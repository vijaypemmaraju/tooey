<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library ecosystem for llms

```
~39% fewer tokens than react | ~10kb minified | 0 deps
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
- [examples](./examples)

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
