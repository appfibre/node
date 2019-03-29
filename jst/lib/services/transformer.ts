import {ITransformer, ModuleSystem, ITransformSettings, ITransformOutput} from '../types'


export class Transformer implements ITransformer {
    type:"Transformer";
    settings:ITransformSettings;
    constructor(settings?:ITransformSettings)
    {
        this.type = "Transformer";
        this.settings = settings ? {...settings, indent: settings.indent || '\t', compact: settings.compact || false, module: settings.module || ModuleSystem.None, namedExports: settings.namedExports === undefined ? true : settings.namedExports} : { module: ModuleSystem.ES};
        this.settings.parsers = this.settings.parsers || {};
        this.settings.parsers[".require"] = this.settings.parsers[".import"] = (obj:any, parseSettings:ITransformOutput, offset:number) => this.loadModule(obj[".import"] || obj[".require"], parseSettings);
        this.settings.parsers[".function"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `function ${obj[".function"]?obj[".function"]:""}(${obj["arguments"] ? this.process(obj["arguments"], false, true, parseSettings, offset) : ""}){ return ${this.process(obj["return"], true, false, parseSettings, offset)} }`;};
        this.settings.parsers[".map"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `${this.process(obj[".map"], false, false, parseSettings, offset)}.map(function(${obj["arguments"]}) {return ${settings && settings.indent ? new Array(offset).join(' ') :""}${this.process(obj["return"], true, false, parseSettings, offset)} })` };
        this.settings.parsers[".filter"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `${this.process(obj[".filter"], false, false, parseSettings, offset)}.filter(function(${obj["arguments"]}) {return ${this.process(obj["condition"], true, false, parseSettings, offset)} })` };
        this.settings.parsers[".call"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `${this.process(obj[".call"], false, false, parseSettings, offset)}.call(${obj["arguments"] ? this.process(obj["arguments"], false, true, parseSettings, offset) : ""})` }
        this.settings.parsers[".exec"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `${this.process(obj[".exec"], true, false, parseSettings, offset)}(${obj["arguments"] ? this.process(obj["arguments"], true, true, parseSettings, offset) : ""})` }
        this.settings.parsers[".new"] = (obj:any, parseSettings:ITransformOutput, offset:number) => { return `new ${this.process(obj[".new"], true, false, parseSettings, offset)}(${obj["arguments"] ? this.process(obj["arguments"], true, true, parseSettings, offset) : ""})` }
        this.settings.parsers[".id"] = this.settings.parsers[".code"] = (obj:any, parseSettings:ITransformOutput, offset:number) => obj[".code"] || obj[".id"];
        this.settings.parsers[".app"] =  (obj:any, parseSettings:ITransformOutput, offset:number) => {
            var obj2:{[key:string]:any} = {};
            var keys = Object.keys(obj);
            for (var key in keys) obj2[keys[key] == ".app" ? "main" : keys[key]] = obj[keys[key]];
            return `${this.process({ ".new": {".require": "@appfibre/jst#App"}, "arguments": [obj2]}, true, true, parseSettings, offset)}.run()`;
        };
        this.settings.parsers["."] = (obj:any, parseSettings:ITransformOutput, offset?:number) => obj["."];
    }

    loadModule (val:string, parseSettings:ITransformOutput) {
        var m = val.indexOf('#') > 0 ? val.substr(0, val.indexOf('#')) : val;
        if (this.settings.module.toLowerCase() === ModuleSystem.ES.toLowerCase()) m = val.indexOf('#', m.length+2) > -1 ? val.substr(0, val.indexOf('#', m.length+2)-1) : val;
        if (parseSettings.imports.indexOf(m) === -1) parseSettings.imports.push(m);
        return `_${parseSettings.imports.indexOf(m)}${val.length>m.length?val.substring(m.length).replace('#','.'):''}`;
    }

    reservedWords = ['function', 'for', 'var', 'this', 'self', 'null'];

    format(lines: string[], parseSettings:ITransformOutput, indent:number) {
        var lt = this.settings.compact ? "" : "\n"; 
        var tab = this.settings.compact ? "" : this.settings.indent || "\t";
        return lt + new Array(indent+1).join(tab) + lines.join("," + lt + new Array(indent+1).join(tab)) + lt + new Array(indent).join(tab);
    }

    process(obj:any, esc:boolean, et:boolean, parseSettings:ITransformOutput, offset:number) : string {
        var output;
        if (obj === null)
            output = "null";
        else if (Array.isArray(obj))       
            output = (et ? "" : "[") + this.format(obj.map( (e, i) => this.process(e, esc, false, parseSettings, offset+1)), parseSettings, offset) + (et ? "" : "]");
        else if (typeof obj === "object") {
            var keys = Object.keys(obj);
            var processed = false;
            for (var k in keys)
                if (!processed && keys[k].length > 0 && keys[k].charAt(0) == '.') {
                    if (this.settings.parsers && this.settings.parsers[keys[k]]) {
                        processed = true;
                        output = this.settings.parsers[keys[k]](obj, parseSettings, offset) || '';
                    }
                    else 
                        throw new Error(`Could not locate parser ${keys[k].substr(1)}`)
                }
            if (!processed) 
                output = (et ? "" : "{") + this.format(keys.filter(k => k.length < 2 || k.substr(0, 2) != '..').map((k,i) => ( this.reservedWords.indexOf(k) > -1 ? "\"" + k + "\"" : k ) + ":" + (this.settings.compact ? '' : ' ') + this.process(obj[k], esc, false, parseSettings, offset+1)), parseSettings, offset) + (et ? "" : "}");
        } else if (typeof obj === "function") // object not JSON...
            output = obj.toString();
        else
            output = typeof obj === "string" && esc ? JSON.stringify(obj) : obj;
        return output;
    }

    bundleModule(obj:any, name?:string) : ITransformOutput {
        var output:ITransformOutput = {name:name, imports: [], exports: {}, compositeObject:false, code:''};
        var keys : any[string] = Object.keys(obj);
        var validkeys : any[string] = keys.filter((k:string) => k.indexOf(' ') === -1 && k.indexOf('/') === -1 && k.indexOf('-') === -1 && this.reservedWords.indexOf(k) === -1 );
        var isDefault = keys.length === 1 && keys[0] === 'default';
        var nl = this.settings.compact ? '' : '\n';
        var sp = this.settings.compact ? '' : ' ';
        var vr = this.settings.preferConst ? 'const' : 'var'

        switch (this.settings.module.toLowerCase())
        {
            case "umd":
            case "commonjs":
            case "cjs":
                for (var req in r) output.code += `${vr} _${r[req]}${sp}=${sp}require('${req}');${nl}`;
                    output.code += keys.map((key:number) => `module.exports['${key}']${sp}=${sp}${this.process(obj[key], true, false, output, 0)};`).join(nl);
                if (!isDefault)
                    output.code += `${nl}module.exports['default']${sp}=${sp}{${sp}${keys.map((key:number) => `${key}: ${this.process(obj[key], true, false, output, 0)}`).join(nl)} };`;
                if (output.name) output.code += `${nl}module.exports['__jst'] = '${name};`;
                break;
            case "es":            
                if (isDefault)
                    output.code += `export default${sp}${this.process(obj["default"], true, false, output, 0)};`
                else {             
                    output.code += `export default${sp}{${this.format(keys.map((key:string) => validkeys.indexOf(key) === -1 ? `"${key}": ${this.process(obj[key], true, false, output, 0)}` : `${key}:${sp}${(this.settings.namedExports?key:this.process(obj[key], true, false, output, 2))}`), output, 1)}};`
                    if (this.settings.namedExports && validkeys.length > 0)
                        output.code = validkeys.map((key:number) => `export ${vr} ${key}${sp}=${sp}${this.process(obj[key], true, false, output, 1)};`).join(nl) + `${nl + output.code + nl}`;
                }
                break;
            default:
                if (output.name)
                    output.code += `return ${isDefault ? "{'default' : " + this.process(obj["default"], true, false, output, 1) + ", '__jst': '" + output.name + "'}" : `{${this.format(keys.map((key:string) => validkeys.indexOf(key) === -1 ? `"${key}": ${this.process(obj[key], true, false, output, 1)}` : `${key}:${sp}${this.process(obj[key], true, false, output, 2)}`), output, 1)}}, '__jst': '${output.name}'`};`;
                else
                    output.code += `return ${isDefault ? this.process(obj["default"], true, false, output, 1) : `{${this.format(keys.map((key:string) => validkeys.indexOf(key) === -1 ? `"${key}": ${this.process(obj[key], true, false, output, 1)}` : `${key}:${sp}${this.process(obj[key], true, false, output, 2)}`), output, 1)}}`};`;
        }

        var s : any[string] = {};
        var r : any[string] = {};
        
        if (output.imports.length > 0) 
            for (var i = 0; i < output.imports.length; i++)
                if (output.imports[i].indexOf('#') > -1) {
                    var module_name = output.imports[i].substr(0,output.imports[i].indexOf('#'));
                    if (s[module_name] === undefined)    
                        s[module_name] = { };
                    s[module_name][output.imports[i].substr(module_name.length+1)] = i;
                } else
                    r[output.imports[i]] = i;

        switch (this.settings.module.toLowerCase())
        {
            case "umd": 
            case "commonjs":
            case "cjs":
                for (var req in r) output.code = `${vr} _${r[req]}${sp}=${sp}require("${req}");${nl}${output.code}`;
                break;
            case "amd": 
                output.code = `define([${Object.keys(r).map((key:string) => `'${key}'`).join(", ")}], function (${Object.keys(r).map((key:string) => '_'+r[key]).join(", ")}) { ${output.code} });${nl}`
                break;
            case "es":
                output.code = Object.keys(s).map((key:string) => (key.charAt(0) === '~' ? `var {${Object.keys(s[key]).map((k:string) => `${k}: _${s[key][k]}`)}}  = await import('${key.substr(1)}');${nl}` : `import {${Object.keys(s[key]).map((k:string) => `${k} as _${s[key][k]}` ).join(','+sp)}} from '${key}';${nl}`)).join('') + Object.keys(r).map((key:string) => (key.charAt(0) === '~' ? `var _${r[key]} = await import('${key.substr(1)}');${nl}` : `import * as _${r[key]} from '${key}';${nl}`)).join('') + output.code;
                break;
            default:
                for (var req in r) output.code = `${vr} _${r[req]}${sp}=${sp}require("${req}");${nl}${output.code}`;
        }
        return output;
    }


    transform (input:string|object, name?:string) : ITransformOutput {
        var obj;
        try
        {
            obj = typeof input === "string" ? JSON.parse(input) : input;
        }
        catch (e)
        {
            //console.log(JSON.stringify(this.settings));
            if (this.settings.dangerouslyProcessJavaScript || this.settings.dangerouslyProcessJavaScript === undefined) {
                try {
                    obj = eval(`(${input});`);
                    if (this.settings.dangerouslyProcessJavaScript === undefined) console.warn(`Warning: ${name || ''} is not JSON compliant: ${e.message}.  Set option "dangerouslyProcessJavaScript" to true to hide this message.\r\n${input}`);
                } catch (f)
                {
                    throw new Error(`Unable to process ${name || ''} as JavaScript: ${f.message}`);
                }
            } else 
                throw new Error(`Unable to parse JSON file ${name || ''}: ${e.message}`);
        }
        try {
            return this.bundleModule(Array.isArray(obj) || typeof(obj || '') !== 'object' || Object.keys(obj).filter(k=>k[0]=='.').length > 0 ? {"default": obj} : obj, name);
        } catch (e) {
            throw new Error(`Unable to transform js template: ${e.message}\r\n${e.stack}`);
        }
    }

}