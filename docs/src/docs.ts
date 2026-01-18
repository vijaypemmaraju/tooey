/**
 * tooey documentation site
 * demonstrates the full tooey ecosystem: signals, computed, effects, plugins, theming, function components
 * now also demonstrates advanced features: refs, context, portals, fragments, memo, devtools
 * now also demonstrates @tooey/components - shadcn-inspired component library
 */

import {
  render, signal, effect,
  // 2-letter component abbreviations
  vs, hs, dv, gr, fr,
  tx, bt, In, ln, sv,
  // advanced features
  ref, cx, ux, devtools,
  // types
  type TooeySpec, type NodeSpec, type Props, type TooeyPlugin, type ProviderNode, type PortalNode
} from '@tooey/ui';
// shadcn-inspired components from @tooey/components
import {
  Bt, Bg, Al, AlT, AlD, Pg, Sp, Av,
  shadcnTheme
} from '@tooey/components';
import { API_DATA, searchAPI, type SearchResult, type ApiItem } from './api-data';

// ============================================================================
// theme
// ============================================================================

interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, number>;
  radius: Record<string, number>;
}

const darkTheme: Theme = {
  colors: {
    bg: '#0a0a0f', bgSecondary: '#111118', bgTertiary: '#1a1a24', bgHover: '#252530',
    text: '#e0e0e0', textSecondary: '#888', textMuted: '#666',
    accent: '#0af', success: '#4f8', warning: '#fa0', error: '#f55', border: '#333', codeBg: '#111'
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12 }
};

const lightTheme: Theme = {
  colors: {
    bg: '#fff', bgSecondary: '#f8f9fa', bgTertiary: '#e9ecef', bgHover: '#dee2e6',
    text: '#212529', textSecondary: '#495057', textMuted: '#868e96',
    accent: '#0066cc', success: '#28a745', warning: '#ffc107', error: '#dc3545', border: '#dee2e6', codeBg: '#f4f4f4'
  },
  spacing: darkTheme.spacing,
  radius: darkTheme.radius
};

const applyCssVars = (theme: Theme): void => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
  });
};

// inject global styles for layout (now using Tailwind classes where possible)
const injectGlobalStyles = () => {
  if (document.getElementById('tooey-docs-styles')) return;
  const style = document.createElement('style');
  style.id = 'tooey-docs-styles';
  style.textContent = `
    pre[class*="language-"], code[class*="language-"] {
      font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
    }
  `;
  document.head.appendChild(style);
};

// ============================================================================
// plugins
// ============================================================================

const loggerPlugin: TooeyPlugin = {
  name: 'logger',
  onStateChange(key, oldVal, newVal) {
    if (!['searchQuery', 'searchResults'].includes(key)) {
      console.log(`[docs] ${key}:`, oldVal, '→', newVal);
    }
  }
};

// ============================================================================
// function components
// ============================================================================

const Logo = (props: { size?: number }): NodeSpec => {
  const size = props.size || 32;
  return [dv, '', {
    w: size,
    h: size,
    s: {
      display: 'inline-block',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    id: `logo-${Math.random().toString(36).slice(2, 8)}`
  }];
};

// render logo SVG after DOM is ready
const renderLogos = () => {
  document.querySelectorAll('[id^="logo-"]').forEach((el) => {
    if (el.innerHTML) return;
    const size = parseInt((el as HTMLElement).style.width) || 32;
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="color: var(--accent);">
      <rect x="24" y="8" width="16" height="48" rx="8" fill="currentColor"/>
      <rect x="12" y="20" width="40" height="14" rx="7" fill="currentColor" transform="rotate(-20 32 27)"/>
    </svg>`;
  });
};

const Card = (_props: Props = {}, children: NodeSpec[] = []): NodeSpec =>
  [vs, children, { cls: 'bg-bg-secondary p-4 rounded-lg border border-border' }];

// store code blocks for later rendering with Prism
const codeBlocks: Map<string, { code: string; lang: string }> = new Map();

const Code = (props: { code: string; lang?: string }): NodeSpec => {
  const id = `code-${Math.random().toString(36).slice(2, 8)}`;
  codeBlocks.set(id, { code: props.code, lang: props.lang || 'javascript' });
  return [dv, '', { id, cls: 'bg-code-bg rounded overflow-auto max-h-[300px]' }];
};

// helper to escape HTML
const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// render code blocks with Prism after DOM update
const renderCodeBlocks = () => {
  codeBlocks.forEach(({ code, lang }, id) => {
    const el = document.getElementById(id);
    if (el && !el.querySelector('pre')) {
      el.innerHTML = `<pre style="margin:0;padding:8px;font-size:12px;line-height:1.4;"><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
    }
  });
  // clear map to avoid memory leak on page changes
  codeBlocks.clear();
};

const Section = (props: { title: string; subtitle?: string }): NodeSpec =>
  [vs, [
    [tx, props.title, { cls: 'text-xs font-normal text-text-muted uppercase tracking-wider block' }],
    props.subtitle ? [tx, props.subtitle, { cls: 'text-sm text-text-secondary mt-1' }] : null
  ].filter(Boolean) as NodeSpec[], { cls: 'mb-4' }];

const ApiDetail = (props: { item: ApiItem; type: string }): NodeSpec => {
  const { item, type } = props;
  const children: NodeSpec[] = [
    [hs, [
      [tx, type, { cls: 'text-[10px] text-accent bg-bg-tertiary px-2 py-0.5 rounded uppercase' }],
      [tx, item.name || item.op || item.fullName || '', { cls: 'text-lg font-semibold text-text-primary' }]
    ], { cls: 'gap-2 items-center flex' }],
    [tx, item.description, { cls: 'text-text-secondary my-2 mb-4 block' }]
  ];
  if (item.signature) children.push(Code({ code: item.signature }));
  if (item.example) children.push([vs, [
    [tx, 'example', { cls: 'text-xs text-text-muted uppercase tracking-wider' }],
    Code({ code: item.example })
  ], { cls: 'gap-2 my-4' }]);
  return Card({}, children);
};

// ============================================================================
// pages
// ============================================================================

type Page = 'home' | 'core-functions' | 'instance-methods' | 'components' | 'props' | 'events' | 'control-flow' | 'theming' | 'plugins' | 'function-components' | 'error-boundaries' | 'types' | 'examples' | 'advanced-features' | 'component-library';

const pages: Record<Page, () => NodeSpec> = {
  'home': () => [vs, [
    [vs, [
      [hs, [[dv, [Logo({ size: 48 })], { cls: 'w-12 h-12 drop-shadow-[0_4px_20px_rgba(0,170,255,0.3)]' }],
        [vs, [[tx, 'tooey', { cls: 'text-2xl font-bold text-text-primary' }], [tx, 'token-efficient ui for llm output', { cls: 'text-sm text-text-secondary' }]], { cls: 'gap-1' }]], { cls: 'gap-4 items-center flex' }],
      [hs, [[tx, '~39%', { cls: 'text-accent font-semibold' }], [tx, 'fewer tokens', { cls: 'text-text-secondary' }],
        [tx, '|', { cls: 'text-border mx-2' }], [tx, '~10kb', { cls: 'text-accent font-semibold' }], [tx, 'minified', { cls: 'text-text-secondary' }],
        [tx, '|', { cls: 'text-border mx-2' }], [tx, '0', { cls: 'text-accent font-semibold' }], [tx, 'deps', { cls: 'text-text-secondary' }]], { cls: 'gap-1.5 items-center flex-wrap flex my-6' }]
    ], { cls: 'mb-8' }],
    Card({}, [Section({ title: 'quick start' }), Code({ code: `import { render, vs, tx, bt } from '@tooey/ui';
render(document.getElementById('app'), {
  s: { count: 0 },
  r: [vs, [[tx, { $: 'count' }], [bt, '+', { c: 'count+' }]], { g: 8 }]
});` }), [hs, [[bt, 'examples', { c: () => navigateTo('examples'), cls: 'bg-accent text-white px-4 py-2 rounded border-none cursor-pointer hover:bg-accent-hover transition-colors' }],
      [ln, 'github', { href: 'https://github.com/vijaypemmaraju/tooey', cls: 'text-text-secondary px-4 py-2 no-underline hover:text-accent transition-colors' }]], { cls: 'gap-2 flex mt-4' }]]),
    [gr, [
      Card({}, [[tx, 'signals & reactivity', { cls: 'font-semibold text-text-primary text-sm block mb-2' }], [tx, 'fine-grained reactivity with signals, computed, and effects', { cls: 'text-text-secondary text-sm' }]]),
      Card({}, [[tx, 'function components', { cls: 'font-semibold text-text-primary text-sm block mb-2' }], [tx, 'create reusable components as simple functions', { cls: 'text-text-secondary text-sm' }]]),
      Card({}, [[tx, 'theming', { cls: 'font-semibold text-text-primary text-sm block mb-2' }], [tx, 'token-based theming with $token syntax', { cls: 'text-text-secondary text-sm' }]]),
      Card({}, [[tx, 'advanced features', { cls: 'font-semibold text-text-primary text-sm block mb-2' }], [tx, 'refs, context, portals, fragments, memo, router, ssr, devtools', { cls: 'text-text-secondary text-sm' }]])
    ], { cols: 2, g: 16, cls: 'my-6' }],
    Card({}, [Section({ title: 'components' }), [gr, ['layout', 'text', 'form', 'table', 'list', 'media'].map(cat =>
      [vs, [[tx, cat, { cls: 'text-accent text-xs uppercase tracking-wider' }],
        [tx, API_DATA.components.filter(c => c.category === cat).map(c => c.name).join(' '), { cls: 'text-text-primary font-mono' }]], { cls: 'gap-1' }]), { cols: 3, g: 16 }]])
  ], { cls: 'space-y-6' }],

  'core-functions': () => [vs, [Section({ title: 'core functions', subtitle: 'essential functions for rendering and state management' }),
    ...API_DATA.coreFunctions.map(fn => ApiDetail({ item: fn, type: 'function' }))], { g: 16 }],

  'instance-methods': () => [vs, [Section({ title: 'instance methods', subtitle: 'methods on TooeyInstance returned by render()' }),
    ...API_DATA.instanceMethods.map(m => ApiDetail({ item: m, type: 'method' }))], { g: 16 }],

  'components': () => [vs, [Section({ title: 'components', subtitle: '23 built-in components with short names' }),
    ...['layout', 'text', 'form', 'table', 'list', 'media'].map(cat => Card({}, [
      [tx, cat, { cls: 'text-sm font-semibold text-accent uppercase mb-3 block' }],
      [gr, API_DATA.components.filter(c => c.category === cat).map(c => [vs, [
        [hs, [[tx, c.name, { cls: 'text-success font-bold font-mono text-base' }], [tx, `(${c.fullName})`, { cls: 'text-text-muted text-xs' }]], { cls: 'gap-1.5 items-center flex' }],
        [tx, c.description, { cls: 'text-text-secondary text-xs' }], [tx, c.element, { cls: 'text-text-muted text-xs font-mono' }]
      ], { cls: 'gap-1 p-2 bg-bg-tertiary rounded' }]), { cols: 2, g: 8 }]
    ]))], { cls: 'space-y-4' }],

  'props': () => [vs, [Section({ title: 'props', subtitle: 'all style and element properties' }),
    ...['spacing', 'sizing', 'colors', 'borders', 'positioning', 'typography', 'layout', 'misc', 'element'].map(cat => Card({}, [
      [tx, cat, { cls: 'text-sm font-semibold text-accent uppercase mb-3 block' }],
      [vs, API_DATA.props.filter(p => p.category === cat).map(p => [hs, [
        [tx, p.name, { cls: 'text-success font-semibold font-mono text-sm w-10' }],
        [tx, p.fullName || '', { cls: 'text-text-primary text-sm w-[120px]' }],
        [tx, p.description, { cls: 'text-text-secondary text-xs flex-1' }],
        [tx, p.example || '', { cls: 'text-text-muted font-mono text-xs' }]
      ], { cls: 'gap-2 items-center flex py-1.5 border-b border-border' }]), { cls: 'space-y-0' }]
    ]))], { cls: 'space-y-4' }],

  'events': () => [vs, [Section({ title: 'events & operations', subtitle: 'event handlers and state operations' }),
    Card({}, [[tx, 'events', { cls: 'text-sm font-semibold text-accent uppercase mb-3 block' }],
      [vs, API_DATA.events.map(e => [hs, [[tx, e.name, { cls: 'text-success font-semibold font-mono text-sm w-10' }],
        [tx, e.fullName || '', { cls: 'text-text-primary text-sm w-[100px]' }], [tx, e.description, { cls: 'text-text-secondary text-xs flex-1' }],
        [tx, e.example || '', { cls: 'text-text-muted font-mono text-xs' }]], { cls: 'gap-2 items-center flex py-2 border-b border-border' }]), { cls: 'space-y-0' }]]),
    Card({}, [[tx, 'state operations', { cls: 'text-sm font-semibold text-accent uppercase mb-3 block' }],
      [vs, API_DATA.stateOps.map(op => [hs, [[tx, op.op || '', { cls: 'text-warning font-bold font-mono text-base w-[30px] text-center' }],
        [tx, op.name, { cls: 'text-text-primary text-sm w-20' }], [tx, op.description, { cls: 'text-text-secondary text-xs flex-1' }],
        [tx, op.example || '', { cls: 'text-text-muted font-mono text-xs' }]], { cls: 'gap-2 items-center flex py-2 border-b border-border' }]), { cls: 'space-y-0' }]])
  ], { cls: 'space-y-4' }],

  'control-flow': () => [vs, [Section({ title: 'control flow', subtitle: 'conditional rendering and list iteration' }),
    ...API_DATA.controlFlow.map(cf => Card({}, [[tx, cf.name, { cls: 'text-sm font-semibold text-text-primary block mb-2' }],
      [tx, cf.description, { cls: 'text-text-secondary text-sm block mb-3' }],
      Code({ code: cf.example || '' })]))], { cls: 'space-y-4' }],

  'theming': () => [vs, [Section({ title: 'theming', subtitle: 'token-based theming system' }),
    Card({}, [[tx, API_DATA.theming.description, { cls: 'text-text-secondary block mb-4' }],
      [tx, 'interface', { cls: 'text-xs text-text-muted uppercase tracking-wider' }], Code({ code: API_DATA.theming.interface })]),
    Card({}, [[tx, 'example', { cls: 'text-xs text-text-muted uppercase tracking-wider mb-2 block' }],
      Code({ code: API_DATA.theming.example })])], { cls: 'space-y-4' }],

  'plugins': () => [vs, [Section({ title: 'plugins', subtitle: 'extend with lifecycle hooks' }),
    Card({}, [[tx, API_DATA.plugins.description, { cls: 'text-text-secondary block mb-4' }], Code({ code: API_DATA.plugins.interface })]),
    Card({}, [[tx, 'hooks', { cls: 'text-sm font-semibold text-accent uppercase mb-3 block' }],
      [vs, API_DATA.plugins.hooks.map(h => [hs, [[tx, h.name, { cls: 'text-success font-semibold font-mono text-sm w-[120px]' }],
        [tx, h.description, { cls: 'text-text-secondary text-xs flex-1' }]], { cls: 'gap-2 items-center flex py-2 border-b border-border' }]), { cls: 'space-y-0' }]]),
    Card({}, [[tx, 'example', { cls: 'text-xs text-text-muted uppercase tracking-wider mb-2 block' }], Code({ code: API_DATA.plugins.example })])
  ], { cls: 'space-y-4' }],

  'function-components': () => [vs, [Section({ title: 'function components', subtitle: 'create reusable components' }),
    Card({}, [[tx, API_DATA.functionComponents.description, { cls: 'text-text-secondary block mb-4' }], Code({ code: API_DATA.functionComponents.signature })]),
    Card({}, [[tx, 'example', { cls: 'text-xs text-text-muted uppercase tracking-wider mb-2 block' }], Code({ code: API_DATA.functionComponents.example })])], { cls: 'space-y-4' }],

  'error-boundaries': () => [vs, [Section({ title: 'error boundaries', subtitle: 'catch render errors gracefully' }),
    Card({}, [[tx, API_DATA.errorBoundaries.description, { cls: 'text-text-secondary block mb-4' }], Code({ code: API_DATA.errorBoundaries.interface })]),
    Card({}, [[tx, 'example', { cls: 'text-xs text-text-muted uppercase tracking-wider mb-2 block' }], Code({ code: API_DATA.errorBoundaries.example })])], { cls: 'space-y-4' }],

  'types': () => [vs, [Section({ title: 'types', subtitle: 'typescript type definitions' }),
    ...API_DATA.types.map(t => Card({}, [[tx, t.name, { cls: 'text-success font-semibold font-mono text-sm' }],
      [tx, t.description, { cls: 'text-text-secondary text-sm my-2' }], Code({ code: t.signature || '' })]))], { cls: 'space-y-4' }],

  'examples': () => [vs, [Section({ title: 'examples', subtitle: 'interactive demos with token comparisons' }),
    [vs, API_DATA.examples.map((ex: { id: string; name: string; file: string; savings: string; tooeyTokens: number; reactTokens: number; description: string; tooeyCode: string; reactCode: string; demoSpec: string; reactDemoCode: string }) => Card({}, [
      [hs, [
        [tx, ex.name, { cls: 'text-text-primary font-semibold text-base' }],
        [tx, ex.savings, { cls: 'text-success font-bold font-mono text-sm' }]
      ], { cls: 'justify-between items-center flex' }],
      [tx, ex.description, { cls: 'text-text-secondary text-sm my-2 mb-4' }],
      [dv, [
        [vs, [
          [hs, [[tx, 'tooey', { cls: 'text-accent text-xs uppercase tracking-wider' }],
            [tx, `(${ex.tooeyTokens} tokens)`, { cls: 'text-text-muted text-xs' }]], { cls: 'gap-2 items-center flex' }],
          Code({ code: ex.tooeyCode, lang: 'javascript' })
        ], { cls: 'gap-2' }],
        [vs, [
          [hs, [[tx, 'react', { cls: 'text-warning text-xs uppercase tracking-wider' }],
            [tx, `(${ex.reactTokens} tokens)`, { cls: 'text-text-muted text-xs' }]], { cls: 'gap-2 items-center flex' }],
          Code({ code: ex.reactCode, lang: 'jsx' })
        ], { cls: 'gap-2' }]
      ], { cls: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }],
      [tx, 'live demos', { cls: 'text-text-muted text-xs uppercase tracking-wider mt-4 mb-2' }],
      [dv, [
        [vs, [
          [tx, 'tooey', { cls: 'text-accent text-[10px] uppercase tracking-wider' }],
          [dv, '', { id: `demo-tooey-${ex.id}`, cls: 'bg-bg-tertiary p-4 rounded-lg border border-border min-h-[100px]' }]
        ], { cls: 'gap-2' }],
        [vs, [
          [tx, 'react', { cls: 'text-warning text-[10px] uppercase tracking-wider' }],
          [dv, '', { id: `demo-react-${ex.id}`, cls: 'bg-bg-tertiary p-4 rounded-lg border border-border min-h-[100px]' }]
        ], { cls: 'gap-2' }]
      ], { cls: 'grid grid-cols-1 sm:grid-cols-2 gap-4' }]
    ])), { cls: 'space-y-6' }]], { cls: 'space-y-4' }],

  'advanced-features': () => [vs, [
    Section({ title: 'advanced features', subtitle: 'refs, context, portals, fragments, reducer, memo, ssr, router, devtools' }),
    // refs
    Card({}, [
      [hs, [[tx, 'refs', { cls: 'text-accent text-xs uppercase' }], [tx, 'ref()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'access dom elements directly for focus, measurements, or third-party integration', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `const inputRef = ref();
render(el, { r: [vs, [
  [In, '', { rf: inputRef, ph: 'type here...' }],
  [bt, 'focus', { c: () => inputRef.el?.focus() }]
]] });` })
    ]),
    // context
    Card({}, [
      [hs, [[tx, 'context', { cls: 'text-accent text-xs uppercase' }], [tx, 'cx() ux()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'pass data deeply without prop drilling', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `const ThemeCtx = cx('#007bff');
const Themed = () => [tx, 'text', { fg: ux(ThemeCtx) }];
render(el, { r: { pv: ThemeCtx, v: '#ff0000', c: [Themed] } });` })
    ]),
    // portals
    Card({}, [
      [hs, [[tx, 'portals', { cls: 'text-accent text-xs uppercase' }], [tx, '{ pt: target, c: [...] }', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'render content outside the normal dom tree (modals, tooltips)', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `// render modal to document.body
{ pt: document.body, c: [dv, [[tx, 'modal']], { pos: 'fix' }] }` })
    ]),
    // fragments
    Card({}, [
      [hs, [[tx, 'fragments', { cls: 'text-accent text-xs uppercase' }], [tx, 'fr', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'group children without a visible wrapper (uses display: contents)', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `[fr, [[tx, 'one'], [tx, 'two'], [tx, 'three']]]` })
    ]),
    // reducer
    Card({}, [
      [hs, [[tx, 'reducer', { cls: 'text-accent text-xs uppercase' }], [tx, 'rd$()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'complex state logic with reducer pattern (like useReducer)', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `const reducer = (s, a) => a.type === 'inc' ? { n: s.n + 1 } : s;
const { s, dp } = rd$(reducer, { n: 0 });
render(el, { s, r: [vs, [[tx, { $: 'n' }], [bt, '+', { c: () => dp({ type: 'inc' }) }]]] });` })
    ]),
    // memo
    Card({}, [
      [hs, [[tx, 'memo', { cls: 'text-accent text-xs uppercase' }], [tx, 'mm()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'memoize expensive components to prevent unnecessary re-renders', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `const ExpensiveList = mm((props) => [vs, props.items.map(i => [tx, i])]);
// or declarative: { mm: ['dep1', 'dep2'], c: [...] }` })
    ]),
    // ssr
    Card({}, [
      [hs, [[tx, 'ssr', { cls: 'text-accent text-xs uppercase' }], [tx, 'rts() hy()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'server-side rendering and hydration', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `// server
const html = rts({ s: { name: 'world' }, r: [tx, { $: 'name' }] });
// client
const app = hy(container, spec);` })
    ]),
    // router
    Card({}, [
      [hs, [[tx, 'router', { cls: 'text-accent text-xs uppercase' }], [tx, 'lk ot() nav()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'client-side routing for single-page apps', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `const routes = [{ p: '/', c: Home }, { p: '/about', c: About }];
[vs, [[lk, 'home', { to: '/' }], [lk, 'about', { to: '/about' }], ot(routes)]]` })
    ]),
    // devtools
    Card({}, [
      [hs, [[tx, 'devtools', { cls: 'text-accent text-xs uppercase' }], [tx, 'devtools()', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'debugging plugin with state inspection and history (this docs site uses it!)', { cls: 'text-text-secondary text-sm mb-3 block' }],
      Code({ code: `render(el, spec, { plugins: [devtools({ name: 'my-app' })] });
// console: window.__TOOEY_DEVTOOLS__.getState()` })
    ])
  ], { cls: 'space-y-4' }],

  'component-library': () => [vs, [
    Section({ title: '@tooey/components', subtitle: 'shadcn-inspired component library for tooey' }),
    // intro card
    Card({}, [
      [tx, 'a collection of pre-built, beautifully designed components inspired by shadcn/ui. includes buttons, cards, badges, alerts, progress bars, and more - all optimized for token efficiency.', { cls: 'text-text-secondary text-sm block mb-4' }],
      [hs, [
        [Bg, [[tx, 'beta']], { variant: 'secondary' }],
        [Bg, [[tx, '~10kb']], { variant: 'outline' }],
        [Bg, [[tx, 'token-efficient']], {}]
      ], { cls: 'gap-2 flex flex-wrap' }]
    ]),
    // buttons
    Card({}, [
      [hs, [[tx, 'buttons', { cls: 'text-accent text-xs uppercase' }], [tx, 'Bt', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, '6 variants (default, destructive, outline, secondary, ghost, link) and 4 sizes', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [hs, [
        [Bt, '', { label: 'default' }],
        [Bt, '', { label: 'destructive', variant: 'destructive' }],
        [Bt, '', { label: 'outline', variant: 'outline' }],
        [Bt, '', { label: 'secondary', variant: 'secondary' }],
        [Bt, '', { label: 'ghost', variant: 'ghost' }],
        [Bt, '', { label: 'link', variant: 'link' }]
      ], { cls: 'gap-2 flex flex-wrap' }],
      Code({ code: `[Bt, '', { label: 'click me', variant: 'outline' }]` })
    ]),
    // badges
    Card({}, [
      [hs, [[tx, 'badges', { cls: 'text-accent text-xs uppercase' }], [tx, 'Bg', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, '4 variants for labels, tags, and status indicators', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [hs, [
        [Bg, '', { label: 'default' }],
        [Bg, '', { label: 'secondary', variant: 'secondary' }],
        [Bg, '', { label: 'destructive', variant: 'destructive' }],
        [Bg, '', { label: 'outline', variant: 'outline' }]
      ], { cls: 'gap-2 flex flex-wrap' }],
      Code({ code: `[Bg, '', { label: 'new', variant: 'secondary' }]` })
    ]),
    // alerts
    Card({}, [
      [hs, [[tx, 'alerts', { cls: 'text-accent text-xs uppercase' }], [tx, 'Al AlT AlD', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'notification messages with title and description', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [Al, [
        [AlT, [[tx, 'heads up!']]],
        [AlD, [[tx, 'you can use these components to build beautiful uis']]]
      ]],
      [dv, '', { h: 8 }],
      [Al, [
        [AlT, [[tx, 'error']]],
        [AlD, [[tx, 'something went wrong']]]
      ], { variant: 'destructive' }],
      Code({ code: `[Al, [[AlT, [[tx, 'title']]], [AlD, [[tx, 'description']]]], { variant: 'destructive' }]` })
    ]),
    // progress
    Card({}, [
      [hs, [[tx, 'progress', { cls: 'text-accent text-xs uppercase' }], [tx, 'Pg', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'progress bar with customizable value and max', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [vs, [
        [Pg, '', { value: 25 }],
        [Pg, '', { value: 50 }],
        [Pg, '', { value: 75 }]
      ], { cls: 'gap-2' }],
      Code({ code: `[Pg, '', { value: 75, max: 100 }]` })
    ]),
    // avatar
    Card({}, [
      [hs, [[tx, 'avatar', { cls: 'text-accent text-xs uppercase' }], [tx, 'Av', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'user avatar with image support and fallback initials', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [hs, [
        [Av, '', { fallback: 'JD' }],
        [Av, '', { fallback: 'AB', w: 48 }],
        [Av, '', { fallback: '?', w: 32 }]
      ], { cls: 'gap-2 items-center flex' }],
      Code({ code: `[Av, '', { fallback: 'JD', w: 48 }]` })
    ]),
    // separator
    Card({}, [
      [hs, [[tx, 'separator', { cls: 'text-accent text-xs uppercase' }], [tx, 'Sp', { cls: 'text-success font-mono text-sm' }]], { cls: 'gap-2 items-center flex mb-2' }],
      [tx, 'divider line - horizontal or vertical', { cls: 'text-text-secondary text-sm mb-3 block' }],
      [vs, [
        [tx, 'content above', { cls: 'text-text-secondary text-sm' }],
        [Sp],
        [tx, 'content below', { cls: 'text-text-secondary text-sm' }]
      ], { cls: 'gap-2' }],
      Code({ code: `[Sp]  // or [Sp, '', { orientation: 'vertical' }]` })
    ]),
    // available components
    Card({}, [
      [tx, 'all available components', { cls: 'text-accent text-xs uppercase mb-2 block' }],
      [gr, [
        [vs, [[tx, 'layout', { cls: 'text-success text-xs uppercase' }], [tx, 'Cd CdH CdT CdD CdC CdF', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }],
        [vs, [[tx, 'form', { cls: 'text-success text-xs uppercase' }], [tx, 'Ip Ta Sl Cb Rg RgI Lb Sw', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }],
        [vs, [[tx, 'feedback', { cls: 'text-success text-xs uppercase' }], [tx, 'Al AlT AlD Bg Pg Sk', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }],
        [vs, [[tx, 'overlay', { cls: 'text-success text-xs uppercase' }], [tx, 'Dg DgO DgC DgH DgT DgD DgF', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }],
        [vs, [[tx, 'navigation', { cls: 'text-success text-xs uppercase' }], [tx, 'Tb TbL TbT TbC Ac AcI AcT AcC', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }],
        [vs, [[tx, 'misc', { cls: 'text-success text-xs uppercase' }], [tx, 'Av Sp Tt Dd DdT DdM DdI', { cls: 'text-text-primary font-mono text-sm' }]], { cls: 'gap-1' }]
      ], { cols: 3, g: 16 }]
    ]),
    // installation
    Card({}, [
      [tx, 'installation', { cls: 'text-accent text-xs uppercase mb-2 block' }],
      Code({ code: `npm install @tooey/components

import { Bt, Cd, Bg, Al, shadcnTheme } from '@tooey/components';
import { createTooey } from '@tooey/ui';

const tooey = createTooey({ theme: shadcnTheme });
tooey.render(el, { r: [Bt, '', { label: 'hello' }] });` })
    ])
  ], { cls: 'space-y-4' }]
};

// store demo data for lookup by ID
const demoSpecs: Record<string, string> = {};
const reactDemos: Record<string, string> = {};
API_DATA.examples.forEach((ex: { id: string; demoSpec: string; reactDemoCode: string }) => {
  demoSpecs[ex.id] = ex.demoSpec;
  reactDemos[ex.id] = ex.reactDemoCode;
});

const setupShoppingCartDemo = (instance: ReturnType<typeof render>): void => {
  const q1 = instance.state.q1;
  const q2 = instance.state.q2;
  const total = instance.state.total;
  if (!q1 || !q2 || !total) return;

  effect(() => {
    const rawQ1 = q1() as number;
    const rawQ2 = q2() as number;
    const safeQ1 = Math.max(0, rawQ1);
    const safeQ2 = Math.max(0, rawQ2);

    if (safeQ1 !== rawQ1) q1.set(safeQ1);
    if (safeQ2 !== rawQ2) q2.set(safeQ2);

    const newTotal = `$${safeQ1 * 25 + safeQ2 * 35}`;
    if (total() !== newTotal) total.set(newTotal);
  });
};

const setupTemperatureDemo = (instance: ReturnType<typeof render>): void => {
  const c = instance.state.c;
  const f = instance.state.f;
  if (!c || !f) return;

  let prevC = Number(c());
  let prevF = Number(f());

  effect(() => {
    const currentC = Number(c());
    const currentF = Number(f());
    const cChanged = currentC !== prevC;
    const fChanged = currentF !== prevF;

    if (cChanged && !fChanged) {
      const nextF = Math.round(currentC * 9 / 5 + 32);
      prevC = currentC;
      prevF = nextF;
      if (f() !== nextF) f.set(nextF);
      return;
    }

    if (fChanged && !cChanged) {
      const nextC = Math.round((currentF - 32) * 5 / 9);
      prevF = currentF;
      prevC = nextC;
      if (c() !== nextC) c.set(nextC);
      return;
    }

    prevC = currentC;
    prevF = currentF;
  });
};

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'home', page: 'home' }, { label: 'core functions', page: 'core-functions' }, { label: 'instance methods', page: 'instance-methods' },
  { label: 'components', page: 'components' }, { label: 'props', page: 'props' }, { label: 'events & ops', page: 'events' },
  { label: 'control flow', page: 'control-flow' }, { label: 'theming', page: 'theming' }, { label: 'plugins', page: 'plugins' },
  { label: 'function components', page: 'function-components' }, { label: 'error boundaries', page: 'error-boundaries' },
  { label: 'advanced features', page: 'advanced-features' }, { label: 'types', page: 'types' }, { label: 'examples', page: 'examples' },
  { label: '@tooey/components', page: 'component-library' }
];

// ============================================================================
// app state
// ============================================================================

const currentPage = signal<Page>((window.location.hash.slice(1) as Page) || 'home');
const searchQuery = signal('');
const searchResults = signal<SearchResult[]>([]);
const isDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

let pageContainer: HTMLElement;
let searchContainer: HTMLElement;

const navigateTo = (page: Page) => {
  window.location.hash = page;
  currentPage.set(page);
  searchQuery.set('');
  searchResults.set([]);
};

// load Prism for syntax highlighting
let prismLoaded = false;
let prismStyleEl: HTMLStyleElement | null = null;

const updatePrismTheme = (dark: boolean) => {
  if (!prismStyleEl) {
    prismStyleEl = document.createElement('style');
    document.head.appendChild(prismStyleEl);
  }
  // custom syntax highlighting colors that work in both modes
  prismStyleEl.textContent = dark ? `
    code[class*="language-"], pre[class*="language-"] { color: #e0e0e0; background: #111; }
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955; }
    .token.punctuation { color: #808080; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol { color: #b5cea8; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin { color: #ce9178; }
    .token.operator, .token.entity, .token.url { color: #d4d4d4; }
    .token.atrule, .token.attr-value, .token.keyword { color: #569cd6; }
    .token.function, .token.class-name { color: #dcdcaa; }
    .token.regex, .token.important, .token.variable { color: #d16969; }
  ` : `
    code[class*="language-"], pre[class*="language-"] { color: #333; background: #f4f4f4; }
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955; }
    .token.punctuation { color: #393a34; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol { color: #36acaa; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin { color: #9a6700; }
    .token.operator, .token.entity, .token.url { color: #393a34; }
    .token.atrule, .token.attr-value, .token.keyword { color: #0550ae; }
    .token.function, .token.class-name { color: #6f42c1; }
    .token.regex, .token.important, .token.variable { color: #cf222e; }
  `;
};

const loadPrism = (): Promise<void> => {
  if (prismLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    // apply initial theme
    updatePrismTheme(isDark());
    // load Prism JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/prismjs@1/prism.min.js';
    script.onload = () => {
      // load additional languages
      const jsxScript = document.createElement('script');
      jsxScript.src = 'https://unpkg.com/prismjs@1/components/prism-jsx.min.js';
      jsxScript.onload = () => {
        const tsScript = document.createElement('script');
        tsScript.src = 'https://unpkg.com/prismjs@1/components/prism-typescript.min.js';
        tsScript.onload = () => {
          prismLoaded = true;
          resolve();
        };
        document.head.appendChild(tsScript);
      };
      document.head.appendChild(jsxScript);
    };
    document.head.appendChild(script);
  });
};

const highlightCode = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Prism = (window as any).Prism;
  if (Prism) {
    // highlight each code element individually for reliability
    document.querySelectorAll('code[class*="language-"]').forEach((el) => {
      if (!el.classList.contains('prism-highlighted')) {
        Prism.highlightElement(el);
        el.classList.add('prism-highlighted');
      }
    });
  }
};

// load React and Babel from CDN for examples page
let reactLoaded = false;
const loadReact = (): Promise<void> => {
  if (reactLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    const react = document.createElement('script');
    react.src = 'https://unpkg.com/react@18/umd/react.development.js';
    react.crossOrigin = 'anonymous';
    react.onload = () => {
      const reactDom = document.createElement('script');
      reactDom.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
      reactDom.crossOrigin = 'anonymous';
      reactDom.onload = () => {
        const babel = document.createElement('script');
        babel.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
        babel.onload = () => {
          reactLoaded = true;
          resolve();
        };
        document.head.appendChild(babel);
      };
      document.head.appendChild(reactDom);
    };
    document.head.appendChild(react);
  });
};

const renderReactDemo = (container: HTMLElement, code: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Babel = (window as any).Babel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const React = (window as any).React;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ReactDOM = (window as any).ReactDOM;
    if (!Babel || !React || !ReactDOM) return;

    // transpile JSX to JS
    const transformed = Babel.transform(code, { presets: ['react'] }).code;
    // create component function
    const Component = new Function('React', `${transformed}; return ${code.match(/function\s+(\w+)/)?.[1] || 'Component'};`)(React);
    // render to container
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(Component));
    container.dataset.rendered = 'true';
  } catch (e) {
    console.warn('[tooey] failed to render react demo:', e);
    container.textContent = 'failed to render';
  }
};

const renderPage = () => {
  if (!pageContainer) return;
  const page = currentPage();
  pageContainer.innerHTML = '';
  render(pageContainer, { r: pages[page]() });

  // render logos
  renderLogos();

  // render code blocks and apply syntax highlighting
  // use requestAnimationFrame to ensure DOM is ready, then load Prism and highlight
  requestAnimationFrame(() => {
    renderCodeBlocks();
    loadPrism().then(() => {
      // double RAF to ensure code blocks are fully rendered
      requestAnimationFrame(highlightCode);
    });
  });

  // update nav button styles
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    const el = btn as HTMLElement;
    el.style.background = navItems[i].page === page ? 'var(--bg-tertiary)' : 'transparent';
    el.style.color = navItems[i].page === page ? 'var(--accent)' : 'var(--text-secondary)';
  });

  // render live demos on examples page
  if (page === 'examples') {
    // render tooey demos
    Object.keys(demoSpecs).forEach((id) => {
      const el = document.getElementById(`demo-tooey-${id}`);
      if (el && !el.dataset.rendered) {
        try {
          const spec = JSON.parse(demoSpecs[id]);
          const instance = render(el, spec);
          if (id === 'shopping-cart') {
            setupShoppingCartDemo(instance);
          }
          if (id === 'temperature') {
            setupTemperatureDemo(instance);
          }
          el.dataset.rendered = 'true';
        } catch (e) {
          console.warn('[tooey] failed to render demo:', id, e);
        }
      }
    });
    // load react and render react demos
    loadReact().then(() => {
      Object.keys(reactDemos).forEach((id) => {
        const el = document.getElementById(`demo-react-${id}`);
        if (el && !el.dataset.rendered) {
          renderReactDemo(el, reactDemos[id]);
        }
      });
    });
  }
};

const renderSearchResults = () => {
  if (!searchContainer) return;
  const results = searchResults();
  if (!results.length) { searchContainer.innerHTML = ''; return; }
  searchContainer.innerHTML = '';
  render(searchContainer, { r: [vs, results.slice(0, 10).map(r => [dv, [
    [hs, [[tx, r.type, { cls: 'text-[9px] text-accent bg-bg-tertiary px-1.5 py-0.5 rounded uppercase' }],
      [tx, r.name, { cls: 'text-text-primary font-medium text-sm' }]], { cls: 'gap-1.5 items-center flex' }],
    [tx, r.description, { cls: 'text-text-secondary text-xs' }]
  ], { cls: 'search-result p-2 rounded cursor-pointer hover:bg-bg-tertiary transition-colors' }]), {
    cls: 'absolute top-[42px] left-0 right-0 bg-bg-secondary rounded p-2 z-[100] max-h-[300px] overflow-auto border border-border shadow-lg'
  }] });
};

// ============================================================================
// init
// ============================================================================

// create ref for search input (demonstrating refs feature)
const searchRef = ref<HTMLInputElement | null>();

const init = () => {
  applyCssVars(isDark() ? darkTheme : lightTheme);
  injectGlobalStyles();

  const container = document.getElementById('app');
  if (!container) return;

  // create devtools plugin (demonstrating devtools feature)
  const docsDevtools = devtools({ name: 'tooey-docs', log: false });

  const spec: TooeySpec = {
    s: {},
    r: [hs, [
      // mobile menu button (hidden on desktop)
      [bt, '', { id: 'menu-btn', cls: 'fixed top-4 left-4 z-[1001] bg-bg-secondary p-2.5 rounded-lg border border-border hidden' }],
      // sidebar overlay (for mobile) - using portal would be cleaner but keeping simple for now
      [dv, '', { id: 'sidebar-overlay', cls: 'fixed inset-0 z-[999] bg-black/50 hidden' }],
      // sidebar
      [vs, [
        [hs, [Logo({ size: 32 }), [tx, 'tooey', { cls: 'text-lg font-bold text-text-primary' }]], { cls: 'gap-2 items-center flex mb-6' }],
        [vs, [
          // using ref for search input
          [In, '', { ph: 'search...', id: 'search', rf: searchRef, cls: 'bg-bg-tertiary text-text-primary px-3 py-2 rounded w-full border border-border outline-none focus:border-accent' }],
          [dv, '', { id: 'search-results' }]
        ], { cls: 'relative mb-4' }],
        [vs, navItems.map(item => [bt, item.label, { cls: 'nav-btn bg-transparent text-text-secondary px-3 py-2 rounded w-full text-left text-sm cursor-pointer border-none hover:bg-bg-tertiary hover:text-accent transition-colors' }]), { cls: 'gap-0.5' }],
        [hs, [[bt, '', { id: 'theme-btn', cls: 'bg-transparent text-text-secondary p-2 rounded cursor-pointer border-none hover:text-accent transition-colors' }],
          [ln, '', { href: 'https://github.com/vijaypemmaraju/tooey', id: 'github-link', cls: 'text-text-secondary p-2 hover:text-accent transition-colors' }]], { cls: 'gap-2 mt-auto' }]
      ], { id: 'sidebar', cls: 'w-60 h-screen p-6 bg-bg-secondary fixed top-0 left-0 z-[1000] border-r border-border overflow-y-auto flex flex-col transition-transform duration-300' }],
      // content with error boundary
      [dv, [{ boundary: true, child: [dv, '', { id: 'page-content' }], fallback: Card({}, [[tx, 'error', { cls: 'text-error font-semibold' }]]), onError: (e) => console.error(e) }],
        { id: 'main-content', cls: 'ml-60 p-8 max-w-[900px] min-h-screen' }]
    ], { cls: 'w-full' }]
  };

  // render with both logger and devtools plugins
  render(container, spec, { plugins: [loggerPlugin, docsDevtools] });

  pageContainer = document.getElementById('page-content')!;
  searchContainer = document.getElementById('search-results')!;
  // use ref for search input instead of getElementById (demonstrating refs feature)
  const searchInput = searchRef.el;
  const themeBtn = document.getElementById('theme-btn')!;
  const githubLink = document.getElementById('github-link')!;
  const menuBtn = document.getElementById('menu-btn')!;
  const sidebar = document.getElementById('sidebar')!;
  const sidebarOverlay = document.getElementById('sidebar-overlay')!;
  const mainContent = document.getElementById('main-content')!;

  // icons
  const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
  const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
  const ghIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.089-.744.083-.729.083-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>';
  const menuIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  const closeIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  themeBtn.innerHTML = isDark() ? sunIcon : moonIcon;
  githubLink.innerHTML = ghIcon;
  menuBtn.innerHTML = menuIcon;

  // mobile responsive handling
  let isMobile = window.innerWidth <= 768;
  let sidebarOpen = false;

  const updateMobileLayout = () => {
    isMobile = window.innerWidth <= 768;
    if (isMobile) {
      menuBtn.style.display = 'block';
      sidebar.style.transform = sidebarOpen ? 'translateX(0)' : 'translateX(-100%)';
      sidebarOverlay.style.display = sidebarOpen ? 'block' : 'none';
      mainContent.style.marginLeft = '0';
      mainContent.style.padding = '16px';
      mainContent.style.paddingTop = '60px';
    } else {
      menuBtn.style.display = 'none';
      sidebar.style.transform = 'translateX(0)';
      sidebarOverlay.style.display = 'none';
      mainContent.style.marginLeft = '240px';
      mainContent.style.padding = '32px';
      sidebarOpen = false;
    }
  };

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
    menuBtn.innerHTML = sidebarOpen ? closeIcon : menuIcon;
    updateMobileLayout();
  };

  const closeSidebar = () => {
    if (sidebarOpen) {
      sidebarOpen = false;
      menuBtn.innerHTML = menuIcon;
      updateMobileLayout();
    }
  };

  menuBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  window.addEventListener('resize', updateMobileLayout);
  updateMobileLayout();

  // events
  searchInput?.addEventListener('input', (e) => {
    const q = (e.target as HTMLInputElement).value;
    searchQuery.set(q);
    searchResults.set(searchAPI(q));
    renderSearchResults();
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { searchQuery.set(''); searchResults.set([]); searchInput.value = ''; renderSearchResults(); }
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('#search') && !(e.target as HTMLElement).closest('#search-results')) {
      searchResults.set([]); renderSearchResults();
    }
  });

  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      navigateTo(navItems[i].page);
      closeSidebar();
    });
  });

  themeBtn.addEventListener('click', () => {
    isDark.set(!isDark());
    applyCssVars(isDark() ? darkTheme : lightTheme);
    themeBtn.innerHTML = isDark() ? sunIcon : moonIcon;
    updatePrismTheme(isDark());
  });

  // handle browser back/forward
  window.addEventListener('popstate', () => {
    const page = (window.location.hash.slice(1) as Page) || 'home';
    if (navItems.some(n => n.page === page)) {
      currentPage.set(page);
    }
  });

  // reactivity
  effect(renderPage);
  effect(renderSearchResults);

  // render sidebar logos
  renderLogos();
};

document.addEventListener('DOMContentLoaded', init);
