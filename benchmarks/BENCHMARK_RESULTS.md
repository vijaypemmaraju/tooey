# Tooey vs React Benchmark Results

## Executive Summary

| Metric | Tooey | React | Difference |
|--------|-------|-------|------------|
| Token Count | 931 | 1588 | **41% fewer** |
| Bundle Size | ~10 KB | ~140 KB | **93% smaller** |
| Dependencies | 0 | 2+ | Zero deps |

## Token Efficiency

Tokens counted using GPT-4 tokenizer. Lower is better for LLM cost and context.

| Component | Tooey | React | Savings | Description |
|-----------|-------|-------|---------|-------------|
| Counter | 51 | 102 | **50%** | Simple counter with increment/decrement |
| Todo List | 87 | 194 | **55%** | Add and remove items |
| Form | 131 | 240 | **45%** | Multi-field form |
| Tabs | 96 | 116 | **17%** | Tab navigation |
| Modal | 127 | 178 | **29%** | Modal dialog with overlay |
| Data Table | 83 | 120 | **31%** | Table with mapped rows |
| Shopping Cart | 140 | 282 | **50%** | Cart with quantity controls |
| Wizard | 216 | 356 | **39%** | Multi-step form wizard |
| **Total** | **931** | **1588** | **41%** | - |

## Bundle Size

| Library | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
| Tooey | ~10 KB | ~4 KB | Zero dependencies |
| React + ReactDOM 18 | ~140 KB | ~45 KB | Production build |
| Preact | ~10 KB | ~4 KB | React alternative |
| Vue 3 | ~40 KB | ~16 KB | Runtime only |
| Svelte | ~2 KB | ~1 KB | Compiler-based |
| SolidJS | ~7 KB | ~3 KB | Fine-grained reactivity |

## Runtime Performance

All benchmarks run in JSDOM environment. Times in milliseconds unless noted.

### Initial Render

| List Size | Time (ms) | Items/ms |
|-----------|-----------|----------|
| 100 | 2.75 | 36 |
| 500 | 10.01 | 50 |
| 1000 | 19.63 | 51 |
| 5000 | 107.26 | 47 |

### State Updates

| Updates | Total (ms) | Per Update (μs) |
|---------|------------|-----------------|
| 100 | 1.38 | 13.82 |
| 1000 | 11.9 | 11.9 |
| 10000 | 68.9 | 6.89 |

### Signal Performance

| Subscribers | Updates | Total (ms) |
|-------------|---------|------------|
| 1 | 10000 | 0.7 |
| 10 | 10000 | 1.48 |
| 100 | 10000 | 10.02 |

### Batch Updates

| Signals | Updates | Batched (ms) | Unbatched (ms) | Improvement |
|---------|---------|--------------|----------------|-------------|
| 5 | 1000 | 0.84 | 0.54 | -56% |
| 10 | 1000 | 0.5 | 0.43 | -17% |
| 20 | 1000 | 0.76 | 0.65 | -17% |

## Key Advantages

### Token Efficiency (~41% fewer tokens)

| Feature | Tooey | React |
|---------|-------|-------|
| Component names | `V`, `H`, `T`, `B` | `div`, `span`, `button` |
| Flex column | `[V, [...]]` | `<div style={{display:'flex',flexDirection:'column'}}>` |
| Click handler | `{c:"count+"}` | `onClick={()=>setCount(c=>c+1)}` |
| Conditional | `{?:"show",t:[...],e:[...]}` | `{show ? (...) : (...)}` |
| List render | `{m:"items",a:[...]}` | `{items.map((x,i)=>(...))}` |

### Performance

- **Fine-grained reactivity**: Only updates what changed (no virtual DOM diffing)
- **O(1) state updates**: Direct signal propagation
- **Batching support**: Group multiple updates for efficiency
- **Minimal overhead**: ~10KB total with zero dependencies

## Example

**Tooey (51 tokens):**
```javascript
{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n"}],[B,"+",{c:"n"}]],{g:8}]],{g:8}]}
```

**React (102 tokens):**
```jsx
function Counter() {
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
}
```

## Running Benchmarks

```bash
npm run benchmark           # Full benchmark with report
npm run benchmark:test      # Performance tests via vitest
```

---
*Generated: 2026-01-16*
