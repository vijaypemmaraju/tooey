# tooey ecosystem

this document describes the tooey ecosystem - a collection of packages designed for token-efficient ui development with llms.

## packages

| package | description | status |
|---------|-------------|--------|
| [@tooey/ui](./packages/ui) | core ui library | stable |
| [@tooey/components](./packages/components) | shadcn-inspired component library | stable |
| [@tooey/server](./packages/server) | server-side rendering with streaming | stable |
| [@tooey/claude-plugin](./packages/claude-plugin) | claude code integration | stable |

## design principles

### 1. token efficiency

all packages prioritize token efficiency for llm output:

- **abbreviations** - short names for common operations (e.g., `vs` instead of `VStack`)
- **compact syntax** - minimal boilerplate in specs
- **tree-shakeable** - import only what you need
- **small bundle** - core library is ~10kb minified

### 2. functions over registration

components are just functions - no registry, no magic.

```typescript
type Component<P = {}> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

```javascript
// define a component
const Card = (props, children) => [
  vs, children, { bg: '#fff', p: 16, r: 8, ...props }
];

// use in spec
{ r: [Card, [[tx, 'Hello']], { bg: '#f0f0f0' }] }
```

### 3. composition over configuration

build complex uis from simple primitives:

```javascript
const CardWithHeader = (props, children) => [
  Card, [
    [tx, props?.title, { fw: 700 }],
    ...children
  ], props
];
```

### 4. short names stay short

all packages follow consistent abbreviation patterns:

| pattern | example | description |
|---------|---------|-------------|
| first + last consonant | Card → Cd | common words |
| consonant cluster | Modal → Mdl | multi-syllable |
| first 2 letters | Alert → Al | short words |
| double first | Tooltip → Tt | clarity |

### 5. zero overhead

packages don't bloat each other:

- `@tooey/ui` has zero dependencies
- `@tooey/components` peer-depends on `@tooey/ui`
- `@tooey/server` peer-depends on `@tooey/ui`

### 6. llm-friendly

designed for ai code generation:

- consistent patterns that llms can learn
- predictable abbreviations
- comprehensive type definitions
- self-documenting specs

## @tooey/ui

the core library providing:

- **rendering** - `render()`, `hydrate()`, `renderToString()`
- **components** - layout (`vs`, `hs`, `dv`, `gr`), text (`tx`, `bt`), forms (`In`, `ta`, `sl`, `cb`, `rd`), tables, lists, media
- **state** - reactive signals with automatic updates
- **theming** - `$token` syntax for theme values
- **advanced** - refs, context, portals, fragments, memo, router, devtools

see [API.md](./API.md) for complete reference.

## @tooey/components

shadcn-inspired component library with token-efficient abbreviations:

### components

| component | abbrev | subcomponents |
|-----------|--------|---------------|
| Button | `Bt` | variants: default, destructive, outline, secondary, ghost, link |
| Card | `Cd` | `CdH` (header), `CdT` (title), `CdD` (description), `CdC` (content), `CdF` (footer) |
| Input | `Ip` | with label and error support |
| Textarea | `Ta` | styled multi-line input |
| Select | `Sl` | styled dropdown |
| Checkbox | `Cb` | styled with label |
| RadioGroup | `Rg` | `RgI` (item) |
| Badge | `Bg` | variants: default, secondary, destructive, outline |
| Alert | `Al` | `AlT` (title), `AlD` (description) |
| Avatar | `Av` | with image and fallback |
| Progress | `Pg` | progress bar |
| Separator | `Sp` | horizontal/vertical |
| Skeleton | `Sk` | loading placeholder |
| Switch | `Sw` | toggle switch |
| Tabs | `Tb` | `TbL` (list), `TbT` (trigger), `TbC` (content) |
| Accordion | `Ac` | `AcI` (item), `AcT` (trigger), `AcC` (content) |
| Dialog | `Dg` | `DgO` (overlay), `DgC` (content), `DgH` (header), `DgT` (title), `DgD` (description), `DgF` (footer) |
| Dropdown | `Dd` | `DdT` (trigger), `DdM` (menu), `DdI` (item) |
| Tooltip | `Tt` | hover tooltip |
| Label | `Lb` | form label |

### themes

built-in shadcn-inspired themes:

```javascript
import { shadcnTheme, shadcnDarkTheme } from '@tooey/components';
import { createTooey } from '@tooey/ui';

const tooey = createTooey(shadcnTheme);
tooey.render(container, spec);
```

see [@tooey/components readme](./packages/components/readme.md) for full documentation.

## @tooey/server

server-side rendering with streaming and islands:

### features

- **rendering** - `rts` (renderToString), `rtst` (renderToStream), `rtp` (renderPage)
- **islands** - partial hydration with multiple strategies (`islL`, `islI`, `islV`, `islM`, `islS`)
- **routing** - `rt` (createRouter), `rtf` (createFileRouter)
- **middleware** - `mw` (compose), `cors`, `log`, `rl` (rateLimit), `sec` (securityHeaders)
- **adapters** - node.js, edge (cloudflare, deno, vercel, bun)

### hydration strategies

| strategy | abbrev | description |
|----------|--------|-------------|
| load | `islL` | hydrate immediately on page load |
| idle | `islI` | hydrate when browser is idle |
| visible | `islV` | hydrate when element is visible (IntersectionObserver) |
| media | `islM` | hydrate on media query match |
| static | `islS` | no hydration (static html only) |

see [@tooey/server readme](./packages/server/readme.md) for full documentation.

## @tooey/claude-plugin

claude code integration for generating tooey specs:

### installation

```bash
claude plugin marketplace add https://raw.githubusercontent.com/vijaypemmaraju/tooey/main/marketplace.json
claude plugin install tooey
```

### usage

```
/tooey:ui a counter with increment and decrement buttons
/tooey:ui a login form with username and password fields
```

see [@tooey/claude-plugin readme](./packages/claude-plugin/readme.md) for full documentation.

## extending tooey

### custom components

create components following the abbreviation conventions:

```javascript
// MyComponent.js
import { vs, tx } from '@tooey/ui';

// follow naming conventions
export const Mc = (props, children) => [
  vs, children, { bg: '$primary', p: 16, ...props }
];

// with typescript
import type { Component, Props } from '@tooey/ui';

interface MyComponentProps extends Props {
  variant?: 'primary' | 'secondary';
}

export const Mc: Component<MyComponentProps> = (props, children) => {
  const bg = props?.variant === 'secondary' ? '$secondary' : '$primary';
  return [vs, children, { bg, p: 16, ...props }];
};
```

### custom themes

extend or create themes:

```javascript
import { shadcnTheme } from '@tooey/components';

const customTheme = {
  ...shadcnTheme,
  colors: {
    ...shadcnTheme.colors,
    brand: '#ff6b6b',
    brandForeground: '#ffffff',
  },
};
```

### plugins

create plugins for cross-cutting concerns:

```typescript
interface TooeyPlugin {
  name: string;
  onInit?(instance: TooeyInstance): void;
  onDestroy?(instance: TooeyInstance): void;
  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
  afterRender?(el: HTMLElement, spec: NodeSpec): void;
  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;
  extend?: Record<string, Function>;
}
```

```javascript
const analyticsPlugin = {
  name: 'analytics',
  onInit(instance) {
    console.log('app initialized');
  },
  onStateChange(key, oldVal, newVal) {
    analytics.track('state_change', { key, oldVal, newVal });
  }
};

render(el, spec, { plugins: [analyticsPlugin] });
```

## token efficiency analysis

| pattern | tokens | notes |
|---------|--------|-------|
| `[Cd, [...], {}]` | ~5 | component library |
| `[vs, [...], {}]` | ~5 | core component |
| `{ bg: '$primary' }` | ~5 | theme token |
| `{ '?': 'show', t: [...] }` | ~6 | conditional |
| `{ m: 'items', a: [...] }` | ~6 | list mapping |

all patterns maintain ~75% token efficiency compared to react.

## best practices

### 1. use abbreviations consistently

```javascript
// good
[Bt, 'Click', { variant: 'primary', c: 'count+' }]

// avoid
[Button, 'Click', { variant: 'primary', onClick: () => setCount(c => c + 1) }]
```

### 2. prefer built-in state operations

```javascript
// good
{ c: 'count+' }

// verbose
{ c: () => app.set('count', app.get('count') + 1) }
```

### 3. use theme tokens

```javascript
// good
{ bg: '$primary', p: '$md' }

// hardcoded
{ bg: '#007bff', p: 16 }
```

### 4. compose components

```javascript
// compose from primitives
const PrimaryButton = (props, children) =>
  [Bt, children, { variant: 'primary', ...props }];

// use composition
[PrimaryButton, 'Save', { c: 'save~' }]
```

### 5. leverage islands for performance

```javascript
// static content (no js)
islS(headerSpec, 'header')

// hydrate on visibility
islV(commentsSpec, 'comments')

// hydrate immediately for interactive
islL(formSpec, 'form')
```

## contributing

see [CLAUDE.md](./CLAUDE.md) for development guidelines.

## license

mit
