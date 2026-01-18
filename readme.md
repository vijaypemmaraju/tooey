<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library ecosystem for llms

```
~75% fewer output tokens than react | ~10kb minified | 0 deps
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
| [@tooey/components](./packages/components) | shadcn-inspired component library | [![npm](https://img.shields.io/npm/v/@tooey/components)](https://www.npmjs.com/package/@tooey/components) |
| [@tooey/server](./packages/server) | server-side rendering with streaming | [![npm](https://img.shields.io/npm/v/@tooey/server)](https://www.npmjs.com/package/@tooey/server) |
| [@tooey/claude-plugin](./packages/claude-plugin) | claude code plugin | [![npm](https://img.shields.io/npm/v/@tooey/claude-plugin)](https://www.npmjs.com/package/@tooey/claude-plugin) |

## quick start

```bash
npm install @tooey/ui
```

```javascript
import { render, vs, hs, tx, bt } from '@tooey/ui';

render(document.getElementById('app'), {
  s: { n: 0 },
  r: [vs, [[tx, { $: 'n' }], [hs, [[bt, '-', { c: 'n-' }], [bt, '+', { c: 'n+' }]], { g: 8 }]], { g: 8 }]
});
```

## documentation

- [api reference](./API.md)
- [examples](./packages/ui/examples)

## claude code plugin

generate token-efficient ui specs directly in claude code.

### install

```bash
# add the tooey marketplace
claude plugin marketplace add https://raw.githubusercontent.com/vijaypemmaraju/tooey/main/marketplace.json

# install the plugin
claude plugin install tooey
```

### use

```
/tooey:ui a counter with increment and decrement buttons
/tooey:ui a login form with username and password fields
/tooey:ui a modal dialog with close button
```

see [@tooey/claude-plugin](./packages/claude-plugin) for more installation options.

## ecosystem

tooey is designed to be extensible while preserving token efficiency.

### design principles

1. **functions over registration** - custom components are just functions, no registry
2. **composition over configuration** - build complex from simple primitives
3. **short names stay short** - extensions follow abbreviation patterns
4. **tree-shakeable** - everything importable individually
5. **zero overhead** - extensions don't bloat base library
6. **llm-friendly** - patterns that ai can learn and generate efficiently

---

### function components

no registration needed. a component is just a function that returns a `NodeSpec`.

```typescript
type Component<P = {}> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

```javascript
// define a Card component
const Card = (props = {}, children = []) => [
  vs,
  children,
  { bg: '#fff', p: 16, r: 8, sh: '0 2px 4px rgba(0,0,0,0.1)', ...props }
];

// usage in spec (token-efficient)
{ r: [Card, [[tx, 'Hello']], { bg: '#f0f0f0' }] }

// or with helper
{ r: Card({ bg: '#f0f0f0' }, [[tx, 'Hello']]) }
```

#### component with state

```javascript
// components can define their own state keys
const Counter = (props = {}) => ({
  // state contribution (merged with parent spec.s)
  s: { count: props.initial || 0 },
  // component tree
  r: [hs, [
    [bt, '-', { c: 'count-' }],
    [tx, { $: 'count' }],
    [bt, '+', { c: 'count+' }]
  ], { g: 8, ...props }]
});

// usage - returns TooeySpec, can be spread or rendered directly
render(el, Counter({ initial: 5 }))
```

---

### component libraries

third-party packages export components following naming conventions.

#### naming convention

| full name | abbrev | rule |
|-----------|--------|------|
| Card | `Cd` | first + last consonant |
| Modal | `Mdl` | consonant cluster |
| Tabs | `Tbs` | plural → add 's' |
| Alert | `Al` | first 2 letters |
| Dropdown | `Dd` | first letter + key consonant |
| Tooltip | `Tt` | double first letter |

```javascript
import { Cd, Mdl, Al } from '@tooey/components';

{ r: [Cd, [[tx, 'Content']], { variant: 'outlined' }] }
```

---

### theming

#### option a: theme objects (zero overhead)

```javascript
// define theme
const theme = {
  card: { bg: '#fff', r: 8, sh: '0 2px 8px rgba(0,0,0,0.1)' },
  btn: { bg: '#007bff', fg: '#fff', r: 4, p: '8 16' },
  input: { bw: 1, bc: '#ccc', r: 4, p: 8 }
};

// apply via spread
[vs, [...], { ...theme.card, p: 24 }]
```

#### option b: theme provider (runtime)

```javascript
// new api
const { render, theme } = createTooey({
  colors: { primary: '#007bff', danger: '#dc3545' },
  spacing: { sm: 8, md: 16, lg: 24 },
  radius: { sm: 4, md: 8, lg: 16 }
});

// usage with $ prefix for theme values
[bt, 'Save', { bg: '$primary', p: '$md', r: '$sm' }]
```

---

### plugin system

lightweight hooks for cross-cutting concerns.

#### plugin interface

```typescript
interface TooeyPlugin {
  name: string;

  // lifecycle hooks
  onInit?(instance: TooeyInstance): void;
  onDestroy?(instance: TooeyInstance): void;

  // render hooks
  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
  afterRender?(el: HTMLElement, spec: NodeSpec): void;

  // state hooks
  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;

  // extend instance
  extend?: Record<string, Function>;
}
```

#### example plugins

```javascript
// router plugin
const routerPlugin = {
  name: 'router',
  onInit(instance) {
    instance.state.route = signal(location.pathname);
    window.addEventListener('popstate', () => {
      instance.set('route', location.pathname);
    });
  },
  extend: {
    navigate(path) {
      history.pushState({}, '', path);
      this.set('route', path);
    }
  }
};

// logger plugin
const loggerPlugin = {
  name: 'logger',
  onStateChange(key, oldVal, newVal) {
    console.log(`[${key}]`, oldVal, '→', newVal);
  }
};

// usage
const app = render(el, spec, { plugins: [routerPlugin, loggerPlugin] });
app.navigate('/about');
```

---

### slots & composition

for complex component composition.

```javascript
// component with slots
const Layout = (props, children) => {
  const { header, footer, ...rest } = props;
  return [vs, [
    header && [dv, [header], { cls: 'header' }],
    [dv, children, { cls: 'main', s: { flex: 1 } }],
    footer && [dv, [footer], { cls: 'footer' }]
  ], { h: '100vh', ...rest }];
};

// usage
[Layout, [
  [tx, 'Main content']
], {
  header: [hs, [[tx, 'Logo'], [tx, 'Nav']], { jc: 'sb' }],
  footer: [tx, '© 2024']
}]
```

---

### state modules

reusable state patterns.

```javascript
// define a state module
const formState = (fields) => ({
  s: {
    values: Object.fromEntries(fields.map(f => [f, ''])),
    errors: {},
    touched: {},
    submitting: false
  },
  actions: {
    setValue: (field, value) => ['values', '.', [field, value]],
    setError: (field, error) => ['errors', '.', [field, error]],
    submit: () => ['submitting', '!', true]
  }
});

// usage
const form = formState(['email', 'password']);
render(el, {
  s: { ...form.s, otherState: 123 },
  r: [vs, [
    [In, '', { v: { $: 'values.email' }, x: form.actions.setValue.bind(null, 'email') }],
    [bt, 'Submit', { c: form.actions.submit }]
  ]]
});
```

---

### computed state

derived values that update automatically.

```javascript
import { signal, computed, render } from '@tooey/ui';

const items = signal([{ price: 10 }, { price: 20 }]);
const total = computed(() => items().reduce((sum, i) => sum + i.price, 0));

// total() automatically updates when items changes
```

---

### async state

handle loading states elegantly.

```javascript
// async$ helper
function async$(promise, { loading, error }) {
  return {
    s: { data: null, loading: true, error: null },
    init: async (instance) => {
      try {
        const data = await promise;
        instance.set('data', data);
      } catch (e) {
        instance.set('error', e.message);
      } finally {
        instance.set('loading', false);
      }
    }
  };
}

// usage
const userSpec = async$(fetch('/api/user').then(r => r.json()), {
  loading: [tx, 'Loading...'],
  error: [tx, { $: 'error' }, { fg: 'red' }]
});

render(el, {
  s: userSpec.s,
  r: { '?': 'loading',
    t: userSpec.loading,
    e: { '?': 'error', t: userSpec.error, e: [tx, { $: 'data.name' }] }
  }
});
```

---

### type-safe props

typescript support for custom components.

```typescript
interface CardProps extends Props {
  variant?: 'filled' | 'outlined' | 'elevated';
  clickable?: boolean;
}

const Card: Component<CardProps> = (props = {}, children = []) => {
  const { variant = 'elevated', clickable, ...rest } = props;
  const styles = {
    filled: { bg: '#f5f5f5' },
    outlined: { bw: 1, bc: '#ddd' },
    elevated: { sh: '0 2px 8px rgba(0,0,0,0.1)' }
  };
  return [vs, children, {
    ...styles[variant],
    r: 8,
    p: 16,
    cur: clickable ? 'pointer' : undefined,
    ...rest
  }];
};
```

---

### token efficiency analysis

| pattern | tokens | notes |
|---------|--------|-------|
| `[Card, [...], {}]` | ~5 | same as built-in |
| `Card({}, [...])` | ~6 | slightly more |
| `{ ...theme.card }` | ~4 | very efficient |
| `{ bg: '$primary' }` | ~5 | same as hardcoded |
| `[Cd, [...]]` | ~3 | abbreviated |

all patterns maintain token efficiency comparable to core components.

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
