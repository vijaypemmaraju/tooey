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
      "id": "Td",
      "name": "Td",
      "fullName": "TableCell",
      "category": "table",
      "element": "td",
      "description": "TableCell component",
      "example": "[Td, \"content\", { }]"
    },
    {
      "id": "Tr",
      "name": "Tr",
      "fullName": "TableRow",
      "category": "table",
      "element": "tr",
      "description": "TableRow component",
      "example": "[Tr, \"content\", { }]"
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
      "id": "counter",
      "name": "counter",
      "savings": "-45%",
      "tooeyTokens": 56,
      "reactTokens": 102,
      "description": "increment / decrement buttons with state",
      "tooeyCode": "{s:{n:0},r:[V,[[T,{$:\"n\"}],[H,[[B,\"-\",{c:[\"n\",\"-\"]}],[B,\"+\",{c:[\"n\",\"+\"]}]],{g:8}]],{g:8}]}",
      "reactCode": "function Counter() {\n  const [n, setN] = useState(0);\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:8}}>\n      <span>{n}</span>\n      <div style={{display:'flex',gap:8}}>\n        <button onClick={()=>setN(n-1)}>-</button>\n        <button onClick={()=>setN(n+1)}>+</button>\n      </div>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"n\":0},\"r\":[\"vs\",[[\"tx\",{\"$\":\"n\"},{\"fs\":24,\"fg\":\"#fa0\"}],[\"hs\",[[\"bt\",\"-\",{\"c\":[\"n\",\"-\"]}],[\"bt\",\"+\",{\"c\":[\"n\",\"+\"]}]],{\"g\":8}]],{\"g\":16,\"ai\":\"c\"}]}",
      "reactDemoCode": "function Counter() {\n  const [n, setN] = React.useState(0);\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>\n      <span style={{fontSize:24,color:'#fa0'}}>{n}</span>\n      <div style={{display:'flex',gap:8}}>\n        <button onClick={()=>setN(n-1)}>-</button>\n        <button onClick={()=>setN(n+1)}>+</button>\n      </div>\n    </div>\n  );\n}",
      "file": "01-counter.html"
    },
    {
      "id": "todo-list",
      "name": "todo list",
      "savings": "-55%",
      "tooeyTokens": 92,
      "reactTokens": 203,
      "description": "add / remove items with input binding",
      "tooeyCode": "{s:{txt:\"\",items:[]},r:[V,[\n  [H,[[I,\"\",{v:{$:\"txt\"},x:[\"txt\",\"!\"],ph:\"add...\"}],[B,\"+\",{c:add}]],{g:8}],\n  {map:\"items\",as:[H,[[T,\"$item\"],[B,\"x\",{c:del}]],{g:8}]}\n],{g:12}]}",
      "reactCode": "function TodoList() {\n  const [txt, setTxt] = useState('');\n  const [items, setItems] = useState([]);\n  const add = () => {\n    if (txt) {\n      setItems([...items, txt]);\n      setTxt('');\n    }\n  };\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:12}}>\n      <div style={{display:'flex',gap:8}}>\n        <input value={txt} onChange={e=>setTxt(e.target.value)}\n          placeholder=\"add...\" />\n        <button onClick={add}>+</button>\n      </div>\n      {items.map((item, i) => (\n        <div key={i} style={{display:'flex',gap:8}}>\n          <span>{item}</span>\n          <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>\n        </div>\n      ))}\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"txt\":\"\",\"items\":[\"buy milk\",\"walk dog\"]},\"r\":[\"vs\",[[\"hs\",[[\"in\",\"\",{\"v\":{\"$\":\"txt\"},\"x\":[\"txt\",\"!\"],\"ph\":\"add item...\",\"s\":{\"flex\":\"1\",\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\"}}],[\"bt\",\"+\",{\"c\":[\"items\",\"<\",{\"$\":\"txt\"}]}]],{\"g\":8}],{\"m\":\"items\",\"a\":[\"hs\",[[\"tx\",\"$item\",{\"s\":{\"flex\":\"1\"}}],[\"bt\",\"x\",{\"c\":[\"items\",\"X\",\"$index\"]}]],{\"g\":8,\"p\":\"8px 0\",\"s\":{\"borderBottom\":\"1px solid #333\"}}]}],{\"g\":12}]}",
      "reactDemoCode": "function TodoList() {\n  const [txt, setTxt] = React.useState('');\n  const [items, setItems] = React.useState(['buy milk', 'walk dog']);\n  const add = () => { if (txt) { setItems([...items, txt]); setTxt(''); } };\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:12}}>\n      <div style={{display:'flex',gap:8}}>\n        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder=\"add item...\" style={{flex:1,padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4}} />\n        <button onClick={add}>+</button>\n      </div>\n      {items.map((item, i) => (\n        <div key={i} style={{display:'flex',gap:8,padding:'8px 0',borderBottom:'1px solid #333'}}>\n          <span style={{flex:1}}>{item}</span>\n          <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>\n        </div>\n      ))}\n    </div>\n  );\n}",
      "file": "02-todo-list.html"
    },
    {
      "id": "form",
      "name": "form",
      "savings": "-7%",
      "tooeyTokens": 196,
      "reactTokens": 211,
      "description": "inputs, checkbox, validation",
      "tooeyCode": "{s:{name:\"\",email:\"\",pw:\"\",agree:false},r:[V,[\n  [V,[[T,\"name\"],[I,\"\",{ph:\"your name\",v:{$:\"name\"},x:[\"name\",\"!\"]}]],{g:4}],\n  [V,[[T,\"email\"],[I,\"\",{type:\"email\",ph:\"you@example.com\",v:{$:\"email\"},x:[\"email\",\"!\"]}]],{g:4}],\n  [V,[[T,\"password\"],[I,\"\",{type:\"password\",ph:\"********\",v:{$:\"pw\"},x:[\"pw\",\"!\"]}]],{g:4}],\n  [H,[[C,\"\",{ch:{$:\"agree\"},x:[\"agree\",\"~\"]}],[T,\"i agree to terms\"]],{g:8,ai:\"center\"}],\n  [B,\"sign up\",{c:submit}]\n],{g:16}]}",
      "reactCode": "function Form() {\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  const [pw, setPw] = useState('');\n  const [agree, setAgree] = useState(false);\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:16}}>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <label>name</label>\n        <input placeholder=\"your name\" value={name}\n          onChange={e=>setName(e.target.value)} />\n      </div>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <label>email</label>\n        <input type=\"email\" placeholder=\"you@example.com\"\n          value={email} onChange={e=>setEmail(e.target.value)} />\n      </div>\n      ...\n      <button onClick={submit}>sign up</button>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"name\":\"\",\"email\":\"\",\"agree\":false},\"r\":[\"vs\",[[\"vs\",[[\"tx\",\"name\",{\"fs\":12,\"fg\":\"#888\"}],[\"in\",\"\",{\"ph\":\"your name\",\"v\":{\"$\":\"name\"},\"x\":[\"name\",\"!\"],\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"100%\"}}]],{\"g\":4}],[\"vs\",[[\"tx\",\"email\",{\"fs\":12,\"fg\":\"#888\"}],[\"in\",\"\",{\"type\":\"email\",\"ph\":\"you@example.com\",\"v\":{\"$\":\"email\"},\"x\":[\"email\",\"!\"],\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"100%\"}}]],{\"g\":4}],[\"hs\",[[\"cb\",\"\",{\"ch\":{\"$\":\"agree\"},\"x\":[\"agree\",\"~\"]}],[\"tx\",\"i agree to terms\",{\"fs\":13}]],{\"g\":8,\"ai\":\"c\"}],[\"bt\",\"sign up\",{\"bg\":\"#fa0\",\"fg\":\"#000\",\"p\":\"10px 20px\",\"r\":4,\"s\":{\"border\":\"none\",\"cursor\":\"pointer\"}}]],{\"g\":16}]}",
      "reactDemoCode": "function Form() {\n  const [name, setName] = React.useState('');\n  const [email, setEmail] = React.useState('');\n  const [agree, setAgree] = React.useState(false);\n  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:'100%'};\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:16}}>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span style={{fontSize:12,color:'#888'}}>name</span>\n        <input placeholder=\"your name\" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />\n      </div>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span style={{fontSize:12,color:'#888'}}>email</span>\n        <input type=\"email\" placeholder=\"you@example.com\" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />\n      </div>\n      <div style={{display:'flex',gap:8,alignItems:'center'}}>\n        <input type=\"checkbox\" checked={agree} onChange={e=>setAgree(e.target.checked)} />\n        <span style={{fontSize:13}}>i agree to terms</span>\n      </div>\n      <button style={{background:'#fa0',color:'#000',padding:'10px 20px',borderRadius:4,border:'none',cursor:'pointer'}}>sign up</button>\n    </div>\n  );\n}",
      "file": "03-form.html"
    },
    {
      "id": "temperature",
      "name": "temperature converter",
      "savings": "-59%",
      "tooeyTokens": 109,
      "reactTokens": 269,
      "description": "bidirectional binding between celsius and fahrenheit",
      "tooeyCode": "{s:{c:0,f:32},r:[H,[\n  [V,[[T,\"celsius\"],[I,\"\",{type:\"number\",v:{$:\"c\"},x:onC}]],{g:4}],\n  [T,\"=\",{fs:24,fg:\"#0af\"}],\n  [V,[[T,\"fahrenheit\"],[I,\"\",{type:\"number\",v:{$:\"f\"},x:onF}]],{g:4}]\n],{g:16,ai:\"center\"}]}",
      "reactCode": "function TempConverter() {\n  const [c, setC] = useState(0);\n  const [f, setF] = useState(32);\n  const onCelsiusChange = (e) => {\n    const val = parseFloat(e.target.value) || 0;\n    setC(val);\n    setF(val * 9/5 + 32);\n  };\n  const onFahrenheitChange = (e) => {\n    const val = parseFloat(e.target.value) || 0;\n    setF(val);\n    setC((val - 32) * 5/9);\n  };\n  return (\n    <div style={{display:'flex',gap:16,alignItems:'center'}}>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span>celsius</span>\n        <input type=\"number\" value={c} onChange={onCelsiusChange}/>\n      </div>\n      <span style={{fontSize:24}}>=</span>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span>fahrenheit</span>\n        <input type=\"number\" value={f} onChange={onFahrenheitChange}/>\n      </div>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"c\":20,\"f\":68},\"r\":[\"hs\",[[\"vs\",[[\"tx\",\"celsius\",{\"fs\":12,\"fg\":\"#888\"}],[\"in\",\"\",{\"type\":\"number\",\"v\":{\"$\":\"c\"},\"x\":[\"c\",\"!\"],\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"80px\"}}]],{\"g\":4}],[\"tx\",\"=\",{\"fs\":24,\"fg\":\"#fa0\"}],[\"vs\",[[\"tx\",\"fahrenheit\",{\"fs\":12,\"fg\":\"#888\"}],[\"in\",\"\",{\"type\":\"number\",\"v\":{\"$\":\"f\"},\"x\":[\"f\",\"!\"],\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"80px\"}}]],{\"g\":4}]],{\"g\":16,\"ai\":\"c\"}]}",
      "reactDemoCode": "function TempConverter() {\n  const [c, setC] = React.useState(20);\n  const [f, setF] = React.useState(68);\n  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:80};\n  const onC = e => { const v = parseFloat(e.target.value)||0; setC(v); setF(Math.round(v*9/5+32)); };\n  const onF = e => { const v = parseFloat(e.target.value)||0; setF(v); setC(Math.round((v-32)*5/9)); };\n  return (\n    <div style={{display:'flex',gap:16,alignItems:'center'}}>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span style={{fontSize:12,color:'#888'}}>celsius</span>\n        <input type=\"number\" value={c} onChange={onC} style={inputStyle} />\n      </div>\n      <span style={{fontSize:24,color:'#fa0'}}>=</span>\n      <div style={{display:'flex',flexDirection:'column',gap:4}}>\n        <span style={{fontSize:12,color:'#888'}}>fahrenheit</span>\n        <input type=\"number\" value={f} onChange={onF} style={inputStyle} />\n      </div>\n    </div>\n  );\n}",
      "file": "04-temperature-converter.html"
    },
    {
      "id": "data-table",
      "name": "data table",
      "savings": "-52%",
      "tooeyTokens": 131,
      "reactTokens": 275,
      "description": "sortable, filterable table with search",
      "tooeyCode": "{s:{q:\"\",sort:\"name\",asc:true,data:[...]},r:[V,[\n  [I,\"\",{ph:\"search...\",v:{$:\"q\"},x:[\"q\",\"!\"]}],\n  [Tb,[\n    [Th,[[Tr,[[Tc,\"name\",{c:sort}],[Tc,\"age\",{c:sort}],[Tc,\"role\",{c:sort}]]]]],\n    [Tbd,[{map:\"filtered\",as:[Tr,[[Td,\"$item.name\"],[Td,\"$item.age\"],[Td,\"$item.role\"]]]}]]\n  ]]\n],{g:12}]}",
      "reactCode": "function DataTable() {\n  const [q, setQ] = useState('');\n  const [sort, setSort] = useState('name');\n  const [asc, setAsc] = useState(true);\n  const [data] = useState([...]);\n  const filtered = data\n    .filter(r => Object.values(r).some(v =>\n      String(v).toLowerCase().includes(q.toLowerCase())))\n    .sort((a,b) => {...});\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:12}}>\n      <input placeholder=\"search...\" value={q}\n        onChange={e=>setQ(e.target.value)} />\n      <table>\n        <thead>\n          <tr>\n            <th onClick={()=>toggleSort('name')}>name</th>\n            ...\n          </tr>\n        </thead>\n        <tbody>\n          {filtered.map((row,i) => (\n            <tr key={i}>\n              <td>{row.name}</td>\n              ...\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"data\":[{\"name\":\"alice\",\"age\":28,\"role\":\"engineer\"},{\"name\":\"bob\",\"age\":34,\"role\":\"designer\"},{\"name\":\"carol\",\"age\":25,\"role\":\"manager\"}]},\"r\":[\"vs\",[[\"tb\",[[\"th\",[[\"tr\",[[\"tc\",\"name\",{\"fg\":\"#fa0\",\"s\":{\"textAlign\":\"left\",\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}],[\"tc\",\"age\",{\"fg\":\"#fa0\",\"s\":{\"textAlign\":\"left\",\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}],[\"tc\",\"role\",{\"fg\":\"#fa0\",\"s\":{\"textAlign\":\"left\",\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}]]]]],[\"bd\",[{\"m\":\"data\",\"a\":[\"tr\",[[\"td\",\"$item.name\",{\"s\":{\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}],[\"td\",\"$item.age\",{\"s\":{\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}],[\"td\",\"$item.role\",{\"s\":{\"padding\":\"8px\",\"borderBottom\":\"1px solid #333\"}}]]]}]]],{\"s\":{\"width\":\"100%\",\"borderCollapse\":\"collapse\"}}]],{\"g\":12}]}",
      "reactDemoCode": "function DataTable() {\n  const data = [{name:'alice',age:28,role:'engineer'},{name:'bob',age:34,role:'designer'},{name:'carol',age:25,role:'manager'}];\n  const thStyle = {color:'#fa0',textAlign:'left',padding:'8px',borderBottom:'1px solid #333'};\n  const tdStyle = {padding:'8px',borderBottom:'1px solid #333'};\n  return (\n    <table style={{width:'100%',borderCollapse:'collapse'}}>\n      <thead>\n        <tr><th style={thStyle}>name</th><th style={thStyle}>age</th><th style={thStyle}>role</th></tr>\n      </thead>\n      <tbody>\n        {data.map((r,i) => <tr key={i}><td style={tdStyle}>{r.name}</td><td style={tdStyle}>{r.age}</td><td style={tdStyle}>{r.role}</td></tr>)}\n      </tbody>\n    </table>\n  );\n}",
      "file": "05-data-table.html"
    },
    {
      "id": "tabs",
      "name": "tabs",
      "savings": "-16%",
      "tooeyTokens": 107,
      "reactTokens": 127,
      "description": "conditional rendering with tab panels",
      "tooeyCode": "{s:{tab:0},r:[V,[\n  [H,[[B,\"profile\",{c:[\"tab\",\"!\",0]}],[B,\"settings\",{c:[\"tab\",\"!\",1]}],[B,\"about\",{c:[\"tab\",\"!\",2]}]]],\n  {if:{$:\"tab\"},eq:0,then:[T,\"user profile content\"],else:{if:{$:\"tab\"},eq:1,then:[T,\"settings panel\"],else:[T,\"about section\"]}}\n],{g:0}]}",
      "reactCode": "function Tabs() {\n  const [tab, setTab] = useState(0);\n  const panels = ['user profile content', 'settings panel', 'about section'];\n  return (\n    <div>\n      <div style={{display:'flex'}}>\n        {['profile','settings','about'].map((t,i) => (\n          <button key={i} onClick={()=>setTab(i)}\n            className={tab===i?'active':''}>{t}</button>\n        ))}\n      </div>\n      <div className=\"panel\">{panels[tab]}</div>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"tab\":0},\"r\":[\"vs\",[[\"hs\",[[\"bt\",\"profile\",{\"c\":[\"tab\",\"!\",0],\"s\":{\"padding\":\"8px 16px\",\"background\":\"transparent\",\"border\":\"none\",\"cursor\":\"pointer\",\"color\":\"#fa0\",\"borderBottom\":\"2px solid #fa0\"}}],[\"bt\",\"settings\",{\"c\":[\"tab\",\"!\",1],\"s\":{\"padding\":\"8px 16px\",\"background\":\"transparent\",\"border\":\"none\",\"cursor\":\"pointer\",\"color\":\"#666\"}}],[\"bt\",\"about\",{\"c\":[\"tab\",\"!\",2],\"s\":{\"padding\":\"8px 16px\",\"background\":\"transparent\",\"border\":\"none\",\"cursor\":\"pointer\",\"color\":\"#666\"}}]],{\"g\":0,\"s\":{\"borderBottom\":\"1px solid #333\"}}],{\"?\":\"tab\",\"is\":0,\"t\":[\"tx\",\"user profile content\",{\"p\":16,\"fg\":\"#ccc\"}],\"e\":{\"?\":\"tab\",\"is\":1,\"t\":[\"tx\",\"settings panel\",{\"p\":16,\"fg\":\"#ccc\"}],\"e\":[\"tx\",\"about section\",{\"p\":16,\"fg\":\"#ccc\"}]}}],{\"g\":0}]}",
      "reactDemoCode": "function Tabs() {\n  const [tab, setTab] = React.useState(0);\n  const tabs = ['profile','settings','about'];\n  const panels = ['user profile content','settings panel','about section'];\n  const btnStyle = (i) => ({padding:'8px 16px',background:'transparent',border:'none',cursor:'pointer',color:i===tab?'#fa0':'#666',borderBottom:i===tab?'2px solid #fa0':'none'});\n  return (\n    <div>\n      <div style={{display:'flex',borderBottom:'1px solid #333'}}>\n        {tabs.map((t,i) => <button key={i} style={btnStyle(i)} onClick={()=>setTab(i)}>{t}</button>)}\n      </div>\n      <div style={{padding:16,color:'#ccc'}}>{panels[tab]}</div>\n    </div>\n  );\n}",
      "file": "06-tabs.html"
    },
    {
      "id": "modal",
      "name": "modal",
      "savings": "-24%",
      "tooeyTokens": 135,
      "reactTokens": 178,
      "description": "dialog / overlay with conditional visibility",
      "tooeyCode": "{s:{open:false},r:[V,[\n  [B,\"open modal\",{c:[\"open\",\"~\"]}],\n  {if:\"open\",then:[D,[\n    [D,[[T,\"confirm action\",{fw:600}],[T,\"are you sure?\"],[B,\"close\",{c:[\"open\",\"~\"]}]],{bg:\"#1a1a1a\",p:24,r:8,g:12}]\n  ],{pos:\"abs\",t:0,l:0,w:\"100%\",h:\"100%\",bg:\"rgba(0,0,0,0.7)\",ai:\"center\",jc:\"center\"}]}\n]]}",
      "reactCode": "function Modal() {\n  const [open, setOpen] = useState(false);\n  return (\n    <div>\n      <button onClick={()=>setOpen(true)}>open modal</button>\n      {open && (\n        <div style={{position:'absolute',top:0,left:0,width:'100%',\n          height:'100%',background:'rgba(0,0,0,0.7)',\n          display:'flex',alignItems:'center',justifyContent:'center'}}>\n          <div style={{background:'#1a1a1a',padding:24,borderRadius:8}}>\n            <h3 style={{fontWeight:600}}>confirm action</h3>\n            <p>are you sure?</p>\n            <button onClick={()=>setOpen(false)}>close</button>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"open\":false},\"r\":[\"vs\",[[\"bt\",\"open modal\",{\"c\":[\"open\",\"~\"]}],{\"?\":\"open\",\"t\":[\"dv\",[[\"dv\",[[\"tx\",\"confirm action\",{\"fw\":600,\"fg\":\"#fff\",\"fs\":14}],[\"tx\",\"are you sure?\",{\"fg\":\"#888\",\"fs\":12}],[\"bt\",\"close\",{\"c\":[\"open\",\"~\"]}]],{\"bg\":\"#1a1a1a\",\"p\":24,\"r\":8,\"g\":12,\"ta\":\"center\"}]],{\"pos\":\"abs\",\"t\":0,\"l\":0,\"w\":\"100%\",\"h\":\"100%\",\"bg\":\"rgba(0,0,0,0.7)\",\"s\":{\"display\":\"flex\",\"alignItems\":\"center\",\"justifyContent\":\"center\"}}]}],{\"pos\":\"rel\",\"h\":150}]}",
      "reactDemoCode": "function Modal() {\n  const [open, setOpen] = React.useState(false);\n  return (\n    <div style={{position:'relative',height:150}}>\n      <button onClick={()=>setOpen(true)}>open modal</button>\n      {open && (\n        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>\n          <div style={{background:'#1a1a1a',padding:24,borderRadius:8,textAlign:'center',display:'flex',flexDirection:'column',gap:12}}>\n            <span style={{fontWeight:600,color:'#fff',fontSize:14}}>confirm action</span>\n            <span style={{color:'#888',fontSize:12}}>are you sure?</span>\n            <button onClick={()=>setOpen(false)}>close</button>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}",
      "file": "07-modal.html"
    },
    {
      "id": "shopping-cart",
      "name": "shopping cart",
      "savings": "-29%",
      "tooeyTokens": 197,
      "reactTokens": 279,
      "description": "quantity controls with computed total",
      "tooeyCode": "{s:{items:[{n:\"widget\",p:25,q:1},{n:\"gadget\",p:35,q:2}]},r:[V,[\n  {map:\"items\",as:[H,[\n    [T,\"$item.n\",{fg:\"#ccc\"}],\n    [H,[[B,\"-\",{c:dec}],[T,\"$item.q\"],[B,\"+\",{c:inc}]],{g:8,ai:\"center\"}],\n    [T,\"$item.price\",{fg:\"#0af\"}]\n  ],{jc:\"space-between\",ai:\"center\",p:\"8px 0\"}]},\n  [H,[[T,\"total:\"],[T,{$:\"total\"},{fg:\"#4f8\",fw:600}]],{jc:\"space-between\",p:\"16px 0\"}]\n],{g:0}]}",
      "reactCode": "function Cart() {\n  const [items, setItems] = useState([\n    {n:\"widget\",p:25,q:1},\n    {n:\"gadget\",p:35,q:2}\n  ]);\n  const updateQty = (i, delta) => {\n    setItems(items.map((item, j) =>\n      j === i ? {...item, q: Math.max(0, item.q + delta)} : item\n    ).filter(item => item.q > 0));\n  };\n  const total = items.reduce((s,i) => s + i.p * i.q, 0);\n  return (\n    <div>\n      {items.map((item, i) => (\n        <div key={i} className=\"cart-item\">\n          <span className=\"name\">{item.n}</span>\n          <div className=\"qty\">\n            <button onClick={()=>updateQty(i,-1)}>-</button>\n            <span>{item.q}</span>\n            <button onClick={()=>updateQty(i,1)}>+</button>\n          </div>\n          <span className=\"price\">${item.p * item.q}</span>\n        </div>\n      ))}\n      <div className=\"total\">\n        <span>total:</span>\n        <span>${total}</span>\n      </div>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"q1\":1,\"q2\":2,\"total\":\"$95\"},\"r\":[\"vs\",[[\"hs\",[[\"tx\",\"widget\",{\"fg\":\"#ccc\",\"s\":{\"flex\":\"1\"}}],[\"hs\",[[\"bt\",\"-\",{\"c\":[\"q1\",\"-\"]}],[\"tx\",{\"$\":\"q1\"}],[\"bt\",\"+\",{\"c\":[\"q1\",\"+\"]}]],{\"g\":8,\"ai\":\"c\"}],[\"tx\",\"$25\",{\"fg\":\"#fa0\",\"w\":50,\"ta\":\"right\"}]],{\"jc\":\"sb\",\"ai\":\"c\",\"p\":\"8px 0\",\"s\":{\"borderBottom\":\"1px solid #333\"}}],[\"hs\",[[\"tx\",\"gadget\",{\"fg\":\"#ccc\",\"s\":{\"flex\":\"1\"}}],[\"hs\",[[\"bt\",\"-\",{\"c\":[\"q2\",\"-\"]}],[\"tx\",{\"$\":\"q2\"}],[\"bt\",\"+\",{\"c\":[\"q2\",\"+\"]}]],{\"g\":8,\"ai\":\"c\"}],[\"tx\",\"$35\",{\"fg\":\"#fa0\",\"w\":50,\"ta\":\"right\"}]],{\"jc\":\"sb\",\"ai\":\"c\",\"p\":\"8px 0\",\"s\":{\"borderBottom\":\"1px solid #333\"}}],[\"hs\",[[\"tx\",\"total:\",{\"fg\":\"#888\"}],[\"tx\",{\"$\":\"total\"},{\"fg\":\"#4f8\",\"fw\":600}]],{\"jc\":\"sb\",\"p\":\"16px 0\"}]],{\"g\":0}]}",
      "reactDemoCode": "function Cart() {\n  const [items, setItems] = React.useState([{n:'widget',p:25,q:1},{n:'gadget',p:35,q:2}]);\n  const update = (i,d) => setItems(items.map((it,j)=>j===i?{...it,q:Math.max(0,it.q+d)}:it).filter(it=>it.q>0));\n  const total = items.reduce((s,i)=>s+i.p*i.q,0);\n  return (\n    <div>\n      {items.map((it,i) => (\n        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #333'}}>\n          <span style={{flex:1,color:'#ccc'}}>{it.n}</span>\n          <div style={{display:'flex',gap:8,alignItems:'center'}}>\n            <button onClick={()=>update(i,-1)}>-</button>\n            <span>{it.q}</span>\n            <button onClick={()=>update(i,1)}>+</button>\n          </div>\n          <span style={{color:'#fa0',width:50,textAlign:'right'}}>${it.p*it.q}</span>\n        </div>\n      ))}\n      <div style={{display:'flex',justifyContent:'space-between',padding:'16px 0'}}>\n        <span style={{color:'#888'}}>total:</span>\n        <span style={{color:'#4f8',fontWeight:600}}>${total}</span>\n      </div>\n    </div>\n  );\n}",
      "file": "08-shopping-cart.html"
    },
    {
      "id": "wizard",
      "name": "wizard",
      "savings": "-26%",
      "tooeyTokens": 249,
      "reactTokens": 338,
      "description": "multi-step form with progress indicator",
      "tooeyCode": "{s:{step:0,name:\"\",email:\"\"},r:[V,[\n  [H,[[D,{cls:\"step done\"}],[D,{cls:\"step\"}],[D,{cls:\"step\"}]],{g:4}],\n  {if:{$:\"step\"},eq:0,then:[V,[[T,\"step 1: name\"],[I,\"\",{v:{$:\"name\"},x:[\"name\",\"!\"],ph:\"your name\"}]],{g:12}]},\n  {if:{$:\"step\"},eq:1,then:[V,[[T,\"step 2: email\"],[I,\"\",{v:{$:\"email\"},x:[\"email\",\"!\"],ph:\"email\",type:\"email\"}]],{g:12}]},\n  {if:{$:\"step\"},eq:2,then:[V,[[T,\"done!\"],[T,\"thanks for signing up\"]],{g:12}]},\n  [H,[[B,\"back\",{c:[\"step\",\"-\"],dis:{$:\"step\"},eq:0}],[B,\"next\",{c:[\"step\",\"+\"]}]],{g:8,jc:\"flex-end\"}]\n],{g:16}]}",
      "reactCode": "function Wizard() {\n  const [step, setStep] = useState(0);\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:16}}>\n      <div style={{display:'flex',gap:4}}>\n        {[0,1,2].map(i => (\n          <div key={i} className={'step'+(i<=step?' done':'')} />\n        ))}\n      </div>\n      {step === 0 && (\n        <div>\n          <h3>step 1: name</h3>\n          <input value={name} onChange={e=>setName(e.target.value)}\n            placeholder=\"your name\" />\n        </div>\n      )}\n      {step === 1 && (\n        <div>\n          <h3>step 2: email</h3>\n          <input type=\"email\" value={email}\n            onChange={e=>setEmail(e.target.value)} placeholder=\"email\" />\n        </div>\n      )}\n      {step === 2 && <div><h3>done!</h3><p>thanks for signing up</p></div>}\n      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>\n        <button disabled={step===0} onClick={()=>setStep(s=>s-1)}>back</button>\n        <button onClick={()=>setStep(s=>Math.min(2,s+1))}>next</button>\n      </div>\n    </div>\n  );\n}",
      "demoSpec": "{\"s\":{\"step\":0,\"name\":\"\",\"email\":\"\"},\"r\":[\"vs\",[[\"hs\",[[\"dv\",\"\",{\"w\":40,\"h\":4,\"bg\":\"#fa0\",\"r\":2}],[\"dv\",\"\",{\"w\":40,\"h\":4,\"bg\":\"#333\",\"r\":2}],[\"dv\",\"\",{\"w\":40,\"h\":4,\"bg\":\"#333\",\"r\":2}]],{\"g\":4}],{\"?\":\"step\",\"is\":0,\"t\":[\"vs\",[[\"tx\",\"step 1: name\",{\"fw\":500,\"fg\":\"#fff\"}],[\"in\",\"\",{\"v\":{\"$\":\"name\"},\"x\":[\"name\",\"!\"],\"ph\":\"your name\",\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"100%\"}}]],{\"g\":12}],\"e\":{\"?\":\"step\",\"is\":1,\"t\":[\"vs\",[[\"tx\",\"step 2: email\",{\"fw\":500,\"fg\":\"#fff\"}],[\"in\",\"\",{\"type\":\"email\",\"v\":{\"$\":\"email\"},\"x\":[\"email\",\"!\"],\"ph\":\"email\",\"s\":{\"padding\":\"8px\",\"background\":\"#0a0a0f\",\"color\":\"#fff\",\"border\":\"1px solid #333\",\"borderRadius\":\"4px\",\"width\":\"100%\"}}]],{\"g\":12}],\"e\":[\"vs\",[[\"tx\",\"done!\",{\"fw\":600,\"fg\":\"#4f8\",\"fs\":16}],[\"tx\",\"thanks for signing up\",{\"fg\":\"#888\"}]],{\"g\":8}]}},[\"hs\",[[\"bt\",\"back\",{\"c\":[\"step\",\"-\"]}],[\"bt\",\"next\",{\"c\":[\"step\",\"+\"]}]],{\"g\":8,\"jc\":\"fe\"}]],{\"g\":16}]}",
      "reactDemoCode": "function Wizard() {\n  const [step, setStep] = React.useState(0);\n  const [name, setName] = React.useState('');\n  const [email, setEmail] = React.useState('');\n  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:'100%'};\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:16}}>\n      <div style={{display:'flex',gap:4}}>\n        {[0,1,2].map(i => <div key={i} style={{width:40,height:4,borderRadius:2,background:i<=step?'#fa0':'#333'}} />)}\n      </div>\n      {step===0 && <div style={{display:'flex',flexDirection:'column',gap:12}}><span style={{fontWeight:500,color:'#fff'}}>step 1: name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder=\"your name\" style={inputStyle}/></div>}\n      {step===1 && <div style={{display:'flex',flexDirection:'column',gap:12}}><span style={{fontWeight:500,color:'#fff'}}>step 2: email</span><input type=\"email\" value={email} onChange={e=>setEmail(e.target.value)} placeholder=\"email\" style={inputStyle}/></div>}\n      {step===2 && <div style={{display:'flex',flexDirection:'column',gap:8}}><span style={{fontWeight:600,color:'#4f8',fontSize:16}}>done!</span><span style={{color:'#888'}}>thanks for signing up</span></div>}\n      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>\n        <button disabled={step===0} onClick={()=>setStep(s=>s-1)}>back</button>\n        <button onClick={()=>setStep(s=>Math.min(2,s+1))}>next</button>\n      </div>\n    </div>\n  );\n}",
      "file": "09-wizard.html"
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
