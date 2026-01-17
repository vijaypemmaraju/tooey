/**
 * tooey - token-efficient ui library for llms
 *
 * component types (2-letter abbreviations):
 *   layout: vs (vstack), hs (hstack), dv (div), gr (grid), fr (fragment)
 *   text & buttons: tx (text/span), bt (button)
 *   inputs: in (input), ta (textarea), sl (select), cb (checkbox), rd (radio)
 *   tables: tb (table), th (thead), bd (tbody), tr (tr), td (td), tc (th)
 *   lists: ul (ul), ol (ol), li (li)
 *   media & links: im (image), ln (link), sv (svg)
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
 *   refs: rf (ref callback or ref object)
 *
 * events: c (click), x (input/change), f (focus), bl (blur), k (keydown), ku, kp, e, lv, sub
 *   shorthand: "state+" (increment), "state-" (decrement), "state~" (toggle), "state!val" (set)
 *
 * state operations: + (increment), - (decrement), ! (set), ~ (toggle), < (append), > (prepend), X (remove), . (set prop)
 *
 * control flow (short form): {?: cond, t: [...], e: [...]} | {m: state, a: [...]}
 * control flow (long form): {if: state, then: [...], else: [...]} | {map: state, as: [...]}
 * equality check: {?: "state", is: 0, t: [...]} or {?: {$:"state"}, is: 0, t: [...]}
 *
 * advanced features:
 *   refs: ref() creates ref object, rf prop attaches to element
 *   context: cx(default) creates context, ux(ctx) gets value, {pv: ctx, v: val, c: [...]} provides
 *   portals: {pt: target, c: [...]} renders children to target element
 *   memo: {mm: ['deps'], c: [...]} memoizes based on state deps, mm(component, compare) wraps component
 *   reducer: rd$(reducer, initialState) returns {s, dp} for reducer pattern
 *   ssr: rts(spec) renders to string, hy(container, spec) hydrates
 *   router: rt (router), lk (link), ot(routes) outlet, nav(path) navigate
 *   devtools: devtools({name, log}) plugin for debugging
 */

// ============ types ============

type StateValue = unknown;
type StateStore = Record<string, Signal<StateValue>>;

// ============ refs ============

interface Ref<T = HTMLElement | null> {
  el: T;
}

function ref<T = HTMLElement | null>(initial: T = null as T): Ref<T> {
  return { el: initial };
}

type RefCallback = (el: HTMLElement) => void;
type RefProp = Ref | RefCallback;

// ============ context ============

// context id counter for unique identification
let contextIdCounter = 0;

interface Context<T> {
  _id: number;
  _default: T;
}

// context value stack for nested providers
const contextStacks: Map<number, unknown[]> = new Map();

function cx<T>(defaultValue: T): Context<T> {
  const id = contextIdCounter++;
  contextStacks.set(id, [defaultValue]);
  return { _id: id, _default: defaultValue };
}

function ux<T>(context: Context<T>): T {
  const stack = contextStacks.get(context._id);
  if (!stack || stack.length === 0) {
    return context._default;
  }
  return stack[stack.length - 1] as T;
}

// push context value (used by provider)
function pushContext<T>(context: Context<T>, value: T): void {
  const stack = contextStacks.get(context._id);
  if (stack) {
    stack.push(value);
  }
}

// pop context value (used by provider cleanup)
function popContext<T>(context: Context<T>): void {
  const stack = contextStacks.get(context._id);
  if (stack && stack.length > 1) {
    stack.pop();
  }
}

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
  // conditional rendering
  show?: string; // state key - component only renders when state is truthy
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
  // refs
  rf?: RefProp;
}

type ComponentType =
  | 'vs' | 'hs' | 'dv' | 'gr'
  | 'tx' | 'bt'
  | 'in' | 'ta' | 'sl' | 'cb' | 'rd'
  | 'tb' | 'th' | 'bd' | 'tr' | 'td' | 'tc'
  | 'ul' | 'ol' | 'li'
  | 'im' | 'ln' | 'sv'
  | 'fr';  // fragment

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

// provider node for context
interface ProviderNode {
  pv: Context<unknown>;
  v: unknown;
  c: NodeSpec | NodeSpec[];
}

// portal node for rendering outside component tree
interface PortalNode {
  pt: HTMLElement | string;  // target element or selector
  c: NodeSpec | NodeSpec[];
}

// memo node for memoized rendering
interface MemoNode {
  mm: string[];  // dependency state keys
  c: NodeSpec;
}

type Content = string | number | StateRef | NodeSpec[] | IfNode | MapNode;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionNodeSpec = [Component<any>, Content?, (Props & Record<string, unknown>)?];
type BuiltinNodeSpec = [ComponentType, Content?, Props?];
type NodeSpec = BuiltinNodeSpec | FunctionNodeSpec | IfNode | MapNode | ProviderNode | PortalNode | MemoNode;

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

// reducer helper - creates state and dispatch function for reducer pattern
type Reducer<S, A> = (state: S, action: A) => S;
type Dispatch<A> = (action: A) => void;

interface ReducerSpec<S extends Record<string, unknown>, A> {
  s: S;
  dp: Dispatch<A>;
}

function rd$<S extends Record<string, unknown>, A>(
  reducer: Reducer<S, A>,
  initialState: S
): ReducerSpec<S, A> {
  let currentState = initialState;
  let instance: TooeyInstance | null = null;

  const dispatch: Dispatch<A> = (action: A) => {
    const newState = reducer(currentState, action);
    if (newState !== currentState) {
      currentState = newState;
      if (instance) {
        batch(() => {
          Object.entries(newState).forEach(([key, val]) => {
            instance!.set(key, val);
          });
        });
      }
    }
  };

  // create a proxy to capture the instance when state is accessed
  const stateProxy = new Proxy(initialState, {
    get(target, prop) {
      return target[prop as keyof S];
    }
  });

  return {
    s: stateProxy,
    dp: dispatch,
    // internal: bind instance after render
    _bind(inst: TooeyInstance) {
      instance = inst;
    }
  } as ReducerSpec<S, A> & { _bind: (inst: TooeyInstance) => void };
}

// memoized component wrapper - caches result based on props comparison
function mm<P extends Props>(
  component: Component<P>,
  compareFn?: (prevProps: P | undefined, nextProps: P | undefined) => boolean
): Component<P> {
  let cachedResult: NodeSpec | null = null;
  let prevProps: P | undefined = undefined;

  const defaultCompare = (prev: P | undefined, next: P | undefined): boolean => {
    if (prev === next) return true;
    if (!prev || !next) return false;
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;
    return prevKeys.every(key => (prev as Record<string, unknown>)[key] === (next as Record<string, unknown>)[key]);
  };

  const compare = compareFn || defaultCompare;

  return (props?: P, children?: NodeSpec[]): NodeSpec => {
    if (cachedResult && compare(prevProps, props)) {
      return cachedResult;
    }
    prevProps = props;
    cachedResult = component(props, children);
    return cachedResult;
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

function isProviderNode(v: unknown): v is ProviderNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && 'pv' in v;
}

function isPortalNode(v: unknown): v is PortalNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && 'pt' in v;
}

function isMemoNode(v: unknown): v is MemoNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && 'mm' in v && 'c' in v;
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

  // handle provider node for context
  if (isProviderNode(spec)) {
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    // push context value
    pushContext(spec.pv as Context<unknown>, spec.v);

    // render children - detect if spec.c is already an array of node specs
    // if first element is a function, it's a single function component NodeSpec [Fn, content?, props?]
    // if first element is an array or object node (if/map/provider/etc), it's an array of NodeSpecs
    const isNodeSpecArray = (arr: unknown[]): boolean => {
      const first = arr[0];
      // function as first = single function component, not array of specs
      if (typeof first === 'function') return false;
      return Array.isArray(first) || isIfNode(first) || isMapNode(first) ||
             isProviderNode(first) || isPortalNode(first) || isMemoNode(first) ||
             isErrorBoundaryNode(first);
    };

    const children = Array.isArray(spec.c) && spec.c.length > 0 && isNodeSpecArray(spec.c as unknown[])
      ? spec.c as NodeSpec[]
      : [spec.c as NodeSpec];

    children.forEach(child => {
      const el = createElement(child, ctx, itemContext);
      if (el) placeholder.appendChild(el);
    });

    // cleanup: pop context value when destroyed
    ctx.cleanups.push(() => popContext(spec.pv as Context<unknown>));

    return placeholder;
  }

  // handle portal node - render to different target
  if (isPortalNode(spec)) {
    const target = typeof spec.pt === 'string'
      ? document.querySelector(spec.pt)
      : spec.pt;

    if (!target) {
      console.warn(`[tooey] portal target not found: ${spec.pt}`);
      return null;
    }

    // create a wrapper for portal content
    const portalWrapper = document.createElement('div');
    portalWrapper.style.display = 'contents';
    portalWrapper.setAttribute('data-tooey-portal', 'true');

    // render children into portal wrapper - detect if spec.c is already an array of node specs
    // if first element is a function, it's a single function component NodeSpec [Fn, content?, props?]
    const isNodeSpecArray = (arr: unknown[]): boolean => {
      const first = arr[0];
      if (typeof first === 'function') return false;
      return Array.isArray(first) || isIfNode(first) || isMapNode(first) ||
             isProviderNode(first) || isPortalNode(first) || isMemoNode(first) ||
             isErrorBoundaryNode(first);
    };

    const children = Array.isArray(spec.c) && spec.c.length > 0 && isNodeSpecArray(spec.c as unknown[])
      ? spec.c as NodeSpec[]
      : [spec.c as NodeSpec];

    children.forEach(child => {
      const el = createElement(child, ctx, itemContext);
      if (el) portalWrapper.appendChild(el);
    });

    // append to target
    target.appendChild(portalWrapper);

    // cleanup: remove portal content when destroyed
    ctx.cleanups.push(() => {
      if (portalWrapper.parentNode) {
        portalWrapper.parentNode.removeChild(portalWrapper);
      }
    });

    // return empty placeholder in original location
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none';
    placeholder.setAttribute('data-tooey-portal-anchor', 'true');
    return placeholder;
  }

  // handle memo node - memoized rendering based on state dependencies
  if (isMemoNode(spec)) {
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    let currentEl: HTMLElement | null = null;
    let childCtx: RenderContext | null = null;
    let prevValues: unknown[] = [];

    const updateMemo = () => {
      // get current values of dependencies
      const currentValues = spec.mm.map(key => state[key]?.());

      // check if any dependency changed
      const hasChanged = prevValues.length === 0 ||
        currentValues.some((val, i) => val !== prevValues[i]);

      if (!hasChanged && currentEl) {
        return; // skip re-render
      }

      prevValues = currentValues;

      // cleanup previous render
      if (childCtx) {
        childCtx.cleanups.forEach(fn => fn());
        childCtx.cleanups = [];
      }
      if (currentEl) {
        placeholder.innerHTML = '';
        currentEl = null;
      }

      childCtx = { cleanups: [], state, theme: ctx.theme, plugins: ctx.plugins };
      currentEl = createElement(spec.c, childCtx, itemContext);
      if (currentEl) {
        placeholder.appendChild(currentEl);
        ctx.cleanups.push(...childCtx.cleanups);
      }
    };

    effect(updateMemo, ctx);
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

  // handle show prop - conditional rendering based on state
  if (props.show !== undefined) {
    const showKey = props.show;
    const placeholder = document.createElement('div');
    placeholder.style.display = 'contents';

    let currentEl: HTMLElement | null = null;
    let childCtx: RenderContext | null = null;

    const updateShow = () => {
      // cleanup previous render
      if (childCtx) {
        childCtx.cleanups.forEach(fn => fn());
        childCtx.cleanups = [];
      }
      if (currentEl) {
        placeholder.innerHTML = '';
        currentEl = null;
      }

      const showValue = state[showKey]?.();
      if (!showValue) return;

      // create the element without the show prop to avoid infinite recursion
      const { show: _, ...propsWithoutShow } = props;
      childCtx = { cleanups: [], state, theme: ctx.theme, plugins: ctx.plugins };
      currentEl = createElement([type, content, propsWithoutShow as Props], childCtx, itemContext);
      if (currentEl) {
        placeholder.appendChild(currentEl);
        ctx.cleanups.push(...childCtx.cleanups);
      }
    };

    effect(updateShow, ctx);
    return placeholder;
  }

  let el: HTMLElement;

  switch (type) {
    case 'vs':
      el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      break;
    case 'hs':
      el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'row';
      break;
    case 'gr':
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
    case 'dv':
      el = document.createElement('div');
      break;
    case 'tx':
      el = document.createElement('span');
      break;
    case 'bt':
      el = document.createElement('button');
      break;
    case 'in':
      el = document.createElement('input');
      (el as HTMLInputElement).type = props.type || 'text';
      if (props.ph) (el as HTMLInputElement).placeholder = props.ph;
      if (props.ro) (el as HTMLInputElement).readOnly = true;
      break;
    case 'ta':
      el = document.createElement('textarea');
      if (props.ph) (el as HTMLTextAreaElement).placeholder = props.ph;
      if (props.rw) (el as HTMLTextAreaElement).rows = props.rw;
      if (props.ro) (el as HTMLTextAreaElement).readOnly = true;
      break;
    case 'sl':
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
    case 'cb':
      el = document.createElement('input');
      (el as HTMLInputElement).type = 'checkbox';
      break;
    case 'rd':
      el = document.createElement('input');
      (el as HTMLInputElement).type = 'radio';
      break;
    case 'tb':
      el = document.createElement('table');
      break;
    case 'th':
      el = document.createElement('thead');
      break;
    case 'bd':
      el = document.createElement('tbody');
      break;
    case 'tr':
      el = document.createElement('tr');
      break;
    case 'td':
      el = document.createElement('td');
      if (props.sp) (el as HTMLTableCellElement).colSpan = props.sp;
      if (props.rsp) (el as HTMLTableCellElement).rowSpan = props.rsp;
      break;
    case 'tc':
      el = document.createElement('th');
      if (props.sp) (el as HTMLTableCellElement).colSpan = props.sp;
      if (props.rsp) (el as HTMLTableCellElement).rowSpan = props.rsp;
      break;
    case 'ul':
      el = document.createElement('ul');
      break;
    case 'ol':
      el = document.createElement('ol');
      break;
    case 'li':
      el = document.createElement('li');
      break;
    case 'im':
      el = document.createElement('img');
      if (props.src) {
        const safeSrc = sanitizeUrl(props.src, 'src');
        if (safeSrc) (el as HTMLImageElement).src = safeSrc;
      }
      if (props.alt) (el as HTMLImageElement).alt = props.alt;
      break;
    case 'ln':
      el = document.createElement('a');
      if (props.href) {
        const safeHref = sanitizeUrl(props.href, 'href');
        if (safeHref) (el as HTMLAnchorElement).href = safeHref;
      }
      break;
    case 'sv':
      el = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as unknown as HTMLElement;
      break;
    case 'fr':
      // fragment - renders children without wrapper, but we need a container
      // use display:contents to make it invisible in layout
      el = document.createElement('div');
      el.style.display = 'contents';
      el.setAttribute('data-tooey-fragment', 'true');
      break;
    default:
      console.warn(`[tooey] unknown component type: ${type}`);
      el = document.createElement('div');
  }

  // handle ref prop
  if (props.rf) {
    if (typeof props.rf === 'function') {
      (props.rf as RefCallback)(el);
    } else {
      (props.rf as Ref).el = el;
    }
  }

  if (props.cls) el.className = props.cls;
  if (props.id) el.id = props.id;
  if (props.dis) (el as HTMLButtonElement).disabled = true;

  applyStyles(el, props, ctx.theme);

  // handle content
  if (content !== undefined) {
    if (Array.isArray(content) && content.length > 0 && (Array.isArray(content[0]) || isIfNode(content[0]) || isMapNode(content[0]) || isErrorBoundaryNode(content[0]))) {
      (content as NodeSpec[]).forEach(childSpec => {
        const child = createElement(childSpec, ctx, itemContext);
        if (child) el.appendChild(child);
      });
    } else if (isIfNode(content) || isMapNode(content) || isErrorBoundaryNode(content)) {
      const child = createElement(content as NodeSpec, ctx, itemContext);
      if (child) el.appendChild(child);
    } else if (isStateRef(content)) {
      effect(() => {
        const val = resolveValue(content, state);
        if (type === 'in') {
          (el as HTMLInputElement).value = String(val ?? '');
        } else if (type === 'ta') {
          (el as HTMLTextAreaElement).value = String(val ?? '');
        } else if (type === 'cb' || type === 'rd') {
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
      if (type === 'in') {
        (el as HTMLInputElement).value = textContent;
      } else if (type === 'ta') {
        (el as HTMLTextAreaElement).value = textContent;
      } else if (type !== 'sl') {
        // don't set textContent for select (would clear options)
        el.textContent = textContent;
      }
    }
  }

  // handle value binding for inputs
  if (props.v !== undefined && isStateRef(props.v)) {
    effect(() => {
      const val = resolveValue(props.v!, state);
      if (type === 'in' || type === 'sl' || type === 'ta') {
        (el as HTMLInputElement).value = String(val ?? '');
      } else if (type === 'cb' || type === 'rd') {
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
  const buttonText = type === 'bt' && (typeof content === 'string' || typeof content === 'number')
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
          const val = (type === 'cb' || type === 'rd') ? target.checked : target.value;
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

// component type constants (2-letter abbreviations)
const vs = 'vs' as const;
const hs = 'hs' as const;
const dv = 'dv' as const;
const gr = 'gr' as const;
const tx = 'tx' as const;
const bt = 'bt' as const;
const In = 'in' as const; // capitalized export to avoid JS reserved word
const ta = 'ta' as const;
const sl = 'sl' as const;
const cb = 'cb' as const;
const rd = 'rd' as const;
const tb = 'tb' as const;
const th = 'th' as const;
const bd = 'bd' as const;
const Tr = 'tr' as const; // capitalized export to avoid collision with transform prop
const Td = 'td' as const; // capitalized for consistency with Tr
const tc = 'tc' as const;
const ul = 'ul' as const;
const ol = 'ol' as const;
const li = 'li' as const;
const im = 'im' as const;
const ln = 'ln' as const;
const sv = 'sv' as const;
const fr = 'fr' as const;

// ============ ssr (server-side rendering) ============

// spec to html string converter for SSR
function specToHtml(spec: NodeSpec, state: Record<string, StateValue> = {}, theme?: Theme): string {
  // create a mock state store for value resolution
  const mockState: StateStore = {};
  Object.entries(state).forEach(([key, val]) => {
    // create a callable function that also has set and sub methods
    const mockSig = (() => val) as Signal<StateValue>;
    mockSig.set = () => {};
    mockSig.sub = () => () => {};
    mockState[key] = mockSig;
  });

  function resolveContent(content: unknown): string {
    if (isStateRef(content)) {
      const val = mockState[content.$]?.();
      return val !== undefined && val !== null ? String(val) : '';
    }
    return String(content ?? '');
  }

  function resolveStyleVal(val: string | number | undefined): string | undefined {
    if (val === undefined) return undefined;
    if (typeof val === 'string' && val.startsWith('$') && theme) {
      const token = val.slice(1);
      const categories: (keyof Theme)[] = ['colors', 'spacing', 'radius', 'fonts'];
      for (const cat of categories) {
        const category = theme[cat];
        if (category && token in category) {
          const v = category[token];
          return typeof v === 'number' ? `${v}px` : String(v);
        }
      }
    }
    return typeof val === 'number' ? `${val}px` : val;
  }

  function propsToStyle(props: Props): string {
    const styles: string[] = [];
    if (props.g !== undefined) { const v = resolveStyleVal(props.g); if (v) styles.push(`gap:${v}`); }
    if (props.p !== undefined) { const v = resolveStyleVal(props.p); if (v) styles.push(`padding:${v}`); }
    if (props.m !== undefined) { const v = resolveStyleVal(props.m); if (v) styles.push(`margin:${v}`); }
    if (props.w !== undefined) { const v = resolveStyleVal(props.w); if (v) styles.push(`width:${v}`); }
    if (props.h !== undefined) { const v = resolveStyleVal(props.h); if (v) styles.push(`height:${v}`); }
    if (props.bg !== undefined) { const v = resolveStyleVal(props.bg); if (v) styles.push(`background:${v}`); }
    if (props.fg !== undefined) { const v = resolveStyleVal(props.fg); if (v) styles.push(`color:${v}`); }
    if (props.r !== undefined) { const v = resolveStyleVal(props.r); if (v) styles.push(`border-radius:${v}`); }
    if (props.fs !== undefined) { const v = resolveStyleVal(props.fs); if (v) styles.push(`font-size:${v}`); }
    if (props.fw !== undefined) styles.push(`font-weight:${props.fw}`);
    if (props.ai !== undefined) styles.push(`align-items:${styleShortcuts[props.ai] || props.ai}`);
    if (props.jc !== undefined) styles.push(`justify-content:${styleShortcuts[props.jc] || props.jc}`);
    return styles.join(';');
  }

  function nodeToHtml(node: NodeSpec): string {
    // handle if node
    if (isIfNode(node)) {
      const ifCond = node.if ?? node['?'];
      const thenBranch = node.then ?? node.t;
      const elseBranch = node.else ?? node.e;
      const eqValue = node.eq ?? node.is;

      const rawValue = typeof ifCond === 'string'
        ? mockState[ifCond]?.()
        : isStateRef(ifCond) ? mockState[ifCond.$]?.() : ifCond;

      const condition = eqValue !== undefined ? rawValue === eqValue : Boolean(rawValue);
      const branch = condition ? thenBranch : elseBranch;
      if (!branch) return '';

      if (Array.isArray(branch) && branch.length > 0 && Array.isArray(branch[0])) {
        return (branch as NodeSpec[]).map(nodeToHtml).join('');
      }
      return nodeToHtml(branch as NodeSpec);
    }

    // handle map node
    if (isMapNode(node)) {
      const mapSource = node.map ?? node.m;
      const asTemplate = node.as ?? node.a;
      if (!asTemplate) return '';

      const arr = (typeof mapSource === 'string'
        ? mockState[mapSource]?.()
        : isStateRef(mapSource) ? mockState[mapSource.$]?.() : mapSource) as unknown[];

      if (!Array.isArray(arr)) return '';

      return arr.map((item, index) => {
        // temporarily set $item and $index for template resolution
        const itemStr = typeof item === 'object' ? JSON.stringify(item) : String(item);
        return nodeToHtml(asTemplate).replace(/\$item\.(\w+)/g, (_, key) => {
          return String((item as Record<string, unknown>)?.[key] ?? '');
        }).replace(/\$item/g, itemStr).replace(/\$index/g, String(index));
      }).join('');
    }

    // handle provider node
    if (isProviderNode(node)) {
      const children = Array.isArray(node.c) && node.c.length > 0 && Array.isArray(node.c[0])
        ? node.c as NodeSpec[]
        : [node.c as NodeSpec];
      return children.map(nodeToHtml).join('');
    }

    // handle portal node - skip for SSR (render placeholder)
    if (isPortalNode(node)) {
      return '<!-- portal -->';
    }

    // handle memo node
    if (isMemoNode(node)) {
      return nodeToHtml(node.c);
    }

    // handle error boundary
    if (isErrorBoundaryNode(node)) {
      try {
        return nodeToHtml(node.child);
      } catch {
        return node.fallback ? nodeToHtml(node.fallback) : '<div>[error]</div>';
      }
    }

    if (!Array.isArray(node) || (node as unknown[]).length === 0) return '';

    const [typeOrFn, content, props = {}] = node as [ComponentType | Component, Content?, Props?];

    // handle function components
    if (typeof typeOrFn === 'function') {
      const children = Array.isArray(content) && content.length > 0 && Array.isArray(content[0])
        ? content as NodeSpec[]
        : undefined;
      const resolved = (typeOrFn as Component)(props, children);
      return nodeToHtml(resolved);
    }

    const type = typeOrFn as ComponentType;

    // map component types to HTML tags
    const tagMap: Record<ComponentType, string> = {
      vs: 'div', hs: 'div', dv: 'div', gr: 'div', fr: 'div',
      tx: 'span', bt: 'button',
      in: 'input', ta: 'textarea', sl: 'select', cb: 'input', rd: 'input',
      tb: 'table', th: 'thead', bd: 'tbody', tr: 'tr', td: 'td', tc: 'th',
      ul: 'ul', ol: 'ol', li: 'li',
      im: 'img', ln: 'a', sv: 'svg'
    };

    const tag = tagMap[type] || 'div';
    const selfClosing = ['input', 'img'].includes(tag);

    // build attributes
    const attrs: string[] = [];

    // add type-specific styles
    let baseStyle = '';
    if (type === 'vs') baseStyle = 'display:flex;flex-direction:column;';
    if (type === 'hs') baseStyle = 'display:flex;flex-direction:row;';
    if (type === 'gr') baseStyle = 'display:grid;';
    if (type === 'fr') baseStyle = 'display:contents;';

    const propsStyle = propsToStyle(props);
    const fullStyle = baseStyle + propsStyle;
    if (fullStyle) attrs.push(`style="${fullStyle}"`);

    if (props.cls) attrs.push(`class="${props.cls}"`);
    if (props.id) attrs.push(`id="${props.id}"`);
    if (props.dis) attrs.push('disabled');
    if (props.href) attrs.push(`href="${props.href}"`);
    if (props.src) attrs.push(`src="${props.src}"`);
    if (props.alt) attrs.push(`alt="${props.alt}"`);
    if (props.ph) attrs.push(`placeholder="${props.ph}"`);
    if (props.type) attrs.push(`type="${props.type}"`);
    if (type === 'cb') attrs.push('type="checkbox"');
    if (type === 'rd') attrs.push('type="radio"');

    // add data attribute for hydration
    attrs.push('data-tooey-ssr="true"');

    const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

    if (selfClosing) {
      return `<${tag}${attrStr}/>`;
    }

    // handle content
    let innerHtml = '';
    if (content !== undefined) {
      if (Array.isArray(content) && content.length > 0 && (Array.isArray(content[0]) || isIfNode(content[0]) || isMapNode(content[0]))) {
        innerHtml = (content as NodeSpec[]).map(nodeToHtml).join('');
      } else if (isIfNode(content) || isMapNode(content)) {
        innerHtml = nodeToHtml(content as NodeSpec);
      } else if (typeof content === 'string' || typeof content === 'number' || isStateRef(content)) {
        innerHtml = resolveContent(content);
      }
    }

    // handle select options
    if (type === 'sl' && props.opts) {
      innerHtml = props.opts.map(opt =>
        `<option value="${opt.v}">${opt.l}</option>`
      ).join('');
    }

    return `<${tag}${attrStr}>${innerHtml}</${tag}>`;
  }

  return nodeToHtml(spec);
}

// render to string for SSR (short name: rts)
function rts(spec: TooeySpec, options?: { theme?: Theme }): string {
  return specToHtml(spec.r, spec.s || {}, options?.theme);
}

// hydrate - attach event listeners and reactivity to SSR-rendered HTML
function hy(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance {
  // for now, just re-render (full hydration would require matching DOM nodes)
  // this is a simple implementation - production would need smarter reconciliation
  return render(container, spec, options);
}

// ============ router ============

interface Route {
  p: string;  // path pattern
  c: NodeSpec | Component;  // component to render
  ch?: Route[];  // child routes for nested routing
}

interface RouterState {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

// global router state
let routerState: Signal<RouterState> | null = null;
let routerBase = '';

function initRouter(base = ''): Signal<RouterState> {
  if (routerState) return routerState;

  routerBase = base;
  const getState = (): RouterState => {
    const path = window.location.pathname.replace(base, '') || '/';
    const query: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((v, k) => {
      query[k] = v;
    });
    return { path, params: {}, query };
  };

  routerState = signal(getState());

  // listen for popstate (back/forward)
  window.addEventListener('popstate', () => {
    routerState?.set(getState());
  });

  return routerState;
}

// navigate programmatically
function nav(path: string, options?: { replace?: boolean }): void {
  const fullPath = routerBase + path;
  if (options?.replace) {
    window.history.replaceState(null, '', fullPath);
  } else {
    window.history.pushState(null, '', fullPath);
  }
  if (routerState) {
    const query: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((v, k) => {
      query[k] = v;
    });
    routerState.set({ path, params: {}, query });
  }
}

// match route pattern to path
function matchRoute(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    // check for wildcard
    if (!patternParts.some(p => p === '*')) {
      return { match: false, params: {} };
    }
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    const pathPart = pathParts[i];

    if (pp === '*') {
      return { match: true, params };
    }
    if (pp.startsWith(':')) {
      params[pp.slice(1)] = pathPart || '';
    } else if (pp !== pathPart) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

// router props interface
interface RouterProps extends Props {
  routes?: Route[];
  base?: string;
}

// link props interface
interface LinkProps extends Props {
  to?: string;
}

// route component props (passed to route components)
interface RouteProps extends Props {
  params?: Record<string, string>;
}

// router component - renders matched route
const Router: Component<RouterProps> = (props) => {
  const routes = props?.routes || [];
  const base = props?.base || '';

  initRouter(base);

  return {
    '?': { $: '_routerMatch' },
    t: [dv, 'Route matched'],
    e: [dv, 'No route matched']
  } as unknown as NodeSpec;
};

// create router view that reactively renders matched route
function createRouterView(routes: Route[], base = ''): NodeSpec {
  const routerSig = initRouter(base);

  // this needs to be a function component that re-evaluates on route change
  const RouteView: Component = () => {
    const { path } = routerSig();

    for (const route of routes) {
      const { match, params } = matchRoute(route.p, path);
      if (match) {
        // update params in router state
        if (Object.keys(params).length > 0) {
          routerSig.set(s => ({ ...s, params }));
        }

        if (typeof route.c === 'function') {
          return (route.c as Component<RouteProps>)({ params });
        }
        return route.c as NodeSpec;
      }
    }

    // no match - return empty
    return [tx, ''];
  };

  return [RouteView];
}

// link component for navigation
const Link: Component<LinkProps> = (props, children) => {
  const href = props?.to || '/';
  return [ln, children || href, {
    href: routerBase + href,
    c: () => {
      nav(href);
    },
    cls: props?.cls
  }];
};

// router component type constants
const rt = Router;
const lk = Link;

// outlet for nested routes (renders children routes)
function ot(routes: Route[]): NodeSpec {
  return createRouterView(routes);
}

// ============ devtools plugin ============

interface DevtoolsOptions {
  name?: string;
  log?: boolean;
}

function devtools(options?: DevtoolsOptions): TooeyPlugin {
  const name = options?.name || 'tooey';
  const shouldLog = options?.log ?? true;

  let stateHistory: Array<{ timestamp: number; key: string; oldVal: unknown; newVal: unknown }> = [];

  return {
    name: 'devtools',

    onInit(instance) {
      if (shouldLog) {
        console.log(`[${name}] initialized`, {
          state: Object.fromEntries(
            Object.entries(instance.state).map(([k, v]) => [k, v()])
          )
        });
      }

      // expose devtools API on window
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).__TOOEY_DEVTOOLS__ = {
          instance,
          getState: () => Object.fromEntries(
            Object.entries(instance.state).map(([k, v]) => [k, v()])
          ),
          setState: (key: string, value: unknown) => instance.set(key, value),
          getHistory: () => stateHistory,
          clearHistory: () => { stateHistory = []; }
        };
      }
    },

    onDestroy(_instance) {
      if (shouldLog) {
        console.log(`[${name}] destroyed`);
      }
      if (typeof window !== 'undefined') {
        delete (window as unknown as Record<string, unknown>).__TOOEY_DEVTOOLS__;
      }
    },

    onStateChange(key, oldVal, newVal) {
      stateHistory.push({
        timestamp: Date.now(),
        key,
        oldVal,
        newVal
      });

      // keep last 100 entries
      if (stateHistory.length > 100) {
        stateHistory = stateHistory.slice(-100);
      }

      if (shouldLog) {
        console.log(`[${name}] state change:`, key, oldVal, '→', newVal);
      }
    }
  };
}

export {
  // core
  render,
  createTooey,
  signal,
  effect,
  batch,
  computed,
  async$,
  $,
  // components
  vs, hs, dv, gr, fr,
  tx, bt,
  In, ta, sl, cb, rd,
  tb, th, bd, Tr, Td, tc,
  ul, ol, li,
  im, ln, sv,
  // refs
  ref,
  Ref,
  RefCallback,
  RefProp,
  // context
  cx,
  ux,
  Context,
  ProviderNode,
  PortalNode,
  MemoNode,
  // reducer
  rd$,
  Reducer,
  Dispatch,
  ReducerSpec,
  // memo
  mm,
  // ssr
  rts,
  hy,
  // router
  rt,
  lk,
  ot,
  nav,
  Route,
  RouterState,
  RouterProps,
  LinkProps,
  RouteProps,
  createRouterView,
  // devtools
  devtools,
  DevtoolsOptions,
  // types
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
