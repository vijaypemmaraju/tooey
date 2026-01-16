// auto-generated from tooey.ts via typedoc
// do not edit manually - run 'pnpm run generate' to regenerate

export interface ApiItem {
  id: string;
  name: string;
  category: string;
  description: string;
  signature?: string;
  params?: Array<{ name: string; type: string; description: string; optional?: boolean }>;
  returns?: string;
  example?: string;
  type?: string;
  element?: string;
  css?: string;
  fullName?: string;
  op?: string;
  event?: string;
}

export interface SearchResult extends ApiItem {
  type: string;
}

export const API_DATA = {
  "coreFunctions": [
    {
      "id": "$",
      "name": "$",
      "category": "core",
      "description": "$ function",
      "signature": "$(name: string): StateRef",
      "params": [
        {
          "name": "name",
          "type": "string",
          "description": ""
        }
      ],
      "returns": "StateRef",
      "example": ""
    },
    {
      "id": "async$",
      "name": "async$",
      "category": "core",
      "description": "async$ function",
      "signature": "async$(promiseOrFn: Promise | object, options?: object): AsyncSpec",
      "params": [
        {
          "name": "promiseOrFn",
          "type": "Promise | object",
          "description": ""
        },
        {
          "name": "options",
          "type": "object",
          "description": "",
          "optional": true
        }
      ],
      "returns": "AsyncSpec",
      "example": ""
    },
    {
      "id": "batch",
      "name": "batch",
      "category": "core",
      "description": "batch function",
      "signature": "batch(fn: object): void",
      "params": [
        {
          "name": "fn",
          "type": "object",
          "description": ""
        }
      ],
      "returns": "void",
      "example": ""
    },
    {
      "id": "computed",
      "name": "computed",
      "category": "core",
      "description": "computed function",
      "signature": "computed(fn: object): ComputedSignal",
      "params": [
        {
          "name": "fn",
          "type": "object",
          "description": ""
        }
      ],
      "returns": "ComputedSignal",
      "example": ""
    },
    {
      "id": "createtooey",
      "name": "createTooey",
      "category": "core",
      "description": "createTooey function",
      "signature": "createTooey(themeOrOptions: Theme | CreateTooeyOptions): TooeyFactory",
      "params": [
        {
          "name": "themeOrOptions",
          "type": "Theme | CreateTooeyOptions",
          "description": ""
        }
      ],
      "returns": "TooeyFactory",
      "example": ""
    },
    {
      "id": "effect",
      "name": "effect",
      "category": "core",
      "description": "effect function",
      "signature": "effect(fn: object, ctx?: RenderContext): object",
      "params": [
        {
          "name": "fn",
          "type": "object",
          "description": ""
        },
        {
          "name": "ctx",
          "type": "RenderContext",
          "description": "",
          "optional": true
        }
      ],
      "returns": "object",
      "example": ""
    },
    {
      "id": "render",
      "name": "render",
      "category": "core",
      "description": "render function",
      "signature": "render(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance",
      "params": [
        {
          "name": "container",
          "type": "HTMLElement",
          "description": ""
        },
        {
          "name": "spec",
          "type": "TooeySpec",
          "description": ""
        },
        {
          "name": "options",
          "type": "RenderOptions",
          "description": "",
          "optional": true
        }
      ],
      "returns": "TooeyInstance",
      "example": ""
    },
    {
      "id": "signal",
      "name": "signal",
      "category": "core",
      "description": "signal function",
      "signature": "signal(initial: T): Signal",
      "params": [
        {
          "name": "initial",
          "type": "T",
          "description": ""
        }
      ],
      "returns": "Signal",
      "example": ""
    }
  ],
  "instanceMethods": [
    {
      "id": "get",
      "name": "get",
      "category": "instance",
      "description": "read the current value of a state key",
      "signature": "instance.get(key: string): unknown",
      "example": "const count = app.get(\"count\");"
    },
    {
      "id": "set",
      "name": "set",
      "category": "instance",
      "description": "set a state value (triggers reactive updates)",
      "signature": "instance.set(key: string, value: unknown): void",
      "example": "app.set(\"count\", 10);"
    },
    {
      "id": "destroy",
      "name": "destroy",
      "category": "instance",
      "description": "clean up event listeners and remove dom elements",
      "signature": "instance.destroy(): void",
      "example": "app.destroy();"
    },
    {
      "id": "update",
      "name": "update",
      "category": "instance",
      "description": "update state values or re-render with new root",
      "signature": "instance.update(spec: TooeySpec): void",
      "example": "app.update({ s: { count: 0 }, r: newSpec });"
    }
  ],
  "components": [
    {
      "id": "B",
      "name": "B",
      "fullName": "Button",
      "category": "text",
      "element": "button",
      "description": "Button component",
      "example": "[B, \"content\", { }]"
    },
    {
      "id": "C",
      "name": "C",
      "fullName": "Checkbox",
      "category": "form",
      "element": "input[checkbox]",
      "description": "Checkbox component",
      "example": "[C, \"content\", { }]"
    },
    {
      "id": "D",
      "name": "D",
      "fullName": "Div",
      "category": "layout",
      "element": "div",
      "description": "Div component",
      "example": "[D, \"content\", { }]"
    },
    {
      "id": "G",
      "name": "G",
      "fullName": "Grid",
      "category": "layout",
      "element": "div",
      "description": "Grid component",
      "example": "[G, \"content\", { }]"
    },
    {
      "id": "H",
      "name": "H",
      "fullName": "HStack",
      "category": "layout",
      "element": "div",
      "description": "HStack component",
      "example": "[H, \"content\", { }]"
    },
    {
      "id": "I",
      "name": "I",
      "fullName": "Input",
      "category": "form",
      "element": "input",
      "description": "Input component",
      "example": "[I, \"content\", { }]"
    },
    {
      "id": "L",
      "name": "L",
      "fullName": "Link",
      "category": "media",
      "element": "a",
      "description": "Link component",
      "example": "[L, \"content\", { }]"
    },
    {
      "id": "Li",
      "name": "Li",
      "fullName": "ListItem",
      "category": "list",
      "element": "li",
      "description": "ListItem component",
      "example": "[Li, \"content\", { }]"
    },
    {
      "id": "M",
      "name": "M",
      "fullName": "Image",
      "category": "media",
      "element": "img",
      "description": "Image component",
      "example": "[M, \"content\", { }]"
    },
    {
      "id": "Ol",
      "name": "Ol",
      "fullName": "OrderedList",
      "category": "list",
      "element": "ol",
      "description": "OrderedList component",
      "example": "[Ol, \"content\", { }]"
    },
    {
      "id": "R",
      "name": "R",
      "fullName": "Radio",
      "category": "form",
      "element": "input[radio]",
      "description": "Radio component",
      "example": "[R, \"content\", { }]"
    },
    {
      "id": "S",
      "name": "S",
      "fullName": "Select",
      "category": "form",
      "element": "select",
      "description": "Select component",
      "example": "[S, \"content\", { }]"
    },
    {
      "id": "Sv",
      "name": "Sv",
      "fullName": "SVG",
      "category": "media",
      "element": "svg",
      "description": "SVG component",
      "example": "[Sv, \"content\", { }]"
    },
    {
      "id": "T",
      "name": "T",
      "fullName": "Text",
      "category": "text",
      "element": "span",
      "description": "Text component",
      "example": "[T, \"content\", { }]"
    },
    {
      "id": "Ta",
      "name": "Ta",
      "fullName": "Textarea",
      "category": "form",
      "element": "textarea",
      "description": "Textarea component",
      "example": "[Ta, \"content\", { }]"
    },
    {
      "id": "Tb",
      "name": "Tb",
      "fullName": "Table",
      "category": "table",
      "element": "table",
      "description": "Table component",
      "example": "[Tb, \"content\", { }]"
    },
    {
      "id": "Tbd",
      "name": "Tbd",
      "fullName": "TableBody",
      "category": "table",
      "element": "tbody",
      "description": "TableBody component",
      "example": "[Tbd, \"content\", { }]"
    },
    {
      "id": "Tc",
      "name": "Tc",
      "fullName": "TableHeaderCell",
      "category": "table",
      "element": "th",
      "description": "TableHeaderCell component",
      "example": "[Tc, \"content\", { }]"
    },
    {
      "id": "Td",
      "name": "Td",
      "fullName": "TableCell",
      "category": "table",
      "element": "td",
      "description": "TableCell component",
      "example": "[Td, \"content\", { }]"
    },
    {
      "id": "Th",
      "name": "Th",
      "fullName": "TableHead",
      "category": "table",
      "element": "thead",
      "description": "TableHead component",
      "example": "[Th, \"content\", { }]"
    },
    {
      "id": "Tr",
      "name": "Tr",
      "fullName": "TableRow",
      "category": "table",
      "element": "tr",
      "description": "TableRow component",
      "example": "[Tr, \"content\", { }]"
    },
    {
      "id": "Ul",
      "name": "Ul",
      "fullName": "UnorderedList",
      "category": "list",
      "element": "ul",
      "description": "UnorderedList component",
      "example": "[Ul, \"content\", { }]"
    },
    {
      "id": "V",
      "name": "V",
      "fullName": "VStack",
      "category": "layout",
      "element": "div",
      "description": "VStack component",
      "example": "[V, \"content\", { }]"
    }
  ],
  "props": [
    {
      "id": "g",
      "name": "g",
      "fullName": "gap",
      "category": "spacing",
      "css": "gap",
      "description": "gap between flex/grid children",
      "example": "{ g: 8 }"
    },
    {
      "id": "p",
      "name": "p",
      "fullName": "padding",
      "category": "spacing",
      "css": "padding",
      "description": "inner spacing",
      "example": "{ p: 16 }"
    },
    {
      "id": "m",
      "name": "m",
      "fullName": "margin",
      "category": "spacing",
      "css": "margin",
      "description": "outer spacing",
      "example": "{ m: 8 }"
    },
    {
      "id": "w",
      "name": "w",
      "fullName": "width",
      "category": "sizing",
      "css": "width",
      "description": "element width",
      "example": "{ w: 200 }"
    },
    {
      "id": "h",
      "name": "h",
      "fullName": "height",
      "category": "sizing",
      "css": "height",
      "description": "element height",
      "example": "{ h: 100 }"
    },
    {
      "id": "mw",
      "name": "mw",
      "fullName": "maxWidth",
      "category": "sizing",
      "css": "max-width",
      "description": "maximum width",
      "example": "{ mw: 600 }"
    },
    {
      "id": "mh",
      "name": "mh",
      "fullName": "maxHeight",
      "category": "sizing",
      "css": "max-height",
      "description": "maximum height",
      "example": "{ mh: 400 }"
    },
    {
      "id": "bg",
      "name": "bg",
      "fullName": "background",
      "category": "colors",
      "css": "background",
      "description": "background color",
      "example": "{ bg: \"#f0f0f0\" }"
    },
    {
      "id": "fg",
      "name": "fg",
      "fullName": "color",
      "category": "colors",
      "css": "color",
      "description": "text color",
      "example": "{ fg: \"blue\" }"
    },
    {
      "id": "o",
      "name": "o",
      "fullName": "opacity",
      "category": "colors",
      "css": "opacity",
      "description": "element opacity",
      "example": "{ o: 0.5 }"
    },
    {
      "id": "r",
      "name": "r",
      "fullName": "borderRadius",
      "category": "borders",
      "css": "border-radius",
      "description": "corner rounding",
      "example": "{ r: 8 }"
    },
    {
      "id": "bw",
      "name": "bw",
      "fullName": "borderWidth",
      "category": "borders",
      "css": "border-width",
      "description": "border thickness",
      "example": "{ bw: 1 }"
    },
    {
      "id": "bc",
      "name": "bc",
      "fullName": "borderColor",
      "category": "borders",
      "css": "border-color",
      "description": "border color",
      "example": "{ bc: \"gray\" }"
    },
    {
      "id": "bs",
      "name": "bs",
      "fullName": "borderStyle",
      "category": "borders",
      "css": "border-style",
      "description": "border style",
      "example": "{ bs: \"solid\" }"
    },
    {
      "id": "pos",
      "name": "pos",
      "fullName": "position",
      "category": "positioning",
      "css": "position",
      "description": "position type (rel/abs/fix/sticky)",
      "example": "{ pos: \"abs\" }"
    },
    {
      "id": "z",
      "name": "z",
      "fullName": "zIndex",
      "category": "positioning",
      "css": "z-index",
      "description": "stack order",
      "example": "{ z: 100 }"
    },
    {
      "id": "t",
      "name": "t",
      "fullName": "top",
      "category": "positioning",
      "css": "top",
      "description": "top position",
      "example": "{ t: 0 }"
    },
    {
      "id": "l",
      "name": "l",
      "fullName": "left",
      "category": "positioning",
      "css": "left",
      "description": "left position",
      "example": "{ l: 0 }"
    },
    {
      "id": "b",
      "name": "b",
      "fullName": "bottom",
      "category": "positioning",
      "css": "bottom",
      "description": "bottom position",
      "example": "{ b: 0 }"
    },
    {
      "id": "rt",
      "name": "rt",
      "fullName": "right",
      "category": "positioning",
      "css": "right",
      "description": "right position",
      "example": "{ rt: 0 }"
    },
    {
      "id": "fs",
      "name": "fs",
      "fullName": "fontSize",
      "category": "typography",
      "css": "font-size",
      "description": "text size",
      "example": "{ fs: 16 }"
    },
    {
      "id": "fw",
      "name": "fw",
      "fullName": "fontWeight",
      "category": "typography",
      "css": "font-weight",
      "description": "text weight",
      "example": "{ fw: 700 }"
    },
    {
      "id": "ff",
      "name": "ff",
      "fullName": "fontFamily",
      "category": "typography",
      "css": "font-family",
      "description": "font family",
      "example": "{ ff: \"Arial\" }"
    },
    {
      "id": "ta",
      "name": "ta",
      "fullName": "textAlign",
      "category": "typography",
      "css": "text-align",
      "description": "text alignment",
      "example": "{ ta: \"center\" }"
    },
    {
      "id": "td",
      "name": "td",
      "fullName": "textDecoration",
      "category": "typography",
      "css": "text-decoration",
      "description": "text decoration",
      "example": "{ td: \"underline\" }"
    },
    {
      "id": "lh",
      "name": "lh",
      "fullName": "lineHeight",
      "category": "typography",
      "css": "line-height",
      "description": "line spacing",
      "example": "{ lh: 1.5 }"
    },
    {
      "id": "ls",
      "name": "ls",
      "fullName": "letterSpacing",
      "category": "typography",
      "css": "letter-spacing",
      "description": "character spacing",
      "example": "{ ls: 1 }"
    },
    {
      "id": "ai",
      "name": "ai",
      "fullName": "alignItems",
      "category": "layout",
      "css": "align-items",
      "description": "cross-axis alignment (c/fs/fe/st)",
      "example": "{ ai: \"c\" }"
    },
    {
      "id": "jc",
      "name": "jc",
      "fullName": "justifyContent",
      "category": "layout",
      "css": "justify-content",
      "description": "main-axis alignment (c/sb/sa/se)",
      "example": "{ jc: \"sb\" }"
    },
    {
      "id": "flw",
      "name": "flw",
      "fullName": "flexWrap",
      "category": "layout",
      "css": "flex-wrap",
      "description": "flex wrapping",
      "example": "{ flw: \"wrap\" }"
    },
    {
      "id": "cols",
      "name": "cols",
      "fullName": "gridColumns",
      "category": "layout",
      "css": "grid-template-columns",
      "description": "grid column count",
      "example": "{ cols: 3 }"
    },
    {
      "id": "rows",
      "name": "rows",
      "fullName": "gridRows",
      "category": "layout",
      "css": "grid-template-rows",
      "description": "grid row count",
      "example": "{ rows: 2 }"
    },
    {
      "id": "cur",
      "name": "cur",
      "fullName": "cursor",
      "category": "misc",
      "css": "cursor",
      "description": "mouse cursor style",
      "example": "{ cur: \"pointer\" }"
    },
    {
      "id": "ov",
      "name": "ov",
      "fullName": "overflow",
      "category": "misc",
      "css": "overflow",
      "description": "overflow behavior",
      "example": "{ ov: \"hidden\" }"
    },
    {
      "id": "pe",
      "name": "pe",
      "fullName": "pointerEvents",
      "category": "misc",
      "css": "pointer-events",
      "description": "pointer event handling",
      "example": "{ pe: \"none\" }"
    },
    {
      "id": "us",
      "name": "us",
      "fullName": "userSelect",
      "category": "misc",
      "css": "user-select",
      "description": "text selection behavior",
      "example": "{ us: \"none\" }"
    },
    {
      "id": "sh",
      "name": "sh",
      "fullName": "boxShadow",
      "category": "misc",
      "css": "box-shadow",
      "description": "shadow effect",
      "example": "{ sh: \"0 2px 4px rgba(0,0,0,0.1)\" }"
    },
    {
      "id": "tr",
      "name": "tr",
      "fullName": "transform",
      "category": "misc",
      "css": "transform",
      "description": "css transform",
      "example": "{ tr: \"rotate(45deg)\" }"
    },
    {
      "id": "s",
      "name": "s",
      "fullName": "customStyles",
      "category": "misc",
      "css": "(object)",
      "description": "custom css properties",
      "example": "{ s: { display: \"inline-block\" } }"
    },
    {
      "id": "v",
      "name": "v",
      "fullName": "value",
      "category": "element",
      "css": "-",
      "description": "input value binding",
      "example": "{ v: { $: \"name\" } }"
    },
    {
      "id": "ph",
      "name": "ph",
      "fullName": "placeholder",
      "category": "element",
      "css": "-",
      "description": "placeholder text",
      "example": "{ ph: \"Enter text\" }"
    },
    {
      "id": "type",
      "name": "type",
      "fullName": "inputType",
      "category": "element",
      "css": "-",
      "description": "input type attribute",
      "example": "{ type: \"email\" }"
    },
    {
      "id": "href",
      "name": "href",
      "fullName": "href",
      "category": "element",
      "css": "-",
      "description": "link url (validated)",
      "example": "{ href: \"/page\" }"
    },
    {
      "id": "src",
      "name": "src",
      "fullName": "src",
      "category": "element",
      "css": "-",
      "description": "image source (validated)",
      "example": "{ src: \"/img.png\" }"
    },
    {
      "id": "alt",
      "name": "alt",
      "fullName": "alt",
      "category": "element",
      "css": "-",
      "description": "image alt text",
      "example": "{ alt: \"description\" }"
    },
    {
      "id": "dis",
      "name": "dis",
      "fullName": "disabled",
      "category": "element",
      "css": "-",
      "description": "disabled state",
      "example": "{ dis: true }"
    },
    {
      "id": "ch",
      "name": "ch",
      "fullName": "checked",
      "category": "element",
      "css": "-",
      "description": "checkbox/radio checked binding",
      "example": "{ ch: { $: \"agreed\" } }"
    },
    {
      "id": "ro",
      "name": "ro",
      "fullName": "readOnly",
      "category": "element",
      "css": "-",
      "description": "read-only state",
      "example": "{ ro: true }"
    },
    {
      "id": "opts",
      "name": "opts",
      "fullName": "options",
      "category": "element",
      "css": "-",
      "description": "select options array",
      "example": "{ opts: [{ v: \"a\", l: \"A\" }] }"
    },
    {
      "id": "rw",
      "name": "rw",
      "fullName": "rows",
      "category": "element",
      "css": "-",
      "description": "textarea rows",
      "example": "{ rw: 4 }"
    },
    {
      "id": "sp",
      "name": "sp",
      "fullName": "colspan",
      "category": "element",
      "css": "-",
      "description": "table cell column span",
      "example": "{ sp: 2 }"
    },
    {
      "id": "rsp",
      "name": "rsp",
      "fullName": "rowspan",
      "category": "element",
      "css": "-",
      "description": "table cell row span",
      "example": "{ rsp: 2 }"
    },
    {
      "id": "cls",
      "name": "cls",
      "fullName": "className",
      "category": "element",
      "css": "-",
      "description": "css class name",
      "example": "{ cls: \"my-class\" }"
    },
    {
      "id": "id",
      "name": "id",
      "fullName": "id",
      "category": "element",
      "css": "-",
      "description": "element id attribute",
      "example": "{ id: \"my-id\" }"
    }
  ],
  "events": [
    {
      "id": "c",
      "name": "c",
      "fullName": "click",
      "category": "event",
      "event": "click",
      "description": "click handler",
      "example": "{ c: \"count+\" }"
    },
    {
      "id": "x",
      "name": "x",
      "fullName": "input/change",
      "category": "event",
      "event": "input",
      "description": "input value change",
      "example": "{ x: [\"name\", \"!\"] }"
    },
    {
      "id": "f",
      "name": "f",
      "fullName": "focus",
      "category": "event",
      "event": "focus",
      "description": "focus gained",
      "example": "{ f: () => {} }"
    },
    {
      "id": "bl",
      "name": "bl",
      "fullName": "blur",
      "category": "event",
      "event": "blur",
      "description": "focus lost",
      "example": "{ bl: () => {} }"
    },
    {
      "id": "k",
      "name": "k",
      "fullName": "keydown",
      "category": "event",
      "event": "keydown",
      "description": "key pressed",
      "example": "{ k: (e) => {} }"
    },
    {
      "id": "ku",
      "name": "ku",
      "fullName": "keyup",
      "category": "event",
      "event": "keyup",
      "description": "key released",
      "example": "{ ku: (e) => {} }"
    },
    {
      "id": "kp",
      "name": "kp",
      "fullName": "keypress",
      "category": "event",
      "event": "keypress",
      "description": "key press",
      "example": "{ kp: (e) => {} }"
    },
    {
      "id": "e",
      "name": "e",
      "fullName": "mouseenter",
      "category": "event",
      "event": "mouseenter",
      "description": "mouse entered",
      "example": "{ e: \"hover~\" }"
    },
    {
      "id": "lv",
      "name": "lv",
      "fullName": "mouseleave",
      "category": "event",
      "event": "mouseleave",
      "description": "mouse left",
      "example": "{ lv: \"hover~\" }"
    },
    {
      "id": "sub",
      "name": "sub",
      "fullName": "submit",
      "category": "event",
      "event": "submit",
      "description": "form submit",
      "example": "{ sub: () => {} }"
    }
  ],
  "stateOps": [
    {
      "id": "op-inc",
      "name": "increment",
      "op": "+",
      "category": "operation",
      "description": "increment numeric value",
      "example": "[\"n\", \"+\"] or [\"n\", \"+\", 5]"
    },
    {
      "id": "op-dec",
      "name": "decrement",
      "op": "-",
      "category": "operation",
      "description": "decrement numeric value",
      "example": "[\"n\", \"-\"]"
    },
    {
      "id": "op-set",
      "name": "set",
      "op": "!",
      "category": "operation",
      "description": "set to specific value",
      "example": "[\"val\", \"!\", \"new\"]"
    },
    {
      "id": "op-toggle",
      "name": "toggle",
      "op": "~",
      "category": "operation",
      "description": "toggle boolean value",
      "example": "[\"flag\", \"~\"]"
    },
    {
      "id": "op-append",
      "name": "append",
      "op": "<",
      "category": "operation",
      "description": "append to array",
      "example": "[\"items\", \"<\", newItem]"
    },
    {
      "id": "op-prepend",
      "name": "prepend",
      "op": ">",
      "category": "operation",
      "description": "prepend to array",
      "example": "[\"items\", \">\", newItem]"
    },
    {
      "id": "op-remove",
      "name": "remove",
      "op": "X",
      "category": "operation",
      "description": "remove from array by index/value",
      "example": "[\"items\", \"X\", index]"
    },
    {
      "id": "op-prop",
      "name": "property",
      "op": ".",
      "category": "operation",
      "description": "set object property",
      "example": "[\"obj\", \".\", [\"key\", \"value\"]]"
    }
  ],
  "controlFlow": [
    {
      "id": "cf-conditional",
      "name": "conditional",
      "category": "controlflow",
      "description": "conditionally render based on state",
      "example": "{ \"?\": \"show\", t: [T, \"Visible\"], e: [T, \"Hidden\"] }"
    },
    {
      "id": "cf-equality",
      "name": "equality check",
      "category": "controlflow",
      "description": "render when state equals specific value",
      "example": "{ \"?\": \"tab\", is: \"home\", t: [T, \"Home content\"] }"
    },
    {
      "id": "cf-map",
      "name": "list rendering",
      "category": "controlflow",
      "description": "render list from array state",
      "example": "{ m: \"items\", a: [Li, \"$item\"] }"
    },
    {
      "id": "cf-map-index",
      "name": "list with index",
      "category": "controlflow",
      "description": "access $index in map template",
      "example": "{ m: \"items\", a: [Li, \"$index: $item.name\"] }"
    }
  ],
  "plugins": {
    "description": "plugins extend tooey with cross-cutting concerns",
    "interface": "interface TooeyPlugin {\n  name: string;\n  onInit?(instance: TooeyInstance): void;\n  onDestroy?(instance: TooeyInstance): void;\n  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;\n  afterRender?(el: HTMLElement, spec: NodeSpec): void;\n  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;\n  extend?: Record<string, Function>;\n}",
    "hooks": [
      {
        "name": "onInit",
        "description": "called when instance is created",
        "params": "instance: TooeyInstance"
      },
      {
        "name": "onDestroy",
        "description": "called when instance is destroyed",
        "params": "instance: TooeyInstance"
      },
      {
        "name": "beforeRender",
        "description": "transform spec before rendering",
        "params": "spec: NodeSpec, ctx: RenderContext"
      },
      {
        "name": "afterRender",
        "description": "called after element is rendered",
        "params": "el: HTMLElement, spec: NodeSpec"
      },
      {
        "name": "onStateChange",
        "description": "called when state changes",
        "params": "key: string, oldVal: unknown, newVal: unknown"
      },
      {
        "name": "extend",
        "description": "add methods to instance",
        "params": "Record<string, Function>"
      }
    ],
    "example": "const loggerPlugin = {\n  name: 'logger',\n  onStateChange(key, oldVal, newVal) {\n    console.log(`[${key}]`, oldVal, '→', newVal);\n  }\n};\n\nrender(el, spec, { plugins: [loggerPlugin] });"
  },
  "theming": {
    "description": "theme tokens ($name) are resolved at render time",
    "interface": "interface Theme {\n  colors?: Record<string, string>;\n  spacing?: Record<string, number | string>;\n  radius?: Record<string, number | string>;\n  fonts?: Record<string, string>;\n  [key: string]: Record<string, string | number> | undefined;\n}",
    "supportedProps": {
      "colors": [
        "bg",
        "fg",
        "bc"
      ],
      "spacing": [
        "g",
        "p",
        "m",
        "w",
        "h",
        "mw",
        "mh",
        "t",
        "l",
        "b",
        "rt",
        "fs",
        "ls"
      ],
      "radius": [
        "r"
      ],
      "fonts": [
        "ff"
      ]
    },
    "example": "const theme = {\n  colors: { primary: '#007bff', danger: '#dc3545' },\n  spacing: { sm: 8, md: 16, lg: 24 },\n  radius: { rSm: 4, rMd: 8 }\n};\n\nrender(el, { r: [B, 'Save', { bg: '$primary', p: '$md' }] }, { theme });"
  },
  "functionComponents": {
    "description": "function components are just functions returning NodeSpec",
    "signature": "type Component<P> = (props?: P, children?: NodeSpec[]) => NodeSpec",
    "example": "const Card = (props, children) => [V, children, {\n  bg: '#fff', p: 16, r: 8,\n  sh: '0 2px 4px rgba(0,0,0,0.1)',\n  ...props\n}];\n\n// usage\n[Card, [[T, 'Hello']], { bg: '#f0f0f0' }]"
  },
  "errorBoundaries": {
    "description": "catch render errors and show fallback ui",
    "interface": "interface ErrorBoundaryNode {\n  boundary: true;\n  child: NodeSpec;\n  fallback?: NodeSpec;\n  onError?: (error: ErrorInfo) => void;\n}",
    "example": "{\n  boundary: true,\n  child: [V, [[T, 'Risky content']]],\n  fallback: [T, 'Something went wrong'],\n  onError: (error) => console.error(error)\n}"
  },
  "types": [
    {
      "id": "computedsignal",
      "name": "ComputedSignal",
      "category": "type",
      "description": "ComputedSignal type",
      "signature": "interface ComputedSignal { ... }"
    },
    {
      "id": "props",
      "name": "Props",
      "category": "type",
      "description": "Props type",
      "signature": "interface Props { ... }"
    },
    {
      "id": "theme",
      "name": "Theme",
      "category": "type",
      "description": "Theme type",
      "signature": "interface Theme { ... }"
    },
    {
      "id": "tooeyinstance",
      "name": "TooeyInstance",
      "category": "type",
      "description": "TooeyInstance type",
      "signature": "interface TooeyInstance { ... }"
    },
    {
      "id": "tooeyplugin",
      "name": "TooeyPlugin",
      "category": "type",
      "description": "TooeyPlugin type",
      "signature": "interface TooeyPlugin { ... }"
    },
    {
      "id": "tooeyspec",
      "name": "TooeySpec",
      "category": "type",
      "description": "TooeySpec type",
      "signature": "interface TooeySpec { ... }"
    }
  ],
  "examples": [
    {
      "name": "counter - tooey",
      "file": "01-counter.html",
      "tokens": "-45%",
      "description": "counter - tooey"
    },
    {
      "name": "todo list - tooey",
      "file": "02-todo-list.html",
      "tokens": "-55%",
      "description": "todo list - tooey"
    },
    {
      "name": "form - tooey",
      "file": "03-form.html",
      "tokens": "-7%",
      "description": "form - tooey"
    },
    {
      "name": "temperature - tooey",
      "file": "04-temperature-converter.html",
      "tokens": "-59%",
      "description": "temperature - tooey"
    },
    {
      "name": "data table - tooey",
      "file": "05-data-table.html",
      "tokens": "-52%",
      "description": "data table - tooey"
    },
    {
      "name": "tabs - tooey",
      "file": "06-tabs.html",
      "tokens": "-16%",
      "description": "tabs - tooey"
    },
    {
      "name": "modal - tooey",
      "file": "07-modal.html",
      "tokens": "-24%",
      "description": "modal - tooey"
    },
    {
      "name": "shopping cart - tooey",
      "file": "08-shopping-cart.html",
      "tokens": "-29%",
      "description": "shopping cart - tooey"
    },
    {
      "name": "wizard - tooey",
      "file": "09-wizard.html",
      "tokens": "-26%",
      "description": "wizard - tooey"
    }
  ]
} as const;

export type ApiData = typeof API_DATA;

export function searchAPI(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  API_DATA.coreFunctions.forEach(fn => {
    if (fn.name.toLowerCase().includes(q) || fn.description.toLowerCase().includes(q)) {
      results.push({ type: 'function', ...fn });
    }
  });

  API_DATA.instanceMethods.forEach(m => {
    if (m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) {
      results.push({ type: 'method', ...m });
    }
  });

  API_DATA.components.forEach(c => {
    if (c.name.toLowerCase().includes(q) || (c.fullName?.toLowerCase().includes(q)) || c.description.toLowerCase().includes(q)) {
      results.push({ type: 'component', ...c });
    }
  });

  API_DATA.props.forEach(p => {
    if (p.name.toLowerCase().includes(q) || (p.fullName?.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q)) {
      results.push({ type: 'prop', ...p });
    }
  });

  API_DATA.events.forEach(e => {
    if (e.name.toLowerCase().includes(q) || (e.fullName?.toLowerCase().includes(q)) || e.description.toLowerCase().includes(q)) {
      results.push({ type: 'event', ...e });
    }
  });

  API_DATA.stateOps.forEach(op => {
    if ((op.op?.includes(q)) || op.name.toLowerCase().includes(q) || op.description.toLowerCase().includes(q)) {
      results.push({ type: 'operation', ...op });
    }
  });

  API_DATA.controlFlow.forEach(cf => {
    if (cf.name.toLowerCase().includes(q) || cf.description.toLowerCase().includes(q)) {
      results.push({ type: 'controlflow', ...cf });
    }
  });

  API_DATA.types.forEach(t => {
    if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
      results.push({ type: 'type', ...t });
    }
  });

  return results;
}
