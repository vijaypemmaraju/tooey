import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { encode } from 'gpt-tokenizer';
import {
  render,
  V, H, D, T, B, Li, Ul,
  signal
} from '../src/tooey';

describe('Tooey vs React Benchmarks', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Token Efficiency', () => {
    const examples = [
      {
        name: 'Counter',
        tooey: `{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n"}],[B,"+",{c:"n"}]],{g:8}]],{g:8}]}`,
        react: `function Counter(){const[n,setN]=useState(0);return(<div style={{display:'flex',flexDirection:'column',gap:8}}><span>{n}</span><div style={{display:'flex',gap:8}}><button onClick={()=>setN(n-1)}>-</button><button onClick={()=>setN(n+1)}>+</button></div></div>);}`
      },
      {
        name: 'Todo List',
        tooey: `{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"add"}],[B,"+",{c:add}]],{g:8}],{m:"items",a:[H,[[T,"$item"],[B,"x",{c:del}]],{g:8}]}],{g:12}]}`,
        react: `function TodoList(){const[txt,setTxt]=useState('');const[items,setItems]=useState([]);const add=()=>{if(txt){setItems([...items,txt]);setTxt('');}};return(<div style={{display:'flex',flexDirection:'column',gap:12}}><div style={{display:'flex',gap:8}}><input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="add"/><button onClick={add}>+</button></div>{items.map((item,i)=>(<div key={i} style={{display:'flex',gap:8}}><span>{item}</span><button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button></div>))}</div>);}`
      },
      {
        name: 'Tabs',
        tooey: `{s:{tab:0},r:[V,[[H,[[B,"A",{c:"tab!0"}],[B,"B",{c:"tab!1"}]]],{?:"tab",is:0,t:[T,"A"]},{?:"tab",is:1,t:[T,"B"]}]]}`,
        react: `function Tabs(){const[tab,setTab]=useState(0);return(<div><div style={{display:'flex'}}><button onClick={()=>setTab(0)}>A</button><button onClick={()=>setTab(1)}>B</button></div>{tab===0&&<span>A</span>}{tab===1&&<span>B</span>}</div>);}`
      },
      {
        name: 'Toggle',
        tooey: `{s:{on:false},r:[V,[[B,"toggle",{c:"on~"}],[T,{$:"on"}]]]}`,
        react: `function Toggle(){const[on,setOn]=useState(false);return(<div><button onClick={()=>setOn(!on)}>toggle</button><span>{String(on)}</span></div>);}`
      },
      {
        name: 'Form Input',
        tooey: `{s:{v:""},r:[V,[[I,"",{v:{$:"v"},x:"v",ph:"type"}],[T,{$:"v"}]],{g:8}]}`,
        react: `function FormInput(){const[v,setV]=useState('');return(<div style={{display:'flex',flexDirection:'column',gap:8}}><input value={v} onChange={e=>setV(e.target.value)} placeholder="type"/><span>{v}</span></div>);}`
      },
      {
        name: 'List Render',
        tooey: `{s:{items:["a","b","c"]},r:[Ul,[{m:"items",a:[Li,"$item"]}]]}`,
        react: `function List(){const[items]=useState(["a","b","c"]);return(<ul>{items.map((item,i)=>(<li key={i}>{item}</li>))}</ul>);}`
      },
      {
        name: 'Modal',
        tooey: `{s:{open:false},r:[V,[[B,"open",{c:"open~"}],{?:"open",t:[D,[[T,"Modal"],[B,"close",{c:"open~"}]],{bg:"#000",p:16}]}]]}`,
        react: `function Modal(){const[open,setOpen]=useState(false);return(<div><button onClick={()=>setOpen(true)}>open</button>{open&&<div style={{background:'#000',padding:16}}><span>Modal</span><button onClick={()=>setOpen(false)}>close</button></div>}</div>);}`
      },
      {
        name: 'Nested Layout',
        tooey: `{r:[V,[[H,[[T,"A"],[T,"B"]],{g:8}],[H,[[T,"C"],[T,"D"]],{g:8}]],{g:16}]}`,
        react: `function Layout(){return(<div style={{display:'flex',flexDirection:'column',gap:16}}><div style={{display:'flex',gap:8}}><span>A</span><span>B</span></div><div style={{display:'flex',gap:8}}><span>C</span><span>D</span></div></div>);}`
      }
    ];

    it('should use fewer tokens than React for all examples', () => {
      let totalTooey = 0;
      let totalReact = 0;

      for (const ex of examples) {
        const tooeyTokens = encode(ex.tooey).length;
        const reactTokens = encode(ex.react).length;

        totalTooey += tooeyTokens;
        totalReact += reactTokens;

        // each example should use fewer tokens
        expect(tooeyTokens).toBeLessThan(reactTokens);
      }

      // overall should save at least 30% tokens
      const savings = (1 - totalTooey / totalReact) * 100;
      expect(savings).toBeGreaterThan(30);
    });

    it('Counter: should use ~35%+ fewer tokens', () => {
      const ex = examples.find(e => e.name === 'Counter')!;
      const tooeyTokens = encode(ex.tooey).length;
      const reactTokens = encode(ex.react).length;
      const savings = (1 - tooeyTokens / reactTokens) * 100;

      expect(savings).toBeGreaterThan(35);
    });

    it('Todo List: should use ~35%+ fewer tokens', () => {
      const ex = examples.find(e => e.name === 'Todo List')!;
      const tooeyTokens = encode(ex.tooey).length;
      const reactTokens = encode(ex.react).length;
      const savings = (1 - tooeyTokens / reactTokens) * 100;

      expect(savings).toBeGreaterThan(35);
    });

    it('should generate token comparison report', () => {
      console.log('\n=== Token Efficiency Report ===\n');
      console.log('| Component | Tooey | React | Savings |');
      console.log('|-----------|-------|-------|---------|');

      let totalTooey = 0;
      let totalReact = 0;

      for (const ex of examples) {
        const tooeyTokens = encode(ex.tooey).length;
        const reactTokens = encode(ex.react).length;
        const savings = Math.round((1 - tooeyTokens / reactTokens) * 100);

        totalTooey += tooeyTokens;
        totalReact += reactTokens;

        console.log(`| ${ex.name.padEnd(11)} | ${String(tooeyTokens).padEnd(5)} | ${String(reactTokens).padEnd(5)} | ${savings}% |`);
      }

      const totalSavings = Math.round((1 - totalTooey / totalReact) * 100);
      console.log(`| **TOTAL** | ${totalTooey} | ${totalReact} | **${totalSavings}%** |`);
      console.log(`\nAverage savings: ~${totalSavings}% fewer tokens\n`);

      expect(totalSavings).toBeGreaterThan(30);
    });
  });

  describe('Render Performance', () => {
    it('should render 100 items in under 100ms', () => {
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);

      const start = performance.now();
      const instance = render(container, {
        s: { items },
        r: [Ul, [{ m: 'items', a: [Li, '$item'] }]]
      });
      const elapsed = performance.now() - start;

      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(100);
      expect(container.querySelectorAll('li').length).toBe(100);

      instance.destroy();
    });

    it('should render 1000 items in under 500ms', () => {
      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

      const start = performance.now();
      const instance = render(container, {
        s: { items },
        r: [Ul, [{ m: 'items', a: [Li, '$item'] }]]
      });
      const elapsed = performance.now() - start;

      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(500);
      expect(container.querySelectorAll('li').length).toBe(1000);

      instance.destroy();
    });

    it('should handle rapid state updates', () => {
      const instance = render(container, {
        s: { count: 0 },
        r: [T, { $: 'count' }]
      });

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        instance.set('count', i);
      }
      const elapsed = performance.now() - start;

      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(200);
      expect(container.textContent).toBe('999');

      instance.destroy();
    });

    it('should handle complex nested structures', () => {
      const start = performance.now();

      const instance = render(container, {
        s: { tab: 0, items: ['a', 'b', 'c', 'd', 'e'] },
        r: [V, [
          [H, [
            [B, 'Tab 1', { c: 'tab!0' }],
            [B, 'Tab 2', { c: 'tab!1' }],
            [B, 'Tab 3', { c: 'tab!2' }]
          ], { g: 8 }],
          { '?': 'tab', is: 0, t: [V, [
            [T, 'Tab 1 Content', { fw: 'bold' }],
            { m: 'items', a: [D, [
              [T, '$index: '],
              [T, '$item']
            ], { p: 8, bg: '#f0f0f0' }] }
          ], { g: 8 }] },
          { '?': 'tab', is: 1, t: [T, 'Tab 2 Content'] },
          { '?': 'tab', is: 2, t: [T, 'Tab 3 Content'] }
        ], { g: 16 }]
      });

      const elapsed = performance.now() - start;
      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(100);

      // verify structure
      expect(container.querySelectorAll('button').length).toBe(3);

      instance.destroy();
    });
  });

  describe('Signal Performance', () => {
    it('should handle 10000 signal updates efficiently', () => {
      const count = signal(-1); // start at -1 so all 0-9999 are new values
      let effectRuns = 0;

      // create a subscriber
      count.sub(() => effectRuns++);

      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        count.set(i);
      }
      const elapsed = performance.now() - start;

      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(200);
      // signals only notify when value changes, so all 10000 should trigger
      expect(effectRuns).toBe(10000);
    });

    it('should handle many subscribers efficiently', () => {
      const count = signal(-1); // start at -1 so all 0-99 are new values
      const subscribers: (() => void)[] = [];
      let totalCalls = 0;

      // add 100 subscribers
      for (let i = 0; i < 100; i++) {
        subscribers.push(count.sub(() => totalCalls++));
      }

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        count.set(i);
      }
      const elapsed = performance.now() - start;

      // increased threshold for ci environments
      expect(elapsed).toBeLessThan(100);
      expect(totalCalls).toBe(100 * 100); // 100 updates * 100 subscribers

      // cleanup
      subscribers.forEach(unsub => unsub());
    });
  });

  describe('Memory Efficiency', () => {
    it('should cleanup properly after destroy', () => {
      const instance = render(container, {
        s: { items: Array.from({ length: 100 }, (_, i) => `Item ${i}`) },
        r: [Ul, [{ m: 'items', a: [Li, '$item'] }]]
      });

      expect(container.querySelectorAll('li').length).toBe(100);

      instance.destroy();

      expect(container.innerHTML).toBe('');
    });

    it('should handle create/destroy cycles', () => {
      for (let i = 0; i < 100; i++) {
        const instance = render(container, {
          s: { n: i },
          r: [T, { $: 'n' }]
        });
        expect(container.textContent).toBe(String(i));
        instance.destroy();
      }

      expect(container.innerHTML).toBe('');
    });
  });
});
