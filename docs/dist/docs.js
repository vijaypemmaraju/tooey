import{render as D,signal as A,effect as M,vs as a,hs as i,dv as x,gr as E,tx as e,bt as B,In as ue,ln as ae,ref as ge,devtools as xe}from"@tooey/ui";import{Bt as C,Bg as k,Al as Y,AlT as Z,AlD as K,Pg as P,Sp as fe,Av as z}from"@tooey/components";var c={coreFunctions:[{id:"$",name:"$",category:"core",description:"$ function",signature:"$(name: string): StateRef",params:[{name:"name",type:"string",description:""}],returns:"StateRef",example:""},{id:"async$",name:"async$",category:"core",description:"async$ function",signature:"async$(promiseOrFn: Promise | object, options?: object): AsyncSpec",params:[{name:"promiseOrFn",type:"Promise | object",description:""},{name:"options",type:"object",description:"",optional:!0}],returns:"AsyncSpec",example:""},{id:"batch",name:"batch",category:"core",description:"batch function",signature:"batch(fn: object): void",params:[{name:"fn",type:"object",description:""}],returns:"void",example:""},{id:"computed",name:"computed",category:"core",description:"computed function",signature:"computed(fn: object): ComputedSignal",params:[{name:"fn",type:"object",description:""}],returns:"ComputedSignal",example:""},{id:"createtooey",name:"createTooey",category:"core",description:"createTooey function",signature:"createTooey(themeOrOptions: Theme | CreateTooeyOptions): TooeyFactory",params:[{name:"themeOrOptions",type:"Theme | CreateTooeyOptions",description:""}],returns:"TooeyFactory",example:""},{id:"effect",name:"effect",category:"core",description:"effect function",signature:"effect(fn: object, ctx?: RenderContext): object",params:[{name:"fn",type:"object",description:""},{name:"ctx",type:"RenderContext",description:"",optional:!0}],returns:"object",example:""},{id:"render",name:"render",category:"core",description:"render function",signature:"render(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance",params:[{name:"container",type:"HTMLElement",description:""},{name:"spec",type:"TooeySpec",description:""},{name:"options",type:"RenderOptions",description:"",optional:!0}],returns:"TooeyInstance",example:""},{id:"signal",name:"signal",category:"core",description:"signal function",signature:"signal(initial: T): Signal",params:[{name:"initial",type:"T",description:""}],returns:"Signal",example:""}],instanceMethods:[{id:"get",name:"get",category:"instance",description:"read the current value of a state key",signature:"instance.get(key: string): unknown",example:'const count = app.get("count");'},{id:"set",name:"set",category:"instance",description:"set a state value (triggers reactive updates)",signature:"instance.set(key: string, value: unknown): void",example:'app.set("count", 10);'},{id:"destroy",name:"destroy",category:"instance",description:"clean up event listeners and remove dom elements",signature:"instance.destroy(): void",example:"app.destroy();"},{id:"update",name:"update",category:"instance",description:"update state values or re-render with new root",signature:"instance.update(spec: TooeySpec): void",example:"app.update({ s: { count: 0 }, r: newSpec });"}],components:[{id:"Td",name:"Td",fullName:"TableCell",category:"table",element:"td",description:"TableCell component",example:'[Td, "content", { }]'},{id:"Tr",name:"Tr",fullName:"TableRow",category:"table",element:"tr",description:"TableRow component",example:'[Tr, "content", { }]'}],props:[{id:"g",name:"g",fullName:"gap",category:"spacing",css:"gap",description:"gap between flex/grid children",example:"{ g: 8 }"},{id:"p",name:"p",fullName:"padding",category:"spacing",css:"padding",description:"inner spacing",example:"{ p: 16 }"},{id:"m",name:"m",fullName:"margin",category:"spacing",css:"margin",description:"outer spacing",example:"{ m: 8 }"},{id:"w",name:"w",fullName:"width",category:"sizing",css:"width",description:"element width",example:"{ w: 200 }"},{id:"h",name:"h",fullName:"height",category:"sizing",css:"height",description:"element height",example:"{ h: 100 }"},{id:"mw",name:"mw",fullName:"maxWidth",category:"sizing",css:"max-width",description:"maximum width",example:"{ mw: 600 }"},{id:"mh",name:"mh",fullName:"maxHeight",category:"sizing",css:"max-height",description:"maximum height",example:"{ mh: 400 }"},{id:"bg",name:"bg",fullName:"background",category:"colors",css:"background",description:"background color",example:'{ bg: "#f0f0f0" }'},{id:"fg",name:"fg",fullName:"color",category:"colors",css:"color",description:"text color",example:'{ fg: "blue" }'},{id:"o",name:"o",fullName:"opacity",category:"colors",css:"opacity",description:"element opacity",example:"{ o: 0.5 }"},{id:"r",name:"r",fullName:"borderRadius",category:"borders",css:"border-radius",description:"corner rounding",example:"{ r: 8 }"},{id:"bw",name:"bw",fullName:"borderWidth",category:"borders",css:"border-width",description:"border thickness",example:"{ bw: 1 }"},{id:"bc",name:"bc",fullName:"borderColor",category:"borders",css:"border-color",description:"border color",example:'{ bc: "gray" }'},{id:"bs",name:"bs",fullName:"borderStyle",category:"borders",css:"border-style",description:"border style",example:'{ bs: "solid" }'},{id:"pos",name:"pos",fullName:"position",category:"positioning",css:"position",description:"position type (rel/abs/fix/sticky)",example:'{ pos: "abs" }'},{id:"z",name:"z",fullName:"zIndex",category:"positioning",css:"z-index",description:"stack order",example:"{ z: 100 }"},{id:"t",name:"t",fullName:"top",category:"positioning",css:"top",description:"top position",example:"{ t: 0 }"},{id:"l",name:"l",fullName:"left",category:"positioning",css:"left",description:"left position",example:"{ l: 0 }"},{id:"b",name:"b",fullName:"bottom",category:"positioning",css:"bottom",description:"bottom position",example:"{ b: 0 }"},{id:"rt",name:"rt",fullName:"right",category:"positioning",css:"right",description:"right position",example:"{ rt: 0 }"},{id:"fs",name:"fs",fullName:"fontSize",category:"typography",css:"font-size",description:"text size",example:"{ fs: 16 }"},{id:"fw",name:"fw",fullName:"fontWeight",category:"typography",css:"font-weight",description:"text weight",example:"{ fw: 700 }"},{id:"ff",name:"ff",fullName:"fontFamily",category:"typography",css:"font-family",description:"font family",example:'{ ff: "Arial" }'},{id:"ta",name:"ta",fullName:"textAlign",category:"typography",css:"text-align",description:"text alignment",example:'{ ta: "center" }'},{id:"td",name:"td",fullName:"textDecoration",category:"typography",css:"text-decoration",description:"text decoration",example:'{ td: "underline" }'},{id:"lh",name:"lh",fullName:"lineHeight",category:"typography",css:"line-height",description:"line spacing",example:"{ lh: 1.5 }"},{id:"ls",name:"ls",fullName:"letterSpacing",category:"typography",css:"letter-spacing",description:"character spacing",example:"{ ls: 1 }"},{id:"ai",name:"ai",fullName:"alignItems",category:"layout",css:"align-items",description:"cross-axis alignment (c/fs/fe/st)",example:'{ ai: "c" }'},{id:"jc",name:"jc",fullName:"justifyContent",category:"layout",css:"justify-content",description:"main-axis alignment (c/sb/sa/se)",example:'{ jc: "sb" }'},{id:"flw",name:"flw",fullName:"flexWrap",category:"layout",css:"flex-wrap",description:"flex wrapping",example:'{ flw: "wrap" }'},{id:"cols",name:"cols",fullName:"gridColumns",category:"layout",css:"grid-template-columns",description:"grid column count",example:"{ cols: 3 }"},{id:"rows",name:"rows",fullName:"gridRows",category:"layout",css:"grid-template-rows",description:"grid row count",example:"{ rows: 2 }"},{id:"cur",name:"cur",fullName:"cursor",category:"misc",css:"cursor",description:"mouse cursor style",example:'{ cur: "pointer" }'},{id:"ov",name:"ov",fullName:"overflow",category:"misc",css:"overflow",description:"overflow behavior",example:'{ ov: "hidden" }'},{id:"pe",name:"pe",fullName:"pointerEvents",category:"misc",css:"pointer-events",description:"pointer event handling",example:'{ pe: "none" }'},{id:"us",name:"us",fullName:"userSelect",category:"misc",css:"user-select",description:"text selection behavior",example:'{ us: "none" }'},{id:"sh",name:"sh",fullName:"boxShadow",category:"misc",css:"box-shadow",description:"shadow effect",example:'{ sh: "0 2px 4px rgba(0,0,0,0.1)" }'},{id:"tr",name:"tr",fullName:"transform",category:"misc",css:"transform",description:"css transform",example:'{ tr: "rotate(45deg)" }'},{id:"s",name:"s",fullName:"customStyles",category:"misc",css:"(object)",description:"custom css properties",example:'{ s: { display: "inline-block" } }'},{id:"v",name:"v",fullName:"value",category:"element",css:"-",description:"input value binding",example:'{ v: { $: "name" } }'},{id:"ph",name:"ph",fullName:"placeholder",category:"element",css:"-",description:"placeholder text",example:'{ ph: "Enter text" }'},{id:"type",name:"type",fullName:"inputType",category:"element",css:"-",description:"input type attribute",example:'{ type: "email" }'},{id:"href",name:"href",fullName:"href",category:"element",css:"-",description:"link url (validated)",example:'{ href: "/page" }'},{id:"src",name:"src",fullName:"src",category:"element",css:"-",description:"image source (validated)",example:'{ src: "/img.png" }'},{id:"alt",name:"alt",fullName:"alt",category:"element",css:"-",description:"image alt text",example:'{ alt: "description" }'},{id:"dis",name:"dis",fullName:"disabled",category:"element",css:"-",description:"disabled state",example:"{ dis: true }"},{id:"ch",name:"ch",fullName:"checked",category:"element",css:"-",description:"checkbox/radio checked binding",example:'{ ch: { $: "agreed" } }'},{id:"ro",name:"ro",fullName:"readOnly",category:"element",css:"-",description:"read-only state",example:"{ ro: true }"},{id:"opts",name:"opts",fullName:"options",category:"element",css:"-",description:"select options array",example:'{ opts: [{ v: "a", l: "A" }] }'},{id:"rw",name:"rw",fullName:"rows",category:"element",css:"-",description:"textarea rows",example:"{ rw: 4 }"},{id:"sp",name:"sp",fullName:"colspan",category:"element",css:"-",description:"table cell column span",example:"{ sp: 2 }"},{id:"rsp",name:"rsp",fullName:"rowspan",category:"element",css:"-",description:"table cell row span",example:"{ rsp: 2 }"},{id:"cls",name:"cls",fullName:"className",category:"element",css:"-",description:"css class name",example:'{ cls: "my-class" }'},{id:"id",name:"id",fullName:"id",category:"element",css:"-",description:"element id attribute",example:'{ id: "my-id" }'}],events:[{id:"c",name:"c",fullName:"click",category:"event",event:"click",description:"click handler",example:'{ c: "count+" }'},{id:"x",name:"x",fullName:"input/change",category:"event",event:"input",description:"input value change",example:'{ x: ["name", "!"] }'},{id:"f",name:"f",fullName:"focus",category:"event",event:"focus",description:"focus gained",example:"{ f: () => {} }"},{id:"bl",name:"bl",fullName:"blur",category:"event",event:"blur",description:"focus lost",example:"{ bl: () => {} }"},{id:"k",name:"k",fullName:"keydown",category:"event",event:"keydown",description:"key pressed",example:"{ k: (e) => {} }"},{id:"ku",name:"ku",fullName:"keyup",category:"event",event:"keyup",description:"key released",example:"{ ku: (e) => {} }"},{id:"kp",name:"kp",fullName:"keypress",category:"event",event:"keypress",description:"key press",example:"{ kp: (e) => {} }"},{id:"e",name:"e",fullName:"mouseenter",category:"event",event:"mouseenter",description:"mouse entered",example:'{ e: "hover~" }'},{id:"lv",name:"lv",fullName:"mouseleave",category:"event",event:"mouseleave",description:"mouse left",example:'{ lv: "hover~" }'},{id:"sub",name:"sub",fullName:"submit",category:"event",event:"submit",description:"form submit",example:"{ sub: () => {} }"}],stateOps:[{id:"op-inc",name:"increment",op:"+",category:"operation",description:"increment numeric value",example:'["n", "+"] or ["n", "+", 5]'},{id:"op-dec",name:"decrement",op:"-",category:"operation",description:"decrement numeric value",example:'["n", "-"]'},{id:"op-set",name:"set",op:"!",category:"operation",description:"set to specific value",example:'["val", "!", "new"]'},{id:"op-toggle",name:"toggle",op:"~",category:"operation",description:"toggle boolean value",example:'["flag", "~"]'},{id:"op-append",name:"append",op:"<",category:"operation",description:"append to array",example:'["items", "<", newItem]'},{id:"op-prepend",name:"prepend",op:">",category:"operation",description:"prepend to array",example:'["items", ">", newItem]'},{id:"op-remove",name:"remove",op:"X",category:"operation",description:"remove from array by index/value",example:'["items", "X", index]'},{id:"op-prop",name:"property",op:".",category:"operation",description:"set object property",example:'["obj", ".", ["key", "value"]]'}],controlFlow:[{id:"cf-conditional",name:"conditional",category:"controlflow",description:"conditionally render based on state",example:'{ "?": "show", t: [T, "Visible"], e: [T, "Hidden"] }'},{id:"cf-equality",name:"equality check",category:"controlflow",description:"render when state equals specific value",example:'{ "?": "tab", is: "home", t: [T, "Home content"] }'},{id:"cf-map",name:"list rendering",category:"controlflow",description:"render list from array state",example:'{ m: "items", a: [Li, "$item"] }'},{id:"cf-map-index",name:"list with index",category:"controlflow",description:"access $index in map template",example:'{ m: "items", a: [Li, "$index: $item.name"] }'}],plugins:{description:"plugins extend tooey with cross-cutting concerns",interface:`interface TooeyPlugin {
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
}`,demoSpec:'{"s":{"n":0},"r":["vs",[["tx",{"$":"n"},{"fs":24,"fg":"#fa0"}],["hs",[["bt","-",{"c":["n","-"]}],["bt","+",{"c":["n","+"]}]],{"g":8}]],{"g":16,"ai":"c"}]}',reactDemoCode:`function Counter() {
  const [n, setN] = React.useState(0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>
      <span style={{fontSize:24,color:'#fa0'}}>{n}</span>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>setN(n-1)}>-</button>
        <button onClick={()=>setN(n+1)}>+</button>
      </div>
    </div>
  );
}`,file:"01-counter.html"},{id:"todo-list",name:"todo list",savings:"-55%",tooeyTokens:92,reactTokens:203,description:"add / remove items with input binding",tooeyCode:`{s:{txt:"",items:[]},r:[V,[
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
}`,demoSpec:'{"s":{"txt":"","items":["buy milk","walk dog"]},"r":["vs",[["hs",[["in","",{"v":{"$":"txt"},"x":["txt","!"],"ph":"add item...","s":{"flex":"1","padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px"}}],["bt","+",{"c":["items","<",{"$":"txt"}]}]],{"g":8}],{"m":"items","a":["hs",[["tx","$item",{"s":{"flex":"1"}}],["bt","x",{"c":["items","X","$index"]}]],{"g":8,"p":"8px 0","s":{"borderBottom":"1px solid #333"}}]}],{"g":12}]}',reactDemoCode:`function TodoList() {
  const [txt, setTxt] = React.useState('');
  const [items, setItems] = React.useState(['buy milk', 'walk dog']);
  const add = () => { if (txt) { setItems([...items, txt]); setTxt(''); } };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="add item..." style={{flex:1,padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4}} />
        <button onClick={add}>+</button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{display:'flex',gap:8,padding:'8px 0',borderBottom:'1px solid #333'}}>
          <span style={{flex:1}}>{item}</span>
          <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>
        </div>
      ))}
    </div>
  );
}`,file:"02-todo-list.html"},{id:"form",name:"form",savings:"-7%",tooeyTokens:196,reactTokens:211,description:"inputs, checkbox, validation",tooeyCode:`{s:{name:"",email:"",pw:"",agree:false},r:[V,[
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
}`,demoSpec:'{"s":{"name":"","email":"","agree":false},"r":["vs",[["vs",[["tx","name",{"fs":12,"fg":"#888"}],["in","",{"ph":"your name","v":{"$":"name"},"x":["name","!"],"s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"100%"}}]],{"g":4}],["vs",[["tx","email",{"fs":12,"fg":"#888"}],["in","",{"type":"email","ph":"you@example.com","v":{"$":"email"},"x":["email","!"],"s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"100%"}}]],{"g":4}],["hs",[["cb","",{"ch":{"$":"agree"},"x":["agree","~"]}],["tx","i agree to terms",{"fs":13}]],{"g":8,"ai":"c"}],["bt","sign up",{"bg":"#fa0","fg":"#000","p":"10px 20px","r":4,"s":{"border":"none","cursor":"pointer"}}]],{"g":16}]}',reactDemoCode:`function Form() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:'100%'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span style={{fontSize:12,color:'#888'}}>name</span>
        <input placeholder="your name" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span style={{fontSize:12,color:'#888'}}>email</span>
        <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
        <span style={{fontSize:13}}>i agree to terms</span>
      </div>
      <button style={{background:'#fa0',color:'#000',padding:'10px 20px',borderRadius:4,border:'none',cursor:'pointer'}}>sign up</button>
    </div>
  );
}`,file:"03-form.html"},{id:"temperature",name:"temperature converter",savings:"-59%",tooeyTokens:109,reactTokens:269,description:"bidirectional binding between celsius and fahrenheit",tooeyCode:`{s:{c:0,f:32},r:[H,[
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
}`,demoSpec:'{"s":{"c":20,"f":68},"r":["hs",[["vs",[["tx","celsius",{"fs":12,"fg":"#888"}],["in","",{"type":"number","v":{"$":"c"},"x":["c","!"],"s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"80px"}}]],{"g":4}],["tx","=",{"fs":24,"fg":"#fa0"}],["vs",[["tx","fahrenheit",{"fs":12,"fg":"#888"}],["in","",{"type":"number","v":{"$":"f"},"x":["f","!"],"s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"80px"}}]],{"g":4}]],{"g":16,"ai":"c"}]}',reactDemoCode:`function TempConverter() {
  const [c, setC] = React.useState(20);
  const [f, setF] = React.useState(68);
  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:80};
  const onC = e => { const v = parseFloat(e.target.value)||0; setC(v); setF(Math.round(v*9/5+32)); };
  const onF = e => { const v = parseFloat(e.target.value)||0; setF(v); setC(Math.round((v-32)*5/9)); };
  return (
    <div style={{display:'flex',gap:16,alignItems:'center'}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span style={{fontSize:12,color:'#888'}}>celsius</span>
        <input type="number" value={c} onChange={onC} style={inputStyle} />
      </div>
      <span style={{fontSize:24,color:'#fa0'}}>=</span>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <span style={{fontSize:12,color:'#888'}}>fahrenheit</span>
        <input type="number" value={f} onChange={onF} style={inputStyle} />
      </div>
    </div>
  );
}`,file:"04-temperature-converter.html"},{id:"data-table",name:"data table",savings:"-52%",tooeyTokens:131,reactTokens:275,description:"sortable, filterable table with search",tooeyCode:`{s:{q:"",sort:"name",asc:true,data:[...]},r:[V,[
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
}`,demoSpec:'{"s":{"data":[{"name":"alice","age":28,"role":"engineer"},{"name":"bob","age":34,"role":"designer"},{"name":"carol","age":25,"role":"manager"}]},"r":["vs",[["tb",[["th",[["tr",[["tc","name",{"fg":"#fa0","s":{"textAlign":"left","padding":"8px","borderBottom":"1px solid #333"}}],["tc","age",{"fg":"#fa0","s":{"textAlign":"left","padding":"8px","borderBottom":"1px solid #333"}}],["tc","role",{"fg":"#fa0","s":{"textAlign":"left","padding":"8px","borderBottom":"1px solid #333"}}]]]]],["bd",[{"m":"data","a":["tr",[["td","$item.name",{"s":{"padding":"8px","borderBottom":"1px solid #333"}}],["td","$item.age",{"s":{"padding":"8px","borderBottom":"1px solid #333"}}],["td","$item.role",{"s":{"padding":"8px","borderBottom":"1px solid #333"}}]]]}]]],{"s":{"width":"100%","borderCollapse":"collapse"}}]],{"g":12}]}',reactDemoCode:`function DataTable() {
  const data = [{name:'alice',age:28,role:'engineer'},{name:'bob',age:34,role:'designer'},{name:'carol',age:25,role:'manager'}];
  const thStyle = {color:'#fa0',textAlign:'left',padding:'8px',borderBottom:'1px solid #333'};
  const tdStyle = {padding:'8px',borderBottom:'1px solid #333'};
  return (
    <table style={{width:'100%',borderCollapse:'collapse'}}>
      <thead>
        <tr><th style={thStyle}>name</th><th style={thStyle}>age</th><th style={thStyle}>role</th></tr>
      </thead>
      <tbody>
        {data.map((r,i) => <tr key={i}><td style={tdStyle}>{r.name}</td><td style={tdStyle}>{r.age}</td><td style={tdStyle}>{r.role}</td></tr>)}
      </tbody>
    </table>
  );
}`,file:"05-data-table.html"},{id:"tabs",name:"tabs",savings:"-16%",tooeyTokens:107,reactTokens:127,description:"conditional rendering with tab panels",tooeyCode:`{s:{tab:0},r:[V,[
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
}`,demoSpec:'{"s":{"tab":0},"r":["vs",[["hs",[{"?":"tab","is":0,"t":["bt","profile",{"c":["tab","!",0],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#fa0","borderBottom":"2px solid #fa0"}}],"e":["bt","profile",{"c":["tab","!",0],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#666","borderBottom":"none"}}]},{"?":"tab","is":1,"t":["bt","settings",{"c":["tab","!",1],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#fa0","borderBottom":"2px solid #fa0"}}],"e":["bt","settings",{"c":["tab","!",1],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#666","borderBottom":"none"}}]},{"?":"tab","is":2,"t":["bt","about",{"c":["tab","!",2],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#fa0","borderBottom":"2px solid #fa0"}}],"e":["bt","about",{"c":["tab","!",2],"s":{"padding":"8px 16px","background":"transparent","border":"none","cursor":"pointer","color":"#666","borderBottom":"none"}}]}],{"g":0,"s":{"borderBottom":"1px solid #333"}}],{"?":"tab","is":0,"t":["tx","user profile content",{"p":16,"fg":"#ccc"}],"e":{"?":"tab","is":1,"t":["tx","settings panel",{"p":16,"fg":"#ccc"}],"e":["tx","about section",{"p":16,"fg":"#ccc"}]}}],{"g":0}]}',reactDemoCode:`function Tabs() {
  const [tab, setTab] = React.useState(0);
  const tabs = ['profile','settings','about'];
  const panels = ['user profile content','settings panel','about section'];
  const btnStyle = (i) => ({padding:'8px 16px',background:'transparent',border:'none',cursor:'pointer',color:i===tab?'#fa0':'#666',borderBottom:i===tab?'2px solid #fa0':'none'});
  return (
    <div>
      <div style={{display:'flex',borderBottom:'1px solid #333'}}>
        {tabs.map((t,i) => <button key={i} style={btnStyle(i)} onClick={()=>setTab(i)}>{t}</button>)}
      </div>
      <div style={{padding:16,color:'#ccc'}}>{panels[tab]}</div>
    </div>
  );
}`,file:"06-tabs.html"},{id:"modal",name:"modal",savings:"-24%",tooeyTokens:135,reactTokens:178,description:"dialog / overlay with conditional visibility",tooeyCode:`{s:{open:false},r:[V,[
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
}`,demoSpec:'{"s":{"open":false},"r":["vs",[["bt","open modal",{"c":["open","~"]}],{"?":"open","t":["dv",[["dv",[["tx","confirm action",{"fw":600,"fg":"#fff","fs":14}],["tx","are you sure?",{"fg":"#888","fs":12}],["bt","close",{"c":["open","~"]}]],{"bg":"#1a1a1a","p":24,"r":8,"g":12,"ta":"center","s":{"display":"flex","flexDirection":"column","gap":12}}]],{"pos":"abs","t":0,"l":0,"w":"100%","h":"100%","bg":"rgba(0,0,0,0.7)","s":{"display":"flex","alignItems":"center","justifyContent":"center"}}]}],{"pos":"rel","h":150}]}',reactDemoCode:`function Modal() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{position:'relative',height:150}}>
      <button onClick={()=>setOpen(true)}>open modal</button>
      {open && (
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#1a1a1a',padding:24,borderRadius:8,textAlign:'center',display:'flex',flexDirection:'column',gap:12}}>
            <span style={{fontWeight:600,color:'#fff',fontSize:14}}>confirm action</span>
            <span style={{color:'#888',fontSize:12}}>are you sure?</span>
            <button onClick={()=>setOpen(false)}>close</button>
          </div>
        </div>
      )}
    </div>
  );
}`,file:"07-modal.html"},{id:"shopping-cart",name:"shopping cart",savings:"-29%",tooeyTokens:197,reactTokens:279,description:"quantity controls with computed total",tooeyCode:`{s:{items:[{n:"widget",p:25,q:1},{n:"gadget",p:35,q:2}]},r:[V,[
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
}`,demoSpec:'{"s":{"q1":1,"q2":2,"total":"$95"},"r":["vs",[["hs",[["tx","widget",{"fg":"#ccc","s":{"flex":"1"}}],["hs",[["bt","-",{"c":["q1","-"]}],["tx",{"$":"q1"}],["bt","+",{"c":["q1","+"]}]],{"g":8,"ai":"c"}],["tx","$25",{"fg":"#fa0","w":50,"ta":"right"}]],{"jc":"sb","ai":"c","p":"8px 0","s":{"borderBottom":"1px solid #333"}}],["hs",[["tx","gadget",{"fg":"#ccc","s":{"flex":"1"}}],["hs",[["bt","-",{"c":["q2","-"]}],["tx",{"$":"q2"}],["bt","+",{"c":["q2","+"]}]],{"g":8,"ai":"c"}],["tx","$35",{"fg":"#fa0","w":50,"ta":"right"}]],{"jc":"sb","ai":"c","p":"8px 0","s":{"borderBottom":"1px solid #333"}}],["hs",[["tx","total:",{"fg":"#888"}],["tx",{"$":"total"},{"fg":"#4f8","fw":600}]],{"jc":"sb","p":"16px 0"}]],{"g":0}]}',reactDemoCode:`function Cart() {
  const [items, setItems] = React.useState([{n:'widget',p:25,q:1},{n:'gadget',p:35,q:2}]);
  const update = (i,d) => setItems(items.map((it,j)=>j===i?{...it,q:Math.max(0,it.q+d)}:it).filter(it=>it.q>0));
  const total = items.reduce((s,i)=>s+i.p*i.q,0);
  return (
    <div>
      {items.map((it,i) => (
        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #333'}}>
          <span style={{flex:1,color:'#ccc'}}>{it.n}</span>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={()=>update(i,-1)}>-</button>
            <span>{it.q}</span>
            <button onClick={()=>update(i,1)}>+</button>
          </div>
          <span style={{color:'#fa0',width:50,textAlign:'right'}}>\${it.p*it.q}</span>
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'space-between',padding:'16px 0'}}>
        <span style={{color:'#888'}}>total:</span>
        <span style={{color:'#4f8',fontWeight:600}}>\${total}</span>
      </div>
    </div>
  );
}`,file:"08-shopping-cart.html"},{id:"wizard",name:"wizard",savings:"-26%",tooeyTokens:249,reactTokens:338,description:"multi-step form with progress indicator",tooeyCode:`{s:{step:0,name:"",email:""},r:[V,[
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
}`,demoSpec:'{"s":{"step":0,"name":"","email":""},"r":["vs",[["hs",[["dv","",{"w":40,"h":4,"bg":"#fa0","r":2}],["dv","",{"w":40,"h":4,"bg":"#333","r":2}],["dv","",{"w":40,"h":4,"bg":"#333","r":2}]],{"g":4}],{"?":"step","is":0,"t":["vs",[["tx","step 1: name",{"fw":500,"fg":"#fff"}],["in","",{"v":{"$":"name"},"x":["name","!"],"ph":"your name","s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"100%"}}]],{"g":12}],"e":{"?":"step","is":1,"t":["vs",[["tx","step 2: email",{"fw":500,"fg":"#fff"}],["in","",{"type":"email","v":{"$":"email"},"x":["email","!"],"ph":"email","s":{"padding":"8px","background":"#0a0a0f","color":"#fff","border":"1px solid #333","borderRadius":"4px","width":"100%"}}]],{"g":12}],"e":["vs",[["tx","done!",{"fw":600,"fg":"#4f8","fs":16}],["tx","thanks for signing up",{"fg":"#888"}]],{"g":8}]}},["hs",[{"?":"step","is":0,"t":["bt","back",{"dis":true}],"e":["bt","back",{"c":["step","-"]}]},["bt","next",{"c":["step","+"]}]],{"g":8,"jc":"fe"}]],{"g":16}]}',reactDemoCode:`function Wizard() {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const inputStyle = {padding:'8px',background:'#0a0a0f',color:'#fff',border:'1px solid #333',borderRadius:4,width:'100%'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',gap:4}}>
        {[0,1,2].map(i => <div key={i} style={{width:40,height:4,borderRadius:2,background:i<=step?'#fa0':'#333'}} />)}
      </div>
      {step===0 && <div style={{display:'flex',flexDirection:'column',gap:12}}><span style={{fontWeight:500,color:'#fff'}}>step 1: name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="your name" style={inputStyle}/></div>}
      {step===1 && <div style={{display:'flex',flexDirection:'column',gap:12}}><span style={{fontWeight:500,color:'#fff'}}>step 2: email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={inputStyle}/></div>}
      {step===2 && <div style={{display:'flex',flexDirection:'column',gap:8}}><span style={{fontWeight:600,color:'#4f8',fontSize:16}}>done!</span><span style={{color:'#888'}}>thanks for signing up</span></div>}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button disabled={step===0} onClick={()=>setStep(s=>s-1)}>back</button>
        <button onClick={()=>setStep(s=>Math.min(2,s+1))}>next</button>
      </div>
    </div>
  );
}`,file:"09-wizard.html"}]};function G(t){if(!t||t.length<2)return[];let n=t.toLowerCase(),s=[];return c.coreFunctions.forEach(o=>{(o.name.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"function",...o})}),c.instanceMethods.forEach(o=>{(o.name.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"method",...o})}),c.components.forEach(o=>{(o.name.toLowerCase().includes(n)||o.fullName?.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"component",...o})}),c.props.forEach(o=>{(o.name.toLowerCase().includes(n)||o.fullName?.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"prop",...o})}),c.events.forEach(o=>{(o.name.toLowerCase().includes(n)||o.fullName?.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"event",...o})}),c.stateOps.forEach(o=>{(o.op?.includes(n)||o.name.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"operation",...o})}),c.controlFlow.forEach(o=>{(o.name.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"controlflow",...o})}),c.types.forEach(o=>{(o.name.toLowerCase().includes(n)||o.description.toLowerCase().includes(n))&&s.push({type:"type",...o})}),s}var j={colors:{bg:"#0a0a0f",bgSecondary:"#111118",bgTertiary:"#1a1a24",bgHover:"#252530",text:"#e0e0e0",textSecondary:"#888",textMuted:"#666",accent:"#0af",success:"#4f8",warning:"#fa0",error:"#f55",border:"#333",codeBg:"#111"},spacing:{xs:4,sm:8,md:16,lg:24,xl:32},radius:{sm:4,md:8,lg:12}},U={colors:{bg:"#fff",bgSecondary:"#f8f9fa",bgTertiary:"#e9ecef",bgHover:"#dee2e6",text:"#212529",textSecondary:"#495057",textMuted:"#868e96",accent:"#0066cc",success:"#28a745",warning:"#ffc107",error:"#dc3545",border:"#dee2e6",codeBg:"#f4f4f4"},spacing:j.spacing,radius:j.radius},ee=t=>{let n=document.documentElement;Object.entries(t.colors).forEach(([s,o])=>{n.style.setProperty(`--${s.replace(/([A-Z])/g,"-$1").toLowerCase()}`,o)})},ye=()=>{if(document.getElementById("tooey-docs-styles"))return;let t=document.createElement("style");t.id="tooey-docs-styles",t.textContent=`
    pre[class*="language-"], code[class*="language-"] {
      font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
    }
  `,document.head.appendChild(t)},be={name:"logger",onStateChange(t,n,s){["searchQuery","searchResults"].includes(t)||console.log(`[docs] ${t}:`,n,"\u2192",s)}},re=t=>{let n=t.size||32;return[x,"",{w:n,h:n,s:{display:"inline-block"},id:`logo-${Math.random().toString(36).slice(2,8)}`}]},ie=()=>{document.querySelectorAll('[id^="logo-"]').forEach(t=>{if(t.innerHTML)return;let n=parseInt(t.style.width)||32;t.innerHTML=`<svg width="${n}" height="${n}" viewBox="0 0 64 64" style="color: var(--accent);">
      <rect x="24" y="8" width="16" height="48" rx="8" fill="currentColor"/>
      <rect x="12" y="20" width="40" height="14" rx="7" fill="currentColor" transform="rotate(-20 32 27)"/>
    </svg>`})},r=(t={},n=[])=>[a,n,{cls:"bg-bg-secondary p-4 rounded-lg border border-border"}],H=new Map,l=t=>{let n=`code-${Math.random().toString(36).slice(2,8)}`;return H.set(n,{code:t.code,lang:t.lang||"javascript"}),[x,"",{id:n,cls:"bg-code-bg rounded overflow-auto max-h-[300px]"}]},he=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),ve=()=>{H.forEach(({code:t,lang:n},s)=>{let o=document.getElementById(s);o&&!o.querySelector("pre")&&(o.innerHTML=`<pre style="margin:0;padding:8px;font-size:12px;line-height:1.4;"><code class="language-${n}">${he(t)}</code></pre>`)}),H.clear()},m=t=>[a,[[e,t.title,{cls:"text-xs font-normal text-text-muted uppercase tracking-wider block"}],t.subtitle?[e,t.subtitle,{cls:"text-sm text-text-secondary mt-1"}]:null].filter(Boolean),{cls:"mb-4"}],te=t=>{let{item:n,type:s}=t,o=[[i,[[e,s,{cls:"text-[10px] text-accent bg-bg-tertiary px-2 py-0.5 rounded uppercase"}],[e,n.name||n.op||n.fullName||"",{cls:"text-lg font-semibold text-text-primary"}]],{cls:"gap-2 items-center flex"}],[e,n.description,{cls:"text-text-secondary my-2 mb-4 block"}]];return n.signature&&o.push(l({code:n.signature})),n.example&&o.push([a,[[e,"example",{cls:"text-xs text-text-muted uppercase tracking-wider"}],l({code:n.example})],{cls:"gap-2 my-4"}]),r({},o)},ke={home:()=>[a,[[a,[[i,[[x,[re({size:48})],{cls:"w-12 h-12 drop-shadow-[0_4px_20px_rgba(0,170,255,0.3)]"}],[a,[[e,"tooey",{cls:"text-2xl font-bold text-text-primary"}],[e,"token-efficient ui for llm output",{cls:"text-sm text-text-secondary"}]],{cls:"gap-1"}]],{cls:"gap-4 items-center flex"}],[i,[[e,"~39%",{cls:"text-accent font-semibold"}],[e,"fewer tokens",{cls:"text-text-secondary"}],[e,"|",{cls:"text-border mx-2"}],[e,"~10kb",{cls:"text-accent font-semibold"}],[e,"minified",{cls:"text-text-secondary"}],[e,"|",{cls:"text-border mx-2"}],[e,"0",{cls:"text-accent font-semibold"}],[e,"deps",{cls:"text-text-secondary"}]],{cls:"gap-1.5 items-center flex-wrap flex my-6"}]],{cls:"mb-8"}],r({},[m({title:"quick start"}),l({code:`import { render, vs, tx, bt } from '@tooey/ui';
render(document.getElementById('app'), {
  s: { count: 0 },
  r: [vs, [[tx, { $: 'count' }], [bt, '+', { c: 'count+' }]], { g: 8 }]
});`}),[i,[[B,"examples",{c:()=>ce("examples"),cls:"bg-accent text-white px-4 py-2 rounded border-none cursor-pointer hover:bg-accent-hover transition-colors"}],[ae,"github",{href:"https://github.com/vijaypemmaraju/tooey",cls:"text-text-secondary px-4 py-2 no-underline hover:text-accent transition-colors"}]],{cls:"gap-2 flex mt-4"}]]),[E,[r({},[[e,"signals & reactivity",{cls:"font-semibold text-text-primary text-sm block mb-2"}],[e,"fine-grained reactivity with signals, computed, and effects",{cls:"text-text-secondary text-sm"}]]),r({},[[e,"function components",{cls:"font-semibold text-text-primary text-sm block mb-2"}],[e,"create reusable components as simple functions",{cls:"text-text-secondary text-sm"}]]),r({},[[e,"theming",{cls:"font-semibold text-text-primary text-sm block mb-2"}],[e,"token-based theming with $token syntax",{cls:"text-text-secondary text-sm"}]]),r({},[[e,"advanced features",{cls:"font-semibold text-text-primary text-sm block mb-2"}],[e,"refs, context, portals, fragments, memo, router, ssr, devtools",{cls:"text-text-secondary text-sm"}]])],{cols:2,g:16,cls:"my-6"}],r({},[m({title:"components"}),[E,["layout","text","form","table","list","media"].map(t=>[a,[[e,t,{cls:"text-accent text-xs uppercase tracking-wider"}],[e,c.components.filter(n=>n.category===t).map(n=>n.name).join(" "),{cls:"text-text-primary font-mono"}]],{cls:"gap-1"}]),{cols:3,g:16}]])],{cls:"space-y-6"}],"core-functions":()=>[a,[m({title:"core functions",subtitle:"essential functions for rendering and state management"}),...c.coreFunctions.map(t=>te({item:t,type:"function"}))],{g:16}],"instance-methods":()=>[a,[m({title:"instance methods",subtitle:"methods on TooeyInstance returned by render()"}),...c.instanceMethods.map(t=>te({item:t,type:"method"}))],{g:16}],components:()=>[a,[m({title:"components",subtitle:"23 built-in components with short names"}),...["layout","text","form","table","list","media"].map(t=>r({},[[e,t,{cls:"text-sm font-semibold text-accent uppercase mb-3 block"}],[E,c.components.filter(n=>n.category===t).map(n=>[a,[[i,[[e,n.name,{cls:"text-success font-bold font-mono text-base"}],[e,`(${n.fullName})`,{cls:"text-text-muted text-xs"}]],{cls:"gap-1.5 items-center flex"}],[e,n.description,{cls:"text-text-secondary text-xs"}],[e,n.element,{cls:"text-text-muted text-xs font-mono"}]],{cls:"gap-1 p-2 bg-bg-tertiary rounded"}]),{cols:2,g:8}]]))],{cls:"space-y-4"}],props:()=>[a,[m({title:"props",subtitle:"all style and element properties"}),...["spacing","sizing","colors","borders","positioning","typography","layout","misc","element"].map(t=>r({},[[e,t,{cls:"text-sm font-semibold text-accent uppercase mb-3 block"}],[a,c.props.filter(n=>n.category===t).map(n=>[i,[[e,n.name,{cls:"text-success font-semibold font-mono text-sm w-10"}],[e,n.fullName||"",{cls:"text-text-primary text-sm w-[120px]"}],[e,n.description,{cls:"text-text-secondary text-xs flex-1"}],[e,n.example||"",{cls:"text-text-muted font-mono text-xs"}]],{cls:"gap-2 items-center flex py-1.5 border-b border-border"}]),{cls:"space-y-0"}]]))],{cls:"space-y-4"}],events:()=>[a,[m({title:"events & operations",subtitle:"event handlers and state operations"}),r({},[[e,"events",{cls:"text-sm font-semibold text-accent uppercase mb-3 block"}],[a,c.events.map(t=>[i,[[e,t.name,{cls:"text-success font-semibold font-mono text-sm w-10"}],[e,t.fullName||"",{cls:"text-text-primary text-sm w-[100px]"}],[e,t.description,{cls:"text-text-secondary text-xs flex-1"}],[e,t.example||"",{cls:"text-text-muted font-mono text-xs"}]],{cls:"gap-2 items-center flex py-2 border-b border-border"}]),{cls:"space-y-0"}]]),r({},[[e,"state operations",{cls:"text-sm font-semibold text-accent uppercase mb-3 block"}],[a,c.stateOps.map(t=>[i,[[e,t.op||"",{cls:"text-warning font-bold font-mono text-base w-[30px] text-center"}],[e,t.name,{cls:"text-text-primary text-sm w-20"}],[e,t.description,{cls:"text-text-secondary text-xs flex-1"}],[e,t.example||"",{cls:"text-text-muted font-mono text-xs"}]],{cls:"gap-2 items-center flex py-2 border-b border-border"}]),{cls:"space-y-0"}]])],{cls:"space-y-4"}],"control-flow":()=>[a,[m({title:"control flow",subtitle:"conditional rendering and list iteration"}),...c.controlFlow.map(t=>r({},[[e,t.name,{cls:"text-sm font-semibold text-text-primary block mb-2"}],[e,t.description,{cls:"text-text-secondary text-sm block mb-3"}],l({code:t.example||""})]))],{cls:"space-y-4"}],theming:()=>[a,[m({title:"theming",subtitle:"token-based theming system"}),r({},[[e,c.theming.description,{cls:"text-text-secondary block mb-4"}],[e,"interface",{cls:"text-xs text-text-muted uppercase tracking-wider"}],l({code:c.theming.interface})]),r({},[[e,"example",{cls:"text-xs text-text-muted uppercase tracking-wider mb-2 block"}],l({code:c.theming.example})])],{cls:"space-y-4"}],plugins:()=>[a,[m({title:"plugins",subtitle:"extend with lifecycle hooks"}),r({},[[e,c.plugins.description,{cls:"text-text-secondary block mb-4"}],l({code:c.plugins.interface})]),r({},[[e,"hooks",{cls:"text-sm font-semibold text-accent uppercase mb-3 block"}],[a,c.plugins.hooks.map(t=>[i,[[e,t.name,{cls:"text-success font-semibold font-mono text-sm w-[120px]"}],[e,t.description,{cls:"text-text-secondary text-xs flex-1"}]],{cls:"gap-2 items-center flex py-2 border-b border-border"}]),{cls:"space-y-0"}]]),r({},[[e,"example",{cls:"text-xs text-text-muted uppercase tracking-wider mb-2 block"}],l({code:c.plugins.example})])],{cls:"space-y-4"}],"function-components":()=>[a,[m({title:"function components",subtitle:"create reusable components"}),r({},[[e,c.functionComponents.description,{cls:"text-text-secondary block mb-4"}],l({code:c.functionComponents.signature})]),r({},[[e,"example",{cls:"text-xs text-text-muted uppercase tracking-wider mb-2 block"}],l({code:c.functionComponents.example})])],{cls:"space-y-4"}],"error-boundaries":()=>[a,[m({title:"error boundaries",subtitle:"catch render errors gracefully"}),r({},[[e,c.errorBoundaries.description,{cls:"text-text-secondary block mb-4"}],l({code:c.errorBoundaries.interface})]),r({},[[e,"example",{cls:"text-xs text-text-muted uppercase tracking-wider mb-2 block"}],l({code:c.errorBoundaries.example})])],{cls:"space-y-4"}],types:()=>[a,[m({title:"types",subtitle:"typescript type definitions"}),...c.types.map(t=>r({},[[e,t.name,{cls:"text-success font-semibold font-mono text-sm"}],[e,t.description,{cls:"text-text-secondary text-sm my-2"}],l({code:t.signature||""})]))],{cls:"space-y-4"}],examples:()=>[a,[m({title:"examples",subtitle:"interactive demos with token comparisons"}),[a,c.examples.map(t=>r({},[[i,[[e,t.name,{cls:"text-text-primary font-semibold text-base"}],[e,t.savings,{cls:"text-success font-bold font-mono text-sm"}]],{cls:"justify-between items-center flex"}],[e,t.description,{cls:"text-text-secondary text-sm my-2 mb-4"}],[x,[[a,[[i,[[e,"tooey",{cls:"text-accent text-xs uppercase tracking-wider"}],[e,`(${t.tooeyTokens} tokens)`,{cls:"text-text-muted text-xs"}]],{cls:"gap-2 items-center flex"}],l({code:t.tooeyCode,lang:"javascript"})],{cls:"gap-2"}],[a,[[i,[[e,"react",{cls:"text-warning text-xs uppercase tracking-wider"}],[e,`(${t.reactTokens} tokens)`,{cls:"text-text-muted text-xs"}]],{cls:"gap-2 items-center flex"}],l({code:t.reactCode,lang:"jsx"})],{cls:"gap-2"}]],{cls:"grid grid-cols-1 sm:grid-cols-2 gap-4"}],[e,"live demos",{cls:"text-text-muted text-xs uppercase tracking-wider mt-4 mb-2"}],[x,[[a,[[e,"tooey",{cls:"text-accent text-[10px] uppercase tracking-wider"}],[x,"",{id:`demo-tooey-${t.id}`,cls:"bg-bg-tertiary p-4 rounded-lg border border-border min-h-[100px]"}]],{cls:"gap-2"}],[a,[[e,"react",{cls:"text-warning text-[10px] uppercase tracking-wider"}],[x,"",{id:`demo-react-${t.id}`,cls:"bg-bg-tertiary p-4 rounded-lg border border-border min-h-[100px]"}]],{cls:"gap-2"}]],{cls:"grid grid-cols-1 sm:grid-cols-2 gap-4"}]])),{cls:"space-y-6"}]],{cls:"space-y-4"}],"advanced-features":()=>[a,[m({title:"advanced features",subtitle:"refs, context, portals, fragments, reducer, memo, ssr, router, devtools"}),r({},[[i,[[e,"refs",{cls:"text-accent text-xs uppercase"}],[e,"ref()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"access dom elements directly for focus, measurements, or third-party integration",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`const inputRef = ref();
render(el, { r: [vs, [
  [In, '', { rf: inputRef, ph: 'type here...' }],
  [bt, 'focus', { c: () => inputRef.el?.focus() }]
]] });`})]),r({},[[i,[[e,"context",{cls:"text-accent text-xs uppercase"}],[e,"cx() ux()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"pass data deeply without prop drilling",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`const ThemeCtx = cx('#007bff');
const Themed = () => [tx, 'text', { fg: ux(ThemeCtx) }];
render(el, { r: { pv: ThemeCtx, v: '#ff0000', c: [Themed] } });`})]),r({},[[i,[[e,"portals",{cls:"text-accent text-xs uppercase"}],[e,"{ pt: target, c: [...] }",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"render content outside the normal dom tree (modals, tooltips)",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`// render modal to document.body
{ pt: document.body, c: [dv, [[tx, 'modal']], { pos: 'fix' }] }`})]),r({},[[i,[[e,"fragments",{cls:"text-accent text-xs uppercase"}],[e,"fr",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"group children without a visible wrapper (uses display: contents)",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:"[fr, [[tx, 'one'], [tx, 'two'], [tx, 'three']]]"})]),r({},[[i,[[e,"reducer",{cls:"text-accent text-xs uppercase"}],[e,"rd$()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"complex state logic with reducer pattern (like useReducer)",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`const reducer = (s, a) => a.type === 'inc' ? { n: s.n + 1 } : s;
const { s, dp } = rd$(reducer, { n: 0 });
render(el, { s, r: [vs, [[tx, { $: 'n' }], [bt, '+', { c: () => dp({ type: 'inc' }) }]]] });`})]),r({},[[i,[[e,"memo",{cls:"text-accent text-xs uppercase"}],[e,"mm()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"memoize expensive components to prevent unnecessary re-renders",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`const ExpensiveList = mm((props) => [vs, props.items.map(i => [tx, i])]);
// or declarative: { mm: ['dep1', 'dep2'], c: [...] }`})]),r({},[[i,[[e,"ssr",{cls:"text-accent text-xs uppercase"}],[e,"rts() hy()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"server-side rendering and hydration",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`// server
const html = rts({ s: { name: 'world' }, r: [tx, { $: 'name' }] });
// client
const app = hy(container, spec);`})]),r({},[[i,[[e,"router",{cls:"text-accent text-xs uppercase"}],[e,"lk ot() nav()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"client-side routing for single-page apps",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`const routes = [{ p: '/', c: Home }, { p: '/about', c: About }];
[vs, [[lk, 'home', { to: '/' }], [lk, 'about', { to: '/about' }], ot(routes)]]`})]),r({},[[i,[[e,"devtools",{cls:"text-accent text-xs uppercase"}],[e,"devtools()",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"debugging plugin with state inspection and history (this docs site uses it!)",{cls:"text-text-secondary text-sm mb-3 block"}],l({code:`render(el, spec, { plugins: [devtools({ name: 'my-app' })] });
// console: window.__TOOEY_DEVTOOLS__.getState()`})])],{cls:"space-y-4"}],"component-library":()=>[a,[m({title:"@tooey/components",subtitle:"shadcn-inspired component library for tooey"}),r({},[[e,"a collection of pre-built, beautifully designed components inspired by shadcn/ui. includes buttons, cards, badges, alerts, progress bars, and more - all optimized for token efficiency.",{cls:"text-text-secondary text-sm block mb-4"}],[i,[[k,[[e,"beta"]],{variant:"secondary"}],[k,[[e,"~10kb"]],{variant:"outline"}],[k,[[e,"token-efficient"]],{}]],{cls:"gap-2 flex flex-wrap"}]]),r({},[[i,[[e,"buttons",{cls:"text-accent text-xs uppercase"}],[e,"Bt",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"6 variants (default, destructive, outline, secondary, ghost, link) and 4 sizes",{cls:"text-text-secondary text-sm mb-3 block"}],[i,[[C,"",{label:"default"}],[C,"",{label:"destructive",variant:"destructive"}],[C,"",{label:"outline",variant:"outline"}],[C,"",{label:"secondary",variant:"secondary"}],[C,"",{label:"ghost",variant:"ghost"}],[C,"",{label:"link",variant:"link"}]],{cls:"gap-2 flex flex-wrap"}],l({code:"[Bt, '', { label: 'click me', variant: 'outline' }]"})]),r({},[[i,[[e,"badges",{cls:"text-accent text-xs uppercase"}],[e,"Bg",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"4 variants for labels, tags, and status indicators",{cls:"text-text-secondary text-sm mb-3 block"}],[i,[[k,"",{label:"default"}],[k,"",{label:"secondary",variant:"secondary"}],[k,"",{label:"destructive",variant:"destructive"}],[k,"",{label:"outline",variant:"outline"}]],{cls:"gap-2 flex flex-wrap"}],l({code:"[Bg, '', { label: 'new', variant: 'secondary' }]"})]),r({},[[i,[[e,"alerts",{cls:"text-accent text-xs uppercase"}],[e,"Al AlT AlD",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"notification messages with title and description",{cls:"text-text-secondary text-sm mb-3 block"}],[Y,[[Z,[[e,"heads up!"]]],[K,[[e,"you can use these components to build beautiful uis"]]]]],[x,"",{h:8}],[Y,[[Z,[[e,"error"]]],[K,[[e,"something went wrong"]]]],{variant:"destructive"}],l({code:"[Al, [[AlT, [[tx, 'title']]], [AlD, [[tx, 'description']]]], { variant: 'destructive' }]"})]),r({},[[i,[[e,"progress",{cls:"text-accent text-xs uppercase"}],[e,"Pg",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"progress bar with customizable value and max",{cls:"text-text-secondary text-sm mb-3 block"}],[a,[[P,"",{value:25}],[P,"",{value:50}],[P,"",{value:75}]],{cls:"gap-2"}],l({code:"[Pg, '', { value: 75, max: 100 }]"})]),r({},[[i,[[e,"avatar",{cls:"text-accent text-xs uppercase"}],[e,"Av",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"user avatar with image support and fallback initials",{cls:"text-text-secondary text-sm mb-3 block"}],[i,[[z,"",{fallback:"JD"}],[z,"",{fallback:"AB",w:48}],[z,"",{fallback:"?",w:32}]],{cls:"gap-2 items-center flex"}],l({code:"[Av, '', { fallback: 'JD', w: 48 }]"})]),r({},[[i,[[e,"separator",{cls:"text-accent text-xs uppercase"}],[e,"Sp",{cls:"text-success font-mono text-sm"}]],{cls:"gap-2 items-center flex mb-2"}],[e,"divider line - horizontal or vertical",{cls:"text-text-secondary text-sm mb-3 block"}],[a,[[e,"content above",{cls:"text-text-secondary text-sm"}],[fe],[e,"content below",{cls:"text-text-secondary text-sm"}]],{cls:"gap-2"}],l({code:"[Sp]  // or [Sp, '', { orientation: 'vertical' }]"})]),r({},[[e,"all available components",{cls:"text-accent text-xs uppercase mb-2 block"}],[E,[[a,[[e,"layout",{cls:"text-success text-xs uppercase"}],[e,"Cd CdH CdT CdD CdC CdF",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}],[a,[[e,"form",{cls:"text-success text-xs uppercase"}],[e,"Ip Ta Sl Cb Rg RgI Lb Sw",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}],[a,[[e,"feedback",{cls:"text-success text-xs uppercase"}],[e,"Al AlT AlD Bg Pg Sk",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}],[a,[[e,"overlay",{cls:"text-success text-xs uppercase"}],[e,"Dg DgO DgC DgH DgT DgD DgF",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}],[a,[[e,"navigation",{cls:"text-success text-xs uppercase"}],[e,"Tb TbL TbT TbC Ac AcI AcT AcC",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}],[a,[[e,"misc",{cls:"text-success text-xs uppercase"}],[e,"Av Sp Tt Dd DdT DdM DdI",{cls:"text-text-primary font-mono text-sm"}]],{cls:"gap-1"}]],{cols:3,g:16}]]),r({},[[e,"installation",{cls:"text-accent text-xs uppercase mb-2 block"}],l({code:`npm install @tooey/components

import { Bt, Cd, Bg, Al, shadcnTheme } from '@tooey/components';
import { createTooey } from '@tooey/ui';

const tooey = createTooey({ theme: shadcnTheme });
tooey.render(el, { r: [Bt, '', { label: 'hello' }] });`})])],{cls:"space-y-4"}]},F={},O={};c.examples.forEach(t=>{F[t.id]=t.demoSpec,O[t.id]=t.reactDemoCode});var we=t=>{let n=t.state.q1,s=t.state.q2,o=t.state.total;!n||!s||!o||M(()=>{let d=n(),f=s(),p=Math.max(0,d),y=Math.max(0,f);p!==d&&n.set(p),y!==f&&s.set(y);let b=`$${p*25+y*35}`;o()!==b&&o.set(b)})},Ce=t=>{let n=t.state.c,s=t.state.f;if(!n||!s)return;let o=Number(n()),d=Number(s());M(()=>{let f=Number(n()),p=Number(s()),y=f!==o,b=p!==d;if(y&&!b){let g=Math.round(f*9/5+32);o=f,d=g,s()!==g&&s.set(g);return}if(b&&!y){let g=Math.round((p-32)*5/9);d=p,o=g,n()!==g&&n.set(g);return}o=f,d=p})},S=[{label:"home",page:"home"},{label:"core functions",page:"core-functions"},{label:"instance methods",page:"instance-methods"},{label:"components",page:"components"},{label:"props",page:"props"},{label:"events & ops",page:"events"},{label:"control flow",page:"control-flow"},{label:"theming",page:"theming"},{label:"plugins",page:"plugins"},{label:"function components",page:"function-components"},{label:"error boundaries",page:"error-boundaries"},{label:"advanced features",page:"advanced-features"},{label:"types",page:"types"},{label:"examples",page:"examples"},{label:"@tooey/components",page:"component-library"}],W=A(window.location.hash.slice(1)||"home"),V=A(""),N=A([]),v=A(window.matchMedia("(prefers-color-scheme: dark)").matches),L,T,ce=t=>{window.location.hash=t,W.set(t),V.set(""),N.set([])},ne=!1,I=null,le=t=>{I||(I=document.createElement("style"),document.head.appendChild(I)),I.textContent=t?`
    code[class*="language-"], pre[class*="language-"] { color: #e0e0e0; background: #111; }
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955; }
    .token.punctuation { color: #808080; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol { color: #b5cea8; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin { color: #ce9178; }
    .token.operator, .token.entity, .token.url { color: #d4d4d4; }
    .token.atrule, .token.attr-value, .token.keyword { color: #569cd6; }
    .token.function, .token.class-name { color: #dcdcaa; }
    .token.regex, .token.important, .token.variable { color: #d16969; }
  `:`
    code[class*="language-"], pre[class*="language-"] { color: #333; background: #f4f4f4; }
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955; }
    .token.punctuation { color: #393a34; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol { color: #36acaa; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin { color: #9a6700; }
    .token.operator, .token.entity, .token.url { color: #393a34; }
    .token.atrule, .token.attr-value, .token.keyword { color: #0550ae; }
    .token.function, .token.class-name { color: #6f42c1; }
    .token.regex, .token.important, .token.variable { color: #cf222e; }
  `},Te=()=>ne?Promise.resolve():new Promise(t=>{le(v());let n=document.createElement("script");n.src="https://unpkg.com/prismjs@1/prism.min.js",n.onload=()=>{let s=document.createElement("script");s.src="https://unpkg.com/prismjs@1/components/prism-jsx.min.js",s.onload=()=>{let o=document.createElement("script");o.src="https://unpkg.com/prismjs@1/components/prism-typescript.min.js",o.onload=()=>{ne=!0,t()},document.head.appendChild(o)},document.head.appendChild(s)},document.head.appendChild(n)}),Se=()=>{let t=window.Prism;t&&document.querySelectorAll('code[class*="language-"]').forEach(n=>{n.classList.contains("prism-highlighted")||(t.highlightElement(n),n.classList.add("prism-highlighted"))})},oe=!1,Ne=()=>oe?Promise.resolve():new Promise(t=>{let n=document.createElement("script");n.src="https://unpkg.com/react@18/umd/react.development.js",n.crossOrigin="anonymous",n.onload=()=>{let s=document.createElement("script");s.src="https://unpkg.com/react-dom@18/umd/react-dom.development.js",s.crossOrigin="anonymous",s.onload=()=>{let o=document.createElement("script");o.src="https://unpkg.com/@babel/standalone/babel.min.js",o.onload=()=>{oe=!0,t()},document.head.appendChild(o)},document.head.appendChild(s)},document.head.appendChild(n)}),$e=(t,n)=>{try{let s=window.Babel,o=window.React,d=window.ReactDOM;if(!s||!o||!d)return;let f=s.transform(n,{presets:["react"]}).code,p=new Function("React",`${f}; return ${n.match(/function\s+(\w+)/)?.[1]||"Component"};`)(o);d.createRoot(t).render(o.createElement(p)),t.dataset.rendered="true"}catch(s){console.warn("[tooey] failed to render react demo:",s),t.textContent="failed to render"}},Ee=()=>{if(!L)return;let t=W();L.innerHTML="",D(L,{r:ke[t]()}),ie(),requestAnimationFrame(()=>{ve(),Te().then(()=>{requestAnimationFrame(Se)})}),document.querySelectorAll(".nav-btn").forEach((n,s)=>{let o=n;o.style.background=S[s].page===t?"var(--bg-tertiary)":"transparent",o.style.color=S[s].page===t?"var(--accent)":"var(--text-secondary)"}),t==="examples"&&(Object.keys(F).forEach(n=>{let s=document.getElementById(`demo-tooey-${n}`);if(s&&!s.dataset.rendered)try{let o=JSON.parse(F[n]),d=D(s,o);n==="shopping-cart"&&we(d),n==="temperature"&&Ce(d),s.dataset.rendered="true"}catch(o){console.warn("[tooey] failed to render demo:",n,o)}}),Ne().then(()=>{Object.keys(O).forEach(n=>{let s=document.getElementById(`demo-react-${n}`);s&&!s.dataset.rendered&&$e(s,O[n])})}))},R=()=>{if(!T)return;let t=N();if(!t.length){T.innerHTML="";return}T.innerHTML="",D(T,{r:[a,t.slice(0,10).map(n=>[x,[[i,[[e,n.type,{cls:"text-[9px] text-accent bg-bg-tertiary px-1.5 py-0.5 rounded uppercase"}],[e,n.name,{cls:"text-text-primary font-medium text-sm"}]],{cls:"gap-1.5 items-center flex"}],[e,n.description,{cls:"text-text-secondary text-xs"}]],{cls:"search-result p-2 rounded cursor-pointer hover:bg-bg-tertiary transition-colors"}]),{cls:"absolute top-[42px] left-0 right-0 bg-bg-secondary rounded p-2 z-[100] max-h-[300px] overflow-auto border border-border shadow-lg"}]})},se=ge(),Ie=()=>{ee(v()?j:U),ye();let t=document.getElementById("app");if(!t)return;let n=xe({name:"tooey-docs",log:!1}),s={s:{},r:[i,[[B,"",{id:"menu-btn",cls:"fixed top-4 left-4 z-[1001] bg-bg-secondary p-2.5 rounded-lg border border-border hidden"}],[x,"",{id:"sidebar-overlay",cls:"fixed inset-0 z-[999] bg-black/50 hidden"}],[a,[[i,[re({size:32}),[e,"tooey",{cls:"text-lg font-bold text-text-primary"}]],{cls:"gap-2 items-center flex mb-6"}],[a,[[ue,"",{ph:"search...",id:"search",rf:se,cls:"bg-bg-tertiary text-text-primary px-3 py-2 rounded w-full border border-border outline-none focus:border-accent"}],[x,"",{id:"search-results"}]],{cls:"relative mb-4"}],[a,S.map(u=>[B,u.label,{cls:"nav-btn bg-transparent text-text-secondary px-3 py-2 rounded w-full text-left text-sm cursor-pointer border-none hover:bg-bg-tertiary hover:text-accent transition-colors"}]),{cls:"gap-0.5"}],[i,[[B,"",{id:"theme-btn",cls:"bg-transparent text-text-secondary p-2 rounded cursor-pointer border-none hover:text-accent transition-colors"}],[ae,"",{href:"https://github.com/vijaypemmaraju/tooey",id:"github-link",cls:"text-text-secondary p-2 hover:text-accent transition-colors"}]],{cls:"gap-2 mt-auto"}]],{id:"sidebar",cls:"w-60 h-screen p-6 bg-bg-secondary fixed top-0 left-0 z-[1000] border-r border-border overflow-y-auto flex flex-col transition-transform duration-300"}],[x,[{boundary:!0,child:[x,"",{id:"page-content"}],fallback:r({},[[e,"error",{cls:"text-error font-semibold"}]]),onError:u=>console.error(u)}],{id:"main-content",cls:"ml-60 p-8 max-w-[900px] min-h-screen"}]],{cls:"w-full"}]};D(t,s,{plugins:[be,n]}),L=document.getElementById("page-content"),T=document.getElementById("search-results");let o=se.el,d=document.getElementById("theme-btn"),f=document.getElementById("github-link"),p=document.getElementById("menu-btn"),y=document.getElementById("sidebar"),b=document.getElementById("sidebar-overlay"),g=document.getElementById("main-content"),_='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',Q='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',de='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.089-.744.083-.729.083-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>',q='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',pe='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';d.innerHTML=v()?_:Q,f.innerHTML=de,p.innerHTML=q;let X=window.innerWidth<=768,h=!1,$=()=>{X=window.innerWidth<=768,X?(p.style.display="block",y.style.transform=h?"translateX(0)":"translateX(-100%)",b.style.display=h?"block":"none",g.style.marginLeft="0",g.style.padding="16px",g.style.paddingTop="60px"):(p.style.display="none",y.style.transform="translateX(0)",b.style.display="none",g.style.marginLeft="240px",g.style.padding="32px",h=!1)},me=()=>{h=!h,p.innerHTML=h?pe:q,$()},J=()=>{h&&(h=!1,p.innerHTML=q,$())};p.addEventListener("click",me),b.addEventListener("click",J),window.addEventListener("resize",$),$(),o?.addEventListener("input",u=>{let w=u.target.value;V.set(w),N.set(G(w)),R()}),o?.addEventListener("keydown",u=>{u.key==="Escape"&&(V.set(""),N.set([]),o.value="",R())}),document.addEventListener("click",u=>{!u.target.closest("#search")&&!u.target.closest("#search-results")&&(N.set([]),R())}),document.querySelectorAll(".nav-btn").forEach((u,w)=>{u.addEventListener("click",()=>{ce(S[w].page),J()})}),d.addEventListener("click",()=>{v.set(!v()),ee(v()?j:U),d.innerHTML=v()?_:Q,le(v())}),window.addEventListener("popstate",()=>{let u=window.location.hash.slice(1)||"home";S.some(w=>w.page===u)&&W.set(u)}),M(Ee),M(R),ie()};document.addEventListener("DOMContentLoaded",Ie);
//# sourceMappingURL=docs.js.map
