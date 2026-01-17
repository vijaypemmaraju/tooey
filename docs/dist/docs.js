import{render as N,signal as L,effect as A,V as s,H as c,D as d,G as T,T as t,B as S,I as J,L as E,Sv as Y}from"@tooey/ui";var o={coreFunctions:[{id:"$",name:"$",category:"core",description:"$ function",signature:"$(name: string): StateRef",params:[{name:"name",type:"string",description:""}],returns:"StateRef",example:""},{id:"async$",name:"async$",category:"core",description:"async$ function",signature:"async$(promiseOrFn: Promise | object, options?: object): AsyncSpec",params:[{name:"promiseOrFn",type:"Promise | object",description:""},{name:"options",type:"object",description:"",optional:!0}],returns:"AsyncSpec",example:""},{id:"batch",name:"batch",category:"core",description:"batch function",signature:"batch(fn: object): void",params:[{name:"fn",type:"object",description:""}],returns:"void",example:""},{id:"computed",name:"computed",category:"core",description:"computed function",signature:"computed(fn: object): ComputedSignal",params:[{name:"fn",type:"object",description:""}],returns:"ComputedSignal",example:""},{id:"createtooey",name:"createTooey",category:"core",description:"createTooey function",signature:"createTooey(themeOrOptions: Theme | CreateTooeyOptions): TooeyFactory",params:[{name:"themeOrOptions",type:"Theme | CreateTooeyOptions",description:""}],returns:"TooeyFactory",example:""},{id:"effect",name:"effect",category:"core",description:"effect function",signature:"effect(fn: object, ctx?: RenderContext): object",params:[{name:"fn",type:"object",description:""},{name:"ctx",type:"RenderContext",description:"",optional:!0}],returns:"object",example:""},{id:"render",name:"render",category:"core",description:"render function",signature:"render(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance",params:[{name:"container",type:"HTMLElement",description:""},{name:"spec",type:"TooeySpec",description:""},{name:"options",type:"RenderOptions",description:"",optional:!0}],returns:"TooeyInstance",example:""},{id:"signal",name:"signal",category:"core",description:"signal function",signature:"signal(initial: T): Signal",params:[{name:"initial",type:"T",description:""}],returns:"Signal",example:""}],instanceMethods:[{id:"get",name:"get",category:"instance",description:"read the current value of a state key",signature:"instance.get(key: string): unknown",example:'const count = app.get("count");'},{id:"set",name:"set",category:"instance",description:"set a state value (triggers reactive updates)",signature:"instance.set(key: string, value: unknown): void",example:'app.set("count", 10);'},{id:"destroy",name:"destroy",category:"instance",description:"clean up event listeners and remove dom elements",signature:"instance.destroy(): void",example:"app.destroy();"},{id:"update",name:"update",category:"instance",description:"update state values or re-render with new root",signature:"instance.update(spec: TooeySpec): void",example:"app.update({ s: { count: 0 }, r: newSpec });"}],components:[{id:"B",name:"B",fullName:"Button",category:"text",element:"button",description:"Button component",example:'[B, "content", { }]'},{id:"C",name:"C",fullName:"Checkbox",category:"form",element:"input[checkbox]",description:"Checkbox component",example:'[C, "content", { }]'},{id:"D",name:"D",fullName:"Div",category:"layout",element:"div",description:"Div component",example:'[D, "content", { }]'},{id:"G",name:"G",fullName:"Grid",category:"layout",element:"div",description:"Grid component",example:'[G, "content", { }]'},{id:"H",name:"H",fullName:"HStack",category:"layout",element:"div",description:"HStack component",example:'[H, "content", { }]'},{id:"I",name:"I",fullName:"Input",category:"form",element:"input",description:"Input component",example:'[I, "content", { }]'},{id:"L",name:"L",fullName:"Link",category:"media",element:"a",description:"Link component",example:'[L, "content", { }]'},{id:"Li",name:"Li",fullName:"ListItem",category:"list",element:"li",description:"ListItem component",example:'[Li, "content", { }]'},{id:"M",name:"M",fullName:"Image",category:"media",element:"img",description:"Image component",example:'[M, "content", { }]'},{id:"Ol",name:"Ol",fullName:"OrderedList",category:"list",element:"ol",description:"OrderedList component",example:'[Ol, "content", { }]'},{id:"R",name:"R",fullName:"Radio",category:"form",element:"input[radio]",description:"Radio component",example:'[R, "content", { }]'},{id:"S",name:"S",fullName:"Select",category:"form",element:"select",description:"Select component",example:'[S, "content", { }]'},{id:"Sv",name:"Sv",fullName:"SVG",category:"media",element:"svg",description:"SVG component",example:'[Sv, "content", { }]'},{id:"T",name:"T",fullName:"Text",category:"text",element:"span",description:"Text component",example:'[T, "content", { }]'},{id:"Ta",name:"Ta",fullName:"Textarea",category:"form",element:"textarea",description:"Textarea component",example:'[Ta, "content", { }]'},{id:"Tb",name:"Tb",fullName:"Table",category:"table",element:"table",description:"Table component",example:'[Tb, "content", { }]'},{id:"Tbd",name:"Tbd",fullName:"TableBody",category:"table",element:"tbody",description:"TableBody component",example:'[Tbd, "content", { }]'},{id:"Tc",name:"Tc",fullName:"TableHeaderCell",category:"table",element:"th",description:"TableHeaderCell component",example:'[Tc, "content", { }]'},{id:"Td",name:"Td",fullName:"TableCell",category:"table",element:"td",description:"TableCell component",example:'[Td, "content", { }]'},{id:"Th",name:"Th",fullName:"TableHead",category:"table",element:"thead",description:"TableHead component",example:'[Th, "content", { }]'},{id:"Tr",name:"Tr",fullName:"TableRow",category:"table",element:"tr",description:"TableRow component",example:'[Tr, "content", { }]'},{id:"Ul",name:"Ul",fullName:"UnorderedList",category:"list",element:"ul",description:"UnorderedList component",example:'[Ul, "content", { }]'},{id:"V",name:"V",fullName:"VStack",category:"layout",element:"div",description:"VStack component",example:'[V, "content", { }]'}],props:[{id:"g",name:"g",fullName:"gap",category:"spacing",css:"gap",description:"gap between flex/grid children",example:"{ g: 8 }"},{id:"p",name:"p",fullName:"padding",category:"spacing",css:"padding",description:"inner spacing",example:"{ p: 16 }"},{id:"m",name:"m",fullName:"margin",category:"spacing",css:"margin",description:"outer spacing",example:"{ m: 8 }"},{id:"w",name:"w",fullName:"width",category:"sizing",css:"width",description:"element width",example:"{ w: 200 }"},{id:"h",name:"h",fullName:"height",category:"sizing",css:"height",description:"element height",example:"{ h: 100 }"},{id:"mw",name:"mw",fullName:"maxWidth",category:"sizing",css:"max-width",description:"maximum width",example:"{ mw: 600 }"},{id:"mh",name:"mh",fullName:"maxHeight",category:"sizing",css:"max-height",description:"maximum height",example:"{ mh: 400 }"},{id:"bg",name:"bg",fullName:"background",category:"colors",css:"background",description:"background color",example:'{ bg: "#f0f0f0" }'},{id:"fg",name:"fg",fullName:"color",category:"colors",css:"color",description:"text color",example:'{ fg: "blue" }'},{id:"o",name:"o",fullName:"opacity",category:"colors",css:"opacity",description:"element opacity",example:"{ o: 0.5 }"},{id:"r",name:"r",fullName:"borderRadius",category:"borders",css:"border-radius",description:"corner rounding",example:"{ r: 8 }"},{id:"bw",name:"bw",fullName:"borderWidth",category:"borders",css:"border-width",description:"border thickness",example:"{ bw: 1 }"},{id:"bc",name:"bc",fullName:"borderColor",category:"borders",css:"border-color",description:"border color",example:'{ bc: "gray" }'},{id:"bs",name:"bs",fullName:"borderStyle",category:"borders",css:"border-style",description:"border style",example:'{ bs: "solid" }'},{id:"pos",name:"pos",fullName:"position",category:"positioning",css:"position",description:"position type (rel/abs/fix/sticky)",example:'{ pos: "abs" }'},{id:"z",name:"z",fullName:"zIndex",category:"positioning",css:"z-index",description:"stack order",example:"{ z: 100 }"},{id:"t",name:"t",fullName:"top",category:"positioning",css:"top",description:"top position",example:"{ t: 0 }"},{id:"l",name:"l",fullName:"left",category:"positioning",css:"left",description:"left position",example:"{ l: 0 }"},{id:"b",name:"b",fullName:"bottom",category:"positioning",css:"bottom",description:"bottom position",example:"{ b: 0 }"},{id:"rt",name:"rt",fullName:"right",category:"positioning",css:"right",description:"right position",example:"{ rt: 0 }"},{id:"fs",name:"fs",fullName:"fontSize",category:"typography",css:"font-size",description:"text size",example:"{ fs: 16 }"},{id:"fw",name:"fw",fullName:"fontWeight",category:"typography",css:"font-weight",description:"text weight",example:"{ fw: 700 }"},{id:"ff",name:"ff",fullName:"fontFamily",category:"typography",css:"font-family",description:"font family",example:'{ ff: "Arial" }'},{id:"ta",name:"ta",fullName:"textAlign",category:"typography",css:"text-align",description:"text alignment",example:'{ ta: "center" }'},{id:"td",name:"td",fullName:"textDecoration",category:"typography",css:"text-decoration",description:"text decoration",example:'{ td: "underline" }'},{id:"lh",name:"lh",fullName:"lineHeight",category:"typography",css:"line-height",description:"line spacing",example:"{ lh: 1.5 }"},{id:"ls",name:"ls",fullName:"letterSpacing",category:"typography",css:"letter-spacing",description:"character spacing",example:"{ ls: 1 }"},{id:"ai",name:"ai",fullName:"alignItems",category:"layout",css:"align-items",description:"cross-axis alignment (c/fs/fe/st)",example:'{ ai: "c" }'},{id:"jc",name:"jc",fullName:"justifyContent",category:"layout",css:"justify-content",description:"main-axis alignment (c/sb/sa/se)",example:'{ jc: "sb" }'},{id:"flw",name:"flw",fullName:"flexWrap",category:"layout",css:"flex-wrap",description:"flex wrapping",example:'{ flw: "wrap" }'},{id:"cols",name:"cols",fullName:"gridColumns",category:"layout",css:"grid-template-columns",description:"grid column count",example:"{ cols: 3 }"},{id:"rows",name:"rows",fullName:"gridRows",category:"layout",css:"grid-template-rows",description:"grid row count",example:"{ rows: 2 }"},{id:"cur",name:"cur",fullName:"cursor",category:"misc",css:"cursor",description:"mouse cursor style",example:'{ cur: "pointer" }'},{id:"ov",name:"ov",fullName:"overflow",category:"misc",css:"overflow",description:"overflow behavior",example:'{ ov: "hidden" }'},{id:"pe",name:"pe",fullName:"pointerEvents",category:"misc",css:"pointer-events",description:"pointer event handling",example:'{ pe: "none" }'},{id:"us",name:"us",fullName:"userSelect",category:"misc",css:"user-select",description:"text selection behavior",example:'{ us: "none" }'},{id:"sh",name:"sh",fullName:"boxShadow",category:"misc",css:"box-shadow",description:"shadow effect",example:'{ sh: "0 2px 4px rgba(0,0,0,0.1)" }'},{id:"tr",name:"tr",fullName:"transform",category:"misc",css:"transform",description:"css transform",example:'{ tr: "rotate(45deg)" }'},{id:"s",name:"s",fullName:"customStyles",category:"misc",css:"(object)",description:"custom css properties",example:'{ s: { display: "inline-block" } }'},{id:"v",name:"v",fullName:"value",category:"element",css:"-",description:"input value binding",example:'{ v: { $: "name" } }'},{id:"ph",name:"ph",fullName:"placeholder",category:"element",css:"-",description:"placeholder text",example:'{ ph: "Enter text" }'},{id:"type",name:"type",fullName:"inputType",category:"element",css:"-",description:"input type attribute",example:'{ type: "email" }'},{id:"href",name:"href",fullName:"href",category:"element",css:"-",description:"link url (validated)",example:'{ href: "/page" }'},{id:"src",name:"src",fullName:"src",category:"element",css:"-",description:"image source (validated)",example:'{ src: "/img.png" }'},{id:"alt",name:"alt",fullName:"alt",category:"element",css:"-",description:"image alt text",example:'{ alt: "description" }'},{id:"dis",name:"dis",fullName:"disabled",category:"element",css:"-",description:"disabled state",example:"{ dis: true }"},{id:"ch",name:"ch",fullName:"checked",category:"element",css:"-",description:"checkbox/radio checked binding",example:'{ ch: { $: "agreed" } }'},{id:"ro",name:"ro",fullName:"readOnly",category:"element",css:"-",description:"read-only state",example:"{ ro: true }"},{id:"opts",name:"opts",fullName:"options",category:"element",css:"-",description:"select options array",example:'{ opts: [{ v: "a", l: "A" }] }'},{id:"rw",name:"rw",fullName:"rows",category:"element",css:"-",description:"textarea rows",example:"{ rw: 4 }"},{id:"sp",name:"sp",fullName:"colspan",category:"element",css:"-",description:"table cell column span",example:"{ sp: 2 }"},{id:"rsp",name:"rsp",fullName:"rowspan",category:"element",css:"-",description:"table cell row span",example:"{ rsp: 2 }"},{id:"cls",name:"cls",fullName:"className",category:"element",css:"-",description:"css class name",example:'{ cls: "my-class" }'},{id:"id",name:"id",fullName:"id",category:"element",css:"-",description:"element id attribute",example:'{ id: "my-id" }'}],events:[{id:"c",name:"c",fullName:"click",category:"event",event:"click",description:"click handler",example:'{ c: "count+" }'},{id:"x",name:"x",fullName:"input/change",category:"event",event:"input",description:"input value change",example:'{ x: ["name", "!"] }'},{id:"f",name:"f",fullName:"focus",category:"event",event:"focus",description:"focus gained",example:"{ f: () => {} }"},{id:"bl",name:"bl",fullName:"blur",category:"event",event:"blur",description:"focus lost",example:"{ bl: () => {} }"},{id:"k",name:"k",fullName:"keydown",category:"event",event:"keydown",description:"key pressed",example:"{ k: (e) => {} }"},{id:"ku",name:"ku",fullName:"keyup",category:"event",event:"keyup",description:"key released",example:"{ ku: (e) => {} }"},{id:"kp",name:"kp",fullName:"keypress",category:"event",event:"keypress",description:"key press",example:"{ kp: (e) => {} }"},{id:"e",name:"e",fullName:"mouseenter",category:"event",event:"mouseenter",description:"mouse entered",example:'{ e: "hover~" }'},{id:"lv",name:"lv",fullName:"mouseleave",category:"event",event:"mouseleave",description:"mouse left",example:'{ lv: "hover~" }'},{id:"sub",name:"sub",fullName:"submit",category:"event",event:"submit",description:"form submit",example:"{ sub: () => {} }"}],stateOps:[{id:"op-inc",name:"increment",op:"+",category:"operation",description:"increment numeric value",example:'["n", "+"] or ["n", "+", 5]'},{id:"op-dec",name:"decrement",op:"-",category:"operation",description:"decrement numeric value",example:'["n", "-"]'},{id:"op-set",name:"set",op:"!",category:"operation",description:"set to specific value",example:'["val", "!", "new"]'},{id:"op-toggle",name:"toggle",op:"~",category:"operation",description:"toggle boolean value",example:'["flag", "~"]'},{id:"op-append",name:"append",op:"<",category:"operation",description:"append to array",example:'["items", "<", newItem]'},{id:"op-prepend",name:"prepend",op:">",category:"operation",description:"prepend to array",example:'["items", ">", newItem]'},{id:"op-remove",name:"remove",op:"X",category:"operation",description:"remove from array by index/value",example:'["items", "X", index]'},{id:"op-prop",name:"property",op:".",category:"operation",description:"set object property",example:'["obj", ".", ["key", "value"]]'}],controlFlow:[{id:"cf-conditional",name:"conditional",category:"controlflow",description:"conditionally render based on state",example:'{ "?": "show", t: [T, "Visible"], e: [T, "Hidden"] }'},{id:"cf-equality",name:"equality check",category:"controlflow",description:"render when state equals specific value",example:'{ "?": "tab", is: "home", t: [T, "Home content"] }'},{id:"cf-map",name:"list rendering",category:"controlflow",description:"render list from array state",example:'{ m: "items", a: [Li, "$item"] }'},{id:"cf-map-index",name:"list with index",category:"controlflow",description:"access $index in map template",example:'{ m: "items", a: [Li, "$index: $item.name"] }'}],plugins:{description:"plugins extend tooey with cross-cutting concerns",interface:`interface TooeyPlugin {
  name: string;
  onInit?(instance: TooeyInstance): void;
  onDestroy?(instance: TooeyInstance): void;
  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
  afterRender?(el: HTMLElement, spec: NodeSpec): void;
  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;
  extend?: Record<string, Function>;
}`,hooks:[{name:"onInit",description:"called when instance is created",params:"instance: TooeyInstance"},{name:"onDestroy",description:"called when instance is destroyed",params:"instance: TooeyInstance"},{name:"beforeRender",description:"transform spec before rendering",params:"spec: NodeSpec, ctx: RenderContext"},{name:"afterRender",description:"called after element is rendered",params:"el: HTMLElement, spec: NodeSpec"},{name:"onStateChange",description:"called when state changes",params:"key: string, oldVal: unknown, newVal: unknown"},{name:"extend",description:"add methods to instance",params:"Record<string, Function>"}],example:`const loggerPlugin = {
  name: 'logger',
  onStateChange(key, oldVal, newVal) {
    console.log(\`[\${key}]\`, oldVal, '\u2192', newVal);
  }
};

render(el, spec, { plugins: [loggerPlugin] });`},theming:{description:"theme tokens ($name) are resolved at render time",interface:`interface Theme {
  colors?: Record<string, string>;
  spacing?: Record<string, number | string>;
  radius?: Record<string, number | string>;
  fonts?: Record<string, string>;
  [key: string]: Record<string, string | number> | undefined;
}`,supportedProps:{colors:["bg","fg","bc"],spacing:["g","p","m","w","h","mw","mh","t","l","b","rt","fs","ls"],radius:["r"],fonts:["ff"]},example:`const theme = {
  colors: { primary: '#007bff', danger: '#dc3545' },
  spacing: { sm: 8, md: 16, lg: 24 },
  radius: { rSm: 4, rMd: 8 }
};

render(el, { r: [B, 'Save', { bg: '$primary', p: '$md' }] }, { theme });`},functionComponents:{description:"function components are just functions returning NodeSpec",signature:"type Component<P> = (props?: P, children?: NodeSpec[]) => NodeSpec",example:`const Card = (props, children) => [V, children, {
  bg: '#fff', p: 16, r: 8,
  sh: '0 2px 4px rgba(0,0,0,0.1)',
  ...props
}];

// usage
[Card, [[T, 'Hello']], { bg: '#f0f0f0' }]`},errorBoundaries:{description:"catch render errors and show fallback ui",interface:`interface ErrorBoundaryNode {
  boundary: true;
  child: NodeSpec;
  fallback?: NodeSpec;
  onError?: (error: ErrorInfo) => void;
}`,example:`{
  boundary: true,
  child: [V, [[T, 'Risky content']]],
  fallback: [T, 'Something went wrong'],
  onError: (error) => console.error(error)
}`},types:[{id:"computedsignal",name:"ComputedSignal",category:"type",description:"ComputedSignal type",signature:"interface ComputedSignal { ... }"},{id:"props",name:"Props",category:"type",description:"Props type",signature:"interface Props { ... }"},{id:"theme",name:"Theme",category:"type",description:"Theme type",signature:"interface Theme { ... }"},{id:"tooeyinstance",name:"TooeyInstance",category:"type",description:"TooeyInstance type",signature:"interface TooeyInstance { ... }"},{id:"tooeyplugin",name:"TooeyPlugin",category:"type",description:"TooeyPlugin type",signature:"interface TooeyPlugin { ... }"},{id:"tooeyspec",name:"TooeySpec",category:"type",description:"TooeySpec type",signature:"interface TooeySpec { ... }"}],examples:[{id:"counter",name:"counter",savings:"-45%",tooeyTokens:56,reactTokens:102,description:"increment / decrement buttons with state",tooeyCode:'{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:["n","-"]}],[B,"+",{c:["n","+"]}]],{g:8}]],{g:8}]}',reactCode:`function Counter() {
  const [n, setN] = useState(0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <span>{n}</span>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>setN(n-1)}>-</button>
        <button onClick={()=>setN(n+1)}>+</button>
      </div>
    </div>
  );
}`,demoSpec:'{"s":{"n":0},"r":["V",[["T",{"$":"n"},{"fs":24,"fg":"#0af"}],["H",[["B","-",{"c":["n","-"]}],["B","+",{"c":["n","+"]}]],{"g":8}]],{"g":16,"ai":"c"}]}',file:"01-counter.html"},{id:"todo-list",name:"todo list",savings:"-55%",tooeyTokens:92,reactTokens:203,description:"add / remove items with input binding",tooeyCode:`{s:{txt:"",items:[]},r:[V,[
  [H,[[I,"",{v:{$:"txt"},x:["txt","!"],ph:"add..."}],[B,"+",{c:add}]],{g:8}],
  {map:"items",as:[H,[[T,"$item"],[B,"x",{c:del}]],{g:8}]}
],{g:12}]}`,reactCode:`function TodoList() {
  const [txt, setTxt] = useState('');
  const [items, setItems] = useState([]);
  const add = () => {
    if (txt) {
      setItems([...items, txt]);
      setTxt('');
    }
  };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)}
          placeholder="add..." />
        <button onClick={add}>+</button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{display:'flex',gap:8}}>
          <span>{item}</span>
          <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>
        </div>
      ))}
    </div>
  );
}`,demoSpec:'{"s":{"txt":"","items":["buy milk","walk dog"]},"r":["V",[["H",[["I","",{"v":{"$":"txt"},"x":["txt","!"],"ph":"add item..."}],["B","+",{"c":["items","<",{"$":"txt"}]}]],{"g":8}],{"m":"items","a":["H",[["T","$item",{"s":{"flex":"1"}}],["B","x",{"c":["items","X","$index"]}]],{"g":8,"p":"8px 0","s":{"borderBottom":"1px solid #333"}}]}],{"g":12}]}',file:"02-todo-list.html"},{id:"form",name:"form",savings:"-7%",tooeyTokens:196,reactTokens:211,description:"inputs, checkbox, validation",tooeyCode:`{s:{name:"",email:"",pw:"",agree:false},r:[V,[
  [V,[[T,"name"],[I,"",{ph:"your name",v:{$:"name"},x:["name","!"]}]],{g:4}],
  [V,[[T,"email"],[I,"",{type:"email",ph:"you@example.com",v:{$:"email"},x:["email","!"]}]],{g:4}],
  [V,[[T,"password"],[I,"",{type:"password",ph:"********",v:{$:"pw"},x:["pw","!"]}]],{g:4}],
  [H,[[C,"",{ch:{$:"agree"},x:["agree","~"]}],[T,"i agree to terms"]],{g:8,ai:"center"}],
  [B,"sign up",{c:submit}]
],{g:16}]}`,reactCode:`function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [agree, setAgree] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>name</label>
        <input placeholder="your name" value={name}
          onChange={e=>setName(e.target.value)} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>email</label>
        <input type="email" placeholder="you@example.com"
          value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      ...
      <button onClick={submit}>sign up</button>
    </div>
  );
}`,demoSpec:'{"s":{"name":"","email":"","agree":false},"r":["V",[["V",[["T","name",{"fs":12,"fg":"#888"}],["I","",{"ph":"your name","v":{"$":"name"},"x":["name","!"]}]],{"g":4}],["V",[["T","email",{"fs":12,"fg":"#888"}],["I","",{"type":"email","ph":"you@example.com","v":{"$":"email"},"x":["email","!"]}]],{"g":4}],["H",[["C","",{"ch":{"$":"agree"},"x":["agree","~"]}],["T","i agree to terms",{"fs":13}]],{"g":8,"ai":"c"}],["B","sign up",{"bg":"#0af","fg":"#000","p":"10px 20px","r":4,"s":{"border":"none","cursor":"pointer"}}]],{"g":16}]}',file:"03-form.html"},{id:"temperature",name:"temperature converter",savings:"-59%",tooeyTokens:109,reactTokens:269,description:"bidirectional binding between celsius and fahrenheit",tooeyCode:`{s:{c:0,f:32},r:[H,[
  [V,[[T,"celsius"],[I,"",{type:"number",v:{$:"c"},x:onC}]],{g:4}],
  [T,"=",{fs:24,fg:"#0af"}],
  [V,[[T,"fahrenheit"],[I,"",{type:"number",v:{$:"f"},x:onF}]],{g:4}]
],{g:16,ai:"center"}]}`,reactCode:`function TempConverter() {
  const [c, setC] = useState(0);
  const [f, setF] = useState(32);
  const onCelsiusChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setC(val);
    setF(val * 9/5 + 32);
  };
  const onFahrenheitChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setF(val);
    setC((val - 32) * 5/9);
  };
  return (
    <div style={{display:'flex',gap:16,alignItems:'center'}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span>celsius</span>
        <input type="number" value={c} onChange={onCelsiusChange}/>
      </div>
      <span style={{fontSize:24}}>=</span>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span>fahrenheit</span>
        <input type="number" value={f} onChange={onFahrenheitChange}/>
      </div>
    </div>
  );
}`,demoSpec:'{"s":{"c":20},"r":["H",[["V",[["T","celsius",{"fs":12,"fg":"#888"}],["I","",{"type":"number","v":{"$":"c"},"x":["c","!"]}]],{"g":4}],["T","=",{"fs":24,"fg":"#0af"}],["V",[["T","fahrenheit",{"fs":12,"fg":"#888"}],["T","68",{"fs":16}]],{"g":4}]],{"g":16,"ai":"c"}]}',file:"04-temperature-converter.html"},{id:"data-table",name:"data table",savings:"-52%",tooeyTokens:131,reactTokens:275,description:"sortable, filterable table with search",tooeyCode:`{s:{q:"",sort:"name",asc:true,data:[...]},r:[V,[
  [I,"",{ph:"search...",v:{$:"q"},x:["q","!"]}],
  [Tb,[
    [Th,[[Tr,[[Tc,"name",{c:sort}],[Tc,"age",{c:sort}],[Tc,"role",{c:sort}]]]]],
    [Tbd,[{map:"filtered",as:[Tr,[[Td,"$item.name"],[Td,"$item.age"],[Td,"$item.role"]]]}]]
  ]]
],{g:12}]}`,reactCode:`function DataTable() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name');
  const [asc, setAsc] = useState(true);
  const [data] = useState([...]);
  const filtered = data
    .filter(r => Object.values(r).some(v =>
      String(v).toLowerCase().includes(q.toLowerCase())))
    .sort((a,b) => {...});
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <input placeholder="search..." value={q}
        onChange={e=>setQ(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th onClick={()=>toggleSort('name')}>name</th>
            ...
          </tr>
        </thead>
        <tbody>
          {filtered.map((row,i) => (
            <tr key={i}>
              <td>{row.name}</td>
              ...
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,demoSpec:'{"s":{"data":[{"name":"alice","age":28,"role":"engineer"},{"name":"bob","age":34,"role":"designer"},{"name":"carol","age":25,"role":"manager"}]},"r":["V",[["Tb",[["Th",[["Tr",[["Tc","name",{"fg":"#0af"}],["Tc","age",{"fg":"#0af"}],["Tc","role",{"fg":"#0af"}]]]]],["Tbd",[{"m":"data","a":["Tr",[["Td","$item.name"],["Td","$item.age"],["Td","$item.role"]]]}]]]]],{"g":12}]}',file:"05-data-table.html"},{id:"tabs",name:"tabs",savings:"-16%",tooeyTokens:107,reactTokens:127,description:"conditional rendering with tab panels",tooeyCode:`{s:{tab:0},r:[V,[
  [H,[[B,"profile",{c:["tab","!",0]}],[B,"settings",{c:["tab","!",1]}],[B,"about",{c:["tab","!",2]}]]],
  {if:{$:"tab"},eq:0,then:[T,"user profile content"],else:{if:{$:"tab"},eq:1,then:[T,"settings panel"],else:[T,"about section"]}}
],{g:0}]}`,reactCode:`function Tabs() {
  const [tab, setTab] = useState(0);
  const panels = ['user profile content', 'settings panel', 'about section'];
  return (
    <div>
      <div style={{display:'flex'}}>
        {['profile','settings','about'].map((t,i) => (
          <button key={i} onClick={()=>setTab(i)}
            className={tab===i?'active':''}>{t}</button>
        ))}
      </div>
      <div className="panel">{panels[tab]}</div>
    </div>
  );
}`,demoSpec:'{"s":{"tab":0},"r":["V",[["H",[["B","profile",{"c":["tab","!",0]}],["B","settings",{"c":["tab","!",1]}],["B","about",{"c":["tab","!",2]}]],{"g":0,"s":{"borderBottom":"1px solid #333"}}],{"?":"tab","is":0,"t":["T","user profile content",{"p":16,"fg":"#ccc"}],"e":{"?":"tab","is":1,"t":["T","settings panel",{"p":16,"fg":"#ccc"}],"e":["T","about section",{"p":16,"fg":"#ccc"}]}}],{"g":0}]}',file:"06-tabs.html"},{id:"modal",name:"modal",savings:"-24%",tooeyTokens:135,reactTokens:178,description:"dialog / overlay with conditional visibility",tooeyCode:`{s:{open:false},r:[V,[
  [B,"open modal",{c:["open","~"]}],
  {if:"open",then:[D,[
    [D,[[T,"confirm action",{fw:600}],[T,"are you sure?"],[B,"close",{c:["open","~"]}]],{bg:"#1a1a1a",p:24,r:8,g:12}]
  ],{pos:"abs",t:0,l:0,w:"100%",h:"100%",bg:"rgba(0,0,0,0.7)",ai:"center",jc:"center"}]}
]]}`,reactCode:`function Modal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(true)}>open modal</button>
      {open && (
        <div style={{position:'absolute',top:0,left:0,width:'100%',
          height:'100%',background:'rgba(0,0,0,0.7)',
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#1a1a1a',padding:24,borderRadius:8}}>
            <h3 style={{fontWeight:600}}>confirm action</h3>
            <p>are you sure?</p>
            <button onClick={()=>setOpen(false)}>close</button>
          </div>
        </div>
      )}
    </div>
  );
}`,demoSpec:'{"s":{"open":false},"r":["V",[["B","open modal",{"c":["open","~"]}],{"?":"open","t":["D",[["D",[["T","confirm action",{"fw":600,"fg":"#fff","fs":14}],["T","are you sure?",{"fg":"#888","fs":12}],["B","close",{"c":["open","~"]}]],{"bg":"#1a1a1a","p":24,"r":8,"g":12,"ta":"c"}]],{"pos":"abs","t":0,"l":0,"w":"100%","h":"100%","bg":"rgba(0,0,0,0.7)","s":{"display":"flex","alignItems":"center","justifyContent":"center"}}]}],{"pos":"rel","h":150}]}',file:"07-modal.html"},{id:"shopping-cart",name:"shopping cart",savings:"-29%",tooeyTokens:197,reactTokens:279,description:"quantity controls with computed total",tooeyCode:`{s:{items:[{n:"widget",p:25,q:1},{n:"gadget",p:35,q:2}]},r:[V,[
  {map:"items",as:[H,[
    [T,"$item.n",{fg:"#ccc"}],
    [H,[[B,"-",{c:dec}],[T,"$item.q"],[B,"+",{c:inc}]],{g:8,ai:"center"}],
    [T,"$item.price",{fg:"#0af"}]
  ],{jc:"space-between",ai:"center",p:"8px 0"}]},
  [H,[[T,"total:"],[T,{$:"total"},{fg:"#4f8",fw:600}]],{jc:"space-between",p:"16px 0"}]
],{g:0}]}`,reactCode:`function Cart() {
  const [items, setItems] = useState([
    {n:"widget",p:25,q:1},
    {n:"gadget",p:35,q:2}
  ]);
  const updateQty = (i, delta) => {
    setItems(items.map((item, j) =>
      j === i ? {...item, q: Math.max(0, item.q + delta)} : item
    ).filter(item => item.q > 0));
  };
  const total = items.reduce((s,i) => s + i.p * i.q, 0);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="cart-item">
          <span className="name">{item.n}</span>
          <div className="qty">
            <button onClick={()=>updateQty(i,-1)}>-</button>
            <span>{item.q}</span>
            <button onClick={()=>updateQty(i,1)}>+</button>
          </div>
          <span className="price">\${item.p * item.q}</span>
        </div>
      ))}
      <div className="total">
        <span>total:</span>
        <span>\${total}</span>
      </div>
    </div>
  );
}`,demoSpec:'{"s":{"q1":1,"q2":2},"r":["V",[["H",[["T","widget",{"fg":"#ccc","s":{"flex":"1"}}],["H",[["B","-",{"c":["q1","-"]}],["T",{"$":"q1"}],["B","+",{"c":["q1","+"]}]],{"g":8,"ai":"c"}],["T","$25",{"fg":"#0af","w":50,"ta":"rt"}]],{"jc":"sb","ai":"c","p":"8px 0","s":{"borderBottom":"1px solid #333"}}],["H",[["T","gadget",{"fg":"#ccc","s":{"flex":"1"}}],["H",[["B","-",{"c":["q2","-"]}],["T",{"$":"q2"}],["B","+",{"c":["q2","+"]}]],{"g":8,"ai":"c"}],["T","$35",{"fg":"#0af","w":50,"ta":"rt"}]],{"jc":"sb","ai":"c","p":"8px 0","s":{"borderBottom":"1px solid #333"}}],["H",[["T","total:",{"fg":"#888"}],["T","$95",{"fg":"#4f8","fw":600}]],{"jc":"sb","p":"16px 0"}]],{"g":0}]}',file:"08-shopping-cart.html"},{id:"wizard",name:"wizard",savings:"-26%",tooeyTokens:249,reactTokens:338,description:"multi-step form with progress indicator",tooeyCode:`{s:{step:0,name:"",email:""},r:[V,[
  [H,[[D,{cls:"step done"}],[D,{cls:"step"}],[D,{cls:"step"}]],{g:4}],
  {if:{$:"step"},eq:0,then:[V,[[T,"step 1: name"],[I,"",{v:{$:"name"},x:["name","!"],ph:"your name"}]],{g:12}]},
  {if:{$:"step"},eq:1,then:[V,[[T,"step 2: email"],[I,"",{v:{$:"email"},x:["email","!"],ph:"email",type:"email"}]],{g:12}]},
  {if:{$:"step"},eq:2,then:[V,[[T,"done!"],[T,"thanks for signing up"]],{g:12}]},
  [H,[[B,"back",{c:["step","-"],dis:{$:"step"},eq:0}],[B,"next",{c:["step","+"]}]],{g:8,jc:"flex-end"}]
],{g:16}]}`,reactCode:`function Wizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',gap:4}}>
        {[0,1,2].map(i => (
          <div key={i} className={'step'+(i<=step?' done':'')} />
        ))}
      </div>
      {step === 0 && (
        <div>
          <h3>step 1: name</h3>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="your name" />
        </div>
      )}
      {step === 1 && (
        <div>
          <h3>step 2: email</h3>
          <input type="email" value={email}
            onChange={e=>setEmail(e.target.value)} placeholder="email" />
        </div>
      )}
      {step === 2 && <div><h3>done!</h3><p>thanks for signing up</p></div>}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button disabled={step===0} onClick={()=>setStep(s=>s-1)}>back</button>
        <button onClick={()=>setStep(s=>Math.min(2,s+1))}>next</button>
      </div>
    </div>
  );
}`,demoSpec:'{"s":{"step":0,"name":"","email":""},"r":["V",[["H",[["D","",{"w":40,"h":4,"bg":"#0af","r":2}],["D","",{"w":40,"h":4,"bg":"#333","r":2}],["D","",{"w":40,"h":4,"bg":"#333","r":2}]],{"g":4}],{"?":"step","is":0,"t":["V",[["T","step 1: name",{"fw":500,"fg":"#fff"}],["I","",{"v":{"$":"name"},"x":["name","!"],"ph":"your name"}]],{"g":12}],"e":{"?":"step","is":1,"t":["V",[["T","step 2: email",{"fw":500,"fg":"#fff"}],["I","",{"type":"email","v":{"$":"email"},"x":["email","!"],"ph":"email"}]],{"g":12}],"e":["V",[["T","done!",{"fw":600,"fg":"#4f8","fs":16}],["T","thanks for signing up",{"fg":"#888"}]],{"g":8}]}},["H",[["B","back",{"c":["step","-"]}],["B","next",{"c":["step","+"]}]],{"g":8,"jc":"fe"}]],{"g":16}]}',file:"09-wizard.html"}]};function P(e){if(!e||e.length<2)return[];let n=e.toLowerCase(),r=[];return o.coreFunctions.forEach(a=>{(a.name.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"function",...a})}),o.instanceMethods.forEach(a=>{(a.name.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"method",...a})}),o.components.forEach(a=>{(a.name.toLowerCase().includes(n)||a.fullName?.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"component",...a})}),o.props.forEach(a=>{(a.name.toLowerCase().includes(n)||a.fullName?.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"prop",...a})}),o.events.forEach(a=>{(a.name.toLowerCase().includes(n)||a.fullName?.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"event",...a})}),o.stateOps.forEach(a=>{(a.op?.includes(n)||a.name.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"operation",...a})}),o.controlFlow.forEach(a=>{(a.name.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"controlflow",...a})}),o.types.forEach(a=>{(a.name.toLowerCase().includes(n)||a.description.toLowerCase().includes(n))&&r.push({type:"type",...a})}),r}var B={colors:{bg:"#0a0a0f",bgSecondary:"#111118",bgTertiary:"#1a1a24",bgHover:"#252530",text:"#e0e0e0",textSecondary:"#888",textMuted:"#666",accent:"#0af",success:"#4f8",warning:"#fa0",error:"#f55",border:"#333",codeBg:"#111"},spacing:{xs:4,sm:8,md:16,lg:24,xl:32},radius:{sm:4,md:8,lg:12}},z={colors:{bg:"#fff",bgSecondary:"#f8f9fa",bgTertiary:"#e9ecef",bgHover:"#dee2e6",text:"#212529",textSecondary:"#495057",textMuted:"#868e96",accent:"#0066cc",success:"#28a745",warning:"#ffc107",error:"#dc3545",border:"#dee2e6",codeBg:"#f4f4f4"},spacing:B.spacing,radius:B.radius},O=e=>{let n=document.documentElement;Object.entries(e.colors).forEach(([r,a])=>{n.style.setProperty(`--${r.replace(/([A-Z])/g,"-$1").toLowerCase()}`,a)})},Z={name:"logger",onStateChange(e,n,r){["searchQuery","searchResults"].includes(e)||console.log(`[docs] ${e}:`,n,"\u2192",r)}},G=e=>{let n=e.size||32;return[Y,[{tag:"rect",x:24,y:8,width:16,height:48,rx:8,fill:"currentColor"},{tag:"rect",x:12,y:20,width:40,height:14,rx:7,fill:"currentColor",transform:"rotate(-20 32 27)"}],{w:n,h:n,vb:"0 0 64 64",fg:"var(--accent)"}]},i=(e={},n=[])=>[s,n,{bg:"var(--bg-secondary)",p:16,r:8,s:{border:"1px solid var(--border)"}}],p=e=>[d,[[t,e.code,{s:{whiteSpace:"pre-wrap",wordBreak:"break-word"}}]],{bg:"var(--code-bg)",p:8,r:4,fs:12,ff:"ui-monospace, monospace",fg:"var(--success)",ov:"auto",s:{maxHeight:"300px"}}],l=e=>[s,[[t,e.title,{fs:11,fw:400,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px",display:"block"}}],e.subtitle?[t,e.subtitle,{fs:13,fg:"var(--text-secondary)",m:"4px 0 0 0"}]:null].filter(Boolean),{m:"0 0 16px 0"}],F=e=>{let{item:n,type:r}=e,a=[[c,[[t,r,{fs:10,fg:"var(--accent)",bg:"var(--bg-tertiary)",p:"2px 8px",r:4,s:{textTransform:"uppercase"}}],[t,n.name||n.op||n.fullName||"",{fs:18,fw:600,fg:"var(--text)"}]],{g:8,ai:"c"}],[t,n.description,{fg:"var(--text-secondary)",m:"8px 0 16px 0",s:{display:"block"}}]];return n.signature&&a.push(p({code:n.signature})),n.example&&a.push([s,[[t,"example",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px"}}],p({code:n.example})],{g:8,m:"16px 0"}]),i({},a)},K={home:()=>[s,[[s,[[c,[[d,[G({size:48})],{w:48,h:48,s:{filter:"drop-shadow(0 4px 20px rgba(0,170,255,0.3))"}}],[s,[[t,"tooey",{fs:28,fw:700,fg:"var(--text)"}],[t,"token-efficient ui for llm output",{fs:14,fg:"var(--text-secondary)"}]],{g:4}]],{g:16,ai:"c"}],[c,[[t,"~39%",{fg:"var(--accent)",fw:600}],[t,"fewer tokens",{fg:"var(--text-secondary)"}],[t,"|",{fg:"var(--border)",m:"0 8px"}],[t,"~10kb",{fg:"var(--accent)",fw:600}],[t,"minified",{fg:"var(--text-secondary)"}],[t,"|",{fg:"var(--border)",m:"0 8px"}],[t,"0",{fg:"var(--accent)",fw:600}],[t,"deps",{fg:"var(--text-secondary)"}]],{g:6,ai:"c",flw:"wrap",m:"24px 0"}]],{m:"0 0 32px 0"}],i({},[l({title:"quick start"}),p({code:`import { render, V, T, B } from '@tooey/ui';
render(document.getElementById('app'), {
  s: { count: 0 },
  r: [V, [[T, { $: 'count' }], [B, '+', { c: 'count+' }]], { g: 8 }]
});`}),[c,[[S,"examples",{c:()=>Q("examples"),bg:"var(--accent)",fg:"#fff",p:"8px 16px",r:4,s:{border:"none",cursor:"pointer"}}],[E,"github",{href:"https://github.com/vijaypemmaraju/tooey",fg:"var(--text-secondary)",p:"8px 16px",s:{textDecoration:"none"}}]],{g:8,m:"16px 0 0 0"}]]),[T,[i({},[[t,"signals & reactivity",{fw:600,fg:"var(--text)",fs:14,s:{display:"block",marginBottom:"8px"}}],[t,"fine-grained reactivity with signals, computed, and effects",{fg:"var(--text-secondary)",fs:13}]]),i({},[[t,"function components",{fw:600,fg:"var(--text)",fs:14,s:{display:"block",marginBottom:"8px"}}],[t,"create reusable components as simple functions",{fg:"var(--text-secondary)",fs:13}]]),i({},[[t,"theming",{fw:600,fg:"var(--text)",fs:14,s:{display:"block",marginBottom:"8px"}}],[t,"token-based theming with $token syntax",{fg:"var(--text-secondary)",fs:13}]]),i({},[[t,"plugins",{fw:600,fg:"var(--text)",fs:14,s:{display:"block",marginBottom:"8px"}}],[t,"extend functionality with lifecycle hooks",{fg:"var(--text-secondary)",fs:13}]])],{cols:2,g:16,m:"24px 0"}],i({},[l({title:"components"}),[T,["layout","text","form","table","list","media"].map(e=>[s,[[t,e,{fg:"var(--accent)",fs:11,s:{textTransform:"uppercase",letterSpacing:"1px"}}],[t,o.components.filter(n=>n.category===e).map(n=>n.name).join(" "),{fg:"var(--text)",ff:"monospace"}]],{g:4}]),{cols:3,g:16}]])],{g:24}],"core-functions":()=>[s,[l({title:"core functions",subtitle:"essential functions for rendering and state management"}),...o.coreFunctions.map(e=>F({item:e,type:"function"}))],{g:16}],"instance-methods":()=>[s,[l({title:"instance methods",subtitle:"methods on TooeyInstance returned by render()"}),...o.instanceMethods.map(e=>F({item:e,type:"method"}))],{g:16}],components:()=>[s,[l({title:"components",subtitle:"22 built-in components with short names"}),...["layout","text","form","table","list","media"].map(e=>i({},[[t,e,{fs:13,fw:600,fg:"var(--accent)",s:{textTransform:"uppercase",marginBottom:"12px",display:"block"}}],[T,o.components.filter(n=>n.category===e).map(n=>[s,[[c,[[t,n.name,{fg:"var(--success)",fw:700,ff:"monospace",fs:16}],[t,`(${n.fullName})`,{fg:"var(--text-muted)",fs:12}]],{g:6,ai:"c"}],[t,n.description,{fg:"var(--text-secondary)",fs:12}],[t,n.element,{fg:"var(--text-muted)",fs:11,ff:"monospace"}]],{g:4,p:8,bg:"var(--bg-tertiary)",r:4}]),{cols:2,g:8}]]))],{g:16}],props:()=>[s,[l({title:"props",subtitle:"all style and element properties"}),...["spacing","sizing","colors","borders","positioning","typography","layout","misc","element"].map(e=>i({},[[t,e,{fs:13,fw:600,fg:"var(--accent)",s:{textTransform:"uppercase",marginBottom:"12px",display:"block"}}],[s,o.props.filter(n=>n.category===e).map(n=>[c,[[t,n.name,{fg:"var(--success)",fw:600,ff:"monospace",fs:13,w:40}],[t,n.fullName||"",{fg:"var(--text)",fs:13,w:120}],[t,n.description,{fg:"var(--text-secondary)",fs:12,s:{flex:"1"}}],[t,n.example||"",{fg:"var(--text-muted)",ff:"monospace",fs:11}]],{g:8,ai:"c",p:"6px 0",s:{borderBottom:"1px solid var(--border)"}}]),{g:0}]]))],{g:16}],events:()=>[s,[l({title:"events & operations",subtitle:"event handlers and state operations"}),i({},[[t,"events",{fs:13,fw:600,fg:"var(--accent)",s:{textTransform:"uppercase",marginBottom:"12px",display:"block"}}],[s,o.events.map(e=>[c,[[t,e.name,{fg:"var(--success)",fw:600,ff:"monospace",fs:14,w:40}],[t,e.fullName||"",{fg:"var(--text)",fs:13,w:100}],[t,e.description,{fg:"var(--text-secondary)",fs:12,s:{flex:"1"}}],[t,e.example||"",{fg:"var(--text-muted)",ff:"monospace",fs:11}]],{g:8,ai:"c",p:"8px 0",s:{borderBottom:"1px solid var(--border)"}}]),{g:0}]]),i({},[[t,"state operations",{fs:13,fw:600,fg:"var(--accent)",s:{textTransform:"uppercase",marginBottom:"12px",display:"block"}}],[s,o.stateOps.map(e=>[c,[[t,e.op||"",{fg:"var(--warning)",fw:700,ff:"monospace",fs:16,w:30,ta:"center"}],[t,e.name,{fg:"var(--text)",fs:13,w:80}],[t,e.description,{fg:"var(--text-secondary)",fs:12,s:{flex:"1"}}],[t,e.example||"",{fg:"var(--text-muted)",ff:"monospace",fs:11}]],{g:8,ai:"c",p:"8px 0",s:{borderBottom:"1px solid var(--border)"}}]),{g:0}]])],{g:16}],"control-flow":()=>[s,[l({title:"control flow",subtitle:"conditional rendering and list iteration"}),...o.controlFlow.map(e=>i({},[[t,e.name,{fs:14,fw:600,fg:"var(--text)",s:{display:"block",marginBottom:"8px"}}],[t,e.description,{fg:"var(--text-secondary)",fs:13,s:{display:"block",marginBottom:"12px"}}],p({code:e.example||""})]))],{g:16}],theming:()=>[s,[l({title:"theming",subtitle:"token-based theming system"}),i({},[[t,o.theming.description,{fg:"var(--text-secondary)",s:{display:"block",marginBottom:"16px"}}],[t,"interface",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px"}}],p({code:o.theming.interface})]),i({},[[t,"example",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",display:"block"}}],p({code:o.theming.example})])],{g:16}],plugins:()=>[s,[l({title:"plugins",subtitle:"extend with lifecycle hooks"}),i({},[[t,o.plugins.description,{fg:"var(--text-secondary)",s:{display:"block",marginBottom:"16px"}}],p({code:o.plugins.interface})]),i({},[[t,"hooks",{fs:13,fw:600,fg:"var(--accent)",s:{textTransform:"uppercase",marginBottom:"12px",display:"block"}}],[s,o.plugins.hooks.map(e=>[c,[[t,e.name,{fg:"var(--success)",fw:600,ff:"monospace",fs:13,w:120}],[t,e.description,{fg:"var(--text-secondary)",fs:12,s:{flex:"1"}}]],{g:8,ai:"c",p:"8px 0",s:{borderBottom:"1px solid var(--border)"}}]),{g:0}]]),i({},[[t,"example",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",display:"block"}}],p({code:o.plugins.example})])],{g:16}],"function-components":()=>[s,[l({title:"function components",subtitle:"create reusable components"}),i({},[[t,o.functionComponents.description,{fg:"var(--text-secondary)",s:{display:"block",marginBottom:"16px"}}],p({code:o.functionComponents.signature})]),i({},[[t,"example",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",display:"block"}}],p({code:o.functionComponents.example})])],{g:16}],"error-boundaries":()=>[s,[l({title:"error boundaries",subtitle:"catch render errors gracefully"}),i({},[[t,o.errorBoundaries.description,{fg:"var(--text-secondary)",s:{display:"block",marginBottom:"16px"}}],p({code:o.errorBoundaries.interface})]),i({},[[t,"example",{fs:11,fg:"var(--text-muted)",s:{textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",display:"block"}}],p({code:o.errorBoundaries.example})])],{g:16}],types:()=>[s,[l({title:"types",subtitle:"typescript type definitions"}),...o.types.map(e=>i({},[[t,e.name,{fg:"var(--success)",fw:600,ff:"monospace",fs:14}],[t,e.description,{fg:"var(--text-secondary)",fs:13,m:"8px 0"}],p({code:e.signature||""})]))],{g:16}],examples:()=>[s,[l({title:"examples",subtitle:"interactive demos with token comparisons"}),[s,o.examples.map(e=>i({},[[c,[[t,e.name,{fg:"var(--text)",fw:600,fs:16}],[t,e.savings,{fg:"var(--success)",fw:700,ff:"monospace",fs:14}]],{jc:"sb",ai:"c"}],[t,e.description,{fg:"var(--text-secondary)",fs:13,m:"8px 0 16px 0"}],[T,[[s,[[c,[[t,"tooey",{fg:"var(--accent)",fs:11,s:{textTransform:"uppercase",letterSpacing:"1px"}}],[t,`(${e.tooeyTokens} tokens)`,{fg:"var(--text-muted)",fs:11}]],{g:8,ai:"c"}],p({code:e.tooeyCode})],{g:8}],[s,[[c,[[t,"react",{fg:"var(--warning)",fs:11,s:{textTransform:"uppercase",letterSpacing:"1px"}}],[t,`(${e.reactTokens} tokens)`,{fg:"var(--text-muted)",fs:11}]],{g:8,ai:"c"}],[d,[[t,e.reactCode,{s:{whiteSpace:"pre-wrap",wordBreak:"break-word"}}]],{bg:"var(--code-bg)",p:8,r:4,fs:12,ff:"ui-monospace, monospace",fg:"var(--warning)",ov:"auto",s:{maxHeight:"300px"}}]],{g:8}]],{cols:2,g:16}],[s,[[c,[[t,"live demo",{fg:"var(--text-muted)",fs:11,s:{textTransform:"uppercase",letterSpacing:"1px"}}],[E,"full example \u2197",{href:`examples/${e.file}`,fg:"var(--accent)",fs:11,s:{textDecoration:"none"},target:"_blank"}]],{jc:"sb",ai:"c"}],[d,"",{id:`demo-${e.id}`,bg:"var(--bg-tertiary)",p:16,r:8,s:{border:"1px solid var(--border)",minHeight:"100px"},"data-spec":e.demoSpec}]],{g:8,m:"16px 0 0 0"}]])),{g:24}]],{g:16}]},I=[{label:"home",page:"home"},{label:"core functions",page:"core-functions"},{label:"instance methods",page:"instance-methods"},{label:"components",page:"components"},{label:"props",page:"props"},{label:"events & ops",page:"events"},{label:"control flow",page:"control-flow"},{label:"theming",page:"theming"},{label:"plugins",page:"plugins"},{label:"function components",page:"function-components"},{label:"error boundaries",page:"error-boundaries"},{label:"types",page:"types"},{label:"examples",page:"examples"}],W=L("home"),V=L(""),h=L([]),u=L(window.matchMedia("(prefers-color-scheme: dark)").matches),C,b,Q=e=>{W.set(e),V.set(""),h.set([])},ee=()=>{if(!C)return;let e=W();C.innerHTML="",N(C,{r:K[e]()}),document.querySelectorAll(".nav-btn").forEach((n,r)=>{let a=n;a.style.background=I[r].page===e?"var(--bg-tertiary)":"transparent",a.style.color=I[r].page===e?"var(--accent)":"var(--text-secondary)"}),e==="examples"&&document.querySelectorAll("[data-spec]").forEach(n=>{let r=n,a=r.getAttribute("data-spec");if(a&&!r.dataset.rendered)try{let y=JSON.parse(a);N(r,y),r.dataset.rendered="true"}catch(y){console.warn("[tooey] failed to render demo:",y)}})},k=()=>{if(!b)return;let e=h();if(!e.length){b.innerHTML="";return}b.innerHTML="",N(b,{r:[s,e.slice(0,10).map(n=>[d,[[c,[[t,n.type,{fs:9,fg:"var(--accent)",bg:"var(--bg-tertiary)",p:"2px 6px",r:2,s:{textTransform:"uppercase"}}],[t,n.name,{fg:"var(--text)",fw:500,fs:13}]],{g:6,ai:"c"}],[t,n.description,{fg:"var(--text-secondary)",fs:11}]],{p:8,r:4,cur:"pointer",cls:"search-result"}]),{pos:"abs",t:42,l:0,rt:0,bg:"var(--bg-secondary)",r:4,p:8,z:100,mh:300,ov:"auto",s:{border:"1px solid var(--border)",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}]})},te=()=>{O(u()?B:z);let e=document.getElementById("app");if(!e)return;let n={s:{},r:[c,[[S,"",{id:"menu-btn",pos:"fix",t:16,l:16,z:1001,bg:"var(--bg-secondary)",p:10,r:8,s:{border:"1px solid var(--border)",display:"none"}}],[d,"",{id:"sidebar-overlay",pos:"fix",t:0,l:0,w:"100vw",h:"100vh",z:999,bg:"rgba(0,0,0,0.5)",s:{display:"none"}}],[s,[[c,[G({size:32}),[t,"tooey",{fs:18,fw:700,fg:"var(--text)"}]],{g:8,ai:"c",m:"0 0 24px 0"}],[s,[[J,"",{ph:"search...",bg:"var(--bg-tertiary)",fg:"var(--text)",p:"8px 12px",r:4,w:"100%",s:{border:"1px solid var(--border)",outline:"none"},id:"search"}]],{pos:"rel",m:"0 0 16px 0"}],[d,"",{id:"search-results"}],[s,I.map(m=>[S,m.label,{bg:"transparent",fg:"var(--text-secondary)",p:"8px 12px",r:4,w:"100%",ta:"left",fs:13,cur:"pointer",s:{border:"none"},cls:"nav-btn"}]),{g:2}],[c,[[S,"",{bg:"transparent",fg:"var(--text-secondary)",p:8,r:4,cur:"pointer",s:{border:"none"},id:"theme-btn"}],[E,"",{href:"https://github.com/vijaypemmaraju/tooey",fg:"var(--text-secondary)",p:8,id:"github-link"}]],{g:8,m:"auto 0 0 0"}]],{w:240,h:"100vh",p:24,bg:"var(--bg-secondary)",pos:"fix",t:0,l:0,z:1e3,s:{borderRight:"1px solid var(--border)",overflowY:"auto",display:"flex",flexDirection:"column",transition:"transform 0.3s ease"},id:"sidebar"}],[d,[{boundary:!0,child:[d,"",{id:"page-content"}],fallback:i({},[[t,"error",{fg:"var(--error)",fw:600}]]),onError:m=>console.error(m)}],{m:"0 0 0 240px",p:32,mw:900,s:{minHeight:"100vh"},id:"main-content"}]],{w:"100%"}]};N(e,n,{plugins:[Z]}),C=document.getElementById("page-content"),b=document.getElementById("search-results");let r=document.getElementById("search"),a=document.getElementById("theme-btn"),y=document.getElementById("github-link"),f=document.getElementById("menu-btn"),M=document.getElementById("sidebar"),$=document.getElementById("sidebar-overlay"),x=document.getElementById("main-content"),j='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',R='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',X='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.089-.744.083-.729.083-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>',H='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',_='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';a.innerHTML=u()?j:R,y.innerHTML=X,f.innerHTML=H;let q=window.innerWidth<=768,g=!1,v=()=>{q=window.innerWidth<=768,q?(f.style.display="block",M.style.transform=g?"translateX(0)":"translateX(-100%)",$.style.display=g?"block":"none",x.style.marginLeft="0",x.style.padding="16px",x.style.paddingTop="60px"):(f.style.display="none",M.style.transform="translateX(0)",$.style.display="none",x.style.marginLeft="240px",x.style.padding="32px",g=!1)},U=()=>{g=!g,f.innerHTML=g?_:H,v()},D=()=>{g&&(g=!1,f.innerHTML=H,v())};f.addEventListener("click",U),$.addEventListener("click",D),window.addEventListener("resize",v),v(),r?.addEventListener("input",m=>{let w=m.target.value;V.set(w),h.set(P(w)),k()}),r?.addEventListener("keydown",m=>{m.key==="Escape"&&(V.set(""),h.set([]),r.value="",k())}),document.addEventListener("click",m=>{!m.target.closest("#search")&&!m.target.closest("#search-results")&&(h.set([]),k())}),document.querySelectorAll(".nav-btn").forEach((m,w)=>{m.addEventListener("click",()=>{Q(I[w].page),D()})}),a.addEventListener("click",()=>{u.set(!u()),O(u()?B:z),a.innerHTML=u()?j:R}),A(ee),A(k)};document.addEventListener("DOMContentLoaded",te);
//# sourceMappingURL=docs.js.map
