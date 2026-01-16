# Tooey Ecosystem Design

Design document for making tooey extensible while preserving token efficiency.

## Design Principles

1. **Functions over registration** - Custom components are just functions, no registry
2. **Composition over configuration** - Build complex from simple primitives
3. **Short names stay short** - Extensions follow abbreviation patterns
4. **Tree-shakeable** - Everything importable individually
5. **Zero overhead** - Extensions don't bloat base library
6. **LLM-friendly** - Patterns that AI can learn and generate efficiently

---

## 1. Custom Components (Function Components)

No registration needed. A component is just a function that returns a `NodeSpec`.

### API

```typescript
type Component<P = {}> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### Example

```javascript
// Define a Card component
const Card = (props = {}, children = []) => [
  V,
  children,
  { bg: '#fff', p: 16, r: 8, sh: '0 2px 4px rgba(0,0,0,0.1)', ...props }
];

// Usage in spec (token-efficient)
{ r: [Card, [[T, 'Hello']], { bg: '#f0f0f0' }] }

// Or with helper
{ r: Card({ bg: '#f0f0f0' }, [[T, 'Hello']]) }
```

### Component with State

```javascript
// Components can define their own state keys
const Counter = (props = {}) => ({
  // State contribution (merged with parent spec.s)
  s: { count: props.initial || 0 },
  // Component tree
  r: [H, [
    [B, '-', { c: 'count-' }],
    [T, { $: 'count' }],
    [B, '+', { c: 'count+' }]
  ], { g: 8, ...props }]
});

// Usage - returns TooeySpec, can be spread or rendered directly
render(el, Counter({ initial: 5 }))
```

### Implementation Changes

```typescript
// In createElement, detect function components
function createElement(spec, ctx, itemContext) {
  // If first element is a function, call it
  if (Array.isArray(spec) && typeof spec[0] === 'function') {
    const [Comp, content, props] = spec;
    const resolved = Comp(props, Array.isArray(content) ? content : [content]);
    return createElement(resolved, ctx, itemContext);
  }
  // ... existing logic
}
```

---

## 2. Component Libraries (Packages)

Third-party packages export components following naming conventions.

### Package Structure

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

### Naming Convention

| Full Name | Abbrev | Rule |
|-----------|--------|------|
| Card | `Cd` | First + last consonant |
| Modal | `Mdl` | Consonant cluster |
| Tabs | `Tbs` | Plural → add 's' |
| Alert | `Al` | First 2 letters |
| Dropdown | `Dd` | First letter + key consonant |
| Tooltip | `Tt` | Double first letter |

### Usage

```javascript
import { Cd, Mdl, Al } from '@tooey/components';

{ r: [Cd, [[T, 'Content']], { variant: 'outlined' }] }
```

---

## 3. Theming

### Option A: Theme Objects (Zero Overhead)

```javascript
// Define theme
const theme = {
  card: { bg: '#fff', r: 8, sh: '0 2px 4px rgba(0,0,0,0.1)' },
  btn: { bg: '#007bff', fg: '#fff', r: 4, p: '8 16' },
  input: { bw: 1, bc: '#ccc', r: 4, p: 8 }
};

// Apply via spread
[V, [...], { ...theme.card, p: 24 }]
```

### Option B: Theme Provider (Runtime)

```javascript
// New API
const { render, theme } = createTooey({
  colors: { primary: '#007bff', danger: '#dc3545' },
  spacing: { sm: 8, md: 16, lg: 24 },
  radius: { sm: 4, md: 8, lg: 16 }
});

// Usage with $ prefix for theme values
[B, 'Save', { bg: '$primary', p: '$md', r: '$sm' }]
```

### Implementation

```typescript
// Theme resolution in applyStyles
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

## 4. Plugin System

Lightweight hooks for cross-cutting concerns.

### Plugin Interface

```typescript
interface TooeyPlugin {
  name: string;

  // Lifecycle hooks
  onInit?(instance: TooeyInstance): void;
  onDestroy?(instance: TooeyInstance): void;

  // Render hooks
  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
  afterRender?(el: HTMLElement, spec: NodeSpec): void;

  // State hooks
  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;

  // Extend instance
  extend?: Record<string, Function>;
}
```

### Example Plugins

```javascript
// Router plugin
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

// Logger plugin
const loggerPlugin = {
  name: 'logger',
  onStateChange(key, oldVal, newVal) {
    console.log(`[${key}]`, oldVal, '→', newVal);
  }
};

// Usage
const app = render(el, spec, { plugins: [routerPlugin, loggerPlugin] });
app.navigate('/about');
```

---

## 5. Slots & Composition

For complex component composition.

### Slot API

```javascript
// Component with slots
const Layout = (props, children) => {
  const { header, footer, ...rest } = props;
  return [V, [
    header && [D, [header], { cls: 'header' }],
    [D, children, { cls: 'main', s: { flex: 1 } }],
    footer && [D, [footer], { cls: 'footer' }]
  ], { h: '100vh', ...rest }];
};

// Usage
[Layout, [
  [T, 'Main content']
], {
  header: [H, [[T, 'Logo'], [T, 'Nav']], { jc: 'sb' }],
  footer: [T, '© 2024']
}]
```

---

## 6. State Modules

Reusable state patterns.

### API

```javascript
// Define a state module
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

// Usage
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

## 7. Computed State

Derived values that update automatically.

### API

```typescript
// New export
function computed<T>(fn: () => T): Signal<T>;
```

### Usage

```javascript
import { signal, computed, render } from '@tooey/ui';

const items = signal([{ price: 10 }, { price: 20 }]);
const total = computed(() => items().reduce((sum, i) => sum + i.price, 0));

// total() automatically updates when items changes
```

---

## 8. Async State

Handle loading states elegantly.

### API

```javascript
// New helper
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

### Usage

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

## 9. Type-Safe Props

TypeScript support for custom components.

### Example

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

## 10. Package Ecosystem Structure

```
@tooey/ui          - Core library (this repo)
@tooey/components  - Official component library
@tooey/forms       - Form handling utilities
@tooey/router      - Client-side routing
@tooey/motion      - Animations
@tooey/icons       - Icon components
@tooey/themes      - Pre-built themes
@tooey/devtools    - Browser extension for debugging
```

---

## Implementation Priority

### Phase 1: Function Components (Minor version)
- [ ] Detect function as first element in NodeSpec
- [ ] Call function with (props, children)
- [ ] Recursively render returned spec
- [ ] Update types

### Phase 2: Theming (Minor version)
- [ ] Add optional theme parameter to render
- [ ] Resolve `$token` values in props
- [ ] Export createTooey factory

### Phase 3: Plugins (Minor version)
- [ ] Add plugins option to render
- [ ] Implement lifecycle hooks
- [ ] Implement extend for instance methods

### Phase 4: Computed & Async (Minor version)
- [ ] Export computed helper
- [ ] Export async$ helper
- [ ] Update effect tracking

---

## Token Efficiency Analysis

| Pattern | Tokens | Notes |
|---------|--------|-------|
| `[Card, [...], {}]` | ~5 | Same as built-in |
| `Card({}, [...])` | ~6 | Slightly more |
| `{ ...theme.card }` | ~4 | Very efficient |
| `{ bg: '$primary' }` | ~5 | Same as hardcoded |
| `[Cd, [...]]` | ~3 | Abbreviated |

All patterns maintain token efficiency comparable to core components.
