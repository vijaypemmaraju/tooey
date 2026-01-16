# @tooey/ui API Reference

Complete API documentation for @tooey/ui - the token-efficient UI library for LLMs.

## Table of Contents

- [Core Functions](#core-functions)
- [Components](#components)
- [Props Reference](#props-reference)
- [Events](#events)
- [State Operations](#state-operations)
- [Control Flow](#control-flow)
- [Function Components](#function-components)
- [Error Boundaries](#error-boundaries)
- [Types](#types)

## Core Functions

### `render(container, spec)`

Renders a tooey specification to the DOM.

```typescript
function render(container: HTMLElement, spec: TooeySpec): TooeyInstance
```

**Parameters:**
- `container` - The DOM element to render into
- `spec` - The tooey specification object

**Returns:** `TooeyInstance` with methods to interact with the rendered UI

**Example:**
```javascript
const app = tooey.render(document.getElementById('app'), {
  s: { count: 0 },
  r: [V, [[T, { $: 'count' }], [B, '+', { c: 'count+' }]], { g: 8 }]
});
```

### `TooeyInstance`

The object returned by `render()`.

```typescript
interface TooeyInstance {
  state: StateStore;      // Internal state store
  el: HTMLElement | null; // Root DOM element
  destroy(): void;        // Cleanup and remove UI
  update(spec): void;     // Update state or re-render
  get(key: string): unknown;    // Read state value
  set(key: string, value): void; // Write state value
}
```

**Methods:**

- `get(key)` - Get the current value of a state key
- `set(key, value)` - Set a state value (triggers reactive updates)
- `destroy()` - Clean up event listeners and remove DOM elements
- `update(spec)` - Update state values or re-render with new root

### `signal(initial)`

Creates a reactive signal (for advanced use cases).

```typescript
function signal<T>(initial: T): Signal<T>
```

**Example:**
```javascript
const count = tooey.signal(0);
count();        // Read: 0
count.set(5);   // Write
count.set(n => n + 1); // Update with function
```

### `effect(fn, ctx?)`

Runs a function that automatically re-runs when its signal dependencies change.

```typescript
function effect(fn: () => void, ctx?: RenderContext): () => void
```

**Returns:** Cleanup function to stop the effect

### `batch(fn)`

Batches multiple state updates to trigger a single re-render.

```typescript
function batch(fn: () => void): void
```

**Example:**
```javascript
tooey.batch(() => {
  app.set('a', 1);
  app.set('b', 2);
  app.set('c', 3);
}); // Only one re-render
```

### `$(name)`

Helper to create a state reference.

```typescript
function $(name: string): StateRef  // Returns { $: name }
```

## Components

### Layout Components

| Code | Element | Description |
|------|---------|-------------|
| `V` | `<div>` | Vertical stack (flex-direction: column) |
| `H` | `<div>` | Horizontal stack (flex-direction: row) |
| `D` | `<div>` | Plain div |
| `G` | `<div>` | Grid container |

### Text & Buttons

| Code | Element | Description |
|------|---------|-------------|
| `T` | `<span>` | Text/inline element |
| `B` | `<button>` | Button |

### Form Elements

| Code | Element | Description |
|------|---------|-------------|
| `I` | `<input>` | Text input (default type="text") |
| `Ta` | `<textarea>` | Multi-line text input |
| `S` | `<select>` | Dropdown select |
| `C` | `<input>` | Checkbox (type="checkbox") |
| `R` | `<input>` | Radio button (type="radio") |

### Table Elements

| Code | Element | Description |
|------|---------|-------------|
| `Tb` | `<table>` | Table |
| `Th` | `<thead>` | Table header |
| `Tbd` | `<tbody>` | Table body |
| `Tr` | `<tr>` | Table row |
| `Td` | `<td>` | Table cell |
| `Tc` | `<th>` | Table header cell |

### List Elements

| Code | Element | Description |
|------|---------|-------------|
| `Ul` | `<ul>` | Unordered list |
| `Ol` | `<ol>` | Ordered list |
| `Li` | `<li>` | List item |

### Media & Links

| Code | Element | Description |
|------|---------|-------------|
| `M` | `<img>` | Image |
| `L` | `<a>` | Link/anchor |
| `Sv` | `<svg>` | SVG container |

## Props Reference

### Spacing & Sizing

| Prop | CSS Property | Example |
|------|--------------|---------|
| `g` | gap | `{ g: 8 }` or `{ g: '1rem' }` |
| `p` | padding | `{ p: 16 }` |
| `m` | margin | `{ m: 8 }` |
| `w` | width | `{ w: 200 }` or `{ w: '100%' }` |
| `h` | height | `{ h: 100 }` |
| `mw` | max-width | `{ mw: 600 }` |
| `mh` | max-height | `{ mh: 400 }` |

### Colors

| Prop | CSS Property | Example |
|------|--------------|---------|
| `bg` | background | `{ bg: '#f0f0f0' }` |
| `fg` | color | `{ fg: 'blue' }` |
| `o` | opacity | `{ o: 0.5 }` |

### Borders

| Prop | CSS Property | Example |
|------|--------------|---------|
| `r` | border-radius | `{ r: 8 }` |
| `bw` | border-width | `{ bw: 1 }` |
| `bc` | border-color | `{ bc: 'gray' }` |
| `bs` | border-style | `{ bs: 'solid' }` |

### Positioning

| Prop | CSS Property | Values |
|------|--------------|--------|
| `pos` | position | `'rel'`, `'abs'`, `'fix'`, `'sticky'` |
| `z` | z-index | `{ z: 100 }` |
| `t` | top | `{ t: 0 }` |
| `l` | left | `{ l: 0 }` |
| `b` | bottom | `{ b: 0 }` |
| `rt` | right | `{ rt: 0 }` |

### Typography

| Prop | CSS Property | Example |
|------|--------------|---------|
| `fs` | font-size | `{ fs: 16 }` |
| `fw` | font-weight | `{ fw: 700 }` |
| `ff` | font-family | `{ ff: 'Arial' }` |
| `ta` | text-align | `{ ta: 'center' }` |
| `td` | text-decoration | `{ td: 'underline' }` |
| `lh` | line-height | `{ lh: 1.5 }` |
| `ls` | letter-spacing | `{ ls: 1 }` |

### Layout

| Prop | CSS Property | Shortcuts |
|------|--------------|-----------|
| `ai` | align-items | `c`=center, `fs`=flex-start, `fe`=flex-end, `st`=stretch |
| `jc` | justify-content | `c`=center, `sb`=space-between, `sa`=space-around, `se`=space-evenly |
| `flw` | flex-wrap | `wrap`, `nowrap` |
| `cols` | grid-template-columns | `{ cols: 3 }` or `{ cols: '1fr 2fr' }` |
| `rows` | grid-template-rows | `{ rows: 2 }` |

### Miscellaneous

| Prop | CSS Property | Example |
|------|--------------|---------|
| `cur` | cursor | `{ cur: 'pointer' }` |
| `ov` | overflow | `{ ov: 'hidden' }` |
| `pe` | pointer-events | `{ pe: 'none' }` |
| `us` | user-select | `{ us: 'none' }` |
| `sh` | box-shadow | `{ sh: '0 2px 4px rgba(0,0,0,0.1)' }` |
| `tr` | transform | `{ tr: 'rotate(45deg)' }` |
| `s` | (custom styles) | `{ s: { display: 'inline-block' } }` |

### Element-Specific

| Prop | Applies To | Description |
|------|------------|-------------|
| `v` | `I`, `Ta`, `S` | Value binding (state ref) |
| `ph` | `I`, `Ta` | Placeholder text |
| `type` | `I` | Input type (text, email, password, etc.) |
| `href` | `L` | Link URL (validated for security) |
| `src` | `M` | Image source URL (validated for security) |
| `alt` | `M` | Image alt text |
| `dis` | `B`, `I` | Disabled state |
| `ch` | `C`, `R` | Checked state binding |
| `ro` | `I`, `Ta` | Read-only |
| `opts` | `S` | Select options `[{ v: 'value', l: 'label' }]` |
| `rw` | `Ta` | Textarea rows |
| `sp` | `Td`, `Tc` | Column span |
| `rsp` | `Td`, `Tc` | Row span |
| `cls` | any | CSS class name |
| `id` | any | Element ID |

## Events

| Prop | Event | Description |
|------|-------|-------------|
| `c` | click | Click handler |
| `x` | input/change | Input value change |
| `f` | focus | Focus gained |
| `bl` | blur | Focus lost |
| `k` | keydown | Key pressed |
| `ku` | keyup | Key released |
| `kp` | keypress | Key press |
| `e` | mouseenter | Mouse entered |
| `lv` | mouseleave | Mouse left |
| `sub` | submit | Form submit |

### Event Handler Formats

```javascript
// Function
{ c: () => console.log('clicked') }

// Array form: [stateKey, operation, value?]
{ c: ['count', '+'] }        // Increment
{ c: ['count', '-'] }        // Decrement
{ c: ['count', '!', 10] }    // Set to 10
{ c: ['flag', '~'] }         // Toggle

// String shorthand
{ c: 'count+' }   // Increment
{ c: 'count-' }   // Decrement
{ c: 'count~' }   // Toggle
{ c: 'count!5' }  // Set to 5
{ c: 'count' }    // For +/- buttons: infers op; for inputs: set
```

## State Operations

| Op | Description | Example |
|----|-------------|---------|
| `+` | Increment | `['n', '+']` or `['n', '+', 5]` |
| `-` | Decrement | `['n', '-']` |
| `!` | Set value | `['val', '!', 'new']` |
| `~` | Toggle boolean | `['flag', '~']` |
| `<` | Append to array | `['items', '<', newItem]` |
| `>` | Prepend to array | `['items', '>', newItem]` |
| `X` | Remove from array | `['items', 'X', index]` or `['items', 'X', value]` |
| `.` | Set object property | `['obj', '.', ['key', 'value']]` |

## Control Flow

### Conditional Rendering

```javascript
// Long form
{ if: 'show', then: [T, 'Visible'], else: [T, 'Hidden'] }

// Short form (saves tokens)
{ '?': 'show', t: [T, 'Visible'], e: [T, 'Hidden'] }

// Equality check
{ '?': 'tab', is: 'home', t: [T, 'Home content'] }

// With state ref
{ '?': { $: 'tab' }, is: 'settings', t: [T, 'Settings'] }
```

### List Rendering

```javascript
// Long form
{ map: 'items', as: [Li, '$item'] }

// Short form
{ m: 'items', a: [Li, '$item'] }

// With index
{ m: 'items', a: [Li, '$index: $item'] }

// Object properties
{ m: 'users', a: [Li, '$item.name'] }
```

### Special Variables in Templates

| Variable | Description |
|----------|-------------|
| `$item` | Current item in map iteration |
| `$index` | Current index in map iteration |
| `$item.prop` | Property of current item object |

## Function Components

Create reusable components using functions. Function components receive props and children, and return a `NodeSpec`.

### Signature

```typescript
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### Basic Example

```javascript
import { Component, V, T, H, B } from '@tooey/ui';

// Simple component with children
const Card = (props, children) => [V, children, { bg: '#fff', p: 16, r: 8, ...props }];

// Usage
render(container, {
  s: {},
  r: [Card, [[T, 'Card content'], [T, 'More content']], { bg: '#f0f0f0' }]
});
```

### Component with Props

```javascript
// Component with typed props
const Alert = ({ type = 'info', message }) =>
  [V, [[T, message]], { bg: type === 'error' ? '#fee' : '#eef', p: 12, r: 4 }];

// Usage
render(container, {
  s: {},
  r: [Alert, '', { type: 'error', message: 'Something went wrong!' }]
});
```

### Nested Components

Function components can be nested:

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

### With State and Control Flow

Function components work with state references and control flow:

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

### Notes

- Function components are detected by `typeof first === 'function'`
- Props are passed as the first argument, children as the second
- Components can return any valid `NodeSpec` (tuples, IfNode, MapNode)
- Components are evaluated at render time, not during spec definition

## Error Boundaries

Error boundaries catch errors during rendering and display fallback UI.

```javascript
// Error boundary node
{
  boundary: true,
  child: [V, [[T, 'Risky content']]],
  fallback: [T, 'Something went wrong'],
  onError: (error) => console.error(error)
}
```

### ErrorBoundaryNode Interface

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

## Types

### TooeySpec

The main specification object passed to `render()`.

```typescript
interface TooeySpec {
  s?: Record<string, StateValue>;  // Initial state
  r: NodeSpec;                      // Root node
}
```

### NodeSpec

A node specification (component). Supports built-in components, function components, and control flow nodes.

```typescript
type BuiltinNodeSpec = [ComponentType, Content?, Props?];
type FunctionNodeSpec = [Component, Content?, Props?];
type NodeSpec = BuiltinNodeSpec | FunctionNodeSpec | IfNode | MapNode;
```

### Component

A function component that returns a NodeSpec.

```typescript
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;
```

### StateRef

Reference to a state value.

```typescript
type StateRef = { $: string };
```

### Props

Component properties (see Props Reference above).

### IfNode

Conditional rendering node.

```typescript
interface IfNode {
  if?: StateRef | string;   // or '?'
  then?: NodeSpec;          // or 't'
  else?: NodeSpec;          // or 'e'
  is?: unknown;             // equality check value
}
```

### MapNode

List rendering node.

```typescript
interface MapNode {
  map?: StateRef | string;  // or 'm'
  as?: NodeSpec;            // or 'a'
  key?: string;
}
```

## Browser Support

tooey targets ES2020 and works in all modern browsers:

- Chrome 80+
- Firefox 74+
- Safari 14+
- Edge 80+

## Bundle Size

- UMD bundle: ~11 KB minified
- ESM bundle: ~10 KB minified
- Zero production dependencies
