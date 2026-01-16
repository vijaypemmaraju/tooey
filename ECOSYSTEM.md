# tooey ecosystem design

design document for making tooey extensible while preserving token efficiency.

## design principles

1. **functions over registration** - custom components are just functions, no registry
2. **composition over configuration** - build complex from simple primitives
3. **short names stay short** - extensions follow abbreviation patterns
4. **tree-shakeable** - everything importable individually
5. **zero overhead** - extensions don't bloat base library
6. **llm-friendly** - patterns that ai can learn and generate efficiently

---

## implementation progress

| phase | description | status |
|-------|-------------|--------|
| phase 0 | monorepo setup | ✅ complete |
| phase 1 | function components | ✅ complete |
| phase 2 | theming | ⬜ not started |
| phase 3 | plugins | ⬜ not started |
| phase 4 | computed & async | ⬜ not started |

### phase 0: monorepo setup ✅

- [x] install pnpm and create workspace config
- [x] create packages/ directory structure
- [x] move @tooey/ui to packages/ui/
- [x] create shared tsconfig.base.json
- [x] update ci/cd for monorepo
- [x] scaffold @tooey/components package
- [x] test cross-package imports

### phase 1: function components ✅

- [x] detect function as first element in NodeSpec
- [x] call function with (props, children)
- [x] recursively render returned spec
- [x] update types (Component, FunctionNodeSpec)
- [x] add tests (10 tests covering all use cases)
- [x] update documentation (readme.md, api.md)

### phase 2: theming ⬜

- [ ] add optional theme parameter to render
- [ ] resolve `$token` values in props
- [ ] export createTooey factory

### phase 3: plugins ⬜

- [ ] add plugins option to render
- [ ] implement lifecycle hooks
- [ ] implement extend for instance methods

### phase 4: computed & async ⬜

- [ ] export computed helper
- [ ] export async$ helper
- [ ] update effect tracking

---

## 1. custom components (function components)

no registration needed. a component is just a function that returns a `NodeSpec`.

### api

```typescript
type Component<P = {}> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### example

```javascript
// define a Card component
const Card = (props = {}, children = []) => [
  V,
  children,
  { bg: '#fff', p: 16, r: 8, sh: '0 2px 4px rgba(0,0,0,0.1)', ...props }
];

// usage in spec (token-efficient)
{ r: [Card, [[T, 'Hello']], { bg: '#f0f0f0' }] }

// or with helper
{ r: Card({ bg: '#f0f0f0' }, [[T, 'Hello']]) }
```

### component with state

```javascript
// components can define their own state keys
const Counter = (props = {}) => ({
  // state contribution (merged with parent spec.s)
  s: { count: props.initial || 0 },
  // component tree
  r: [H, [
    [B, '-', { c: 'count-' }],
    [T, { $: 'count' }],
    [B, '+', { c: 'count+' }]
  ], { g: 8, ...props }]
});

// usage - returns TooeySpec, can be spread or rendered directly
render(el, Counter({ initial: 5 }))
```

### implementation (complete)

```typescript
// in createElement, detect function components
function createElement(spec, ctx, itemContext) {
  // if first element is a function, call it
  if (Array.isArray(spec) && typeof spec[0] === 'function') {
    const [Comp, content, props] = spec;
    const children = Array.isArray(content) ? content : undefined;
    const resolved = Comp(props, children);
    return createElement(resolved, ctx, itemContext);
  }
  // ... existing logic
}
```

---

## 2. component libraries (packages)

third-party packages export components following naming conventions.

### package structure

```
@tooey/components/
├── src/
│   ├── Card.ts      → Cd
│   ├── Modal.ts     → Mdl
│   ├── Tabs.ts      → Tbs
│   ├── Alert.ts     → Al
│   └── index.ts
├── package.json
└── README.md
```

### naming convention

| full name | abbrev | rule |
|-----------|--------|------|
| Card | `Cd` | first + last consonant |
| Modal | `Mdl` | consonant cluster |
| Tabs | `Tbs` | plural → add 's' |
| Alert | `Al` | first 2 letters |
| Dropdown | `Dd` | first letter + key consonant |
| Tooltip | `Tt` | double first letter |

### usage

```javascript
import { Cd, Mdl, Al } from '@tooey/components';

{ r: [Cd, [[T, 'Content']], { variant: 'outlined' }] }
```

---

## 3. theming

### option a: theme objects (zero overhead)

```javascript
// define theme
const theme = {
  card: { bg: '#fff', r: 8, sh: '0 2px 4px rgba(0,0,0,0.1)' },
  btn: { bg: '#007bff', fg: '#fff', r: 4, p: '8 16' },
  input: { bw: 1, bc: '#ccc', r: 4, p: 8 }
};

// apply via spread
[V, [...], { ...theme.card, p: 24 }]
```

### option b: theme provider (runtime)

```javascript
// new api
const { render, theme } = createTooey({
  colors: { primary: '#007bff', danger: '#dc3545' },
  spacing: { sm: 8, md: 16, lg: 24 },
  radius: { sm: 4, md: 8, lg: 16 }
});

// usage with $ prefix for theme values
[B, 'Save', { bg: '$primary', p: '$md', r: '$sm' }]
```

### implementation

```typescript
// theme resolution in applyStyles
function applyStyles(el, props, theme) {
  Object.entries(props).forEach(([key, val]) => {
    if (typeof val === 'string' && val.startsWith('$')) {
      val = resolveThemeValue(val.slice(1), theme);
    }
    // ... apply style
  });
}
```

---

## 4. plugin system

lightweight hooks for cross-cutting concerns.

### plugin interface

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

### example plugins

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

## 5. slots & composition

for complex component composition.

### slot api

```javascript
// component with slots
const Layout = (props, children) => {
  const { header, footer, ...rest } = props;
  return [V, [
    header && [D, [header], { cls: 'header' }],
    [D, children, { cls: 'main', s: { flex: 1 } }],
    footer && [D, [footer], { cls: 'footer' }]
  ], { h: '100vh', ...rest }];
};

// usage
[Layout, [
  [T, 'Main content']
], {
  header: [H, [[T, 'Logo'], [T, 'Nav']], { jc: 'sb' }],
  footer: [T, '© 2024']
}]
```

---

## 6. state modules

reusable state patterns.

### api

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
  r: [V, [
    [I, '', { v: { $: 'values.email' }, x: form.actions.setValue.bind(null, 'email') }],
    [B, 'Submit', { c: form.actions.submit }]
  ]]
});
```

---

## 7. computed state

derived values that update automatically.

### api

```typescript
// new export
function computed<T>(fn: () => T): Signal<T>;
```

### usage

```javascript
import { signal, computed, render } from '@tooey/ui';

const items = signal([{ price: 10 }, { price: 20 }]);
const total = computed(() => items().reduce((sum, i) => sum + i.price, 0));

// total() automatically updates when items changes
```

---

## 8. async state

handle loading states elegantly.

### api

```javascript
// new helper
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
```

### usage

```javascript
const userSpec = async$(fetch('/api/user').then(r => r.json()), {
  loading: [T, 'Loading...'],
  error: [T, { $: 'error' }, { fg: 'red' }]
});

render(el, {
  s: userSpec.s,
  r: { '?': 'loading',
    t: userSpec.loading,
    e: { '?': 'error', t: userSpec.error, e: [T, { $: 'data.name' }] }
  }
});
```

---

## 9. type-safe props

typescript support for custom components.

### example

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
  return [V, children, {
    ...styles[variant],
    r: 8,
    p: 16,
    cur: clickable ? 'pointer' : undefined,
    ...rest
  }];
};
```

---

## 10. monorepo structure

using pnpm workspaces for efficient package management.

### directory structure

```
tooey/
├── packages/
│   ├── ui/                    # @tooey/ui - core library
│   │   ├── src/
│   │   │   └── tooey.ts
│   │   ├── tests/
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── components/            # @tooey/components - component library
│   │   ├── src/
│   │   │   ├── Card.ts
│   │   │   ├── Modal.ts
│   │   │   ├── Alert.ts
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── forms/                 # @tooey/forms - form utilities
│   ├── router/                # @tooey/router - client-side routing
│   ├── themes/                # @tooey/themes - pre-built themes
│   └── devtools/              # @tooey/devtools - browser extension
│
├── examples/                  # shared examples
├── docs/                      # documentation site
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish.yml
├── pnpm-workspace.yaml
├── package.json               # root package.json (workspace scripts)
├── tsconfig.base.json         # shared typescript config
├── vitest.workspace.ts        # shared test config
└── README.md
```

### root package.json

```json
{
  "name": "tooey-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "dev": "pnpm -r --parallel dev",
    "publish-packages": "pnpm -r publish --access public"
  },
  "devDependencies": {
    "pnpm": "^9.0.0"
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### package dependencies

```
@tooey/ui          (no dependencies)
     ↑
@tooey/components  (depends on @tooey/ui)
@tooey/forms       (depends on @tooey/ui)
@tooey/router      (depends on @tooey/ui)
@tooey/themes      (depends on @tooey/ui)
     ↑
@tooey/devtools    (depends on @tooey/ui, @tooey/components)
```

### shared configuration

**tsconfig.base.json** (root)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "lib": ["ES2020", "DOM"]
  }
}
```

**package tsconfig.json** (extends base)
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### ci/cd updates

single workflow handles all packages:

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm -r typecheck
      - run: pnpm -r lint
      - run: pnpm -r build
      - run: pnpm -r test
```

publish workflow uses changesets or manual version bumps:

```yaml
# .github/workflows/publish.yml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm -r build
      - run: pnpm -r test
      - run: pnpm -r publish --access public --no-git-checks
```

---

## token efficiency analysis

| pattern | tokens | notes |
|---------|--------|-------|
| `[Card, [...], {}]` | ~5 | same as built-in |
| `Card({}, [...])` | ~6 | slightly more |
| `{ ...theme.card }` | ~4 | very efficient |
| `{ bg: '$primary' }` | ~5 | same as hardcoded |
| `[Cd, [...]]` | ~3 | abbreviated |

all patterns maintain token efficiency comparable to core components.
