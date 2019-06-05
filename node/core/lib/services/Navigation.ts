//import { INavigation, IAppLoaded, LogLevel, IEventData, IApp, promisedElement, element} from "../types";
import { BaseComponent } from "../components";
import * as types from "../types";

function parse(url:string)  {
    var qs = /(?:\?)([^#]*)(?:#.*)?$/.exec(url);
    var params:{[key:string]:string} = {};
    var index = 0;
    if (qs) qs[1].split('&').forEach(function(p:string) {
        var v = p.split('=');
        params[v.length === 2 ? v[0] : index++] = v[v.length-1];
    });
    return {
        path: qs && qs[1] ? qs[1] : ''
    }
}

function clone(o:any):any {
    if (Array.isArray(o)) 
        return o.map(o => clone(o));
    else if (typeof o === "object") {
        var z = Object.create(o);
        Object.keys(o).forEach(k => z[k] = o[k]);
        return z;
    } else 
    return o;
}

const Navigation:types.INavigation = {

    current: parse(typeof location === "object" ? location.href : ''),
    
    resolve: function transform(this:types.IAppLoaded, container:string) {
        let url = typeof location === "undefined" ? '' : location.href;
        if (this.controllers && Object.keys(this.controllers).length === 0) 
            return this.main;
        for (let c in this.controllers)
            if ((this.controllers[c].container ? this.controllers[c].container : '') == (container || '')) {
                var match = this.controllers[c].match ? this.controllers[c].match.test(url) : true;
                this.services.logger.log(types.LogLevel.Trace, `Route "${url}" ${match?'matched':'did not match'} controller "${c}"`)
                if (match) {
                    var qs = /(?:\?)([^#]*)(?:#.*)?$/.exec(url);
                    var params:{[key:string]:string} = {};
                    var index = 0;
                    if (qs) qs[1].split('&').forEach(function(p:string) {
                        var v = p.split('=');
                        params[v.length === 2 ? v[0] : index++] = v[v.length-1];
                    });
                    return this.controllers[c].resolve.call(this, params);
                }
            } else 
                this.services.logger.log(types.LogLevel.Trace, `Container ${container || '(blank)'} does not match controller ${c}'s container ${this.controllers[c].container  || '(blank)'}`);

        return ["Error", {}, "Could not locate controller matching " + url];
    },

    a: function inject(app:types.IAppLoaded) {
        return class a extends app.services.UI.Component 
        {
            click(e:any) {
                app.services.navigation.current = parse(this.props.href);
                var topParent = parent;
                while (topParent.parent !== topParent) topParent = topParent.parent;
                
                if (topParent.history && topParent.history.pushState) topParent.history.pushState(null, '', this.props.href); else topParent.location.replace(this.props.href);
                app.services.events.publish({type: "Navigation.Redirect", correlationId: this.props.container, data:this.props.href});
                if (e && e.nativeEvent && e.nativeEvent.preventDefault) e.nativeEvent.preventDefault();
                return false;
            }

            render() {
                return app.services.UI.processElement(["a", {...this.props, onClick: this.click.bind(this)}, this.props.children], 0, undefined);
            }
        }
    },

    Container: function transform<P={c:any},S={}>(this:types.IAppLoaded, a:any, c:any) {
            let app = this;
            return [class NavigationContainer extends BaseComponent<P&{c:any},S>(app) {
                state:{a?:any, c:any}

                constructor(props:{a?:any, c:any}) {
                    super(props);
                    this.state = { a: props.a, c: props.c };
                    this.onRedirect = this.onRedirect.bind(this)
                }

                onRedirect(event:types.IEventData<any>) {
                    var e = clone(this.props.c);
                    if (Array.isArray(e)) e.forEach( (c, i) => { if (Array.isArray(c)) c[1].key = Date.now() + i ;} );
                    this.setState( {c: e });
                }

                componentWillMount() {
                    app.services.events.subscribe({type:"Navigation.Redirect"}, this.onRedirect);
                }
    
                componentWillUnmount() {
                    app.services.events.unsubscribe({type:"Navigation.Redirect"}, this.onRedirect);
                }

                render() {
                    return super.render(this.state.c);
                }

            }, {a, c}];
        }
};

export {Navigation};