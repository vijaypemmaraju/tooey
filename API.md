# @tooey/ui api reference

complete api documentation for @tooey/ui - the token-efficient ui library for llms.

## table of contents

- [core functions](#core-functions)
- [components](#components)
- [props reference](#props-reference)
- [events](#events)
- [state operations](#state-operations)
- [control flow](#control-flow)
- [function components](#function-components)
- [error boundaries](#error-boundaries)
- [types](#types)

## core functions

### `render(container, spec)`

renders a tooey specification to the dom.

```typescript
function render(container: HTMLElement, spec: TooeySpec): TooeyInstance
```

**parameters:**
- `container` - the dom element to render into
- `spec` - the tooey specification object

**returns:** `TooeyInstance` with methods to interact with the rendered ui

**example:**
```javascript
const app = tooey.render(document.getElementById('app'), {
  s: { count: 0 },
  r: [V, [[T, { $: 'count' }], [B, '+', { c: 'count+' }]], { g: 8 }]
});
```

### `TooeyInstance`

the object returned by `render()`.

```typescript
interface TooeyInstance {
  state: StateStore;      // internal state store
  el: HTMLElement | null; // root dom element
  destroy(): void;        // cleanup and remove ui
  update(spec): void;     // update state or re-render
  get(key: string): unknown;    // read state value
  set(key: string, value): void; // write state value
}
```

**methods:**

- `get(key)` - get the current value of a state key
- `set(key, value)` - set a state value (triggers reactive updates)
- `destroy()` - clean up event listeners and remove dom elements
- `update(spec)` - update state values or re-render with new root

### `signal(initial)`

creates a reactive signal (for advanced use cases).

```typescript
function signal<T>(initial: T): Signal<T>
```

**example:**
```javascript
const count = tooey.signal(0);
count();        // read: 0
count.set(5);   // write
count.set(n => n + 1); // update with function
```

### `effect(fn, ctx?)`

runs a function that automatically re-runs when its signal dependencies change.

```typescript
function effect(fn: () => void, ctx?: RenderContext): () => void
```

**returns:** cleanup function to stop the effect

### `batch(fn)`

batches multiple state updates to trigger a single re-render.

```typescript
function batch(fn: () => void): void
```

**example:**
```javascript
tooey.batch(() => {
  app.set('a', 1);
  app.set('b', 2);
  app.set('c', 3);
}); // only one re-render
```

### `$(name)`

helper to create a state reference.

```typescript
function $(name: string): StateRef  // returns { $: name }
```

## components

### layout components

| code | element | description |
|------|---------|-------------|
| `V` | `<div>` | vertical stack (flex-direction: column) |
| `H` | `<div>` | horizontal stack (flex-direction: row) |
| `D` | `<div>` | plain div |
| `G` | `<div>` | grid container |

### text & buttons

| code | element | description |
|------|---------|-------------|
| `T` | `<span>` | text/inline element |
| `B` | `<button>` | button |

### form elements

| code | element | description |
|------|---------|-------------|
| `I` | `<input>` | text input (default type="text") |
| `Ta` | `<textarea>` | multi-line text input |
| `S` | `<select>` | dropdown select |
| `C` | `<input>` | checkbox (type="checkbox") |
| `R` | `<input>` | radio button (type="radio") |

### table elements

| code | element | description |
|------|---------|-------------|
| `Tb` | `<table>` | table |
| `Th` | `<thead>` | table header |
| `Tbd` | `<tbody>` | table body |
| `Tr` | `<tr>` | table row |
| `Td` | `<td>` | table cell |
| `Tc` | `<th>` | table header cell |

### list elements

| code | element | description |
|------|---------|-------------|
| `Ul` | `<ul>` | unordered list |
| `Ol` | `<ol>` | ordered list |
| `Li` | `<li>` | list item |

### media & links

| code | element | description |
|------|---------|-------------|
| `M` | `<img>` | image |
| `L` | `<a>` | link/anchor |
| `Sv` | `<svg>` | svg container |

## props reference

### spacing & sizing

| prop | css property | example |
|------|--------------|---------|
| `g` | gap | `{ g: 8 }` or `{ g: '1rem' }` |
| `p` | padding | `{ p: 16 }` |
| `m` | margin | `{ m: 8 }` |
| `w` | width | `{ w: 200 }` or `{ w: '100%' }` |
| `h` | height | `{ h: 100 }` |
| `mw` | max-width | `{ mw: 600 }` |
| `mh` | max-height | `{ mh: 400 }` |

### colors

| prop | css property | example |
|------|--------------|---------|
| `bg` | background | `{ bg: '#f0f0f0' }` |
| `fg` | color | `{ fg: 'blue' }` |
| `o` | opacity | `{ o: 0.5 }` |

### borders

| prop | css property | example |
|------|--------------|---------|
| `r` | border-radius | `{ r: 8 }` |
| `bw` | border-width | `{ bw: 1 }` |
| `bc` | border-color | `{ bc: 'gray' }` |
| `bs` | border-style | `{ bs: 'solid' }` |

### positioning

| prop | css property | values |
|------|--------------|--------|
| `pos` | position | `'rel'`, `'abs'`, `'fix'`, `'sticky'` |
| `z` | z-index | `{ z: 100 }` |
| `t` | top | `{ t: 0 }` |
| `l` | left | `{ l: 0 }` |
| `b` | bottom | `{ b: 0 }` |
| `rt` | right | `{ rt: 0 }` |

### typography

| prop | css property | example |
|------|--------------|---------|
| `fs` | font-size | `{ fs: 16 }` |
| `fw` | font-weight | `{ fw: 700 }` |
| `ff` | font-family | `{ ff: 'Arial' }` |
| `ta` | text-align | `{ ta: 'center' }` |
| `td` | text-decoration | `{ td: 'underline' }` |
| `lh` | line-height | `{ lh: 1.5 }` |
| `ls` | letter-spacing | `{ ls: 1 }` |

### layout

| prop | css property | shortcuts |
|------|--------------|-----------|
| `ai` | align-items | `c`=center, `fs`=flex-start, `fe`=flex-end, `st`=stretch |
| `jc` | justify-content | `c`=center, `sb`=space-between, `sa`=space-around, `se`=space-evenly |
| `flw` | flex-wrap | `wrap`, `nowrap` |
| `cols` | grid-template-columns | `{ cols: 3 }` or `{ cols: '1fr 2fr' }` |
| `rows` | grid-template-rows | `{ rows: 2 }` |

### miscellaneous

| prop | css property | example |
|------|--------------|---------|
| `cur` | cursor | `{ cur: 'pointer' }` |
| `ov` | overflow | `{ ov: 'hidden' }` |
| `pe` | pointer-events | `{ pe: 'none' }` |
| `us` | user-select | `{ us: 'none' }` |
| `sh` | box-shadow | `{ sh: '0 2px 4px rgba(0,0,0,0.1)' }` |
| `tr` | transform | `{ tr: 'rotate(45deg)' }` |
| `s` | (custom styles) | `{ s: { display: 'inline-block' } }` |

### element-specific

| prop | applies to | description |
|------|------------|-------------|
| `v` | `I`, `Ta`, `S` | value binding (state ref) |
| `ph` | `I`, `Ta` | placeholder text |
| `type` | `I` | input type (text, email, password, etc.) |
| `href` | `L` | link url (validated for security) |
| `src` | `M` | image source url (validated for security) |
| `alt` | `M` | image alt text |
| `dis` | `B`, `I` | disabled state |
| `ch` | `C`, `R` | checked state binding |
| `ro` | `I`, `Ta` | read-only |
| `opts` | `S` | select options `[{ v: 'value', l: 'label' }]` |
| `rw` | `Ta` | textarea rows |
| `sp` | `Td`, `Tc` | column span |
| `rsp` | `Td`, `Tc` | row span |
| `cls` | any | css class name |
| `id` | any | element id |

## events

| prop | event | description |
|------|-------|-------------|
| `c` | click | click handler |
| `x` | input/change | input value change |
| `f` | focus | focus gained |
| `bl` | blur | focus lost |
| `k` | keydown | key pressed |
| `ku` | keyup | key released |
| `kp` | keypress | key press |
| `e` | mouseenter | mouse entered |
| `lv` | mouseleave | mouse left |
| `sub` | submit | form submit |

### event handler formats

```javascript
// function
{ c: () => console.log('clicked') }

// array form: [stateKey, operation, value?]
{ c: ['count', '+'] }        // increment
{ c: ['count', '-'] }        // decrement
{ c: ['count', '!', 10] }    // set to 10
{ c: ['flag', '~'] }         // toggle

// string shorthand
{ c: 'count+' }   // increment
{ c: 'count-' }   // decrement
{ c: 'count~' }   // toggle
{ c: 'count!5' }  // set to 5
{ c: 'count' }    // for +/- buttons: infers op; for inputs: set
```

## state operations

| op | description | example |
|----|-------------|---------|
| `+` | increment | `['n', '+']` or `['n', '+', 5]` |
| `-` | decrement | `['n', '-']` |
| `!` | set value | `['val', '!', 'new']` |
| `~` | toggle boolean | `['flag', '~']` |
| `<` | append to array | `['items', '<', newItem]` |
| `>` | prepend to array | `['items', '>', newItem]` |
| `X` | remove from array | `['items', 'X', index]` or `['items', 'X', value]` |
| `.` | set object property | `['obj', '.', ['key', 'value']]` |

## control flow

### conditional rendering

```javascript
// long form
{ if: 'show', then: [T, 'Visible'], else: [T, 'Hidden'] }

// short form (saves tokens)
{ '?': 'show', t: [T, 'Visible'], e: [T, 'Hidden'] }

// equality check
{ '?': 'tab', is: 'home', t: [T, 'Home content'] }

// with state ref
{ '?': { $: 'tab' }, is: 'settings', t: [T, 'Settings'] }
```

### list rendering

```javascript
// long form
{ map: 'items', as: [Li, '$item'] }

// short form
{ m: 'items', a: [Li, '$item'] }

// with index
{ m: 'items', a: [Li, '$index: $item'] }

// object properties
{ m: 'users', a: [Li, '$item.name'] }
```

### special variables in templates

| variable | description |
|----------|-------------|
| `$item` | current item in map iteration |
| `$index` | current index in map iteration |
| `$item.prop` | property of current item object |

## function components

create reusable components using functions. function components receive props and children, and return a `NodeSpec`.

### signature

```typescript
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### basic example

```javascript
import { Component, V, T, H, B } from '@tooey/ui';

// simple component with children
const Card = (props, children) => [V, children, { bg: '#fff', p: 16, r: 8, ...props }];

// usage
render(container, {
  s: {},
  r: [Card, [[T, 'Card content'], [T, 'More content']], { bg: '#f0f0f0' }]
});
```

### component with props

```javascript
// component with typed props
const Alert = ({ type = 'info', message }) =>
  [V, [[T, message]], { bg: type === 'error' ? '#fee' : '#eef', p: 12, r: 4 }];

// usage
render(container, {
  s: {},
  r: [Alert, '', { type: 'error', message: 'Something went wrong!' }]
});
```

### nested components

function components can be nested:

```javascript
const Button = (props) => [B, props?.label || 'Click', { bg: '#007bff', fg: '#fff', p: 8, r: 4, ...props }];

const ButtonGroup = (props, children) => [H, children, { g: 8, ...props }];

render(container, {
  s: { count: 0 },
  r: [ButtonGroup, [
    [Button, '', { label: '-', c: 'count-' }],
    [T, { $: 'count' }],
    [Button, '', { label: '+', c: 'count+' }]
  ]]
});
```

### with state and control flow

function components work with state references and control flow:

```javascript
const Counter = (props) => [V, [
  [T, { $: props?.stateKey || 'count' }],
  [H, [[B, '-', { c: `${props?.stateKey || 'count'}-` }], [B, '+', { c: `${props?.stateKey || 'count'}+` }]], { g: 8 }]
], { g: 8 }];

const ConditionalDisplay = ({ condition }) => ({
  '?': condition,
  t: [T, 'Condition is true'],
  e: [T, 'Condition is false']
});

render(container, {
  s: { count: 0, show: true },
  r: [V, [
    [Counter, '', { stateKey: 'count' }],
    [ConditionalDisplay, '', { condition: 'show' }]
  ], { g: 16 }]
});
```

### notes

- function components are detected by `typeof first === 'function'`
- props are passed as the first argument, children as the second
- components can return any valid `NodeSpec` (tuples, IfNode, MapNode)
- components are evaluated at render time, not during spec definition

## error boundaries

error boundaries catch errors during rendering and display fallback ui.

```javascript
// error boundary node
{
  boundary: true,
  child: [V, [[T, 'Risky content']]],
  fallback: [T, 'Something went wrong'],
  onError: (error) => console.error(error)
}
```

### ErrorBoundaryNode interface

```typescript
interface ErrorBoundaryNode {
  boundary: true;
  child: NodeSpec;
  fallback?: NodeSpec;
  onError?: (error: ErrorInfo) => void;
}

interface ErrorInfo {
  message: string;
  componentType?: string;
  stack?: string;
}
```

## types

### TooeySpec

the main specification object passed to `render()`.

```typescript
interface TooeySpec {
  s?: Record<string, StateValue>;  // initial state
  r: NodeSpec;                      // root node
}
```

### NodeSpec

a node specification (component). supports built-in components, function components, and control flow nodes.

```typescript
type BuiltinNodeSpec = [ComponentType, Content?, Props?];
type FunctionNodeSpec = [Component, Content?, Props?];
type NodeSpec = BuiltinNodeSpec | FunctionNodeSpec | IfNode | MapNode;
```

### Component

a function component that returns a NodeSpec.

```typescript
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### StateRef

reference to a state value.

```typescript
type StateRef = { $: string };
```

### Props

component properties (see props reference above).

### IfNode

conditional rendering node.

```typescript
interface IfNode {
  if?: StateRef | string;   // or '?'
  then?: NodeSpec;          // or 't'
  else?: NodeSpec;          // or 'e'
  is?: unknown;             // equality check value
}
```

### MapNode

list rendering node.

```typescript
interface MapNode {
  map?: StateRef | string;  // or 'm'
  as?: NodeSpec;            // or 'a'
  key?: string;
}
```

## browser support

tooey targets es2020 and works in all modern browsers:

- chrome 80+
- firefox 74+
- safari 14+
- edge 80+

## bundle size

- umd bundle: ~11 kb minified
- esm bundle: ~10 kb minified
- zero production dependencies
