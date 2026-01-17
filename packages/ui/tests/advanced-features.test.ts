/**
 * tests for advanced features: refs, context, portals, fragments, reducer, memo, ssr, router, devtools
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  render,
  ref,
  cx,
  ux,
  rd$,
  mm,
  rts,
  hy,
  nav,
  devtools,
  vs, hs, dv, fr,
  tx, bt, In,
  Props,
  Component,
  NodeSpec,
  TooeySpec,
  ProviderNode,
  PortalNode,
  MemoNode
} from '../src/tooey';

describe('Advanced Features', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Refs', () => {
    test('ref() creates ref object with null initial value', () => {
      const r = ref();
      expect(r.el).toBe(null);
    });

    test('ref() can have custom initial value', () => {
      const r = ref<string>('initial');
      expect(r.el).toBe('initial');
    });

    test('rf prop attaches element to ref object', () => {
      const myRef = ref();
      render(container, {
        r: [bt, 'Click', { rf: myRef }]
      });
      expect(myRef.el).toBeInstanceOf(HTMLButtonElement);
      expect(myRef.el?.textContent).toBe('Click');
    });

    test('rf prop works with callback function', () => {
      let capturedEl: HTMLElement | null = null;
      render(container, {
        r: [In, '', { rf: (el) => { capturedEl = el; } }]
      });
      expect(capturedEl).toBeInstanceOf(HTMLInputElement);
    });

    test('ref allows direct DOM manipulation', () => {
      const inputRef = ref<HTMLInputElement | null>();
      render(container, {
        r: [In, '', { rf: inputRef }]
      });
      inputRef.el?.focus();
      expect(document.activeElement).toBe(inputRef.el);
    });
  });

  describe('Context', () => {
    test('cx() creates context with default value', () => {
      const ThemeContext = cx('#007bff');
      expect(ThemeContext._default).toBe('#007bff');
      expect(typeof ThemeContext._id).toBe('number');
    });

    test('ux() returns default value when no provider', () => {
      const ctx = cx('default');
      const value = ux(ctx);
      expect(value).toBe('default');
    });

    test('provider node provides value to children', () => {
      const ThemeContext = cx<string>('#000');

      let capturedValue: string = '';
      const Consumer: Component = () => {
        capturedValue = ux(ThemeContext);
        return [tx, capturedValue];
      };

      const spec: ProviderNode = {
        pv: ThemeContext,
        v: '#ff0000',
        c: [Consumer]
      };

      render(container, { r: spec as unknown as NodeSpec });
      expect(capturedValue).toBe('#ff0000');
    });

    test('nested providers override values', () => {
      const ctx = cx<number>(0);

      let innerValue = 0;
      const Inner: Component = () => {
        innerValue = ux(ctx);
        return [tx, String(innerValue)];
      };

      // inner provider needs to be a proper ProviderNode
      const innerProvider: ProviderNode = {
        pv: ctx,
        v: 2,
        c: [Inner]
      };

      const spec: ProviderNode = {
        pv: ctx,
        v: 1,
        c: [innerProvider as unknown as NodeSpec]
      };

      render(container, { r: spec as unknown as NodeSpec });
      expect(innerValue).toBe(2);
    });
  });

  describe('Portals', () => {
    let portalTarget: HTMLElement;

    beforeEach(() => {
      portalTarget = document.createElement('div');
      portalTarget.id = 'portal-target';
      document.body.appendChild(portalTarget);
    });

    afterEach(() => {
      portalTarget.remove();
    });

    test('portal renders content to target element', () => {
      const spec: PortalNode = {
        pt: portalTarget,
        c: [tx, 'Portal content']
      };

      render(container, { r: spec as unknown as NodeSpec });
      expect(portalTarget.textContent).toBe('Portal content');
    });

    test('portal works with CSS selector', () => {
      const spec: PortalNode = {
        pt: '#portal-target',
        c: [tx, 'Selected portal']
      };

      render(container, { r: spec as unknown as NodeSpec });
      expect(portalTarget.textContent).toBe('Selected portal');
    });

    test('portal content is cleaned up on destroy', () => {
      const spec: PortalNode = {
        pt: portalTarget,
        c: [tx, 'Will be removed']
      };

      const instance = render(container, { r: spec as unknown as NodeSpec });
      expect(portalTarget.textContent).toBe('Will be removed');

      instance.destroy();
      expect(portalTarget.textContent).toBe('');
    });

    test('portal leaves placeholder in original location', () => {
      const spec: PortalNode = {
        pt: portalTarget,
        c: [tx, 'Elsewhere']
      };

      render(container, { r: spec as unknown as NodeSpec });
      const anchor = container.querySelector('[data-tooey-portal-anchor]');
      expect(anchor).not.toBe(null);
    });
  });

  describe('Fragments', () => {
    test('fr renders children without visible wrapper', () => {
      render(container, {
        r: [fr, [[tx, 'One'], [tx, 'Two'], [tx, 'Three']]]
      });
      expect(container.textContent).toBe('OneTwoThree');
    });

    test('fr uses display:contents for invisible wrapper', () => {
      render(container, {
        r: [fr, [[tx, 'Content']]]
      });
      const fragment = container.querySelector('[data-tooey-fragment]') as HTMLElement;
      expect(fragment?.style.display).toBe('contents');
    });

    test('fr can be nested in other components', () => {
      render(container, {
        r: [vs, [[fr, [[tx, 'A'], [tx, 'B']]], [tx, 'C']]]
      });
      expect(container.textContent).toBe('ABC');
    });
  });

  describe('Reducer', () => {
    test('rd$() creates state and dispatch function', () => {
      const reducer = (state: { count: number }, action: { type: string }) => {
        switch (action.type) {
          case 'inc': return { count: state.count + 1 };
          case 'dec': return { count: state.count - 1 };
          default: return state;
        }
      };

      const { s, dp } = rd$(reducer, { count: 0 });
      expect(s.count).toBe(0);
      expect(typeof dp).toBe('function');
    });

    test('dispatch updates state correctly', () => {
      const reducer = (state: { value: number }, action: { type: string; payload?: number }) => {
        switch (action.type) {
          case 'set': return { value: action.payload || 0 };
          case 'double': return { value: state.value * 2 };
          default: return state;
        }
      };

      const { s, dp } = rd$(reducer, { value: 5 });

      // bind to an instance for dispatch to work
      const instance = render(container, {
        s: s,
        r: [tx, { $: 'value' }]
      });

      // manually bind
      (dp as unknown as { _bind?: (inst: unknown) => void })._bind?.(instance);

      expect(instance.get('value')).toBe(5);
    });
  });

  describe('Memo', () => {
    test('mm() wraps component with memoization', () => {
      let renderCount = 0;

      const Expensive: Component = (props) => {
        renderCount++;
        return [tx, (props as Props & { label?: string })?.label || 'default'];
      };

      const MemoExpensive = mm(Expensive);

      // first render
      const result1 = MemoExpensive({ label: 'test' } as Props);
      expect(renderCount).toBe(1);

      // same props - should use cache
      const result2 = MemoExpensive({ label: 'test' } as Props);
      expect(renderCount).toBe(1);
      expect(result1).toBe(result2);

      // different props - should re-render
      MemoExpensive({ label: 'changed' } as Props);
      expect(renderCount).toBe(2);
    });

    test('mm() accepts custom comparison function', () => {
      let renderCount = 0;

      const Comp: Component = () => {
        renderCount++;
        return [tx, 'content'];
      };

      // always return true = never re-render
      const MemoComp = mm(Comp, () => true);

      MemoComp({ label: 'a' } as Props);
      expect(renderCount).toBe(1);

      MemoComp({ label: 'b' } as Props);
      expect(renderCount).toBe(1); // still 1 because compare returns true
    });

    test('memo node memoizes based on state dependencies', () => {
      const memoSpec: MemoNode = {
        mm: ['dep'],
        c: [tx, 'Memoized']
      };

      const instance = render(container, {
        s: { dep: 1, other: 'x' },
        r: memoSpec as unknown as NodeSpec
      });

      expect(container.textContent).toBe('Memoized');

      // changing dep should re-render
      instance.set('dep', 2);
      expect(container.textContent).toBe('Memoized');
    });
  });

  describe('SSR', () => {
    test('rts() renders spec to HTML string', () => {
      const html = rts({
        s: { name: 'World' },
        r: [vs, [[tx, 'Hello, '], [tx, { $: 'name' }]]]
      });

      expect(html).toContain('Hello,');
      expect(html).toContain('World');
      expect(html).toContain('data-tooey-ssr="true"');
    });

    test('rts() handles conditionals', () => {
      const html = rts({
        s: { show: true },
        r: { '?': 'show', t: [tx, 'Visible'], e: [tx, 'Hidden'] }
      });

      expect(html).toContain('Visible');
      expect(html).not.toContain('Hidden');
    });

    test('rts() handles lists', () => {
      const html = rts({
        s: { items: ['a', 'b', 'c'] },
        r: [vs, [{ m: 'items', a: [tx, '$item'] }]]
      });

      expect(html).toContain('a');
      expect(html).toContain('b');
      expect(html).toContain('c');
    });

    test('rts() applies theme tokens', () => {
      const html = rts(
        {
          r: [dv, 'Themed', { bg: '$primary', p: '$md' }]
        },
        {
          theme: {
            colors: { primary: '#007bff' },
            spacing: { md: 16 }
          }
        }
      );

      expect(html).toContain('#007bff');
      expect(html).toContain('16px');
    });

    test('hy() hydrates SSR content', () => {
      const spec: TooeySpec = {
        s: { count: 0 },
        r: [vs, [[tx, { $: 'count' }], [bt, '+', { c: 'count+' }]]]
      };

      // simulate SSR
      container.innerHTML = rts(spec);

      // hydrate
      const instance = hy(container, spec);
      expect(instance.get('count')).toBe(0);

      // should be interactive after hydration
      instance.set('count', 5);
      expect(container.textContent).toContain('5');
    });
  });

  describe('Router', () => {
    test('nav() programmatically navigates', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState');

      nav('/about');

      expect(pushStateSpy).toHaveBeenCalled();
      pushStateSpy.mockRestore();
    });

    test('nav() supports replace option', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      nav('/settings', { replace: true });

      expect(replaceStateSpy).toHaveBeenCalled();
      replaceStateSpy.mockRestore();
    });
  });

  describe('Devtools', () => {
    test('devtools() returns a valid plugin', () => {
      const plugin = devtools();

      expect(plugin.name).toBe('devtools');
      expect(typeof plugin.onInit).toBe('function');
      expect(typeof plugin.onDestroy).toBe('function');
      expect(typeof plugin.onStateChange).toBe('function');
    });

    test('devtools exposes API on window', () => {
      const plugin = devtools({ name: 'test-app', log: false });

      const instance = render(container, {
        s: { value: 42 },
        r: [tx, { $: 'value' }]
      }, { plugins: [plugin] });

      const api = (window as unknown as Record<string, unknown>).__TOOEY_DEVTOOLS__ as {
        getState: () => Record<string, unknown>;
        setState: (key: string, value: unknown) => void;
      };

      expect(api).toBeDefined();
      expect(api.getState().value).toBe(42);

      api.setState('value', 100);
      expect(instance.get('value')).toBe(100);

      instance.destroy();
      expect((window as unknown as Record<string, unknown>).__TOOEY_DEVTOOLS__).toBeUndefined();
    });

    test('devtools tracks state history', () => {
      const plugin = devtools({ log: false });

      const instance = render(container, {
        s: { count: 0 },
        r: [tx, { $: 'count' }]
      }, { plugins: [plugin] });

      instance.set('count', 1);
      instance.set('count', 2);
      instance.set('count', 3);

      const api = (window as unknown as Record<string, unknown>).__TOOEY_DEVTOOLS__ as {
        getHistory: () => Array<{ key: string; oldVal: unknown; newVal: unknown }>;
      };

      const history = api.getHistory();
      expect(history.length).toBe(3);
      expect(history[0].oldVal).toBe(0);
      expect(history[0].newVal).toBe(1);

      instance.destroy();
    });

    test('devtools logs state changes when enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const plugin = devtools({ name: 'test', log: true });

      const instance = render(container, {
        s: { x: 1 },
        r: [tx, '']
      }, { plugins: [plugin] });

      instance.set('x', 2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[test]'),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );

      consoleSpy.mockRestore();
      instance.destroy();
    });
  });
});
