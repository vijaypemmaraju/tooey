/**
 * Tooey - Token-efficient UI library for LLMs
 *
 * Component types:
 *   V = VStack (vertical flex)
 *   H = HStack (horizontal flex)
 *   D = Div (generic container)
 *   T = Text (span)
 *   B = Button
 *   I = Input
 *   S = Select
 *   C = Checkbox
 *   M = Image
 *   L = Link
 *   G = Grid
 *
 * Props (short keys):
 *   g = gap, p = padding, m = margin
 *   w = width, h = height
 *   c = click handler, x = onChange
 *   v = value, s = style
 *   f = focus, b = blur
 *   t = type (for inputs)
 *   ph = placeholder
 *   bg = background
 *   fg = color (foreground)
 *   r = border-radius
 *   bw = border-width
 *   bc = border-color
 *
 * State operations:
 *   + = increment
 *   - = decrement
 *   ! = set value
 *   ~ = toggle boolean
 *   < = append to array
 *   > = prepend to array
 *   X = remove from array (by index or predicate)
 *   . = set property on object
 */

// ============ Types ============

type StateValue = unknown;
type StateStore = Record<string, Signal<StateValue>>;

interface Signal<T> {
  (): T;
  set(v: T | ((prev: T) => T)): void;
  sub(fn: () => void): () => void;
}

type Op = '+' | '-' | '!' | '~' | '<' | '>' | 'X' | '.';
type EventHandler = [string, Op, unknown?] | (() => void);

interface Props {
  g?: number;           // gap
  p?: number | string;  // padding
  m?: number | string;  // margin
  w?: number | string;  // width
  h?: number | string;  // height
  c?: EventHandler;     // click
  x?: EventHandler;     // change
  v?: unknown;          // value
  s?: Record<string, unknown>; // style
  f?: EventHandler;     // focus
  b?: EventHandler;     // blur
  t?: string;           // type
  ph?: string;          // placeholder
  bg?: string;          // background
  fg?: string;          // color
  r?: number | string;  // border-radius
  bw?: number | string; // border-width
  bc?: string;          // border-color
  href?: string;        // for links
  src?: string;         // for images
  alt?: string;         // for images
  cols?: number;        // grid columns
  rows?: number;        // grid rows
  cls?: string;         // class name
  id?: string;          // id
  d?: boolean;          // disabled
  ch?: boolean;         // checked (for checkbox)
  opts?: Array<{v: string, l: string}>; // options for select
}

type ComponentType = 'V' | 'H' | 'D' | 'T' | 'B' | 'I' | 'S' | 'C' | 'M' | 'L' | 'G';

// Node spec: [Type, Content/Children, Props?]
// or for text with state: [Type, StateRef]
// StateRef: {$: "stateName"} or just a string for static
type StateRef = { $: string };
type Content = string | number | StateRef | NodeSpec[];
type NodeSpec = [ComponentType, Content?, Props?];

interface TooeySpec {
  s?: Record<string, StateValue>;  // initial state
  r: NodeSpec;                      // root node
}

// ============ Signals ============

let currentEffect: (() => void) | null = null;

function signal<T>(initial: T): Signal<T> {
  let value = initial;
  const subscribers = new Set<() => void>();

  const sig = (() => {
    if (currentEffect) {
      subscribers.add(currentEffect);
    }
    return value;
  }) as Signal<T>;

  sig.set = (v: T | ((prev: T) => T)) => {
    const newValue = typeof v === 'function' ? (v as (prev: T) => T)(value) : v;
    if (newValue !== value) {
      value = newValue;
      subscribers.forEach(fn => fn());
    }
  };

  sig.sub = (fn: () => void) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  };

  return sig;
}

function effect(fn: () => void): () => void {
  const execute = () => {
    currentEffect = execute;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };
  execute();
  return () => { currentEffect = null; };
}

// ============ State Operations ============

function applyOp(state: Signal<StateValue>, op: Op, val?: unknown): void {
  switch (op) {
    case '+':
      state.set((v) => (v as number) + (typeof val === 'number' ? val : 1));
      break;
    case '-':
      state.set((v) => (v as number) - (typeof val === 'number' ? val : 1));
      break;
    case '!':
      state.set(val);
      break;
    case '~':
      state.set((v) => !v);
      break;
    case '<':
      state.set((v) => [...(v as unknown[]), val]);
      break;
    case '>':
      state.set((v) => [val, ...(v as unknown[])]);
      break;
    case 'X':
      state.set((v) => {
        const arr = v as unknown[];
        if (typeof val === 'number') {
          return arr.filter((_, i) => i !== val);
        } else if (typeof val === 'function') {
          return arr.filter((item, i) => !(val as (item: unknown, i: number) => boolean)(item, i));
        }
        return arr.filter(item => item !== val);
      });
      break;
    case '.':
      if (Array.isArray(val) && val.length === 2) {
        state.set((v) => ({ ...(v as Record<string, unknown>), [val[0]]: val[1] }));
      }
      break;
  }
}

// ============ Renderer ============

function isStateRef(v: unknown): v is StateRef {
  return typeof v === 'object' && v !== null && '$' in v;
}

function resolveValue(content: Content, state: StateStore): unknown {
  if (isStateRef(content)) {
    const sig = state[content.$];
    return sig ? sig() : undefined;
  }
  return content;
}

function createHandler(handler: EventHandler, state: StateStore): () => void {
  if (typeof handler === 'function') {
    return handler;
  }
  const [stateKey, op, val] = handler;
  return () => {
    const sig = state[stateKey];
    if (sig) {
      applyOp(sig, op, val);
    }
  };
}

function applyStyles(el: HTMLElement, props: Props): void {
  const style = el.style;

  if (props.g !== undefined) style.gap = typeof props.g === 'number' ? `${props.g}px` : props.g;
  if (props.p !== undefined) style.padding = typeof props.p === 'number' ? `${props.p}px` : String(props.p);
  if (props.m !== undefined) style.margin = typeof props.m === 'number' ? `${props.m}px` : String(props.m);
  if (props.w !== undefined) style.width = typeof props.w === 'number' ? `${props.w}px` : String(props.w);
  if (props.h !== undefined) style.height = typeof props.h === 'number' ? `${props.h}px` : String(props.h);
  if (props.bg !== undefined) style.background = props.bg;
  if (props.fg !== undefined) style.color = props.fg;
  if (props.r !== undefined) style.borderRadius = typeof props.r === 'number' ? `${props.r}px` : String(props.r);
  if (props.bw !== undefined) style.borderWidth = typeof props.bw === 'number' ? `${props.bw}px` : String(props.bw);
  if (props.bc !== undefined) style.borderColor = props.bc;

  // Apply custom style object
  if (props.s) {
    Object.entries(props.s).forEach(([key, val]) => {
      (style as unknown as Record<string, string>)[key] = String(val);
    });
  }
}

function createElement(spec: NodeSpec, state: StateStore): HTMLElement {
  const [type, content, props = {}] = spec;
  let el: HTMLElement;

  switch (type) {
    case 'V':
      el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      break;
    case 'H':
      el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'row';
      break;
    case 'G':
      el = document.createElement('div');
      el.style.display = 'grid';
      if (props.cols) el.style.gridTemplateColumns = `repeat(${props.cols}, 1fr)`;
      if (props.rows) el.style.gridTemplateRows = `repeat(${props.rows}, 1fr)`;
      break;
    case 'D':
      el = document.createElement('div');
      break;
    case 'T':
      el = document.createElement('span');
      break;
    case 'B':
      el = document.createElement('button');
      break;
    case 'I':
      el = document.createElement('input');
      (el as HTMLInputElement).type = props.t || 'text';
      if (props.ph) (el as HTMLInputElement).placeholder = props.ph;
      break;
    case 'S':
      el = document.createElement('select');
      if (props.opts) {
        props.opts.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.v;
          option.textContent = opt.l;
          el.appendChild(option);
        });
      }
      break;
    case 'C':
      el = document.createElement('input');
      (el as HTMLInputElement).type = 'checkbox';
      break;
    case 'M':
      el = document.createElement('img');
      if (props.src) (el as HTMLImageElement).src = props.src;
      if (props.alt) (el as HTMLImageElement).alt = props.alt;
      break;
    case 'L':
      el = document.createElement('a');
      if (props.href) (el as HTMLAnchorElement).href = props.href;
      break;
    default:
      el = document.createElement('div');
  }

  // Apply props
  if (props.cls) el.className = props.cls;
  if (props.id) el.id = props.id;
  if (props.d) (el as HTMLButtonElement).disabled = true;

  applyStyles(el, props);

  // Handle content
  if (content !== undefined) {
    if (Array.isArray(content) && content.length > 0 && Array.isArray(content[0])) {
      // Children array
      (content as NodeSpec[]).forEach(childSpec => {
        el.appendChild(createElement(childSpec, state));
      });
    } else if (isStateRef(content)) {
      // Reactive text content
      effect(() => {
        const val = resolveValue(content, state);
        if (type === 'I') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'C') {
          (el as HTMLInputElement).checked = Boolean(val);
        } else {
          el.textContent = String(val ?? '');
        }
      });
    } else if (typeof content === 'string' || typeof content === 'number') {
      // Static content
      if (type === 'I') {
        (el as HTMLInputElement).value = String(content);
      } else {
        el.textContent = String(content);
      }
    }
  }

  // Handle value binding for inputs (separate from content)
  if (props.v !== undefined) {
    if (isStateRef(props.v)) {
      effect(() => {
        const val = resolveValue(props.v!, state);
        if (type === 'I' || type === 'S') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'C') {
          (el as HTMLInputElement).checked = Boolean(val);
        }
      });
    }
  }

  // Handle checked binding for checkboxes
  if (props.ch !== undefined) {
    if (isStateRef(props.ch as unknown)) {
      effect(() => {
        const val = resolveValue(props.ch as unknown as StateRef, state);
        (el as HTMLInputElement).checked = Boolean(val);
      });
    } else {
      (el as HTMLInputElement).checked = Boolean(props.ch);
    }
  }

  // Event handlers
  if (props.c) {
    el.addEventListener('click', createHandler(props.c, state));
  }
  if (props.x) {
    const handler = props.x;
    el.addEventListener('input', (e) => {
      if (typeof handler === 'function') {
        handler();
      } else {
        const [stateKey, op] = handler;
        const sig = state[stateKey];
        if (sig) {
          const target = e.target as HTMLInputElement;
          const val = type === 'C' ? target.checked : target.value;
          applyOp(sig, op, val);
        }
      }
    });
  }
  if (props.f) {
    el.addEventListener('focus', createHandler(props.f, state));
  }
  if (props.b) {
    el.addEventListener('blur', createHandler(props.b, state));
  }

  return el;
}

// ============ Main API ============

interface TooeyInstance {
  state: StateStore;
  el: HTMLElement;
  update(newSpec: TooeySpec): void;
  get(key: string): unknown;
  set(key: string, value: unknown): void;
}

function render(container: HTMLElement, spec: TooeySpec): TooeyInstance {
  // Initialize state
  const state: StateStore = {};
  if (spec.s) {
    Object.entries(spec.s).forEach(([key, val]) => {
      state[key] = signal(val);
    });
  }

  // Clear container and render
  container.innerHTML = '';
  const el = createElement(spec.r, state);
  container.appendChild(el);

  const instance: TooeyInstance = {
    state,
    el,
    update(newSpec: TooeySpec) {
      // Update state values
      if (newSpec.s) {
        Object.entries(newSpec.s).forEach(([key, val]) => {
          if (state[key]) {
            state[key].set(val);
          } else {
            state[key] = signal(val);
          }
        });
      }
      // Re-render if root changed
      if (newSpec.r) {
        container.innerHTML = '';
        const newEl = createElement(newSpec.r, state);
        container.appendChild(newEl);
        instance.el = newEl;
      }
    },
    get(key: string) {
      return state[key]?.();
    },
    set(key: string, value: unknown) {
      if (state[key]) {
        state[key].set(value);
      }
    }
  };

  return instance;
}

// ============ Convenience Helpers ============

// State reference helper
function $(name: string): StateRef {
  return { $: name };
}

// Component factory helpers for even more compact syntax
const V = 'V' as const;
const H = 'H' as const;
const D = 'D' as const;
const T = 'T' as const;
const B = 'B' as const;
const I = 'I' as const;
const S = 'S' as const;
const C = 'C' as const;
const M = 'M' as const;
const L = 'L' as const;
const G = 'G' as const;

// Export everything
export {
  render,
  signal,
  effect,
  $,
  V, H, D, T, B, I, S, C, M, L, G,
  TooeySpec,
  NodeSpec,
  Props,
  StateRef,
  TooeyInstance
};
