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
type StateValue = unknown;
type StateStore = Record<string, Signal<StateValue>>;
interface Signal<T> {
    (): T;
    set(v: T | ((prev: T) => T)): void;
    sub(fn: () => void): () => void;
}
type Op = '+' | '-' | '!' | '~' | '<' | '>' | 'X' | '.';
type EventHandler = [string, Op, unknown?] | (() => void) | string;
interface Props {
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
type ComponentType = 'V' | 'H' | 'D' | 'G' | 'T' | 'B' | 'I' | 'Ta' | 'S' | 'C' | 'R' | 'Tb' | 'Th' | 'Tbd' | 'Tr' | 'Td' | 'Tc' | 'Ul' | 'Ol' | 'Li' | 'M' | 'L' | 'Sv';
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
type NodeSpec = [ComponentType, Content?, Props?] | IfNode | MapNode;
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
interface TooeyInstance {
    state: StateStore;
    el: HTMLElement | null;
    destroy(): void;
    update(newSpec: TooeySpec): void;
    get(key: string): unknown;
    set(key: string, value: unknown): void;
}
declare function render(container: HTMLElement, spec: TooeySpec): TooeyInstance;
declare function $(name: string): StateRef;
declare const V: "V";
declare const H: "H";
declare const D: "D";
declare const G: "G";
declare const T: "T";
declare const B: "B";
declare const I: "I";
declare const Ta: "Ta";
declare const S: "S";
declare const C: "C";
declare const R: "R";
declare const Tb: "Tb";
declare const Th: "Th";
declare const Tbd: "Tbd";
declare const Tr: "Tr";
declare const Td: "Td";
declare const Tc: "Tc";
declare const Ul: "Ul";
declare const Ol: "Ol";
declare const Li: "Li";
declare const M: "M";
declare const L: "L";
declare const Sv: "Sv";
export { render, signal, effect, batch, $, V, H, D, G, T, B, I, Ta, S, C, R, Tb, Th, Tbd, Tr, Td, Tc, Ul, Ol, Li, M, L, Sv, TooeySpec, NodeSpec, Props, StateRef, TooeyInstance, IfNode, MapNode, ErrorBoundaryNode, ErrorInfo, ErrorHandler };
//# sourceMappingURL=tooey.d.ts.map