<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library ecosystem for llms

```
~41% fewer tokens than react | ~10kb minified | 0 deps
```

## benchmarks

comprehensive benchmarks comparing tooey vs react are available in [`packages/ui/benchmarks/BENCHMARK_RESULTS.md`](./packages/ui/benchmarks/BENCHMARK_RESULTS.md).

### token efficiency

tokens counted using gpt-4 tokenizer. lower is better for llm cost and context.

| component | tooey | react | savings |
|-----------|-------|-------|---------|
| counter | 51 | 102 | **50%** |
| todo list | 87 | 194 | **55%** |
| form | 131 | 240 | **45%** |
| tabs | 96 | 116 | **17%** |
| modal | 127 | 178 | **29%** |
| data table | 83 | 120 | **31%** |
| shopping cart | 140 | 282 | **50%** |
| wizard | 216 | 356 | **39%** |
| **total** | **931** | **1588** | **41%** |

### runtime performance

benchmarks run in jsdom environment.

| benchmark | result |
|-----------|--------|
| render 1000 items | ~20ms |
| 10,000 state updates | ~69ms (6.9μs/update) |
| signal with 100 subscribers | ~10ms for 10k updates |

### bundle size

| library | minified | gzipped |
|---------|----------|---------|
| tooey | ~10 KB | ~4 KB |
| react + reactdom | ~140 KB | ~45 KB |
| preact | ~10 KB | ~4 KB |
| vue 3 | ~40 KB | ~16 KB |

run benchmarks locally:

```bash
cd packages/ui
pnpm benchmark           # full benchmark with report
pnpm benchmark:test      # performance tests via vitest
```

## packages

| package | description | version |
|---------|-------------|---------|
| [@tooey/ui](./packages/ui) | core library | [![npm](https://img.shields.io/npm/v/@tooey/ui)](https://www.npmjs.com/package/@tooey/ui) |
| [@tooey/components](./packages/components) | component library | coming soon |

## quick start

```bash
npm install @tooey/ui
```

```javascript
import { render, V, H, T, B } from '@tooey/ui';

render(document.getElementById('app'), {
  s: { n: 0 },
  r: [V, [[T, { $: 'n' }], [H, [[B, '-', { c: 'n-' }], [B, '+', { c: 'n+' }]], { g: 8 }]], { g: 8 }]
});
```

## documentation

- [api reference](./API.md)
- [ecosystem design](./ECOSYSTEM.md)
- [examples](./packages/ui/examples)

## development

this is a pnpm monorepo.

```bash
# install dependencies
pnpm install

# build all packages
pnpm build

# run tests
pnpm test

# run in watch mode
pnpm dev
```

## license

mit
