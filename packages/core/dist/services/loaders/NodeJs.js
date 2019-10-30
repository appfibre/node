"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
//import path from 'path';
var basepath;
function nodeRequire(url) {
    var tmpdir = basepath || global.process.env.INIT_CWD;
    var __dirname__ = global.process.cwd();
    if (tmpdir && __dirname__ != tmpdir)
        global.process.chdir(tmpdir);
    var _exp = (global.require || (global.process.mainModule ? global.process.mainModule.constructor._load : url))(url);
    if (global.process.cwd() != __dirname__)
        global.process.chdir(__dirname__);
    return _exp;
    //return new Function('url', 'tmpdir', 'tmpdir = tmpdir ? tmpdir : global.process.env.INIT_CWD; var __dirname__ = global.process.cwd(); if (__dirname__ != tmpdir) global.process.chdir(tmpdir); var _exp = (global.require || global.process.mainModule.constructor._load)(url); if (global.process.cwd() != __dirname__) global.process.chdir(__dirname__); return _exp;')(url, basepath||'');
}
function run(source, url, references) {
    var m = { exports: {} };
    try {
        if (url)
            basepath = url; //path.resolve(url);
        var refkeys = references ? Object.keys(references) : [];
        var refs = references ? Object.values(references) : [];
        Function.apply(void 0, refkeys.concat(['require', 'module', source + ";\n//# sourceURL=' + " + url])).apply(void 0, refs.concat([nodeRequire, m]));
    }
    catch (f) {
        console.log('Error running script from source "' + (url || source) + '"', f);
        throw f;
    }
    return m.exports;
}
var Loader = {
    instantiate: function (url, parent, _references) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, { credentials: 'same-origin' })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('Fetch error: ' + res.status + ' ' + res.statusText + (parent ? ' loading from  ' + parent : ''));
                    return [2 /*return*/, res.text()];
            }
        });
    }); },
    "import": function (source, url, references) { return __awaiter(_this, void 0, void 0, function () {
        var output;
        return __generator(this, function (_a) {
            try {
                output = run(source, url, references);
                return [2 /*return*/, output];
            }
            catch (e) {
                console.log('Error executing script "' + url + '": ' + e + '\n "' + source + '"');
                throw (e);
            }
            return [2 /*return*/];
        });
    }); },
    resolve: function (name) {
        return name;
    },
    init: function (basePath) {
        basepath = basePath;
    },
    fetch: function (url, headers) { return __awaiter(_this, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url, { headers: headers, credentials: 'same-origin' })];
                case 1:
                    res = _b.sent();
                    _a = {};
                    return [4 /*yield*/, res.text()];
                case 2: return [2 /*return*/, (_a.text = _b.sent(), _a.contentType = (res.headers.get('content-type') || 'text/plain').split(';')[0].toLowerCase(), _a)];
            }
        });
    }); },
    register: function (_source, _target) {
    }
};
exports.Loader = Loader;
