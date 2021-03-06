import { Designer_Select, EditMode } from "./types";
import { types } from "@appfibre/types";
declare type props = {
    style?: object;
    className?: string;
    className_Tab?: string;
};
declare type state = {
    menuIndex: number;
    selectedContext: types.app.IEventData<Designer_Select> | null;
    source?: string | null;
    allowEdit: boolean;
    editMode?: EditMode;
    editing: {
        viewSource: boolean;
        activeFiles: Array<string>;
        selectedFile?: string;
    };
};
declare let DesktopRibbon: (app: types.app.IAppLoaded<{}, {}>) => {
    new (props: any): {
        command_button(editMode: EditMode, title: string, className: string): {
            title: string;
            className: string;
            onClick: () => void;
        };
        menus(): ((string | (string | null)[])[] | (string | {
            className: string;
            style: {
                width: string;
                textAlign: string;
                verticalAlign: string;
            };
        } | (string | {
            className: string;
        })[][])[][] | (string | {}[])[] | (string | (((this: types.app.IAppLoaded<{}, {}>, props: import("../Layout/CommandBar").attr, children: any[]) => ["div", import("../Layout/CommandBar").attr, any[]]) | {
            sections: ({
                title: string;
                commands: {
                    title: string;
                    className: string;
                    onClick: () => void;
                }[];
            } | {
                title: string;
                commands?: undefined;
            })[];
            section_style: {
                height: string;
            };
        })[])[] | (((app: types.app.IAppLoaded<{}, {}>) => {
            new (props: {
                url?: string | undefined;
                activeFiles: string[];
                toggleActiveFile: (file: string) => void;
            }): {
                state: {
                    url: string;
                    allowEdit: boolean;
                };
                url_change(ev: any): void;
                navigate_click(): void;
                render(): any;
                props: Readonly<{
                    url?: string | undefined;
                    activeFiles: string[];
                    toggleActiveFile: (file: string) => void;
                }>;
                context: any;
                setState<K extends "allowEdit" | "url">(state: Pick<{
                    url?: string | undefined;
                    allowEdit: boolean;
                }, K>, callback?: (() => void) | undefined): void;
                setState<K extends "allowEdit" | "url">(fn: (prevState: {
                    url?: string | undefined;
                    allowEdit: boolean;
                }, props: {
                    url?: string | undefined;
                    activeFiles: string[];
                    toggleActiveFile: (file: string) => void;
                }) => Pick<{
                    url?: string | undefined;
                    allowEdit: boolean;
                }, K>, callback?: (() => void) | undefined): void;
                forceUpdate(callback?: (() => void) | undefined): void;
            };
            displayName?: string | undefined;
            defaultProps?: any;
        }) | {
            url: string;
            activeFiles: string[];
            toggleActiveFile: (filename: string) => void;
        })[][])[];
        toggle_ActiveFile(filename: string): void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        nav_click(): void;
        command_click(editMode?: EditMode | undefined): void;
        ribbon_toggle_edit(): void;
        render(): any;
        onSelect(ev: types.app.IEventData<Designer_Select>): void;
        state: Readonly<state>;
        props: Readonly<props>;
        context: any;
        setState<K extends "source" | "menuIndex" | "selectedContext" | "allowEdit" | "editMode" | "editing">(state: Pick<state, K>, callback?: (() => void) | undefined): void;
        setState<K extends "source" | "menuIndex" | "selectedContext" | "allowEdit" | "editMode" | "editing">(fn: (prevState: state, props: props) => Pick<state, K>, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
    };
    displayName?: string | undefined;
    defaultProps?: any;
};
export { DesktopRibbon };
//# sourceMappingURL=DesktopRibbon.d.ts.map