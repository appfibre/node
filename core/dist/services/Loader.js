"use strict";
exports.__esModule = true;
var Loader = /** @class */ (function () {
    function Loader(app) {
        var _this = this;
        this.app = app;
        if (typeof window === "object") {
            var systemjs = Object.getOwnPropertyDescriptor(window, "System");
            if (systemjs) {
                systemjs.value.constructor.prototype.jst = function (input, name) { return _this.app.services.transformer.transform(input, name); };
                this.proxy = { "import": systemjs.value["import"].bind(systemjs.value), instantiate: systemjs.value.instantiate.bind(systemjs.value), init: function (basePath) { return void {}; } };
            }
            else
                this.proxy = require('../browser/loader')["default"];
        }
        if (this['proxy'] == null)
            this.proxy = require('../nodeJS/loader')["default"];
    }
    Loader.prototype["import"] = function (moduleName, normalizedParentName) {
        var _this = this;
        var u = moduleName.indexOf('#') > -1 ? moduleName.slice(0, moduleName.indexOf('#')) : moduleName;
        var b = u.length + 1 < moduleName.length ? moduleName.slice(u.length + 1).split('#') : [];
        return new Promise(function (r, rj) { return _this.proxy["import"](u, normalizedParentName).then(function (x) {
            if (x["default"])
                x = x["default"];
            for (var i = 0; i < b.length; i++)
                if ((x = x[b[i]]) === undefined) {
                    debugger;
                    rj("Could not resolve property " + b[i] + " on " + moduleName);
                }
            ;
            r({ "default": x, __esModule: moduleName });
        }, rj); });
    };
    Loader.prototype.instantiate = function (url, parent) {
        return this.proxy.instantiate(url, parent);
    };
    Loader.prototype.init = function (basePath) {
        Object.defineProperty(this.proxy["import"], "jst", this.app.services.transformer.transform);
        this.proxy.init(basePath);
    };
    return Loader;
}());
exports.Loader = Loader;
