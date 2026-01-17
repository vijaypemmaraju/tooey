/**
 * tooey validation test cases
 *
 * comprehensive ui patterns for measuring:
 * 1. token efficiency across diverse patterns
 * 2. llm generation accuracy
 * 3. corpus transfer (how much context needed)
 */

export interface TestCase {
  id: string;
  name: string;
  category: 'basic' | 'forms' | 'navigation' | 'data' | 'interactive' | 'layout' | 'edge';
  complexity: 'trivial' | 'simple' | 'moderate' | 'complex';
  description: string;
  tooey: string;
  react: string;
  // expected behavior for validation
  expectedElements: string[];
  expectedState?: Record<string, unknown>;
  // semantic tags that would be lost in compression
  semanticIntent: string[];
}

export const TEST_CASES: TestCase[] = [
  // ============ BASIC ============
  {
    id: 'basic-001',
    name: 'static text',
    category: 'basic',
    complexity: 'trivial',
    description: 'single static text element',
    tooey: `{r:[T,"hello world"]}`,
    react: `function App() { return <span>hello world</span>; }`,
    expectedElements: ['span'],
    semanticIntent: ['greeting', 'static-content']
  },
  {
    id: 'basic-002',
    name: 'nested containers',
    category: 'basic',
    complexity: 'trivial',
    description: 'div inside div',
    tooey: `{r:[D,[[D,[[T,"nested"]]]]]}`,
    react: `function App() { return <div><div><span>nested</span></div></div>; }`,
    expectedElements: ['div', 'div', 'span'],
    semanticIntent: ['container', 'wrapper']
  },
  {
    id: 'basic-003',
    name: 'counter',
    category: 'basic',
    complexity: 'simple',
    description: 'increment/decrement counter',
    tooey: `{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n-"}],[B,"+",{c:"n+"}]],{g:8}]],{g:8}]}`,
    react: `function Counter() {
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
}`,
    expectedElements: ['div', 'span', 'div', 'button', 'button'],
    expectedState: { n: 0 },
    semanticIntent: ['counter', 'increment', 'decrement', 'numeric-control']
  },
  {
    id: 'basic-004',
    name: 'toggle',
    category: 'basic',
    complexity: 'simple',
    description: 'boolean toggle with display',
    tooey: `{s:{on:false},r:[V,[[T,{$:"on"}],[B,"toggle",{c:"on~"}]],{g:8}]}`,
    react: `function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <span>{String(on)}</span>
      <button onClick={()=>setOn(!on)}>toggle</button>
    </div>
  );
}`,
    expectedElements: ['div', 'span', 'button'],
    expectedState: { on: false },
    semanticIntent: ['toggle', 'boolean-switch', 'on-off']
  },

  // ============ FORMS ============
  {
    id: 'form-001',
    name: 'single input',
    category: 'forms',
    complexity: 'simple',
    description: 'text input with binding',
    tooey: `{s:{txt:""},r:[V,[[I,"",{v:{$:"txt"},x:"txt",ph:"type here"}],[T,{$:"txt"}]],{g:8}]}`,
    react: `function Input() {
  const [txt, setTxt] = useState('');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="type here"/>
      <span>{txt}</span>
    </div>
  );
}`,
    expectedElements: ['div', 'input', 'span'],
    expectedState: { txt: '' },
    semanticIntent: ['text-input', 'live-preview', 'user-input']
  },
  {
    id: 'form-002',
    name: 'login form',
    category: 'forms',
    complexity: 'moderate',
    description: 'username/password with submit',
    tooey: `{s:{user:"",pass:"",err:""},r:[V,[[V,[[T,"username"],[I,"",{v:{$:"user"},x:"user",ph:"username"}]],{g:4}],[V,[[T,"password"],[I,"",{type:"password",v:{$:"pass"},x:"pass",ph:"password"}]],{g:4}],{?:"err",t:[T,{$:"err"},{fg:"red"}]},{e:null},[B,"login",{c:submit}]],{g:16}]}`,
    react: `function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>username</label>
        <input value={user} onChange={e=>setUser(e.target.value)} placeholder="username"/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>password</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="password"/>
      </div>
      {err && <span style={{color:'red'}}>{err}</span>}
      <button onClick={submit}>login</button>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'span', 'input', 'div', 'span', 'input', 'button'],
    expectedState: { user: '', pass: '', err: '' },
    semanticIntent: ['login', 'authentication', 'credentials', 'error-display']
  },
  {
    id: 'form-003',
    name: 'select dropdown',
    category: 'forms',
    complexity: 'simple',
    description: 'select with options',
    tooey: `{s:{sel:"a"},r:[V,[[S,"",{v:{$:"sel"},x:"sel",opts:[{v:"a",l:"Option A"},{v:"b",l:"Option B"},{v:"c",l:"Option C"}]}],[T,{$:"sel"}]],{g:8}]}`,
    react: `function Dropdown() {
  const [sel, setSel] = useState('a');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <select value={sel} onChange={e=>setSel(e.target.value)}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Option C</option>
      </select>
      <span>{sel}</span>
    </div>
  );
}`,
    expectedElements: ['div', 'select', 'option', 'option', 'option', 'span'],
    expectedState: { sel: 'a' },
    semanticIntent: ['dropdown', 'selection', 'options']
  },
  {
    id: 'form-004',
    name: 'checkbox group',
    category: 'forms',
    complexity: 'moderate',
    description: 'multiple checkboxes',
    tooey: `{s:{a:false,b:true,c:false},r:[V,[[H,[[C,"",{ch:{$:"a"},x:"a~"}],[T,"Option A"]],{g:8,ai:"c"}],[H,[[C,"",{ch:{$:"b"},x:"b~"}],[T,"Option B"]],{g:8,ai:"c"}],[H,[[C,"",{ch:{$:"c"},x:"c~"}],[T,"Option C"]],{g:8,ai:"c"}]],{g:8}]}`,
    react: `function Checkboxes() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [c, setC] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={a} onChange={()=>setA(!a)}/>
        <span>Option A</span>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={b} onChange={()=>setB(!b)}/>
        <span>Option B</span>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={c} onChange={()=>setC(!c)}/>
        <span>Option C</span>
      </div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'input', 'span', 'div', 'input', 'span', 'div', 'input', 'span'],
    expectedState: { a: false, b: true, c: false },
    semanticIntent: ['checkbox-group', 'multi-select', 'preferences']
  },

  // ============ NAVIGATION ============
  {
    id: 'nav-001',
    name: 'tabs',
    category: 'navigation',
    complexity: 'moderate',
    description: 'tab navigation with content',
    tooey: `{s:{tab:0},r:[V,[[H,[[B,"Home",{c:"tab!0"}],[B,"About",{c:"tab!1"}],[B,"Contact",{c:"tab!2"}]],{g:4}],{?:"tab",is:0,t:[T,"Home content"]},{?:"tab",is:1,t:[T,"About content"]},{?:"tab",is:2,t:[T,"Contact content"]}],{g:16}]}`,
    react: `function Tabs() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',gap:4}}>
        <button onClick={()=>setTab(0)}>Home</button>
        <button onClick={()=>setTab(1)}>About</button>
        <button onClick={()=>setTab(2)}>Contact</button>
      </div>
      {tab===0 && <span>Home content</span>}
      {tab===1 && <span>About content</span>}
      {tab===2 && <span>Contact content</span>}
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'button', 'button', 'button', 'span'],
    expectedState: { tab: 0 },
    semanticIntent: ['tabs', 'navigation', 'page-content', 'single-page-app']
  },
  {
    id: 'nav-002',
    name: 'accordion',
    category: 'navigation',
    complexity: 'moderate',
    description: 'collapsible sections',
    tooey: `{s:{open:null},r:[V,[[V,[[B,"Section 1",{c:["open","!",0]}],{?:{$:"open"},is:0,t:[T,"Content 1"]}],{g:4}],[V,[[B,"Section 2",{c:["open","!",1]}],{?:{$:"open"},is:1,t:[T,"Content 2"]}],{g:4}],[V,[[B,"Section 3",{c:["open","!",2]}],{?:{$:"open"},is:2,t:[T,"Content 3"]}],{g:4}]],{g:8}]}`,
    react: `function Accordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <button onClick={()=>setOpen(0)}>Section 1</button>
        {open===0 && <span>Content 1</span>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <button onClick={()=>setOpen(1)}>Section 2</button>
        {open===1 && <span>Content 2</span>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <button onClick={()=>setOpen(2)}>Section 3</button>
        {open===2 && <span>Content 3</span>}
      </div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'button', 'div', 'button', 'div', 'button'],
    expectedState: { open: null },
    semanticIntent: ['accordion', 'collapsible', 'expandable-sections', 'faq']
  },
  {
    id: 'nav-003',
    name: 'breadcrumb',
    category: 'navigation',
    complexity: 'simple',
    description: 'breadcrumb navigation',
    tooey: `{s:{path:["Home","Products","Shoes"]},r:[H,[{m:"path",a:[H,[[L,"$item",{href:"#"}],[T,"/"]],{g:4}]}],{g:4}]}`,
    react: `function Breadcrumb() {
  const path = ["Home","Products","Shoes"];
  return (
    <div style={{display:'flex',gap:4}}>
      {path.map((item,i)=>(
        <div key={i} style={{display:'flex',gap:4}}>
          <a href="#">{item}</a>
          <span>/</span>
        </div>
      ))}
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'a', 'span', 'div', 'a', 'span', 'div', 'a', 'span'],
    expectedState: { path: ['Home', 'Products', 'Shoes'] },
    semanticIntent: ['breadcrumb', 'navigation-path', 'hierarchy']
  },

  // ============ DATA DISPLAY ============
  {
    id: 'data-001',
    name: 'simple list',
    category: 'data',
    complexity: 'simple',
    description: 'unordered list rendering',
    tooey: `{s:{items:["apple","banana","cherry"]},r:[Ul,[{m:"items",a:[Li,"$item"]}]]}`,
    react: `function List() {
  const items = ["apple","banana","cherry"];
  return (
    <ul>
      {items.map((item,i)=><li key={i}>{item}</li>)}
    </ul>
  );
}`,
    expectedElements: ['ul', 'li', 'li', 'li'],
    expectedState: { items: ['apple', 'banana', 'cherry'] },
    semanticIntent: ['list', 'items', 'enumeration']
  },
  {
    id: 'data-002',
    name: 'data table',
    category: 'data',
    complexity: 'moderate',
    description: 'table with header and body',
    tooey: `{s:{rows:[{name:"Alice",age:30},{name:"Bob",age:25}]},r:[Tb,[[Th,[[Tr,[[Tc,"Name"],[Tc,"Age"]]]]],[Tbd,[{m:"rows",a:[Tr,[[Td,"$item.name"],[Td,"$item.age"]]]}]]]]}`,
    react: `function Table() {
  const rows = [{name:"Alice",age:30},{name:"Bob",age:25}];
  return (
    <table>
      <thead><tr><th>Name</th><th>Age</th></tr></thead>
      <tbody>
        {rows.map((row,i)=>(
          <tr key={i}><td>{row.name}</td><td>{row.age}</td></tr>
        ))}
      </tbody>
    </table>
  );
}`,
    expectedElements: ['table', 'thead', 'tr', 'th', 'th', 'tbody', 'tr', 'td', 'td', 'tr', 'td', 'td'],
    expectedState: { rows: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }] },
    semanticIntent: ['data-table', 'tabular-data', 'user-list']
  },
  {
    id: 'data-003',
    name: 'card grid',
    category: 'data',
    complexity: 'moderate',
    description: 'grid of cards',
    tooey: `{s:{cards:[{title:"Card 1",desc:"Description 1"},{title:"Card 2",desc:"Description 2"}]},r:[G,[{m:"cards",a:[V,[[T,"$item.title",{fw:700}],[T,"$item.desc"]],{p:16,bg:"#f0f0f0",r:8,g:8}]}],{cols:2,g:16}]}`,
    react: `function CardGrid() {
  const cards = [{title:"Card 1",desc:"Description 1"},{title:"Card 2",desc:"Description 2"}];
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      {cards.map((card,i)=>(
        <div key={i} style={{padding:16,background:'#f0f0f0',borderRadius:8,display:'flex',flexDirection:'column',gap:8}}>
          <span style={{fontWeight:700}}>{card.title}</span>
          <span>{card.desc}</span>
        </div>
      ))}
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'span', 'span', 'div', 'span', 'span'],
    expectedState: { cards: [{ title: 'Card 1', desc: 'Description 1' }, { title: 'Card 2', desc: 'Description 2' }] },
    semanticIntent: ['card-grid', 'product-cards', 'content-cards']
  },

  // ============ INTERACTIVE ============
  {
    id: 'int-001',
    name: 'todo list',
    category: 'interactive',
    complexity: 'moderate',
    description: 'add/remove items',
    tooey: `{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"new item"}],[B,"+",{c:add}]],{g:8}],[Ul,[{m:"items",a:[Li,[[T,"$item"],[B,"x",{c:del}]]]}]]],{g:12}]}`,
    react: `function TodoList() {
  const [txt, setTxt] = useState('');
  const [items, setItems] = useState([]);
  const add = () => { if(txt){setItems([...items,txt]);setTxt('');} };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="new item"/>
        <button onClick={add}>+</button>
      </div>
      <ul>
        {items.map((item,i)=>(
          <li key={i}>
            <span>{item}</span>
            <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'input', 'button', 'ul'],
    expectedState: { txt: '', items: [] },
    semanticIntent: ['todo-list', 'task-management', 'add-remove']
  },
  {
    id: 'int-002',
    name: 'modal dialog',
    category: 'interactive',
    complexity: 'moderate',
    description: 'modal with overlay',
    tooey: `{s:{open:false},r:[D,[[B,"Open Modal",{c:"open~"}],{?:"open",t:[D,[[D,[[T,"Modal Title",{fs:18,fw:700}],[T,"Modal content goes here"],[B,"Close",{c:"open~"}]],{bg:"#fff",p:24,r:8,g:16}]],{pos:"fix",t:0,l:0,w:"100%",h:"100%",bg:"rgba(0,0,0,0.5)",jc:"c",ai:"c",s:{display:"flex"}}]}]]}`,
    react: `function Modal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(true)}>Open Modal</button>
      {open && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,display:'flex',flexDirection:'column',gap:16}}>
            <span style={{fontSize:18,fontWeight:700}}>Modal Title</span>
            <span>Modal content goes here</span>
            <button onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}`,
    expectedElements: ['div', 'button'],
    expectedState: { open: false },
    semanticIntent: ['modal', 'dialog', 'overlay', 'popup']
  },
  {
    id: 'int-003',
    name: 'shopping cart',
    category: 'interactive',
    complexity: 'complex',
    description: 'cart with quantity controls',
    tooey: `{s:{items:[{name:"Widget",price:10,qty:1},{name:"Gadget",price:25,qty:2}]},r:[V,[[V,[{m:"items",a:[H,[[T,"$item.name",{w:100}],[H,[[B,"-",{c:dec}],[T,"$item.qty"],[B,"+",{c:inc}]],{g:4}],[T,"$item.price",{w:60,ta:"right"}]],{jc:"sb",ai:"c"}]}],{g:8}],[H,[[T,"Total:"],[T,{$:"total"}]],{jc:"sb",fw:700}]],{g:16}]}`,
    react: `function Cart() {
  const [items, setItems] = useState([{name:"Widget",price:10,qty:1},{name:"Gadget",price:25,qty:2}]);
  const updateQty = (i,d) => setItems(items.map((x,j)=>j===i?{...x,qty:Math.max(0,x.qty+d)}:x));
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {items.map((item,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{width:100}}>{item.name}</span>
            <div style={{display:'flex',gap:4}}>
              <button onClick={()=>updateQty(i,-1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={()=>updateQty(i,1)}>+</button>
            </div>
            <span style={{width:60,textAlign:'right'}}>{item.price}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontWeight:700}}>
        <span>Total:</span>
        <span>{total}</span>
      </div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'div', 'span', 'div', 'button', 'span', 'button', 'span', 'div', 'span', 'div', 'button', 'span', 'button', 'span', 'div', 'span', 'span'],
    expectedState: { items: [{ name: 'Widget', price: 10, qty: 1 }, { name: 'Gadget', price: 25, qty: 2 }] },
    semanticIntent: ['shopping-cart', 'e-commerce', 'quantity-control', 'price-total']
  },

  // ============ LAYOUT ============
  {
    id: 'layout-001',
    name: 'two column',
    category: 'layout',
    complexity: 'simple',
    description: 'sidebar + main layout',
    tooey: `{r:[H,[[V,[[T,"Sidebar"]],{w:200,bg:"#f0f0f0",p:16}],[V,[[T,"Main Content"]],{s:{flex:1},p:16}]],{h:"100vh"}]}`,
    react: `function TwoColumn() {
  return (
    <div style={{display:'flex',height:'100vh'}}>
      <div style={{width:200,background:'#f0f0f0',padding:16,display:'flex',flexDirection:'column'}}>
        <span>Sidebar</span>
      </div>
      <div style={{flex:1,padding:16,display:'flex',flexDirection:'column'}}>
        <span>Main Content</span>
      </div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'span', 'div', 'span'],
    semanticIntent: ['two-column', 'sidebar-layout', 'dashboard']
  },
  {
    id: 'layout-002',
    name: 'header-content-footer',
    category: 'layout',
    complexity: 'simple',
    description: 'full page layout',
    tooey: `{r:[V,[[D,[[T,"Header"]],{bg:"#333",fg:"#fff",p:16}],[D,[[T,"Content"]],{s:{flex:1},p:16}],[D,[[T,"Footer"]],{bg:"#333",fg:"#fff",p:16}]],{h:"100vh"}]}`,
    react: `function Layout() {
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
      <div style={{background:'#333',color:'#fff',padding:16}}><span>Header</span></div>
      <div style={{flex:1,padding:16}}><span>Content</span></div>
      <div style={{background:'#333',color:'#fff',padding:16}}><span>Footer</span></div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'span', 'div', 'span', 'div', 'span'],
    semanticIntent: ['page-layout', 'header-footer', 'full-page']
  },

  // ============ EDGE CASES ============
  {
    id: 'edge-001',
    name: 'empty state',
    category: 'edge',
    complexity: 'simple',
    description: 'conditional empty state',
    tooey: `{s:{items:[]},r:[D,[{?:{$:"items"},is:[],t:[T,"No items yet"],e:{m:"items",a:[Li,"$item"]}}]]}`,
    react: `function EmptyState() {
  const [items] = useState([]);
  return (
    <div>
      {items.length === 0 ? (
        <span>No items yet</span>
      ) : (
        items.map((item,i)=><li key={i}>{item}</li>)
      )}
    </div>
  );
}`,
    expectedElements: ['div', 'span'],
    expectedState: { items: [] },
    semanticIntent: ['empty-state', 'fallback', 'no-data']
  },
  {
    id: 'edge-002',
    name: 'deeply nested',
    category: 'edge',
    complexity: 'moderate',
    description: '5 levels of nesting',
    tooey: `{r:[D,[[D,[[D,[[D,[[D,[[T,"deep"]]]]]]]]]]]}`,
    react: `function Deep() {
  return <div><div><div><div><div><span>deep</span></div></div></div></div></div>;
}`,
    expectedElements: ['div', 'div', 'div', 'div', 'div', 'span'],
    semanticIntent: ['nested-structure', 'deep-hierarchy']
  },
  {
    id: 'edge-003',
    name: 'many siblings',
    category: 'edge',
    complexity: 'simple',
    description: '10 sibling elements',
    tooey: `{r:[V,[[T,"1"],[T,"2"],[T,"3"],[T,"4"],[T,"5"],[T,"6"],[T,"7"],[T,"8"],[T,"9"],[T,"10"]],{g:4}]}`,
    react: `function Siblings() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
      <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
    </div>
  );
}`,
    expectedElements: ['div', 'span', 'span', 'span', 'span', 'span', 'span', 'span', 'span', 'span', 'span'],
    semanticIntent: ['sibling-elements', 'list', 'sequence']
  },
  {
    id: 'edge-004',
    name: 'special characters',
    category: 'edge',
    complexity: 'trivial',
    description: 'text with special chars',
    tooey: `{r:[T,"Hello <world> & \"friends\"!"]}`,
    react: `function Special() { return <span>Hello &lt;world&gt; &amp; "friends"!</span>; }`,
    expectedElements: ['span'],
    semanticIntent: ['text-content', 'special-characters', 'escaping']
  },
  {
    id: 'edge-005',
    name: 'computed display',
    category: 'edge',
    complexity: 'moderate',
    description: 'display based on multiple state values',
    tooey: `{s:{a:5,b:3},r:[V,[[H,[[T,"A:"],[T,{$:"a"}]],{g:4}],[H,[[T,"B:"],[T,{$:"b"}]],{g:4}],[H,[[T,"Sum:"],[T,{$:"sum"}]],{g:4}]],{g:8}]}`,
    react: `function Computed() {
  const [a] = useState(5);
  const [b] = useState(3);
  const sum = a + b;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',gap:4}}><span>A:</span><span>{a}</span></div>
      <div style={{display:'flex',gap:4}}><span>B:</span><span>{b}</span></div>
      <div style={{display:'flex',gap:4}}><span>Sum:</span><span>{sum}</span></div>
    </div>
  );
}`,
    expectedElements: ['div', 'div', 'span', 'span', 'div', 'span', 'span', 'div', 'span', 'span'],
    expectedState: { a: 5, b: 3 },
    semanticIntent: ['computed-value', 'derived-state', 'calculation']
  }
];

// categorize for analysis
export const CASES_BY_CATEGORY = {
  basic: TEST_CASES.filter(c => c.category === 'basic'),
  forms: TEST_CASES.filter(c => c.category === 'forms'),
  navigation: TEST_CASES.filter(c => c.category === 'navigation'),
  data: TEST_CASES.filter(c => c.category === 'data'),
  interactive: TEST_CASES.filter(c => c.category === 'interactive'),
  layout: TEST_CASES.filter(c => c.category === 'layout'),
  edge: TEST_CASES.filter(c => c.category === 'edge')
};

export const CASES_BY_COMPLEXITY = {
  trivial: TEST_CASES.filter(c => c.complexity === 'trivial'),
  simple: TEST_CASES.filter(c => c.complexity === 'simple'),
  moderate: TEST_CASES.filter(c => c.complexity === 'moderate'),
  complex: TEST_CASES.filter(c => c.complexity === 'complex')
};
