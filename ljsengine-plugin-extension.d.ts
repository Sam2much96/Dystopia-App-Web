// Declaring the LittleJS UI Plugin module
declare module 'littlejsengine/plugins/uiSystem' {
    // Defining colors and font constants
    const uiDefaultColor: any;
    const uiDefaultLineColor: any;
    const uiDefaultTextColor: any;
    const uiDefaultButtonColor: any;
    const uiDefaultHoverColor: any;
    const uiDefaultLineWidth: number;
    const uiDefaultFont: string;

    // Defining the UIObject class and its methods
    class UIObject {
        localPos: any;
        pos: any;
        size: any;
        color: any;
        lineColor: any;
        textColor: any;
        hoverColor: any;
        lineWidth: number;
        font: string;
        visible: boolean;
        children: UIObject[];
        parent: UIObject | null;

        constructor(localPos: any, size: any);
        addChild(child: UIObject): void;
        removeChild(child: UIObject): void;
        update(): void;
        render(): void;
        onEnter(): void;
        onLeave(): void;
        onPress(): void;
        onRelease(): void;
        onChange(): void;
    }

    // Defining UIText class which extends UIObject
    class UIText extends UIObject {
        text: string;
        align: string;
        font: string;
        lineWidth: number;

        constructor(pos: any, size: any, text: string, align: string, font: string);
        render(): void;
    }

    // Defining UITile class which extends UIObject
    class UITile extends UIObject {
        tileInfo: any;
        color: any;
        angle: number;
        mirror: boolean;

        constructor(pos: any, size: any, tileInfo: any, color: any, angle: number, mirror: boolean);
        render(): void;
    }

    // Defining UIButton class which extends UIObject
    class UIButton extends UIObject {
        text: string;
        color: any;

        constructor(pos: any, size: any, text: string);
        render(): void;
    }

    // Defining UICheckbox class which extends UIObject
    class UICheckbox extends UIObject {
        checked: boolean;

        constructor(pos: any, size: any, checked: boolean);
        onPress(): void;
        render(): void;
    }

    // Defining UIScrollbar class which extends UIObject
    class UIScrollbar extends UIObject {
        value: number;
        text: string;
        handleColor: any;

        constructor(pos: any, size: any, value: number, text: string);
        update(): void;
        render(): void;
    }

    // Declaring functions available in the UI System
    function initUISystem(context: any): void;
    function drawUIRect(pos: any, size: any, color: any, lineWidth: number, lineColor: any): void;
    function drawUILine(posA: any, posB: any, thickness: number, color: any): void;
    function drawUITile(pos: any, size: any, tileInfo: any, color: any, angle: number, mirror: boolean): void;
    function drawUIText(text: string, pos: any, size: any, color: any, lineWidth: number, lineColor: any, align: string, font: string): void;
}
