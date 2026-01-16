/**
 * tooey documentation site
 * demonstrates the full tooey ecosystem: signals, computed, effects, plugins, theming, function components
 */

import { render, signal, effect, V, H, D, G, T, B, I, L } from '@tooey/ui';
import type { TooeySpec, NodeSpec, Props, TooeyPlugin } from '@tooey/ui';
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

const Card = (_props: Props = {}, children: NodeSpec[] = []): NodeSpec =>
  [V, children, { bg: 'var(--bg-secondary)', p: 16, r: 8, s: { border: '1px solid var(--border)' } }];

const Code = (props: { code: string }): NodeSpec =>
  [D, [[T, props.code, { s: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }]], {
    bg: 'var(--code-bg)', p: 8, r: 4, fs: 12, ff: 'ui-monospace, monospace', fg: 'var(--success)', ov: 'auto', s: { maxHeight: '300px' }
  }];

const Section = (props: { title: string; subtitle?: string }): NodeSpec =>
  [V, [
    [T, props.title, { fs: 11, fw: 400, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px', display: 'block' } }],
    props.subtitle ? [T, props.subtitle, { fs: 13, fg: 'var(--text-secondary)', m: '4px 0 0 0' }] : null
  ].filter(Boolean) as NodeSpec[], { m: '0 0 16px 0' }];

const ApiDetail = (props: { item: ApiItem; type: string }): NodeSpec => {
  const { item, type } = props;
  const children: NodeSpec[] = [
    [H, [
      [T, type, { fs: 10, fg: 'var(--accent)', bg: 'var(--bg-tertiary)', p: '2px 8px', r: 4, s: { textTransform: 'uppercase' } }],
      [T, item.name || item.op || item.fullName || '', { fs: 18, fw: 600, fg: 'var(--text)' }]
    ], { g: 8, ai: 'c' }],
    [T, item.description, { fg: 'var(--text-secondary)', m: '8px 0 16px 0', s: { display: 'block' } }]
  ];
  if (item.signature) children.push(Code({ code: item.signature }));
  if (item.example) children.push([V, [
    [T, 'example', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px' } }],
    Code({ code: item.example })
  ], { g: 8, m: '16px 0' }]);
  return Card({}, children);
};

// ============================================================================
// pages
// ============================================================================

type Page = 'home' | 'core-functions' | 'instance-methods' | 'components' | 'props' | 'events' | 'control-flow' | 'theming' | 'plugins' | 'function-components' | 'error-boundaries' | 'types' | 'examples';

const pages: Record<Page, () => NodeSpec> = {
  'home': () => [V, [
    [V, [
      [H, [[D, '', { w: 48, h: 48, r: 12, bg: 'var(--accent)', s: { boxShadow: '0 4px 20px rgba(0,170,255,0.3)' } }],
        [V, [[T, 'tooey', { fs: 28, fw: 700, fg: 'var(--text)' }], [T, 'token-efficient ui for llm output', { fs: 14, fg: 'var(--text-secondary)' }]], { g: 4 }]], { g: 16, ai: 'c' }],
      [H, [[T, '~39%', { fg: 'var(--accent)', fw: 600 }], [T, 'fewer tokens', { fg: 'var(--text-secondary)' }],
        [T, '|', { fg: 'var(--border)', m: '0 8px' }], [T, '~10kb', { fg: 'var(--accent)', fw: 600 }], [T, 'minified', { fg: 'var(--text-secondary)' }],
        [T, '|', { fg: 'var(--border)', m: '0 8px' }], [T, '0', { fg: 'var(--accent)', fw: 600 }], [T, 'deps', { fg: 'var(--text-secondary)' }]], { g: 6, ai: 'c', flw: 'wrap', m: '24px 0' }]
    ], { m: '0 0 32px 0' }],
    Card({}, [Section({ title: 'quick start' }), Code({ code: `import { render, V, T, B } from '@tooey/ui';
render(document.getElementById('app'), {
  s: { count: 0 },
  r: [V, [[T, { $: 'count' }], [B, '+', { c: 'count+' }]], { g: 8 }]
});` }), [H, [[B, 'examples', { c: () => navigateTo('examples'), bg: 'var(--accent)', fg: '#fff', p: '8px 16px', r: 4, s: { border: 'none', cursor: 'pointer' } }],
      [L, 'github', { href: 'https://github.com/vijaypemmaraju/tooey', fg: 'var(--text-secondary)', p: '8px 16px', s: { textDecoration: 'none' } }]], { g: 8, m: '16px 0 0 0' }]]),
    [G, [
      Card({}, [[T, 'signals & reactivity', { fw: 600, fg: 'var(--text)', fs: 14, s: { display: 'block', marginBottom: '8px' } }], [T, 'fine-grained reactivity with signals, computed, and effects', { fg: 'var(--text-secondary)', fs: 13 }]]),
      Card({}, [[T, 'function components', { fw: 600, fg: 'var(--text)', fs: 14, s: { display: 'block', marginBottom: '8px' } }], [T, 'create reusable components as simple functions', { fg: 'var(--text-secondary)', fs: 13 }]]),
      Card({}, [[T, 'theming', { fw: 600, fg: 'var(--text)', fs: 14, s: { display: 'block', marginBottom: '8px' } }], [T, 'token-based theming with $token syntax', { fg: 'var(--text-secondary)', fs: 13 }]]),
      Card({}, [[T, 'plugins', { fw: 600, fg: 'var(--text)', fs: 14, s: { display: 'block', marginBottom: '8px' } }], [T, 'extend functionality with lifecycle hooks', { fg: 'var(--text-secondary)', fs: 13 }]])
    ], { cols: 2, g: 16, m: '24px 0' }],
    Card({}, [Section({ title: 'components' }), [G, ['layout', 'text', 'form', 'table', 'list', 'media'].map(cat =>
      [V, [[T, cat, { fg: 'var(--accent)', fs: 11, s: { textTransform: 'uppercase', letterSpacing: '1px' } }],
        [T, API_DATA.components.filter(c => c.category === cat).map(c => c.name).join(' '), { fg: 'var(--text)', ff: 'monospace' }]], { g: 4 }]), { cols: 3, g: 16 }]])
  ], { g: 24 }],

  'core-functions': () => [V, [Section({ title: 'core functions', subtitle: 'essential functions for rendering and state management' }),
    ...API_DATA.coreFunctions.map(fn => ApiDetail({ item: fn, type: 'function' }))], { g: 16 }],

  'instance-methods': () => [V, [Section({ title: 'instance methods', subtitle: 'methods on TooeyInstance returned by render()' }),
    ...API_DATA.instanceMethods.map(m => ApiDetail({ item: m, type: 'method' }))], { g: 16 }],

  'components': () => [V, [Section({ title: 'components', subtitle: '22 built-in components with short names' }),
    ...['layout', 'text', 'form', 'table', 'list', 'media'].map(cat => Card({}, [
      [T, cat, { fs: 13, fw: 600, fg: 'var(--accent)', s: { textTransform: 'uppercase', marginBottom: '12px', display: 'block' } }],
      [G, API_DATA.components.filter(c => c.category === cat).map(c => [V, [
        [H, [[T, c.name, { fg: 'var(--success)', fw: 700, ff: 'monospace', fs: 16 }], [T, `(${c.fullName})`, { fg: 'var(--text-muted)', fs: 12 }]], { g: 6, ai: 'c' }],
        [T, c.description, { fg: 'var(--text-secondary)', fs: 12 }], [T, c.element, { fg: 'var(--text-muted)', fs: 11, ff: 'monospace' }]
      ], { g: 4, p: 8, bg: 'var(--bg-tertiary)', r: 4 }]), { cols: 2, g: 8 }]
    ]))], { g: 16 }],

  'props': () => [V, [Section({ title: 'props', subtitle: 'all style and element properties' }),
    ...['spacing', 'sizing', 'colors', 'borders', 'positioning', 'typography', 'layout', 'misc', 'element'].map(cat => Card({}, [
      [T, cat, { fs: 13, fw: 600, fg: 'var(--accent)', s: { textTransform: 'uppercase', marginBottom: '12px', display: 'block' } }],
      [V, API_DATA.props.filter(p => p.category === cat).map(p => [H, [
        [T, p.name, { fg: 'var(--success)', fw: 600, ff: 'monospace', fs: 13, w: 40 }],
        [T, p.fullName || '', { fg: 'var(--text)', fs: 13, w: 120 }],
        [T, p.description, { fg: 'var(--text-secondary)', fs: 12, s: { flex: '1' } }],
        [T, p.example || '', { fg: 'var(--text-muted)', ff: 'monospace', fs: 11 }]
      ], { g: 8, ai: 'c', p: '6px 0', s: { borderBottom: '1px solid var(--border)' } }]), { g: 0 }]
    ]))], { g: 16 }],

  'events': () => [V, [Section({ title: 'events & operations', subtitle: 'event handlers and state operations' }),
    Card({}, [[T, 'events', { fs: 13, fw: 600, fg: 'var(--accent)', s: { textTransform: 'uppercase', marginBottom: '12px', display: 'block' } }],
      [V, API_DATA.events.map(e => [H, [[T, e.name, { fg: 'var(--success)', fw: 600, ff: 'monospace', fs: 14, w: 40 }],
        [T, e.fullName || '', { fg: 'var(--text)', fs: 13, w: 100 }], [T, e.description, { fg: 'var(--text-secondary)', fs: 12, s: { flex: '1' } }],
        [T, e.example || '', { fg: 'var(--text-muted)', ff: 'monospace', fs: 11 }]], { g: 8, ai: 'c', p: '8px 0', s: { borderBottom: '1px solid var(--border)' } }]), { g: 0 }]]),
    Card({}, [[T, 'state operations', { fs: 13, fw: 600, fg: 'var(--accent)', s: { textTransform: 'uppercase', marginBottom: '12px', display: 'block' } }],
      [V, API_DATA.stateOps.map(op => [H, [[T, op.op || '', { fg: 'var(--warning)', fw: 700, ff: 'monospace', fs: 16, w: 30, ta: 'center' }],
        [T, op.name, { fg: 'var(--text)', fs: 13, w: 80 }], [T, op.description, { fg: 'var(--text-secondary)', fs: 12, s: { flex: '1' } }],
        [T, op.example || '', { fg: 'var(--text-muted)', ff: 'monospace', fs: 11 }]], { g: 8, ai: 'c', p: '8px 0', s: { borderBottom: '1px solid var(--border)' } }]), { g: 0 }]])
  ], { g: 16 }],

  'control-flow': () => [V, [Section({ title: 'control flow', subtitle: 'conditional rendering and list iteration' }),
    ...API_DATA.controlFlow.map(cf => Card({}, [[T, cf.name, { fs: 14, fw: 600, fg: 'var(--text)', s: { display: 'block', marginBottom: '8px' } }],
      [T, cf.description, { fg: 'var(--text-secondary)', fs: 13, s: { display: 'block', marginBottom: '12px' } }],
      Code({ code: cf.example || '' })]))], { g: 16 }],

  'theming': () => [V, [Section({ title: 'theming', subtitle: 'token-based theming system' }),
    Card({}, [[T, API_DATA.theming.description, { fg: 'var(--text-secondary)', s: { display: 'block', marginBottom: '16px' } }],
      [T, 'interface', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px' } }], Code({ code: API_DATA.theming.interface })]),
    Card({}, [[T, 'example', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' } }],
      Code({ code: API_DATA.theming.example })])], { g: 16 }],

  'plugins': () => [V, [Section({ title: 'plugins', subtitle: 'extend with lifecycle hooks' }),
    Card({}, [[T, API_DATA.plugins.description, { fg: 'var(--text-secondary)', s: { display: 'block', marginBottom: '16px' } }], Code({ code: API_DATA.plugins.interface })]),
    Card({}, [[T, 'hooks', { fs: 13, fw: 600, fg: 'var(--accent)', s: { textTransform: 'uppercase', marginBottom: '12px', display: 'block' } }],
      [V, API_DATA.plugins.hooks.map(h => [H, [[T, h.name, { fg: 'var(--success)', fw: 600, ff: 'monospace', fs: 13, w: 120 }],
        [T, h.description, { fg: 'var(--text-secondary)', fs: 12, s: { flex: '1' } }]], { g: 8, ai: 'c', p: '8px 0', s: { borderBottom: '1px solid var(--border)' } }]), { g: 0 }]]),
    Card({}, [[T, 'example', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' } }], Code({ code: API_DATA.plugins.example })])
  ], { g: 16 }],

  'function-components': () => [V, [Section({ title: 'function components', subtitle: 'create reusable components' }),
    Card({}, [[T, API_DATA.functionComponents.description, { fg: 'var(--text-secondary)', s: { display: 'block', marginBottom: '16px' } }], Code({ code: API_DATA.functionComponents.signature })]),
    Card({}, [[T, 'example', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' } }], Code({ code: API_DATA.functionComponents.example })])], { g: 16 }],

  'error-boundaries': () => [V, [Section({ title: 'error boundaries', subtitle: 'catch render errors gracefully' }),
    Card({}, [[T, API_DATA.errorBoundaries.description, { fg: 'var(--text-secondary)', s: { display: 'block', marginBottom: '16px' } }], Code({ code: API_DATA.errorBoundaries.interface })]),
    Card({}, [[T, 'example', { fs: 11, fg: 'var(--text-muted)', s: { textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' } }], Code({ code: API_DATA.errorBoundaries.example })])], { g: 16 }],

  'types': () => [V, [Section({ title: 'types', subtitle: 'typescript type definitions' }),
    ...API_DATA.types.map(t => Card({}, [[T, t.name, { fg: 'var(--success)', fw: 600, ff: 'monospace', fs: 14 }],
      [T, t.description, { fg: 'var(--text-secondary)', fs: 13, m: '8px 0' }], Code({ code: t.signature || '' })]))], { g: 16 }],

  'examples': () => [V, [Section({ title: 'examples', subtitle: 'interactive demos with token comparisons' }),
    [V, API_DATA.examples.map(ex => Card({}, [[H, [[L, ex.name, { href: `examples/${ex.file}`, fg: 'var(--text)', fw: 500, s: { textDecoration: 'none', flex: '1' } }],
      [T, ex.tokens, { fg: 'var(--success)', fw: 600, ff: 'monospace' }]], { jc: 'sb', ai: 'c' }],
      [T, ex.description, { fg: 'var(--text-secondary)', fs: 13, m: '8px 0 0 0' }]])), { g: 8 }]], { g: 16 }]
};

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'home', page: 'home' }, { label: 'core functions', page: 'core-functions' }, { label: 'instance methods', page: 'instance-methods' },
  { label: 'components', page: 'components' }, { label: 'props', page: 'props' }, { label: 'events & ops', page: 'events' },
  { label: 'control flow', page: 'control-flow' }, { label: 'theming', page: 'theming' }, { label: 'plugins', page: 'plugins' },
  { label: 'function components', page: 'function-components' }, { label: 'error boundaries', page: 'error-boundaries' },
  { label: 'types', page: 'types' }, { label: 'examples', page: 'examples' }
];

// ============================================================================
// app state
// ============================================================================

const currentPage = signal<Page>('home');
const searchQuery = signal('');
const searchResults = signal<SearchResult[]>([]);
const isDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

let pageContainer: HTMLElement;
let searchContainer: HTMLElement;

const navigateTo = (page: Page) => {
  currentPage.set(page);
  searchQuery.set('');
  searchResults.set([]);
};

const renderPage = () => {
  if (!pageContainer) return;
  const page = currentPage();
  pageContainer.innerHTML = '';
  render(pageContainer, { r: pages[page]() });
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    const el = btn as HTMLElement;
    el.style.background = navItems[i].page === page ? 'var(--bg-tertiary)' : 'transparent';
    el.style.color = navItems[i].page === page ? 'var(--accent)' : 'var(--text-secondary)';
  });
};

const renderSearchResults = () => {
  if (!searchContainer) return;
  const results = searchResults();
  if (!results.length) { searchContainer.innerHTML = ''; return; }
  searchContainer.innerHTML = '';
  render(searchContainer, { r: [V, results.slice(0, 10).map(r => [D, [
    [H, [[T, r.type, { fs: 9, fg: 'var(--accent)', bg: 'var(--bg-tertiary)', p: '2px 6px', r: 2, s: { textTransform: 'uppercase' } }],
      [T, r.name, { fg: 'var(--text)', fw: 500, fs: 13 }]], { g: 6, ai: 'c' }],
    [T, r.description, { fg: 'var(--text-secondary)', fs: 11 }]
  ], { p: 8, r: 4, cur: 'pointer', cls: 'search-result' }]), {
    pos: 'abs', t: 42, l: 0, rt: 0, bg: 'var(--bg-secondary)', r: 4, p: 8, z: 100, mh: 300, ov: 'auto',
    s: { border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }
  }] });
};

// ============================================================================
// init
// ============================================================================

const init = () => {
  applyCssVars(isDark() ? darkTheme : lightTheme);

  const container = document.getElementById('app');
  if (!container) return;

  const spec: TooeySpec = {
    s: {},
    r: [H, [
      // mobile menu button (hidden on desktop)
      [B, '', { id: 'menu-btn', pos: 'fix', t: 16, l: 16, z: 1001, bg: 'var(--bg-secondary)', p: 10, r: 8, s: { border: '1px solid var(--border)', display: 'none' } }],
      // sidebar overlay (for mobile)
      [D, '', { id: 'sidebar-overlay', pos: 'fix', t: 0, l: 0, w: '100vw', h: '100vh', z: 999, bg: 'rgba(0,0,0,0.5)', s: { display: 'none' } }],
      // sidebar
      [V, [
        [H, [[D, '', { w: 32, h: 32, r: 8, bg: 'var(--accent)', s: { flexShrink: '0' } }], [T, 'tooey', { fs: 18, fw: 700, fg: 'var(--text)' }]], { g: 8, ai: 'c', m: '0 0 24px 0' }],
        [V, [[I, '', { ph: 'search...', bg: 'var(--bg-tertiary)', fg: 'var(--text)', p: '8px 12px', r: 4, w: '100%', s: { border: '1px solid var(--border)', outline: 'none' }, id: 'search' }]], { pos: 'rel', m: '0 0 16px 0' }],
        [D, '', { id: 'search-results' }],
        [V, navItems.map(item => [B, item.label, { bg: 'transparent', fg: 'var(--text-secondary)', p: '8px 12px', r: 4, w: '100%', ta: 'left', fs: 13, cur: 'pointer', s: { border: 'none' }, cls: 'nav-btn' }]), { g: 2 }],
        [H, [[B, '', { bg: 'transparent', fg: 'var(--text-secondary)', p: 8, r: 4, cur: 'pointer', s: { border: 'none' }, id: 'theme-btn' }],
          [L, '', { href: 'https://github.com/vijaypemmaraju/tooey', fg: 'var(--text-secondary)', p: 8, id: 'github-link' }]], { g: 8, m: 'auto 0 0 0' }]
      ], { w: 240, h: '100vh', p: 24, bg: 'var(--bg-secondary)', pos: 'fix', t: 0, l: 0, z: 1000, s: { borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }, id: 'sidebar' }],
      // content
      [D, [[D, '', { id: 'page-content' }]],
        { m: '0 0 0 240px', p: 32, mw: 900, s: { minHeight: '100vh' }, id: 'main-content' }]
    ], { w: '100%' }]
  };

  render(container, spec, { plugins: [loggerPlugin] });

  pageContainer = document.getElementById('page-content')!;
  searchContainer = document.getElementById('search-results')!;
  const searchInput = document.getElementById('search') as HTMLInputElement;
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
  });

  // reactivity
  effect(renderPage);
  effect(renderSearchResults);
};

document.addEventListener('DOMContentLoaded', init);
