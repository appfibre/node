"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var core_1 = require("@appfibre/core");
var WebUI_1 = require("./services/WebUI");
var types = __importStar(require("./types"));
var WebApp = /** @class */ (function (_super) {
    __extends(WebApp, _super);
    //info: fibre.IInfo
    function WebApp(app, context) {
        if (app === void 0) { app = { main: [] }; }
        var _this = this;
        var t = __assign({}, app, { info: __assign({ browser: types.webapp.browserType.Unknown }, app.info), services: __assign({ UI: app.services && app.services.UI || WebUI_1.WebUI }, app.services), options: app.options || {}, controllers: __assign({}, app.controllers), components: __assign({}, app.components) });
        _this = _super.call(this, t) || this;
        if (typeof document === "object") { // web app
            var w = window;
            var g = global;
            var d = document;
            var bt = types.webapp.browserType.Unknown;
            if (w && g && d) {
                if (g.InstallTrigger !== undefined)
                    _this.info.browser = types.webapp.browserType.FireFox;
                else if ( /*@cc_on!@*/false || !!d.documentMode)
                    bt = types.webapp.browserType.IE;
                else if (!!w.StyleMedia)
                    bt = types.webapp.browserType.Edge;
                else if (/constructor/i.test(w.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!w['safari'] || (typeof g.safari !== 'undefined' && g.safari.pushNotification)))
                    bt = types.webapp.browserType.Safari;
                else if (!!w.chrome && (!!w.chrome.webstore || !!w.chrome.runtime))
                    bt = types.webapp.browserType.Chrome;
                else if ((Object.getOwnPropertyDescriptor(window, "opr") && Object.getOwnPropertyDescriptor(window, "addons")) || Object.getOwnPropertyDescriptor(window, "opera") || navigator.userAgent.indexOf(' OPR/') >= 0)
                    bt = types.webapp.browserType.Opera;
                if ((bt === types.webapp.browserType.Chrome || bt === types.webapp.browserType.Opera) && !!w.CSS)
                    bt = types.webapp.browserType.Blink;
            }
            _this.info.browser = bt;
        }
        return _this;
    }
    WebApp.prototype.run = function () {
        var _this = this;
        this.services.logger.log.call(this, core_1.fibre.app.LogLevel.Trace, 'App.run');
        var main = null;
        return new Promise(function (resolve, reject) {
            try {
                _this.initApp();
                main = _this.services.navigation.resolve.apply(_this);
            }
            catch (e) {
                _this.services.logger.log.call(_this, core_1.fibre.app.LogLevel.Error, e);
                reject(e);
            }
            _this.render(main).then(resolve, function (err) { _this.services.logger.log.call(_this, core_1.fibre.app.LogLevel.Error, err.message, err.stack); reject(err); _this.render(["pre", {}, err.stack]); });
        });
    };
    WebApp.prototype.render = function (ui) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.services.logger.log.call(_this, core_1.fibre.app.LogLevel.Trace, 'App.render', [{ ui: ui }]);
            _this.services.processor.process(ui).then(function (value) {
                try {
                    var target = null;
                    if (typeof document === "object") { // web app
                        if (typeof _this.options.target === "string")
                            target = document.getElementById(_this.options.target);
                        else if (_this.options.target && _this.options.target.tagName === "IFRAME") {
                            var fr = _this.options.target;
                            if (fr.contentDocument)
                                target = !fr.contentDocument.body ? fr.contentDocument.createElement('BODY') : fr.contentDocument.body;
                        }
                        else if (!document.body)
                            document.body = document.createElement('BODY');
                        target = target || document.body;
                        if (target.tagName === "BODY") {
                            var body = _this.options.target;
                            body.style.height = "100%";
                            target = (body.ownerDocument ? body.ownerDocument : document.body).getElementById("main") || body.appendChild((body.ownerDocument ? body.ownerDocument : document.body).createElement("div"));
                            if (!target.id)
                                target.setAttribute("id", "main");
                        }
                        else if (_this.options.target == null)
                            throw new Error("Cannot locate target (" + (_this.options.target ? 'not specified' : _this.options.target) + ") in html document body.");
                        if (_this.options.title)
                            document.title = _this.options.title;
                        //if (module && module.hot) module.hot.accept();
                        if (target.hasChildNodes())
                            target.innerHTML = "";
                    }
                    else
                        throw new Error("Document node undefined.  Are you running WebApp in the context of a browser?");
                    resolve(_this.services.UI.render(value, target));
                }
                catch (e) {
                    reject(e);
                }
            }, function (r) { return reject(r); });
        });
    };
    return WebApp;
}(core_1.App));
exports.WebApp = WebApp;
