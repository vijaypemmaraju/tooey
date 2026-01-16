/**
 * tooey - token-efficient ui library for llms
 *
 * component types:
 *   layout: V (vstack), H (hstack), D (div), G (grid)
 *   text & buttons: T (text/span), B (button)
 *   inputs: I (input), Ta (textarea), S (select), C (checkbox), R (radio)
 *   tables: Tb (table), Th (thead), Tbd (tbody), Tr (tr), Td (td), Tc (th)
 *   lists: Ul (ul), Ol (ol), Li (li)
 *   media & links: M (image), L (link), Sv (svg)
 *
 * props (short keys):
 *   spacing: g (gap), p (padding), m (margin), w (width), h (height), mw, mh
 *   colors: bg (background), fg (color), o (opacity)
 *   borders: r (border-radius), bw (border-width), bc (border-color), bs (border-style)
 *   positioning: pos (position), z (z-index), t (top), l (left), rt (right)
 *   typography: fs (font-size), fw (font-weight), ff (font-family), ta, td, lh, ls
 *   layout: ai (align-items), jc (justify-content), flw (flex-wrap), cols, rows
 *     shortcuts: c=center, sb=space-between, fe=flex-end, fs=flex-start, st=stretch
 *   misc: cur (cursor), ov (overflow), pe (pointer-events), us (user-select), sh, tr
 *   element-specific: v (value), ph (placeholder), type, href, src, alt, dis, ch, ro, opts
 *
 * events: c (click), x (input/change), f (focus), bl (blur), k (keydown), ku, kp, e, lv, sub
 *   shorthand: "state+" (increment), "state-" (decrement), "state~" (toggle), "state!val" (set)
 *
 * state operations: + (increment), - (decrement), ! (set), ~ (toggle), < (append), > (prepend), X (remove), . (set prop)
 *
 * control flow (short form): {?: cond, t: [...], e: [...]} | {m: state, a: [...]}
 * control flow (long form): {if: state, then: [...], else: [...]} | {map: state, as: [...]}
 * equality check: {?: "state", is: 0, t: [...]} or {?: {$:"state"}, is: 0, t: [...]}
 */

// ============ types ============

type StateValue = unknown;
type StateStore = Record<string, Signal<StateValue>>;

// ============ theming ============

type ThemeValue = string | number;
type ThemeCategory = Record<string, ThemeValue>;

interface Theme {
  colors?: ThemeCategory;
  spacing?: ThemeCategory;
  radius?: ThemeCategory;
  fonts?: ThemeCategory;
  [key: string]: ThemeCategory | undefined;
}

// ============ plugins ============

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

  // extend instance with custom methods
  extend?: Record<string, (this: TooeyInstance, ...args: unknown[]) => unknown>;
}

interface RenderOptions {
  theme?: Theme;
  plugins?: TooeyPlugin[];
}

interface Signal<T> {
  (): T;
  set(v: T | ((prev: T) => T)): void;
  sub(fn: () => void): () => void;
}

type Op = '+' | '-' | '!' | '~' | '<' | '>' | 'X' | '.';
type EventHandler = [string, Op, unknown?] | (() => void) | string;

interface Props {
  // spacing/sizing
  g?: number | string;
  p?: number | string;
  m?: number | string;
  w?: number | string;
  h?: number | string;
  mw?: number | string;
  mh?: number | string;
  // colors
  bg?: string;
  fg?: string;
  o?: number;
  // borders
  r?: number | string;
  bw?: number | string;
  bc?: string;
  bs?: string;
  // positioning
  pos?: 'rel' | 'abs' | 'fix' | 'sticky' | string;
  z?: number;
  t?: number | string;
  l?: number | string;
  b?: number | string;
  rt?: number | string;
  // typography
  fs?: number | string;
  fw?: number | string;
  ff?: string;
  ta?: string;
  td?: string;
  lh?: number | string;
  ls?: number | string;
  // layout
  ai?: string;
  jc?: string;
  flw?: string;
  cols?: number | string;
  rows?: number | string;
  // misc
  cur?: string;
  ov?: string;
  pe?: string;
  us?: string;
  sh?: string;
  tr?: string;
  // element-specific
  v?: unknown;
  ph?: string;
  type?: string;
  href?: string;
  src?: string;
  alt?: string;
  dis?: boolean;
  ch?: unknown;
  ro?: boolean;
  opts?: Array<{v: string, l: string}>;
  cls?: string;
  id?: string;
  rw?: number;
  sp?: number;
  rsp?: number;
  // events
  c?: EventHandler;
  x?: EventHandler;
  f?: EventHandler;
  bl?: EventHandler;
  k?: EventHandler;
  ku?: EventHandler;
  kp?: EventHandler;
  e?: EventHandler;
  lv?: EventHandler;
  sub?: EventHandler;
  // custom styles
  s?: Record<string, unknown>;
}

type ComponentType =
  | 'V' | 'H' | 'D' | 'G'
  | 'T' | 'B'
  | 'I' | 'Ta' | 'S' | 'C' | 'R'
  | 'Tb' | 'Th' | 'Tbd' | 'Tr' | 'Td' | 'Tc'
  | 'Ul' | 'Ol' | 'Li'
  | 'M' | 'L' | 'Sv';

// function component type - returns a NodeSpec
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;

type StateRef = { $: string };

interface IfNode {
  // long form
  if?: StateRef | string;
  then?: NodeSpec | NodeSpec[];
  else?: NodeSpec | NodeSpec[];
  // short form
  '?'?: StateRef | string;
  t?: NodeSpec | NodeSpec[];
  e?: NodeSpec | NodeSpec[];
  // equality check (works with both forms)
  eq?: unknown;
  is?: unknown;
}

interface MapNode {
  // long form
  map?: StateRef | string;
  as?: NodeSpec;
  // short form
  m?: StateRef | string;
  a?: NodeSpec;
  key?: string;
}

type Content = string | number | StateRef | NodeSpec[] | IfNode | MapNode;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionNodeSpec = [Component<any>, Content?, (Props & Record<string, unknown>)?];
type BuiltinNodeSpec = [ComponentType, Content?, Props?];
type NodeSpec = BuiltinNodeSpec | FunctionNodeSpec | IfNode | MapNode;

interface TooeySpec {
  s?: Record<string, StateValue>;
  r: NodeSpec;
}

// ============ render context for cleanup ============

interface ErrorInfo {
  message: string;
  componentType?: string;
  stack?: string;
}

type ErrorHandler = (error: ErrorInfo) => void;

interface RenderContext {
  cleanups: Array<() => void>;
  state: StateStore;
  theme?: Theme;
  plugins?: TooeyPlugin[];
  onError?: ErrorHandler;
}

// ============ error boundary ============

interface ErrorBoundaryNode {
  boundary: true;
  child: NodeSpec;
  fallback?: NodeSpec;
  onError?: ErrorHandler;
}

function isErrorBoundaryNode(v: unknown): v is ErrorBoundaryNode {
  return typeof v === 'object' && v !== null && 'boundary' in v && (v as ErrorBoundaryNode).boundary === true;
}

function createErrorFallback(error: ErrorInfo): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = 'padding:12px;background:#fee;border:1px solid #fcc;border-radius:4px;color:#c00;font-family:monospace;font-size:12px';
  el.textContent = `[tooey error] ${error.message}`;
  return el;
}

// ============ signals ============

let currentEffect: (() => void) | null = null;
let batchDepth = 0;
let pendingEffects = new Set<() => void>();

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
      if (batchDepth > 0) {
        subscribers.forEach(fn => pendingEffects.add(fn));
      } else {
        subscribers.forEach(fn => fn());
      }
    }
  };

  sig.sub = (fn: () => void) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  };

  return sig;
}

function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      const effects = pendingEffects;
      pendingEffects = new Set();
      effects.forEach(fn => fn());
    }
  }
}

function effect(fn: () => void, ctx?: RenderContext): () => void {
  let isActive = true;

  const execute = () => {
    if (!isActive) return;
    currentEffect = execute;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };

  execute();

  const cleanup = () => {
    isActive = false;
    currentEffect = null;
  };

  if (ctx) {
    ctx.cleanups.push(cleanup);
  }

  return cleanup;
}

// computed signal - derives value from other signals and auto-updates
interface ComputedSignal<T> {
  (): T;
  sub(fn: () => void): () => void;
}

function computed<T>(fn: () => T): ComputedSignal<T> {
  let cachedValue: T;
  let isDirty = true;
  const subscribers = new Set<() => void>();

  // re-compute and notify subscribers when dependencies change
  const recompute = () => {
    isDirty = true;
    // notify all subscribers that the value may have changed
    if (batchDepth > 0) {
      subscribers.forEach(sub => pendingEffects.add(sub));
    } else {
      subscribers.forEach(sub => sub());
    }
  };

  const sig = (() => {
    // track this computed as a dependency if inside an effect
    if (currentEffect) {
      subscribers.add(currentEffect);
    }

    // recompute if dirty
    if (isDirty) {
      // track dependencies by running the computation inside an effect context
      const prevEffect = currentEffect;
      currentEffect = recompute;
      try {
        cachedValue = fn();
      } finally {
        currentEffect = prevEffect;
      }
      isDirty = false;
    }

    return cachedValue;
  }) as ComputedSignal<T>;

  sig.sub = (subFn: () => void) => {
    subscribers.add(subFn);
    return () => subscribers.delete(subFn);
  };

  return sig;
}

// async$ helper - handle async data with loading states
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  [key: string]: unknown; // index signature for TooeySpec.s compatibility
}

interface AsyncSpec<T> {
  s: AsyncState<T>;
  init(instance: TooeyInstance): Promise<void>;
}

function async$<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  options?: { onError?: (error: Error) => void }
): AsyncSpec<T> {
  return {
    s: {
      data: null,
      loading: true,
      error: null
    },
    async init(instance: TooeyInstance) {
      try {
        const promise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
        const data = await promise;
        instance.set('data', data);
        instance.set('loading', false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        instance.set('error', errorMessage);
        instance.set('loading', false);
        if (options?.onError && err instanceof Error) {
          options.onError(err);
        }
      }
    }
  };
}

// ============ state operations ============

function applyOp(state: Signal<StateValue>, op: Op, val?: unknown): void {
  try {
    switch (op) {
      case '+':
        state.set((v: StateValue) => (v as number) + (typeof val === 'number' ? val : 1));
        break;
      case '-':
        state.set((v: StateValue) => (v as number) - (typeof val === 'number' ? val : 1));
        break;
      case '!':
        state.set(val);
        break;
      case '~':
        state.set((v: StateValue) => !v);
        break;
      case '<':
        state.set((v: StateValue) => [...(v as unknown[]), val]);
        break;
      case '>':
        state.set((v: StateValue) => [val, ...(v as unknown[])]);
        break;
      case 'X':
        state.set((v: StateValue) => {
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
          state.set((v: StateValue) => ({ ...(v as Record<string, unknown>), [val[0]]: val[1] }));
        }
        break;
    }
  } catch (err) {
    console.warn('[tooey] state operation error:', op, err);
  }
}

// ============ helpers ============

function isStateRef(v: unknown): v is StateRef {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && '$' in v;
}

function isIfNode(v: unknown): v is IfNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && ('if' in v || '?' in v);
}

function isMapNode(v: unknown): v is MapNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && ('map' in v || 'm' in v);
}

function resolveValue(content: unknown, state: StateStore): unknown {
  if (isStateRef(content)) {
    const sig = state[content.$];
    if (!sig) {
      console.warn(`[tooey] unknown state key: "${content.$}"`);
      return undefined;
    }
    return sig();
  }
  return content;
}

function resolveCssValue(val: number | string | undefined): string | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') return `${val}px`;
  return val;
}

function resolveThemeValue(token: string, theme: Theme | undefined): ThemeValue | undefined {
  if (!theme) return undefined;

  // try direct category lookup: $primary -> colors.primary, $md -> spacing.md, etc.
  // check in order of most common usage
  const categories: (keyof Theme)[] = ['colors', 'spacing', 'radius', 'fonts'];

  for (const category of categories) {
    const cat = theme[category];
    if (cat && token in cat) {
      return cat[token];
    }
  }

  // check any custom categories
  for (const [key, cat] of Object.entries(theme)) {
    if (cat && !categories.includes(key as keyof Theme) && token in cat) {
      return cat[token];
    }
  }

  return undefined;
}

// style value shortcuts for common layout values
const styleShortcuts: Record<string, string> = {
  'c': 'center',
  'sb': 'space-between',
  'sa': 'space-around',
  'se': 'space-evenly',
  'fe': 'flex-end',
  'fs': 'flex-start',
  'st': 'stretch',
  'bl': 'baseline',
};

function expandStyleValue(val: string | undefined): string | undefined {
  if (val === undefined) return undefined;
  return styleShortcuts[val] || val;
}

// parse string-based event handler shorthand
// format: "stateName+" | "stateName-" | "stateName~" | "stateName!value"
function parseEventShorthand(str: string): [string, Op, unknown?] | null {
  if (typeof str !== 'string' || str.length < 2) return null;

  const lastChar = str[str.length - 1];

  // simple ops: +, -, ~
  if (lastChar === '+' || lastChar === '-' || lastChar === '~') {
    return [str.slice(0, -1), lastChar as Op];
  }

  // set operation with value: "state!value"
  const bangIdx = str.indexOf('!');
  if (bangIdx > 0) {
    const stateKey = str.slice(0, bangIdx);
    const valStr = str.slice(bangIdx + 1);
    // try to parse as number or boolean
    let val: unknown = valStr;
    if (valStr === 'true') val = true;
    else if (valStr === 'false') val = false;
    else if (!isNaN(Number(valStr)) && valStr !== '') val = Number(valStr);
    return [stateKey, '!', val];
  }

  return null;
}

// xss protection - escape html entities (kept for future use, textContent provides protection now)
function _escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// url validation - prevent dangerous protocols
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];

function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  // allow relative urls and anchors
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('.')) {
    return true;
  }

  try {
    const parsed = new URL(url, window.location.href);
    return SAFE_URL_PROTOCOLS.includes(parsed.protocol);
  } catch {
    // if url parsing fails, check for dangerous patterns directly
    const lowerUrl = url.toLowerCase().trim();
    const dangerousPatterns = ['javascript:', 'data:', 'vbscript:'];
    return !dangerousPatterns.some(pattern => lowerUrl.startsWith(pattern));
  }
}

function sanitizeUrl(url: string, propName: string): string | null {
  if (!url) return null;

  if (!isValidUrl(url)) {
    console.warn(`[tooey] blocked unsafe URL in ${propName}: "${url.slice(0, 50)}..."`);
    return null;
  }

  return url;
}

function createHandler(
  handler: EventHandler,
  state: StateStore,
  event?: Event,
  itemContext?: { item: unknown, index: number },
  buttonText?: string
): () => void {
  if (typeof handler === 'function') {
    return handler;
  }

  // handle string shorthand: "state+", "state-", "state~", "state!value"
  let normalizedHandler: [string, Op, unknown?];
  if (typeof handler === 'string') {
    const parsed = parseEventShorthand(handler);
    if (parsed) {
      normalizedHandler = parsed;
    } else {
      // plain state key - infer operation from button text if available
      if (buttonText === '+') {
        normalizedHandler = [handler, '+'];
      } else if (buttonText === '-') {
        normalizedHandler = [handler, '-'];
      } else {
        // default to toggle for plain state key
        normalizedHandler = [handler, '~'];
      }
    }
  } else {
    normalizedHandler = handler;
  }

  const [stateKey, op, val] = normalizedHandler;
  return () => {
    const sig = state[stateKey];
    if (!sig) {
      console.warn(`[tooey] click handler: unknown state key "${stateKey}"`);
      return;
    }
    let actualVal = val;
    // resolve $item and $index in event handler values
    if (itemContext && typeof actualVal === 'string') {
      if (actualVal === '$index') {
        actualVal = itemContext.index;
      } else if (actualVal === '$item') {
        actualVal = itemContext.item;
      } else if (actualVal.startsWith('$item.')) {
        const key = actualVal.substring(6);
        actualVal = (itemContext.item as Record<string, unknown>)?.[key];
      }
    }
    if (op === '!' && val === undefined && event) {
      const target = event.target as HTMLInputElement;
      actualVal = target.type === 'checkbox' ? target.checked : target.value;
    }
    applyOp(sig, op, actualVal);
  };
}

// ============ styles ============

function resolveStyleValue(val: string | number | undefined, theme: Theme | undefined): string | number | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'string' && val.startsWith('$')) {
    const token = val.slice(1);
    const themeVal = resolveThemeValue(token, theme);
    if (themeVal !== undefined) return themeVal;
    console.warn(`[tooey] unknown theme token: "${val}"`);
    return undefined;
  }
  return val;
}

function applyStyles(el: HTMLElement, props: Props, theme?: Theme): void {
  const style = el.style;

  // helper to resolve and apply css value with theme token support
  const resolve = (val: string | number | undefined): string | undefined => {
    const resolved = resolveStyleValue(val, theme);
    return resolveCssValue(resolved as string | number | undefined);
  };

  // helper for string values that support theme tokens
  const resolveStr = (val: string | undefined): string | undefined => {
    if (val === undefined) return undefined;
    const resolved = resolveStyleValue(val, theme);
    return resolved !== undefined ? String(resolved) : undefined;
  };

  if (props.g !== undefined) { const v = resolve(props.g); if (v) style.gap = v; }
  if (props.p !== undefined) { const v = resolve(props.p); if (v) style.padding = v; }
  if (props.m !== undefined) { const v = resolve(props.m); if (v) style.margin = v; }
  if (props.w !== undefined) { const v = resolve(props.w); if (v) style.width = v; }
  if (props.h !== undefined) { const v = resolve(props.h); if (v) style.height = v; }
  if (props.mw !== undefined) { const v = resolve(props.mw); if (v) style.maxWidth = v; }
  if (props.mh !== undefined) { const v = resolve(props.mh); if (v) style.maxHeight = v; }

  if (props.bg !== undefined) { const v = resolveStr(props.bg); if (v) style.background = v; }
  if (props.fg !== undefined) { const v = resolveStr(props.fg); if (v) style.color = v; }
  if (props.o !== undefined) style.opacity = String(props.o);

  if (props.r !== undefined) { const v = resolve(props.r); if (v) style.borderRadius = v; }
  if (props.bw !== undefined) { const v = resolve(props.bw); if (v) style.borderWidth = v; }
  if (props.bc !== undefined) { const v = resolveStr(props.bc); if (v) style.borderColor = v; }
  if (props.bs !== undefined) style.borderStyle = props.bs;

  if (props.pos !== undefined) {
    const posMap: Record<string, string> = {
      rel: 'relative', abs: 'absolute', fix: 'fixed', sticky: 'sticky'
    };
    style.position = posMap[props.pos] || props.pos;
  }
  if (props.z !== undefined) style.zIndex = String(props.z);
  if (props.t !== undefined) { const v = resolve(props.t); if (v) style.top = v; }
  if (props.l !== undefined) { const v = resolve(props.l); if (v) style.left = v; }
  if (typeof props.b === 'number' || (typeof props.b === 'string' && !Array.isArray(props.b))) {
    const v = resolve(props.b as number | string);
    if (v) style.bottom = v;
  }
  if (props.rt !== undefined) { const v = resolve(props.rt); if (v) style.right = v; }

  if (props.fs !== undefined) { const v = resolve(props.fs); if (v) style.fontSize = v; }
  if (props.fw !== undefined) style.fontWeight = String(props.fw);
  if (props.ff !== undefined) { const v = resolveStr(props.ff); if (v) style.fontFamily = v; }
  if (props.ta !== undefined) style.textAlign = props.ta;
  if (props.td !== undefined) style.textDecoration = props.td;
  if (props.lh !== undefined) style.lineHeight = typeof props.lh === 'number' ? String(props.lh) : props.lh;
  if (props.ls !== undefined) { const v = resolve(props.ls); if (v) style.letterSpacing = v; }

  if (props.ai !== undefined) style.alignItems = expandStyleValue(props.ai)!;
  if (props.jc !== undefined) style.justifyContent = expandStyleValue(props.jc)!;
  if (props.flw !== undefined) style.flexWrap = expandStyleValue(props.flw)!

  if (props.cur !== undefined) style.cursor = props.cur;
  if (props.ov !== undefined) style.overflow = props.ov;
  if (props.pe !== undefined) style.pointerEvents = props.pe;
  if (props.us !== undefined) style.userSelect = props.us;
  if (props.sh !== undefined) { const v = resolveStr(props.sh); if (v) style.boxShadow = v; }
  if (props.tr !== undefined) style.transform = props.tr;

  if (props.s) {
    Object.entries(props.s).forEach(([key, val]) => {
      const resolved = resolveStyleValue(val as string | number | undefined, theme);
      if (resolved !== undefined) {
        (style as unknown as Record<string, string>)[key] = String(resolved);
      }
    });
  }
}

// ============ renderer ============

function createElement(
  spec: NodeSpec,
  ctx: RenderContext,
  itemContext?: { item: unknown, index: number }
): HTMLElement | null {
  const { state } = ctx;

  // handle error boundary node
  if (isErrorBoundaryNode(spec)) {
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    try {
      const childCtx: RenderContext = {
        cleanups: [],
        state,
        onError: spec.onError || ctx.onError,
      };
      const child = createElement(spec.child, childCtx, itemContext);
      if (child) {
        placeholder.appendChild(child);
        ctx.cleanups.push(...childCtx.cleanups);
      }
    } catch (err) {
      const errorInfo: ErrorInfo = {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      };

      if (spec.onError) {
        spec.onError(errorInfo);
      }

      if (spec.fallback) {
        try {
          const fallbackEl = createElement(spec.fallback, ctx, itemContext);
          if (fallbackEl) placeholder.appendChild(fallbackEl);
        } catch {
          placeholder.appendChild(createErrorFallback(errorInfo));
        }
      } else {
        placeholder.appendChild(createErrorFallback(errorInfo));
      }
    }

    return placeholder;
  }

  // handle reactive if node (supports both long and short form)
  if (isIfNode(spec)) {
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    let currentEl: HTMLElement | null = null;
    let childCtx: RenderContext | null = null;

    // normalize short form to long form
    const ifCond = spec.if ?? spec['?'];
    const thenBranch = spec.then ?? spec.t;
    const elseBranch = spec.else ?? spec.e;
    const eqValue = spec.eq ?? spec.is;

    const updateIf = () => {
      // cleanup previous render
      if (childCtx) {
        childCtx.cleanups.forEach(fn => fn());
        childCtx.cleanups = [];
      }
      if (currentEl) {
        placeholder.innerHTML = '';
        currentEl = null;
      }

      const rawValue = typeof ifCond === 'string'
        ? state[ifCond]?.()
        : resolveValue(ifCond, state);

      // handle equality check (eq or is)
      let condition: boolean;
      if (eqValue !== undefined) {
        condition = rawValue === eqValue;
      } else {
        condition = Boolean(rawValue);
      }

      const branch = condition ? thenBranch : elseBranch;
      if (!branch) return;

      childCtx = { cleanups: [], state };

      if (Array.isArray(branch) && branch.length > 0 && Array.isArray(branch[0])) {
        (branch as NodeSpec[]).forEach(child => {
          const el = createElement(child, childCtx!, itemContext);
          if (el) placeholder.appendChild(el);
        });
      } else {
        currentEl = createElement(branch as NodeSpec, childCtx, itemContext);
        if (currentEl) placeholder.appendChild(currentEl);
      }
    };

    effect(updateIf, ctx);
    return placeholder;
  }

  // handle reactive map node (supports both long and short form)
  if (isMapNode(spec)) {
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    let childCtx: RenderContext | null = null;

    // normalize short form to long form
    const mapSource = spec.map ?? spec.m;
    const asTemplate = spec.as ?? spec.a;

    const updateMap = () => {
      // cleanup previous render
      if (childCtx) {
        childCtx.cleanups.forEach(fn => fn());
        childCtx.cleanups = [];
      }
      placeholder.innerHTML = '';

      const arr = (typeof mapSource === 'string'
        ? state[mapSource]?.()
        : resolveValue(mapSource, state)) as unknown[];

      if (!Array.isArray(arr) || !asTemplate) return;

      childCtx = { cleanups: [], state };

      arr.forEach((item, index) => {
        const el = createElement(asTemplate, childCtx!, { item, index });
        if (el) placeholder.appendChild(el);
      });
    };

    effect(updateMap, ctx);
    return placeholder;
  }

  // validate spec structure
  if (!Array.isArray(spec) || (spec as unknown[]).length === 0) {
    console.warn('[tooey] invalid node spec:', spec);
    return null;
  }

  // apply beforeRender hooks from plugins
  let processedSpec: NodeSpec = spec;
  if (ctx.plugins) {
    for (const plugin of ctx.plugins) {
      if (plugin.beforeRender) {
        processedSpec = plugin.beforeRender(processedSpec, ctx);
      }
    }
  }

  // if beforeRender transformed spec to a non-array type, recurse
  if (!Array.isArray(processedSpec)) {
    return createElement(processedSpec, ctx, itemContext);
  }

  // handle function components
  const [first, content, props = {}] = processedSpec as [ComponentType | Component, Content?, Props?];
  if (typeof first === 'function') {
    // function component: call it with (props, children)
    const children = Array.isArray(content) && content.length > 0 && (Array.isArray(content[0]) || isIfNode(content[0]) || isMapNode(content[0]) || typeof content[0] === 'function')
      ? content as NodeSpec[]
      : undefined;
    const resolved = (first as Component)(props, children);
    return createElement(resolved, ctx, itemContext);
  }

  const type = first as ComponentType;
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
      if (props.cols) {
        el.style.gridTemplateColumns = typeof props.cols === 'number'
          ? `repeat(${props.cols}, 1fr)` : props.cols;
      }
      if (props.rows) {
        el.style.gridTemplateRows = typeof props.rows === 'number'
          ? `repeat(${props.rows}, 1fr)` : props.rows;
      }
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
    case 'Ul':
      el = document.createElement('ul');
      break;
    case 'Ol':
      el = document.createElement('ol');
      break;
    case 'Li':
      el = document.createElement('li');
      break;
    case 'M':
      el = document.createElement('img');
      if (props.src) {
        const safeSrc = sanitizeUrl(props.src, 'src');
        if (safeSrc) (el as HTMLImageElement).src = safeSrc;
      }
      if (props.alt) (el as HTMLImageElement).alt = props.alt;
      break;
    case 'L':
      el = document.createElement('a');
      if (props.href) {
        const safeHref = sanitizeUrl(props.href, 'href');
        if (safeHref) (el as HTMLAnchorElement).href = safeHref;
      }
      break;
    case 'Sv':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as unknown as HTMLElement;
      break;
    default:
      console.warn(`[tooey] unknown component type: ${type}`);
      el = document.createElement('div');
  }

  if (props.cls) el.className = props.cls;
  if (props.id) el.id = props.id;
  if (props.dis) (el as HTMLButtonElement).disabled = true;

  applyStyles(el, props, ctx.theme);

  // handle content
  if (content !== undefined) {
    if (Array.isArray(content) && content.length > 0 && (Array.isArray(content[0]) || isIfNode(content[0]) || isMapNode(content[0]))) {
      (content as NodeSpec[]).forEach(childSpec => {
        const child = createElement(childSpec, ctx, itemContext);
        if (child) el.appendChild(child);
      });
    } else if (isIfNode(content) || isMapNode(content)) {
      const child = createElement(content as NodeSpec, ctx, itemContext);
      if (child) el.appendChild(child);
    } else if (isStateRef(content)) {
      effect(() => {
        const val = resolveValue(content, state);
        if (type === 'I') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'Ta') {
          (el as HTMLTextAreaElement).value = String(val ?? '');
        } else if (type === 'C' || type === 'R') {
          (el as HTMLInputElement).checked = Boolean(val);
        } else {
          // textContent provides XSS protection by not parsing HTML
          el.textContent = String(val ?? '');
        }
      }, ctx);
    } else if (typeof content === 'string' || typeof content === 'number') {
      let textContent = String(content);
      if (itemContext) {
        // handle object property access first (before $item replacement)
        if (typeof itemContext.item === 'object' && itemContext.item !== null) {
          textContent = textContent.replace(/\$item\.(\w+)/g, (_, key) => {
            return String((itemContext.item as Record<string, unknown>)[key] ?? '');
          });
        }
        textContent = textContent.replace(/\$item/g, String(itemContext.item));
        textContent = textContent.replace(/\$index/g, String(itemContext.index));
      }
      // xss protection for static content
      if (type === 'I') {
        (el as HTMLInputElement).value = textContent;
      } else if (type === 'Ta') {
        (el as HTMLTextAreaElement).value = textContent;
      } else if (type !== 'S') {
        // don't set textContent for select (would clear options)
        el.textContent = textContent;
      }
    }
  }

  // handle value binding for inputs
  if (props.v !== undefined && isStateRef(props.v)) {
    effect(() => {
      const val = resolveValue(props.v!, state);
      if (type === 'I' || type === 'S' || type === 'Ta') {
        (el as HTMLInputElement).value = String(val ?? '');
      } else if (type === 'C' || type === 'R') {
        (el as HTMLInputElement).checked = Boolean(val);
      }
    }, ctx);
  }

  // handle checked binding
  if (props.ch !== undefined) {
    if (isStateRef(props.ch as unknown)) {
      effect(() => {
        const val = resolveValue(props.ch as unknown as StateRef, state);
        (el as HTMLInputElement).checked = Boolean(val);
      }, ctx);
    } else {
      (el as HTMLInputElement).checked = Boolean(props.ch);
    }
  }

  // event handlers with cleanup tracking
  const addEventListener = (event: string, handler: (e: Event) => void) => {
    el.addEventListener(event, handler);
    ctx.cleanups.push(() => el.removeEventListener(event, handler));
  };

  // get button text for implicit operation inference
  const buttonText = type === 'B' && (typeof content === 'string' || typeof content === 'number')
    ? String(content)
    : undefined;

  if (props.c) {
    addEventListener('click', (e) => createHandler(props.c!, state, e, itemContext, buttonText)());
  }
  if (props.x) {
    const handler = props.x;
    addEventListener('input', (e) => {
      if (typeof handler === 'function') {
        handler();
      } else {
        // normalize string shorthand to array form
        let stateKey: string;
        let op: Op;
        if (typeof handler === 'string') {
          const parsed = parseEventShorthand(handler);
          if (parsed) {
            [stateKey, op] = parsed;
          } else {
            // plain state key defaults to set (!) for input
            stateKey = handler;
            op = '!';
          }
        } else {
          [stateKey, op] = handler;
        }
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
    addEventListener('focus', (e) => createHandler(props.f!, state, e, itemContext)());
  }
  if (props.bl) {
    addEventListener('blur', (e) => createHandler(props.bl!, state, e, itemContext)());
  }
  if (props.k) {
    addEventListener('keydown', (e) => createHandler(props.k!, state, e, itemContext)());
  }
  if (props.ku) {
    addEventListener('keyup', (e) => createHandler(props.ku!, state, e, itemContext)());
  }
  if (props.kp) {
    addEventListener('keypress', (e) => createHandler(props.kp!, state, e, itemContext)());
  }
  if (props.e) {
    addEventListener('mouseenter', (e) => createHandler(props.e!, state, e, itemContext)());
  }
  if (props.lv) {
    addEventListener('mouseleave', (e) => createHandler(props.lv!, state, e, itemContext)());
  }
  if (props.sub) {
    addEventListener('submit', (e) => {
      e.preventDefault();
      createHandler(props.sub!, state, e, itemContext)();
    });
  }

  // apply afterRender hooks from plugins
  if (ctx.plugins) {
    for (const plugin of ctx.plugins) {
      if (plugin.afterRender) {
        plugin.afterRender(el, processedSpec);
      }
    }
  }

  return el;
}

// ============ main api ============

interface TooeyInstance {
  state: StateStore;
  el: HTMLElement | null;
  destroy(): void;
  update(newSpec: TooeySpec): void;
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  // allow dynamic extension by plugins
  [key: string]: unknown;
}

function render(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance {
  if (!container) {
    throw new Error('[tooey] render requires a valid container element');
  }
  if (!spec || !spec.r) {
    throw new Error('[tooey] render requires a spec with a root node (r)');
  }

  const theme = options?.theme;
  const plugins = options?.plugins || [];

  // helper to create signals with plugin state change notification
  const createStateSignal = (key: string, initial: StateValue): Signal<StateValue> => {
    const sig = signal(initial);
    const originalSet = sig.set.bind(sig);
    sig.set = (v: StateValue | ((prev: StateValue) => StateValue)) => {
      const oldVal = sig();
      originalSet(v);
      const newVal = sig();
      if (oldVal !== newVal) {
        plugins.forEach(p => p.onStateChange?.(key, oldVal, newVal));
      }
    };
    return sig;
  };

  const state: StateStore = {};
  if (spec.s) {
    Object.entries(spec.s).forEach(([key, val]) => {
      state[key] = createStateSignal(key, val);
    });
  }

  const ctx: RenderContext = { cleanups: [], state, theme, plugins };

  container.innerHTML = '';
  const el = createElement(spec.r, ctx);
  if (el) container.appendChild(el);

  const instance: TooeyInstance = {
    state,
    el,
    destroy() {
      // call onDestroy hooks
      plugins.forEach(p => p.onDestroy?.(instance));
      ctx.cleanups.forEach(fn => fn());
      ctx.cleanups = [];
      container.innerHTML = '';
    },
    update(newSpec: TooeySpec) {
      if (newSpec.s) {
        batch(() => {
          Object.entries(newSpec.s!).forEach(([key, val]) => {
            if (state[key]) {
              state[key].set(val);
            } else {
              state[key] = createStateSignal(key, val);
            }
          });
        });
      }
      if (newSpec.r) {
        ctx.cleanups.forEach(fn => fn());
        ctx.cleanups = [];
        container.innerHTML = '';
        const newEl = createElement(newSpec.r, ctx);
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

  // apply plugin extend methods
  plugins.forEach(plugin => {
    if (plugin.extend) {
      Object.entries(plugin.extend).forEach(([name, fn]) => {
        instance[name] = fn.bind(instance);
      });
    }
  });

  // call onInit hooks
  plugins.forEach(p => p.onInit?.(instance));

  return instance;
}

// ============ factory function ============

interface CreateTooeyOptions {
  theme?: Theme;
  plugins?: TooeyPlugin[];
}

interface TooeyFactory {
  render: (container: HTMLElement, spec: TooeySpec) => TooeyInstance;
  theme: Theme;
  plugins?: TooeyPlugin[];
}

// createTooey supports both a Theme directly (backward compatible) or CreateTooeyOptions
function createTooey(themeOrOptions: Theme | CreateTooeyOptions): TooeyFactory {
  // detect if it's a theme (has colors/spacing/radius/fonts) or options (has theme/plugins keys)
  const isOptions = themeOrOptions && ('theme' in themeOrOptions || 'plugins' in themeOrOptions);
  const theme = isOptions ? (themeOrOptions as CreateTooeyOptions).theme : (themeOrOptions as Theme);
  const plugins = isOptions ? (themeOrOptions as CreateTooeyOptions).plugins : undefined;
  return {
    render: (container: HTMLElement, spec: TooeySpec) => render(container, spec, { theme, plugins }),
    theme: theme!,
    plugins
  };
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

export {
  render,
  createTooey,
  signal,
  effect,
  batch,
  computed,
  async$,
  $,
  V, H, D, G,
  T, B,
  I, Ta, S, C, R,
  Tb, Th, Tbd, Tr, Td, Tc,
  Ul, Ol, Li,
  M, L, Sv,
  TooeySpec,
  NodeSpec,
  Props,
  StateRef,
  TooeyInstance,
  TooeyFactory,
  CreateTooeyOptions,
  IfNode,
  MapNode,
  ErrorBoundaryNode,
  ErrorInfo,
  ErrorHandler,
  Component,
  Theme,
  RenderOptions,
  TooeyPlugin,
  ComputedSignal,
  AsyncSpec
};
