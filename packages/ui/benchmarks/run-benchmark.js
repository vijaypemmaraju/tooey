#!/usr/bin/env node

/**
 * Comprehensive Benchmark: Tooey vs React
 *
 * Measures:
 * 1. Token efficiency (for LLM usage)
 * 2. Bundle size comparison
 * 3. Runtime performance (using JSDOM)
 */

import { encode } from 'gpt-tokenizer';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup JSDOM for performance benchmarks
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  runScripts: 'dangerously',
  pretendToBeVisual: true
});
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;

// Import tooey after setting up DOM (use built ESM module)
const { render, vs, hs, dv, tx, bt, li, ul, signal, batch } = await import('../dist/tooey.esm.js');

// ============ Token Efficiency Examples ============

const tokenExamples = [
  {
    name: 'Counter',
    description: 'Simple counter with increment/decrement',
    tooey: `{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n"}],[B,"+",{c:"n"}]],{g:8}]],{g:8}]}`,
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
}`
  },
  {
    name: 'Todo List',
    description: 'Add and remove items',
    tooey: `{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"add..."}],[B,"+",{c:add}]],{g:8}],{m:"items",a:[H,[[T,"$item"],[B,"x",{c:del}]],{g:8}]}],{g:12}]}`,
    react: `function TodoList() {
  const [txt, setTxt] = useState('');
  const [items, setItems] = useState([]);
  const add = () => { if(txt){setItems([...items,txt]);setTxt('');} };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="add..." />
        <button onClick={add}>+</button>
      </div>
      {items.map((item,i)=>(
        <div key={i} style={{display:'flex',gap:8}}>
          <span>{item}</span>
          <button onClick={()=>setItems(items.filter((_,j)=>j!==i))}>x</button>
        </div>
      ))}
    </div>
  );
}`
  },
  {
    name: 'Form',
    description: 'Multi-field form',
    tooey: `{s:{name:"",email:"",pw:""},r:[V,[[V,[[T,"Name"],[I,"",{ph:"name",v:{$:"name"},x:"name"}]],{g:4}],[V,[[T,"Email"],[I,"",{type:"email",ph:"email",v:{$:"email"},x:"email"}]],{g:4}],[V,[[T,"Password"],[I,"",{type:"password",v:{$:"pw"},x:"pw"}]],{g:4}],[B,"Submit",{c:sub}]],{g:16}]}`,
    react: `function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>Name</label>
        <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>Email</label>
        <input type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label>Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      </div>
      <button onClick={sub}>Submit</button>
    </div>
  );
}`
  },
  {
    name: 'Tabs',
    description: 'Tab navigation',
    tooey: `{s:{tab:0},r:[V,[[H,[[B,"Profile",{c:"tab!0"}],[B,"Settings",{c:"tab!1"}],[B,"About",{c:"tab!2"}]]],{?:"tab",is:0,t:[T,"Profile content"]},{?:"tab",is:1,t:[T,"Settings content"]},{?:"tab",is:2,t:[T,"About content"]}]]}`,
    react: `function Tabs() {
  const [tab, setTab] = useState(0);
  const content = ['Profile content', 'Settings content', 'About content'];
  return (
    <div>
      <div style={{display:'flex'}}>
        <button onClick={()=>setTab(0)}>Profile</button>
        <button onClick={()=>setTab(1)}>Settings</button>
        <button onClick={()=>setTab(2)}>About</button>
      </div>
      <span>{content[tab]}</span>
    </div>
  );
}`
  },
  {
    name: 'Modal',
    description: 'Modal dialog with overlay',
    tooey: `{s:{open:false},r:[V,[[B,"Open Modal",{c:"open~"}],{?:"open",t:[D,[[D,[[T,"Modal Title",{fw:600}],[T,"Modal content goes here"],[B,"Close",{c:"open~"}]],{bg:"#1a1a1a",p:24,r:8,g:12}]],{pos:"fix",t:0,l:0,w:"100%",h:"100%",bg:"rgba(0,0,0,0.7)",ai:"c",jc:"c"}]}]]}`,
    react: `function Modal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(true)}>Open Modal</button>
      {open && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',
          background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#1a1a1a',padding:24,borderRadius:8}}>
            <h3 style={{fontWeight:600}}>Modal Title</h3>
            <p>Modal content goes here</p>
            <button onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}`
  },
  {
    name: 'Data Table',
    description: 'Table with mapped rows',
    tooey: `{s:{data:[{n:"Alice",v:28},{n:"Bob",v:34},{n:"Carol",v:29}]},r:[Tb,[[Th,[[Tr,[[Tc,"Name"],[Tc,"Age"]]]]],[Tbd,[{m:"data",a:[Tr,[[Td,"$item.n"],[Td,"$item.v"]]]}]]]]}`,
    react: `function DataTable() {
  const [data] = useState([{n:"Alice",v:28},{n:"Bob",v:34},{n:"Carol",v:29}]);
  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Age</th></tr>
      </thead>
      <tbody>
        {data.map((row,i)=>(
          <tr key={i}><td>{row.n}</td><td>{row.v}</td></tr>
        ))}
      </tbody>
    </table>
  );
}`
  },
  {
    name: 'Shopping Cart',
    description: 'Cart with quantity controls',
    tooey: `{s:{items:[{n:"Widget",p:25,q:1},{n:"Gadget",p:35,q:2}]},r:[V,[{m:"items",a:[H,[[T,"$item.n"],[H,[[B,"-",{c:dec}],[T,"$item.q"],[B,"+",{c:inc}]],{g:4,ai:"c"}],[T,"$item.p"]],{jc:"sb",p:"8px 0"}]},[H,[[T,"Total:"],[T,{$:"total"}]],{jc:"sb",fw:600}]],{g:8}]}`,
    react: `function Cart() {
  const [items, setItems] = useState([{n:"Widget",p:25,q:1},{n:"Gadget",p:35,q:2}]);
  const updateQty = (i,d) => setItems(items.map((x,j)=>j===i?{...x,q:Math.max(0,x.q+d)}:x));
  const total = items.reduce((s,x)=>s+x.p*x.q,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {items.map((item,i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
          <span>{item.n}</span>
          <div style={{display:'flex',gap:4,alignItems:'center'}}>
            <button onClick={()=>updateQty(i,-1)}>-</button>
            <span>{item.q}</span>
            <button onClick={()=>updateQty(i,1)}>+</button>
          </div>
          <span>{item.p}</span>
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'space-between',fontWeight:600}}>
        <span>Total:</span><span>{total}</span>
      </div>
    </div>
  );
}`
  },
  {
    name: 'Wizard',
    description: 'Multi-step form wizard',
    tooey: `{s:{step:0,name:"",email:""},r:[V,[[H,[[D,"1",{cls:"step"}],[D,"2",{cls:"step"}],[D,"3",{cls:"step"}]],{g:8}],{?:"step",is:0,t:[V,[[T,"Step 1: Name"],[I,"",{v:{$:"name"},x:"name",ph:"Your name"}]],{g:8}]},{?:"step",is:1,t:[V,[[T,"Step 2: Email"],[I,"",{v:{$:"email"},x:"email",type:"email"}]],{g:8}]},{?:"step",is:2,t:[V,[[T,"Complete!"],[T,"Thanks for signing up."]],{g:8}]},[H,[[B,"Back",{c:"step-"}],[B,"Next",{c:"step+"}]],{g:8,jc:"fe"}]],{g:16}]}`,
    react: `function Wizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',gap:8}}>
        {[1,2,3].map(n=><div key={n} className="step">{n}</div>)}
      </div>
      {step===0 && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <span>Step 1: Name</span>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        </div>
      )}
      {step===1 && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <span>Step 2: Email</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
      )}
      {step===2 && (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <span>Complete!</span>
          <span>Thanks for signing up.</span>
        </div>
      )}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button onClick={()=>setStep(s=>s-1)}>Back</button>
        <button onClick={()=>setStep(s=>s+1)}>Next</button>
      </div>
    </div>
  );
}`
  }
];

// Bundle size data (known published sizes)
const bundleSizes = [
  { name: 'Tooey', minified: '~10 KB', gzipped: '~4 KB', note: 'Zero dependencies' },
  { name: 'React + ReactDOM 18', minified: '~140 KB', gzipped: '~45 KB', note: 'Production build' },
  { name: 'Preact', minified: '~10 KB', gzipped: '~4 KB', note: 'React alternative' },
  { name: 'Vue 3', minified: '~40 KB', gzipped: '~16 KB', note: 'Runtime only' },
  { name: 'Svelte', minified: '~2 KB', gzipped: '~1 KB', note: 'Compiler-based' },
  { name: 'SolidJS', minified: '~7 KB', gzipped: '~3 KB', note: 'Fine-grained reactivity' }
];

// ============ Token Benchmarks ============

function runTokenBenchmarks() {
  console.log('\n' + '='.repeat(60));
  console.log('TOKEN EFFICIENCY BENCHMARK');
  console.log('='.repeat(60));
  console.log('\nTokens counted using GPT-4 tokenizer (tiktoken)\n');
  console.log('| Component     | Tooey | React | Savings |');
  console.log('|---------------|-------|-------|---------|');

  const results = [];
  let totalTooey = 0;
  let totalReact = 0;

  for (const ex of tokenExamples) {
    const tooeyTokens = encode(ex.tooey).length;
    const reactTokens = encode(ex.react).length;
    const savings = Math.round((1 - tooeyTokens / reactTokens) * 100);

    results.push({
      name: ex.name,
      description: ex.description,
      tooeyTokens,
      reactTokens,
      savings
    });

    totalTooey += tooeyTokens;
    totalReact += reactTokens;

    console.log(`| ${ex.name.padEnd(13)} | ${String(tooeyTokens).padEnd(5)} | ${String(reactTokens).padEnd(5)} | ${savings}% |`);
  }

  const overallSavings = Math.round((1 - totalTooey / totalReact) * 100);
  console.log(`| ${'TOTAL'.padEnd(13)} | ${String(totalTooey).padEnd(5)} | ${String(totalReact).padEnd(5)} | ${overallSavings}% |`);
  console.log(`\n=> Average: ~${overallSavings}% fewer tokens than React\n`);

  return { results, totalTooey, totalReact, overallSavings };
}

// ============ Performance Benchmarks ============

function runPerformanceBenchmarks() {
  console.log('='.repeat(60));
  console.log('RUNTIME PERFORMANCE BENCHMARK');
  console.log('='.repeat(60));
  console.log('\nBenchmarks run in JSDOM environment\n');

  const container = document.getElementById('root');
  const perfResults = [];

  // Benchmark 1: Initial render with varying list sizes
  console.log('1. Initial Render Performance');
  console.log('   | List Size | Time (ms) | Items/ms |');
  console.log('   |-----------|-----------|----------|');

  for (const size of [100, 500, 1000, 5000]) {
    const items = Array.from({ length: size }, (_, i) => `Item ${i}`);
    const iterations = Math.max(1, Math.floor(100 / (size / 100)));

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const instance = render(container, {
        s: { items },
        r: [ul, [{ m: 'items', a: [li, '$item'] }]]
      });
      instance.destroy();
    }
    const elapsed = (performance.now() - start) / iterations;
    const itemsPerMs = Math.round(size / elapsed);

    console.log(`   | ${String(size).padEnd(9)} | ${elapsed.toFixed(2).padStart(9)} | ${String(itemsPerMs).padStart(8)} |`);

    perfResults.push({
      benchmark: 'Initial Render',
      size,
      timeMs: Math.round(elapsed * 100) / 100,
      itemsPerMs
    });
  }

  // Benchmark 2: State updates
  console.log('\n2. State Update Performance');
  console.log('   | Updates | Total (ms) | Per Update (μs) |');
  console.log('   |---------|------------|-----------------|');

  for (const updates of [100, 1000, 10000]) {
    const instance = render(container, {
      s: { count: 0 },
      r: [tx, { $: 'count' }]
    });

    const start = performance.now();
    for (let i = 0; i < updates; i++) {
      instance.set('count', i);
    }
    const elapsed = performance.now() - start;
    const perUpdate = (elapsed / updates) * 1000; // microseconds

    console.log(`   | ${String(updates).padEnd(7)} | ${elapsed.toFixed(2).padStart(10)} | ${perUpdate.toFixed(2).padStart(15)} |`);

    perfResults.push({
      benchmark: 'State Update',
      count: updates,
      totalMs: Math.round(elapsed * 100) / 100,
      perUpdateUs: Math.round(perUpdate * 100) / 100
    });

    instance.destroy();
  }

  // Benchmark 3: Complex structure render
  console.log('\n3. Complex Structure Render');
  console.log('   | Iterations | Avg Time (ms) |');
  console.log('   |------------|---------------|');

  const complexIterations = 100;
  const start3 = performance.now();
  for (let i = 0; i < complexIterations; i++) {
    const instance = render(container, {
      s: { tab: 0, items: ['a', 'b', 'c', 'd', 'e'] },
      r: [vs, [
        [hs, [
          [bt, 'Tab 1', { c: 'tab!0' }],
          [bt, 'Tab 2', { c: 'tab!1' }],
          [bt, 'Tab 3', { c: 'tab!2' }]
        ], { g: 8 }],
        { '?': 'tab', is: 0, t: [vs, [
          [tx, 'Tab 1 Content', { fw: 'bold' }],
          { m: 'items', a: [dv, [[tx, '$index: '], [tx, '$item']], { p: 8, bg: '#f0f0f0' }] }
        ], { g: 8 }] },
        { '?': 'tab', is: 1, t: [tx, 'Tab 2 Content'] },
        { '?': 'tab', is: 2, t: [tx, 'Tab 3 Content'] }
      ], { g: 16 }]
    });
    instance.destroy();
  }
  const avgComplex = (performance.now() - start3) / complexIterations;
  console.log(`   | ${String(complexIterations).padEnd(10)} | ${avgComplex.toFixed(3).padStart(13)} |`);

  perfResults.push({
    benchmark: 'Complex Structure',
    iterations: complexIterations,
    avgMs: Math.round(avgComplex * 1000) / 1000
  });

  // Benchmark 4: Signal performance
  console.log('\n4. Signal Performance');
  console.log('   | Subscribers | Updates | Total (ms) |');
  console.log('   |-------------|---------|------------|');

  for (const subs of [1, 10, 100]) {
    const sig = signal(0);
    const unsubs = [];

    for (let i = 0; i < subs; i++) {
      unsubs.push(sig.sub(() => {}));
    }

    const updates = 10000;
    const start = performance.now();
    for (let i = 0; i < updates; i++) {
      sig.set(i);
    }
    const elapsed = performance.now() - start;

    console.log(`   | ${String(subs).padEnd(11)} | ${String(updates).padEnd(7)} | ${elapsed.toFixed(2).padStart(10)} |`);

    perfResults.push({
      benchmark: 'Signal Updates',
      subscribers: subs,
      updates,
      totalMs: Math.round(elapsed * 100) / 100
    });

    unsubs.forEach(fn => fn());
  }

  // Benchmark 5: Batch updates
  console.log('\n5. Batch Update Performance');
  console.log('   | Signals | Updates | Batched (ms) | Unbatched (ms) | Improvement |');
  console.log('   |---------|---------|--------------|----------------|-------------|');

  for (const signalCount of [5, 10, 20]) {
    const signals = Array.from({ length: signalCount }, () => signal(0));
    const updates = 1000;

    // Batched
    const batchedStart = performance.now();
    for (let u = 0; u < updates; u++) {
      batch(() => {
        signals.forEach((s, i) => s.set(u + i));
      });
    }
    const batchedTime = performance.now() - batchedStart;

    // Unbatched
    const unbatchedStart = performance.now();
    for (let u = 0; u < updates; u++) {
      signals.forEach((s, i) => s.set(u + i + updates));
    }
    const unbatchedTime = performance.now() - unbatchedStart;

    const improvement = ((unbatchedTime - batchedTime) / unbatchedTime * 100).toFixed(0);

    console.log(`   | ${String(signalCount).padEnd(7)} | ${String(updates).padEnd(7)} | ${batchedTime.toFixed(2).padStart(12)} | ${unbatchedTime.toFixed(2).padStart(14)} | ${improvement}% |`);

    perfResults.push({
      benchmark: 'Batch Updates',
      signals: signalCount,
      updates,
      batchedMs: Math.round(batchedTime * 100) / 100,
      unbatchedMs: Math.round(unbatchedTime * 100) / 100,
      improvement: parseInt(improvement)
    });
  }

  console.log('\n');

  return perfResults;
}

// ============ Generate Markdown Report ============

function generateMarkdown(tokenData, perfData) {
  const { results, totalTooey, totalReact, overallSavings } = tokenData;

  let md = `# Tooey vs React Benchmark Results

## Executive Summary

| Metric | Tooey | React | Difference |
|--------|-------|-------|------------|
| Token Count | ${totalTooey} | ${totalReact} | **${overallSavings}% fewer** |
| Bundle Size | ~10 KB | ~140 KB | **93% smaller** |
| Dependencies | 0 | 2+ | Zero deps |

## Token Efficiency

Tokens counted using GPT-4 tokenizer. Lower is better for LLM cost and context.

| Component | Tooey | React | Savings | Description |
|-----------|-------|-------|---------|-------------|
`;

  for (const r of results) {
    md += `| ${r.name} | ${r.tooeyTokens} | ${r.reactTokens} | **${r.savings}%** | ${r.description} |\n`;
  }
  md += `| **Total** | **${totalTooey}** | **${totalReact}** | **${overallSavings}%** | - |\n`;

  md += `
## Bundle Size

| Library | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
`;

  for (const b of bundleSizes) {
    md += `| ${b.name} | ${b.minified} | ${b.gzipped} | ${b.note} |\n`;
  }

  // Performance section
  md += `
## Runtime Performance

All benchmarks run in JSDOM environment. Times in milliseconds unless noted.

### Initial Render

| List Size | Time (ms) | Items/ms |
|-----------|-----------|----------|
`;

  const renderResults = perfData.filter(p => p.benchmark === 'Initial Render');
  for (const r of renderResults) {
    md += `| ${r.size} | ${r.timeMs} | ${r.itemsPerMs} |\n`;
  }

  md += `
### State Updates

| Updates | Total (ms) | Per Update (μs) |
|---------|------------|-----------------|
`;

  const updateResults = perfData.filter(p => p.benchmark === 'State Update');
  for (const r of updateResults) {
    md += `| ${r.count} | ${r.totalMs} | ${r.perUpdateUs} |\n`;
  }

  md += `
### Signal Performance

| Subscribers | Updates | Total (ms) |
|-------------|---------|------------|
`;

  const signalResults = perfData.filter(p => p.benchmark === 'Signal Updates');
  for (const r of signalResults) {
    md += `| ${r.subscribers} | ${r.updates} | ${r.totalMs} |\n`;
  }

  md += `
### Batch Updates

| Signals | Updates | Batched (ms) | Unbatched (ms) | Improvement |
|---------|---------|--------------|----------------|-------------|
`;

  const batchResults = perfData.filter(p => p.benchmark === 'Batch Updates');
  for (const r of batchResults) {
    md += `| ${r.signals} | ${r.updates} | ${r.batchedMs} | ${r.unbatchedMs} | ${r.improvement}% |\n`;
  }

  md += `
## Key Advantages

### Token Efficiency (~${overallSavings}% fewer tokens)

| Feature | Tooey | React |
|---------|-------|-------|
| Component names | \`vs\`, \`hs\`, \`tx\`, \`bt\` | \`div\`, \`span\`, \`button\` |
| Flex column | \`[vs, [...]]\` | \`<div style={{display:'flex',flexDirection:'column'}}>\` |
| Click handler | \`{c:"count+"}\` | \`onClick={()=>setCount(c=>c+1)}\` |
| Conditional | \`{?:"show",t:[...],e:[...]}\` | \`{show ? (...) : (...)}\` |
| List render | \`{m:"items",a:[...]}\` | \`{items.map((x,i)=>(...))}\` |

### Performance

- **Fine-grained reactivity**: Only updates what changed (no virtual DOM diffing)
- **O(1) state updates**: Direct signal propagation
- **Batching support**: Group multiple updates for efficiency
- **Minimal overhead**: ~10KB total with zero dependencies

## Example

**Tooey (${results[0].tooeyTokens} tokens):**
\`\`\`javascript
${tokenExamples[0].tooey}
\`\`\`

**React (${results[0].reactTokens} tokens):**
\`\`\`jsx
${tokenExamples[0].react}
\`\`\`

## Running Benchmarks

\`\`\`bash
npm run benchmark           # Full benchmark with report
npm run benchmark:test      # Performance tests via vitest
\`\`\`

---
*Generated: ${new Date().toISOString().split('T')[0]}*
`;

  return md;
}

// ============ Main ============

console.log('\n🚀 Running Tooey vs React Benchmarks...\n');

const tokenData = runTokenBenchmarks();
const perfData = runPerformanceBenchmarks();

// Generate and save report
const markdown = generateMarkdown(tokenData, perfData);
const outputPath = path.join(__dirname, 'BENCHMARK_RESULTS.md');
fs.writeFileSync(outputPath, markdown);

console.log('='.repeat(60));
console.log(`✅ Benchmark complete! Report saved to: benchmarks/BENCHMARK_RESULTS.md`);
console.log('='.repeat(60));

export { runTokenBenchmarks, runPerformanceBenchmarks, generateMarkdown, tokenExamples, bundleSizes };
