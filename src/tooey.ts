/**
 * tooey - token-efficient ui library for llms
 *
 * component types:
 *   layout:
 *     V = vstack (vertical flex)
 *     H = hstack (horizontal flex)
 *     D = div (generic container)
 *     G = grid
 *
 *   text & buttons:
 *     T = text (span)
 *     B = button
 *
 *   inputs:
 *     I = input
 *     Ta = textarea
 *     S = select
 *     C = checkbox
 *     R = radio
 *
 *   tables:
 *     Tb = table
 *     Th = thead
 *     Tb = tbody (use Tbd to distinguish)
 *     Tr = tr (table row)
 *     Td = td (table cell)
 *     Tc = th (table header cell)
 *
 *   lists:
 *     Ul = ul (unordered list)
 *     Ol = ol (ordered list)
 *     Li = li (list item)
 *
 *   media & links:
 *     M = image
 *     L = link
 *     Sv = svg container
 *
 * props (short keys):
 *   spacing/sizing:
 *     g = gap, p = padding, m = margin
 *     w = width, h = height
 *     mw = max-width, mh = max-height
 *
 *   colors:
 *     bg = background, fg = color, o = opacity
 *
 *   borders:
 *     r = border-radius
 *     bw = border-width, bc = border-color, bs = border-style
 *
 *   positioning:
 *     pos = position (rel/abs/fix/sticky)
 *     z = z-index
 *     t = top, l = left, b = bottom, rt = right
 *
 *   typography:
 *     fs = font-size, fw = font-weight, ff = font-family
 *     ta = text-align, td = text-decoration
 *     lh = line-height, ls = letter-spacing
 *
 *   layout:
 *     d = display, f = flex, ai = align-items, jc = justify-content
 *     fw = flex-wrap (use flw to avoid conflict with font-weight)
 *     cols = grid columns, rows = grid rows
 *
 *   misc:
 *     cur = cursor, ov = overflow, op = opacity
 *     pe = pointer-events, us = user-select
 *     sh = box-shadow, tr = transform
 *
 *   element-specific:
 *     v = value, ph = placeholder, t = type
 *     href, src, alt
 *     d = disabled, ch = checked, ro = readonly
 *     opts = select options
 *     cls = class, id = id
 *
 * events:
 *   c = click, x = change/input
 *   f = focus, bl = blur
 *   k = keydown, ku = keyup, kp = keypress
 *   e = mouseenter, lv = mouseleave
 *   sub = submit
 *
 * state operations:
 *   + = increment, - = decrement
 *   ! = set value, ~ = toggle boolean
 *   < = append to array, > = prepend to array
 *   X = remove from array, . = set property on object
 *
 * control flow:
 *   {if: stateRef, then: [...], else: [...]}
 *   {map: stateRef, as: (item, i) => [...]}
 */

// ============ types ============

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
  // spacing/sizing
  g?: number | string;    // gap
  p?: number | string;    // padding
  m?: number | string;    // margin
  w?: number | string;    // width
  h?: number | string;    // height
  mw?: number | string;   // max-width
  mh?: number | string;   // max-height

  // colors
  bg?: string;            // background
  fg?: string;            // color
  o?: number;             // opacity

  // borders
  r?: number | string;    // border-radius
  bw?: number | string;   // border-width
  bc?: string;            // border-color
  bs?: string;            // border-style

  // positioning
  pos?: 'rel' | 'abs' | 'fix' | 'sticky' | string;  // position
  z?: number;             // z-index
  t?: number | string;    // top
  l?: number | string;    // left
  b?: number | string;    // bottom (note: conflicts with blur event, use context)
  rt?: number | string;   // right

  // typography
  fs?: number | string;   // font-size
  fw?: number | string;   // font-weight
  ff?: string;            // font-family
  ta?: string;            // text-align
  td?: string;            // text-decoration
  lh?: number | string;   // line-height
  ls?: number | string;   // letter-spacing

  // layout
  ai?: string;            // align-items
  jc?: string;            // justify-content
  flw?: string;           // flex-wrap
  cols?: number | string; // grid columns
  rows?: number | string; // grid rows

  // misc
  cur?: string;           // cursor
  ov?: string;            // overflow
  pe?: string;            // pointer-events
  us?: string;            // user-select
  sh?: string;            // box-shadow
  tr?: string;            // transform

  // element-specific
  v?: unknown;            // value
  ph?: string;            // placeholder
  type?: string;          // input type
  href?: string;          // link href
  src?: string;           // image src
  alt?: string;           // image alt
  dis?: boolean;          // disabled
  ch?: unknown;           // checked
  ro?: boolean;           // readonly
  opts?: Array<{v: string, l: string}>; // select options
  cls?: string;           // class
  id?: string;            // id
  rw?: number;            // textarea rows
  sp?: number;            // colspan
  rsp?: number;           // rowspan

  // events
  c?: EventHandler;       // click
  x?: EventHandler;       // change/input
  f?: EventHandler;       // focus
  bl?: EventHandler;      // blur
  k?: EventHandler;       // keydown
  ku?: EventHandler;      // keyup
  kp?: EventHandler;      // keypress
  e?: EventHandler;       // mouseenter
  lv?: EventHandler;      // mouseleave
  sub?: EventHandler;     // submit

  // custom styles
  s?: Record<string, unknown>;
}

type ComponentType =
  | 'V' | 'H' | 'D' | 'G'           // layout
  | 'T' | 'B'                       // text & button
  | 'I' | 'Ta' | 'S' | 'C' | 'R'    // inputs
  | 'Tb' | 'Th' | 'Tbd' | 'Tr' | 'Td' | 'Tc'  // table
  | 'Ul' | 'Ol' | 'Li'             // lists
  | 'M' | 'L' | 'Sv';              // media & links

// state reference
type StateRef = { $: string };

// control flow
interface IfNode {
  if: StateRef | string;
  then: NodeSpec | NodeSpec[];
  else?: NodeSpec | NodeSpec[];
}

interface MapNode {
  map: StateRef | string;
  as: NodeSpec;
  key?: string;
}

type Content = string | number | StateRef | NodeSpec[] | IfNode | MapNode;
type NodeSpec = [ComponentType, Content?, Props?] | IfNode | MapNode;

interface TooeySpec {
  s?: Record<string, StateValue>;  // initial state
  r: NodeSpec;                      // root node
}

// ============ signals ============

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

// ============ state operations ============

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

// ============ helpers ============

function isStateRef(v: unknown): v is StateRef {
  return typeof v === 'object' && v !== null && '$' in v;
}

function isIfNode(v: unknown): v is IfNode {
  return typeof v === 'object' && v !== null && 'if' in v;
}

function isMapNode(v: unknown): v is MapNode {
  return typeof v === 'object' && v !== null && 'map' in v;
}

function resolveValue(content: unknown, state: StateStore): unknown {
  if (isStateRef(content)) {
    const sig = state[content.$];
    return sig ? sig() : undefined;
  }
  return content;
}

function resolveCssValue(val: number | string | undefined): string | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') return `${val}px`;
  return val;
}

function createHandler(handler: EventHandler, state: StateStore, event?: Event): () => void {
  if (typeof handler === 'function') {
    return handler;
  }
  const [stateKey, op, val] = handler;
  return () => {
    const sig = state[stateKey];
    if (sig) {
      // for input events, use the event target value if val is not provided
      let actualVal = val;
      if (op === '!' && val === undefined && event) {
        const target = event.target as HTMLInputElement;
        actualVal = target.type === 'checkbox' ? target.checked : target.value;
      }
      applyOp(sig, op, actualVal);
    }
  };
}

// ============ styles ============

function applyStyles(el: HTMLElement, props: Props): void {
  const style = el.style;

  // spacing/sizing
  if (props.g !== undefined) style.gap = resolveCssValue(props.g)!;
  if (props.p !== undefined) style.padding = resolveCssValue(props.p)!;
  if (props.m !== undefined) style.margin = resolveCssValue(props.m)!;
  if (props.w !== undefined) style.width = resolveCssValue(props.w)!;
  if (props.h !== undefined) style.height = resolveCssValue(props.h)!;
  if (props.mw !== undefined) style.maxWidth = resolveCssValue(props.mw)!;
  if (props.mh !== undefined) style.maxHeight = resolveCssValue(props.mh)!;

  // colors
  if (props.bg !== undefined) style.background = props.bg;
  if (props.fg !== undefined) style.color = props.fg;
  if (props.o !== undefined) style.opacity = String(props.o);

  // borders
  if (props.r !== undefined) style.borderRadius = resolveCssValue(props.r)!;
  if (props.bw !== undefined) style.borderWidth = resolveCssValue(props.bw)!;
  if (props.bc !== undefined) style.borderColor = props.bc;
  if (props.bs !== undefined) style.borderStyle = props.bs;

  // positioning
  if (props.pos !== undefined) {
    const posMap: Record<string, string> = {
      rel: 'relative', abs: 'absolute', fix: 'fixed', sticky: 'sticky'
    };
    style.position = posMap[props.pos] || props.pos;
  }
  if (props.z !== undefined) style.zIndex = String(props.z);
  if (props.t !== undefined) style.top = resolveCssValue(props.t)!;
  if (props.l !== undefined) style.left = resolveCssValue(props.l)!;
  // props.b is bottom in positioning context (handled separately from blur event)
  if (typeof props.b === 'number' || (typeof props.b === 'string' && !Array.isArray(props.b))) {
    style.bottom = resolveCssValue(props.b as number | string)!;
  }
  if (props.rt !== undefined) style.right = resolveCssValue(props.rt)!;

  // typography
  if (props.fs !== undefined) style.fontSize = resolveCssValue(props.fs)!;
  if (props.fw !== undefined) style.fontWeight = String(props.fw);
  if (props.ff !== undefined) style.fontFamily = props.ff;
  if (props.ta !== undefined) style.textAlign = props.ta;
  if (props.td !== undefined) style.textDecoration = props.td;
  if (props.lh !== undefined) style.lineHeight = typeof props.lh === 'number' ? String(props.lh) : props.lh;
  if (props.ls !== undefined) style.letterSpacing = resolveCssValue(props.ls)!;

  // layout
  if (props.ai !== undefined) style.alignItems = props.ai;
  if (props.jc !== undefined) style.justifyContent = props.jc;
  if (props.flw !== undefined) style.flexWrap = props.flw;

  // misc
  if (props.cur !== undefined) style.cursor = props.cur;
  if (props.ov !== undefined) style.overflow = props.ov;
  if (props.pe !== undefined) style.pointerEvents = props.pe;
  if (props.us !== undefined) style.userSelect = props.us;
  if (props.sh !== undefined) style.boxShadow = props.sh;
  if (props.tr !== undefined) style.transform = props.tr;

  // custom style object
  if (props.s) {
    Object.entries(props.s).forEach(([key, val]) => {
      (style as unknown as Record<string, string>)[key] = String(val);
    });
  }
}

// ============ renderer ============

function createElement(spec: NodeSpec, state: StateStore, itemContext?: { item: unknown, index: number }): HTMLElement | Text | null {
  // handle if node
  if (isIfNode(spec)) {
    const condition = typeof spec.if === 'string'
      ? state[spec.if]?.()
      : resolveValue(spec.if, state);

    const branch = condition ? spec.then : spec.else;
    if (!branch) return null;

    if (Array.isArray(branch) && branch.length > 0 && Array.isArray(branch[0])) {
      // multiple nodes - wrap in fragment-like div
      const wrapper = document.createElement('div');
      wrapper.style.display = 'contents';
      (branch as NodeSpec[]).forEach(child => {
        const el = createElement(child, state, itemContext);
        if (el) wrapper.appendChild(el);
      });
      return wrapper;
    }
    return createElement(branch as NodeSpec, state, itemContext);
  }

  // handle map node
  if (isMapNode(spec)) {
    const arr = (typeof spec.map === 'string'
      ? state[spec.map]?.()
      : resolveValue(spec.map, state)) as unknown[];

    if (!Array.isArray(arr)) return null;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'contents';

    arr.forEach((item, index) => {
      const el = createElement(spec.as, state, { item, index });
      if (el) wrapper.appendChild(el);
    });

    return wrapper;
  }

  const [type, content, props = {}] = spec as [ComponentType, Content?, Props?];
  let el: HTMLElement;

  switch (type) {
    // layout
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
      if (props.cols) {
        el.style.gridTemplateColumns = typeof props.cols === 'number'
          ? `repeat(${props.cols}, 1fr)`
          : props.cols;
      }
      if (props.rows) {
        el.style.gridTemplateRows = typeof props.rows === 'number'
          ? `repeat(${props.rows}, 1fr)`
          : props.rows;
      }
      break;
    case 'D':
      el = document.createElement('div');
      break;

    // text & button
    case 'T':
      el = document.createElement('span');
      break;
    case 'B':
      el = document.createElement('button');
      break;

    // inputs
    case 'I':
      el = document.createElement('input');
      (el as HTMLInputElement).type = props.type || 'text';
      if (props.ph) (el as HTMLInputElement).placeholder = props.ph;
      if (props.ro) (el as HTMLInputElement).readOnly = true;
      break;
    case 'Ta':
      el = document.createElement('textarea');
      if (props.ph) (el as HTMLTextAreaElement).placeholder = props.ph;
      if (props.rw) (el as HTMLTextAreaElement).rows = props.rw;
      if (props.ro) (el as HTMLTextAreaElement).readOnly = true;
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
    case 'R':
      el = document.createElement('input');
      (el as HTMLInputElement).type = 'radio';
      break;

    // tables
    case 'Tb':
      el = document.createElement('table');
      break;
    case 'Th':
      el = document.createElement('thead');
      break;
    case 'Tbd':
      el = document.createElement('tbody');
      break;
    case 'Tr':
      el = document.createElement('tr');
      break;
    case 'Td':
      el = document.createElement('td');
      if (props.sp) (el as HTMLTableCellElement).colSpan = props.sp;
      if (props.rsp) (el as HTMLTableCellElement).rowSpan = props.rsp;
      break;
    case 'Tc':
      el = document.createElement('th');
      if (props.sp) (el as HTMLTableCellElement).colSpan = props.sp;
      if (props.rsp) (el as HTMLTableCellElement).rowSpan = props.rsp;
      break;

    // lists
    case 'Ul':
      el = document.createElement('ul');
      break;
    case 'Ol':
      el = document.createElement('ol');
      break;
    case 'Li':
      el = document.createElement('li');
      break;

    // media & links
    case 'M':
      el = document.createElement('img');
      if (props.src) (el as HTMLImageElement).src = props.src;
      if (props.alt) (el as HTMLImageElement).alt = props.alt;
      break;
    case 'L':
      el = document.createElement('a');
      if (props.href) (el as HTMLAnchorElement).href = props.href;
      break;
    case 'Sv':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as unknown as HTMLElement;
      break;

    default:
      el = document.createElement('div');
  }

  // apply common attributes
  if (props.cls) el.className = props.cls;
  if (props.id) el.id = props.id;
  if (props.dis) (el as HTMLButtonElement).disabled = true;

  applyStyles(el, props);

  // handle content
  if (content !== undefined) {
    if (Array.isArray(content) && content.length > 0 && (Array.isArray(content[0]) || isIfNode(content[0]) || isMapNode(content[0]))) {
      // children array
      (content as NodeSpec[]).forEach(childSpec => {
        const child = createElement(childSpec, state, itemContext);
        if (child) el.appendChild(child);
      });
    } else if (isIfNode(content) || isMapNode(content)) {
      const child = createElement(content as NodeSpec, state, itemContext);
      if (child) el.appendChild(child);
    } else if (isStateRef(content)) {
      // reactive text content
      effect(() => {
        const val = resolveValue(content, state);
        if (type === 'I') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'Ta') {
          (el as HTMLTextAreaElement).value = String(val ?? '');
        } else if (type === 'C' || type === 'R') {
          (el as HTMLInputElement).checked = Boolean(val);
        } else {
          el.textContent = String(val ?? '');
        }
      });
    } else if (typeof content === 'string' || typeof content === 'number') {
      // check for item context placeholders
      let textContent = String(content);
      if (itemContext) {
        textContent = textContent.replace(/\$item/g, String(itemContext.item));
        textContent = textContent.replace(/\$index/g, String(itemContext.index));
        // handle object property access like $item.name
        if (typeof itemContext.item === 'object' && itemContext.item !== null) {
          textContent = textContent.replace(/\$item\.(\w+)/g, (_, key) => {
            return String((itemContext.item as Record<string, unknown>)[key] ?? '');
          });
        }
      }

      if (type === 'I') {
        (el as HTMLInputElement).value = textContent;
      } else if (type === 'Ta') {
        (el as HTMLTextAreaElement).value = textContent;
      } else {
        el.textContent = textContent;
      }
    }
  }

  // handle value binding for inputs
  if (props.v !== undefined) {
    if (isStateRef(props.v)) {
      effect(() => {
        const val = resolveValue(props.v!, state);
        if (type === 'I' || type === 'S' || type === 'Ta') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'C' || type === 'R') {
          (el as HTMLInputElement).checked = Boolean(val);
        }
      });
    }
  }

  // handle checked binding
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

  // event handlers
  if (props.c) {
    el.addEventListener('click', (e) => createHandler(props.c!, state, e)());
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
          const val = (type === 'C' || type === 'R') ? target.checked : target.value;
          applyOp(sig, op, val);
        }
      }
    });
  }
  if (props.f) {
    el.addEventListener('focus', (e) => createHandler(props.f!, state, e)());
  }
  if (props.bl) {
    el.addEventListener('blur', (e) => createHandler(props.bl!, state, e)());
  }
  if (props.k) {
    el.addEventListener('keydown', (e) => createHandler(props.k!, state, e)());
  }
  if (props.ku) {
    el.addEventListener('keyup', (e) => createHandler(props.ku!, state, e)());
  }
  if (props.kp) {
    el.addEventListener('keypress', (e) => createHandler(props.kp!, state, e)());
  }
  if (props.e) {
    el.addEventListener('mouseenter', (e) => createHandler(props.e!, state, e)());
  }
  if (props.lv) {
    el.addEventListener('mouseleave', (e) => createHandler(props.lv!, state, e)());
  }
  if (props.sub) {
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      createHandler(props.sub!, state, e)();
    });
  }

  return el;
}

// ============ main api ============

interface TooeyInstance {
  state: StateStore;
  el: HTMLElement | Text | null;
  update(newSpec: TooeySpec): void;
  get(key: string): unknown;
  set(key: string, value: unknown): void;
}

function render(container: HTMLElement, spec: TooeySpec): TooeyInstance {
  // initialize state
  const state: StateStore = {};
  if (spec.s) {
    Object.entries(spec.s).forEach(([key, val]) => {
      state[key] = signal(val);
    });
  }

  // clear container and render
  container.innerHTML = '';
  const el = createElement(spec.r, state);
  if (el) container.appendChild(el);

  const instance: TooeyInstance = {
    state,
    el,
    update(newSpec: TooeySpec) {
      // update state values
      if (newSpec.s) {
        Object.entries(newSpec.s).forEach(([key, val]) => {
          if (state[key]) {
            state[key].set(val);
          } else {
            state[key] = signal(val);
          }
        });
      }
      // re-render if root changed
      if (newSpec.r) {
        container.innerHTML = '';
        const newEl = createElement(newSpec.r, state);
        if (newEl) container.appendChild(newEl);
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

// ============ convenience helpers ============

function $(name: string): StateRef {
  return { $: name };
}

// component type constants
const V = 'V' as const;
const H = 'H' as const;
const D = 'D' as const;
const G = 'G' as const;
const T = 'T' as const;
const B = 'B' as const;
const I = 'I' as const;
const Ta = 'Ta' as const;
const S = 'S' as const;
const C = 'C' as const;
const R = 'R' as const;
const Tb = 'Tb' as const;
const Th = 'Th' as const;
const Tbd = 'Tbd' as const;
const Tr = 'Tr' as const;
const Td = 'Td' as const;
const Tc = 'Tc' as const;
const Ul = 'Ul' as const;
const Ol = 'Ol' as const;
const Li = 'Li' as const;
const M = 'M' as const;
const L = 'L' as const;
const Sv = 'Sv' as const;

// export everything
export {
  render,
  signal,
  effect,
  $,
  // layout
  V, H, D, G,
  // text & button
  T, B,
  // inputs
  I, Ta, S, C, R,
  // table
  Tb, Th, Tbd, Tr, Td, Tc,
  // lists
  Ul, Ol, Li,
  // media & links
  M, L, Sv,
  // types
  TooeySpec,
  NodeSpec,
  Props,
  StateRef,
  TooeyInstance,
  IfNode,
  MapNode
};
