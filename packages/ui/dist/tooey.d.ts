/**
 * tooey - token-efficient ui library for llms
 *
 * component types (2-letter abbreviations):
 *   layout: vs (vstack), hs (hstack), dv (div), gr (grid)
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
type StateValue = unknown;
type StateStore = Record<string, Signal<StateValue>>;
type ThemeValue = string | number;
type ThemeCategory = Record<string, ThemeValue>;
interface Theme {
    colors?: ThemeCategory;
    spacing?: ThemeCategory;
    radius?: ThemeCategory;
    fonts?: ThemeCategory;
    [key: string]: ThemeCategory | undefined;
}
interface TooeyPlugin {
    name: string;
    onInit?(instance: TooeyInstance): void;
    onDestroy?(instance: TooeyInstance): void;
    beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
    afterRender?(el: HTMLElement, spec: NodeSpec): void;
    onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;
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
    show?: string;
    g?: number | string;
    p?: number | string;
    m?: number | string;
    w?: number | string;
    h?: number | string;
    mw?: number | string;
    mh?: number | string;
    bg?: string;
    fg?: string;
    o?: number;
    r?: number | string;
    bw?: number | string;
    bc?: string;
    bs?: string;
    pos?: 'rel' | 'abs' | 'fix' | 'sticky' | string;
    z?: number;
    t?: number | string;
    l?: number | string;
    b?: number | string;
    rt?: number | string;
    fs?: number | string;
    fw?: number | string;
    ff?: string;
    ta?: string;
    td?: string;
    lh?: number | string;
    ls?: number | string;
    ai?: string;
    jc?: string;
    flw?: string;
    cols?: number | string;
    rows?: number | string;
    cur?: string;
    ov?: string;
    pe?: string;
    us?: string;
    sh?: string;
    tr?: string;
    v?: unknown;
    ph?: string;
    type?: string;
    href?: string;
    src?: string;
    alt?: string;
    dis?: boolean;
    ch?: unknown;
    ro?: boolean;
    opts?: Array<{
        v: string;
        l: string;
    }>;
    cls?: string;
    id?: string;
    rw?: number;
    sp?: number;
    rsp?: number;
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
    s?: Record<string, unknown>;
}
type ComponentType = 'vs' | 'hs' | 'dv' | 'gr' | 'tx' | 'bt' | 'in' | 'ta' | 'sl' | 'cb' | 'rd' | 'tb' | 'th' | 'bd' | 'tr' | 'td' | 'tc' | 'ul' | 'ol' | 'li' | 'im' | 'ln' | 'sv';
type Component<P extends Props = Props> = (props?: P, children?: NodeSpec[]) => NodeSpec;
type StateRef = {
    $: string;
};
interface IfNode {
    if?: StateRef | string;
    then?: NodeSpec | NodeSpec[];
    else?: NodeSpec | NodeSpec[];
    '?'?: StateRef | string;
    t?: NodeSpec | NodeSpec[];
    e?: NodeSpec | NodeSpec[];
    eq?: unknown;
    is?: unknown;
}
interface MapNode {
    map?: StateRef | string;
    as?: NodeSpec;
    m?: StateRef | string;
    a?: NodeSpec;
    key?: string;
}
type Content = string | number | StateRef | NodeSpec[] | IfNode | MapNode;
type FunctionNodeSpec = [Component<any>, Content?, (Props & Record<string, unknown>)?];
type BuiltinNodeSpec = [ComponentType, Content?, Props?];
type NodeSpec = BuiltinNodeSpec | FunctionNodeSpec | IfNode | MapNode;
interface TooeySpec {
    s?: Record<string, StateValue>;
    r: NodeSpec;
}
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
interface ErrorBoundaryNode {
    boundary: true;
    child: NodeSpec;
    fallback?: NodeSpec;
    onError?: ErrorHandler;
}
declare function signal<T>(initial: T): Signal<T>;
declare function batch(fn: () => void): void;
declare function effect(fn: () => void, ctx?: RenderContext): () => void;
interface ComputedSignal<T> {
    (): T;
    sub(fn: () => void): () => void;
}
declare function computed<T>(fn: () => T): ComputedSignal<T>;
interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    [key: string]: unknown;
}
interface AsyncSpec<T> {
    s: AsyncState<T>;
    init(instance: TooeyInstance): Promise<void>;
}
declare function async$<T>(promiseOrFn: Promise<T> | (() => Promise<T>), options?: {
    onError?: (error: Error) => void;
}): AsyncSpec<T>;
interface TooeyInstance {
    state: StateStore;
    el: HTMLElement | null;
    destroy(): void;
    update(newSpec: TooeySpec): void;
    get(key: string): unknown;
    set(key: string, value: unknown): void;
    [key: string]: unknown;
}
declare function render(container: HTMLElement, spec: TooeySpec, options?: RenderOptions): TooeyInstance;
interface CreateTooeyOptions {
    theme?: Theme;
    plugins?: TooeyPlugin[];
}
interface TooeyFactory {
    render: (container: HTMLElement, spec: TooeySpec) => TooeyInstance;
    theme: Theme;
    plugins?: TooeyPlugin[];
}
declare function createTooey(themeOrOptions: Theme | CreateTooeyOptions): TooeyFactory;
declare function $(name: string): StateRef;
declare const vs: "vs";
declare const hs: "hs";
declare const dv: "dv";
declare const gr: "gr";
declare const tx: "tx";
declare const bt: "bt";
declare const In: "in";
declare const ta: "ta";
declare const sl: "sl";
declare const cb: "cb";
declare const rd: "rd";
declare const tb: "tb";
declare const th: "th";
declare const bd: "bd";
declare const Tr: "tr";
declare const Td: "td";
declare const tc: "tc";
declare const ul: "ul";
declare const ol: "ol";
declare const li: "li";
declare const im: "im";
declare const ln: "ln";
declare const sv: "sv";
export { render, createTooey, signal, effect, batch, computed, async$, $, vs, hs, dv, gr, tx, bt, In, ta, sl, cb, rd, tb, th, bd, Tr, Td, tc, ul, ol, li, im, ln, sv, TooeySpec, NodeSpec, Props, StateRef, TooeyInstance, TooeyFactory, CreateTooeyOptions, IfNode, MapNode, ErrorBoundaryNode, ErrorInfo, ErrorHandler, Component, Theme, RenderOptions, TooeyPlugin, ComputedSignal, AsyncSpec };
//# sourceMappingURL=tooey.d.ts.map