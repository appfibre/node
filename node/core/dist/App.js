"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var services_1 = require("./services");
var types = __importStar(require("./types"));
var App = /** @class */ (function () {
    function App(app) {
        var _this = this;
        try {
            Object.keys(app).forEach(function (k) { var d = Object.getOwnPropertyDescriptor(app, k); if (d)
                Object.defineProperty(_this, k, d); });
            this.main = app.main;
            this.options = app.options;
            this.info = app.info;
            this.options.logLevel = this.options.logLevel || types.LogLevel.Error;
            var logger_1 = app.services && app.services.logger ? (typeof app.services.logger === "object" ? app.services.logger : new app.services.logger(this)) : null;
            var s = app.services; //|| {};
            if (!s.UI)
                throw new Error("UI required");
            s.logger = { log: function (logLevel, title, optionalParameters) {
                    if (logLevel <= (_this && _this.options && _this.options.logLevel ? (types.LogLevel[_this.options.logLevel] || 2) : 2))
                        logger_1 ? logger_1.log.bind(_this, logLevel, title, optionalParameters) : [function (title, optionalParameters) { }, console.error, console.error, console.warn, console.info, console.info][logLevel](title + '\r\n', optionalParameters || [_this]);
                } };
            s.transformer = s.transformer ? (typeof s.transformer === "object" ? s.transformer : new s.transformer(this)) : new services_1.Transformer({ module: types.ModuleSystem.AMD });
            s.moduleSystem = s.moduleSystem ? (typeof s.moduleSystem === "object" ? s.moduleSystem : new s.moduleSystem(this)) : new services_1.Loader(this);
            s.navigation = s.navigation ? (typeof s.navigation === "object" ? s.navigation : new s.navigation(this)) : services_1.Navigation;
            s.data = s.data ? (typeof s.data === "object" ? s.data : new s.data(this)) : services_1.Data;
            s.UI = typeof s.UI === "object" ? s.UI : new s.UI(this);
            s.events = s.events ? (typeof s.events === "object" ? s.events : new s.events(this)) : new services_1.Events(this);
            this.services = { moduleSystem: s.moduleSystem, processor: new services_1.Processor(this), transformer: s.transformer, logger: s.logger, UI: s.UI, navigation: s.navigation, events: s.events /*, intercept: s.intercept || ((m) => { if (Array.isArray(m) && m.length > 0 && m[0].default) m[0] = m[0].default; return m.default || m;})*/ };
            this.controllers = {};
            if (app.controllers)
                for (var c in app.controllers) {
                    var co = app.controllers[c];
                    this.controllers[c] = typeof co === "object" ? co : new (co)(this);
                }
            this.components = app.components;
            if (typeof this.components === "object" && !this.components["Navigation"])
                this.components["Navigation"] = services_1.Navigation;
            if (typeof this.components === "object" && !this.components["Data"])
                this.components["Data"] = services_1.Data;
        }
        catch (ex) {
            console.error(ex);
            throw ex;
        }
    }
    App.prototype.initApp = function () {
        //if (!this.options.web) this.options.web = { };
        this.services.moduleSystem.init(this.options.baseExecutionPath);
    };
    return App;
}());
exports.App = App;
