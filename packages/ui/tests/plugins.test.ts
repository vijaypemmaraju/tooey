import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  createTooey,
  vs, tx, bt,
  TooeyPlugin,
  TooeyInstance,
  NodeSpec
} from '../src/tooey';

describe('plugins', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('lifecycle hooks', () => {
    it('calls onInit after render', () => {
      const onInit = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'test-init',
        onInit
      };

      const instance = render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      expect(onInit).toHaveBeenCalledTimes(1);
      expect(onInit).toHaveBeenCalledWith(instance);
    });

    it('calls onDestroy when destroy is called', () => {
      const onDestroy = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'test-destroy',
        onDestroy
      };

      const instance = render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      expect(onDestroy).not.toHaveBeenCalled();
      instance.destroy();
      expect(onDestroy).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledWith(instance);
    });

    it('calls both onInit and onDestroy in order', () => {
      const calls: string[] = [];
      const plugin: TooeyPlugin = {
        name: 'test-lifecycle',
        onInit: () => calls.push('init'),
        onDestroy: () => calls.push('destroy')
      };

      const instance = render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      expect(calls).toEqual(['init']);
      instance.destroy();
      expect(calls).toEqual(['init', 'destroy']);
    });
  });

  describe('render hooks', () => {
    it('calls beforeRender with spec and context', () => {
      const beforeRender = vi.fn((spec: NodeSpec) => spec);
      const plugin: TooeyPlugin = {
        name: 'test-before-render',
        beforeRender
      };

      render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      expect(beforeRender).toHaveBeenCalled();
      // spec should be the [tx, 'hello'] array
      const callArg = beforeRender.mock.calls[0][0];
      expect(callArg).toEqual([tx, 'hello']);
    });

    it('transforms spec in beforeRender', () => {
      const plugin: TooeyPlugin = {
        name: 'test-transform',
        beforeRender: (spec: NodeSpec) => {
          // change text content
          if (Array.isArray(spec) && spec[0] === tx && spec[1] === 'original') {
            return [tx, 'transformed'];
          }
          return spec;
        }
      };

      render(container, {
        r: [tx, 'original']
      }, { plugins: [plugin] });

      expect(container.textContent).toBe('transformed');
    });

    it('calls afterRender with element and spec', () => {
      const afterRender = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'test-after-render',
        afterRender
      };

      render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      expect(afterRender).toHaveBeenCalled();
      const [el, spec] = afterRender.mock.calls[0];
      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.tagName).toBe('SPAN');
      expect(spec).toEqual([tx, 'hello']);
    });

    it('afterRender can modify element', () => {
      const plugin: TooeyPlugin = {
        name: 'test-modify-el',
        afterRender: (el: HTMLElement) => {
          el.setAttribute('data-custom', 'true');
        }
      };

      render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin] });

      const span = container.querySelector('span')!;
      expect(span.getAttribute('data-custom')).toBe('true');
    });
  });

  describe('state hooks', () => {
    it('calls onStateChange when state changes', () => {
      const onStateChange = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'test-state-change',
        onStateChange
      };

      const instance = render(container, {
        s: { count: 0 },
        r: [tx, { $: 'count' }]
      }, { plugins: [plugin] });

      expect(onStateChange).not.toHaveBeenCalled();

      instance.set('count', 5);
      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith('count', 0, 5);
    });

    it('does not call onStateChange when value is same', () => {
      const onStateChange = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'test-no-change',
        onStateChange
      };

      const instance = render(container, {
        s: { value: 'test' },
        r: [tx, { $: 'value' }]
      }, { plugins: [plugin] });

      instance.set('value', 'test'); // same value
      expect(onStateChange).not.toHaveBeenCalled();
    });

    it('tracks multiple state changes', () => {
      const changes: [string, unknown, unknown][] = [];
      const plugin: TooeyPlugin = {
        name: 'test-multi-change',
        onStateChange: (key, oldVal, newVal) => {
          changes.push([key, oldVal, newVal]);
        }
      };

      const instance = render(container, {
        s: { a: 1, b: 2 },
        r: [vs, [
          [tx, { $: 'a' }],
          [tx, { $: 'b' }]
        ]]
      }, { plugins: [plugin] });

      instance.set('a', 10);
      instance.set('b', 20);
      instance.set('a', 100);

      expect(changes).toEqual([
        ['a', 1, 10],
        ['b', 2, 20],
        ['a', 10, 100]
      ]);
    });
  });

  describe('extend', () => {
    it('adds custom method to instance', () => {
      const plugin: TooeyPlugin = {
        name: 'test-extend',
        extend: {
          greet() {
            return 'hello';
          }
        }
      };

      const instance = render(container, {
        r: [tx, 'test']
      }, { plugins: [plugin] }) as TooeyInstance & { greet: () => string };

      expect(typeof instance.greet).toBe('function');
      expect(instance.greet()).toBe('hello');
    });

    it('extend method can access instance via this', () => {
      const plugin: TooeyPlugin = {
        name: 'test-extend-this',
        extend: {
          getCount(this: TooeyInstance) {
            return this.get('count');
          },
          incrementCount(this: TooeyInstance) {
            const current = this.get('count') as number;
            this.set('count', current + 1);
          }
        }
      };

      const instance = render(container, {
        s: { count: 5 },
        r: [tx, { $: 'count' }]
      }, { plugins: [plugin] }) as TooeyInstance & {
        getCount: () => number;
        incrementCount: () => void;
      };

      expect(instance.getCount()).toBe(5);
      instance.incrementCount();
      expect(instance.getCount()).toBe(6);
      expect(container.textContent).toBe('6');
    });

    it('extend method can accept arguments', () => {
      const plugin: TooeyPlugin = {
        name: 'test-extend-args',
        extend: {
          add(this: TooeyInstance, amount: unknown) {
            const current = this.get('value') as number;
            this.set('value', current + (amount as number));
          }
        }
      };

      const instance = render(container, {
        s: { value: 10 },
        r: [tx, { $: 'value' }]
      }, { plugins: [plugin] }) as TooeyInstance & { add: (amount: number) => void };

      instance.add(5);
      expect(instance.get('value')).toBe(15);
    });
  });

  describe('multiple plugins', () => {
    it('calls all plugin hooks in order', () => {
      const calls: string[] = [];

      const plugin1: TooeyPlugin = {
        name: 'plugin1',
        onInit: () => calls.push('init1'),
        onDestroy: () => calls.push('destroy1')
      };

      const plugin2: TooeyPlugin = {
        name: 'plugin2',
        onInit: () => calls.push('init2'),
        onDestroy: () => calls.push('destroy2')
      };

      const instance = render(container, {
        r: [tx, 'hello']
      }, { plugins: [plugin1, plugin2] });

      expect(calls).toEqual(['init1', 'init2']);
      instance.destroy();
      expect(calls).toEqual(['init1', 'init2', 'destroy1', 'destroy2']);
    });

    it('chains beforeRender transformations', () => {
      const plugin1: TooeyPlugin = {
        name: 'plugin1',
        beforeRender: (spec: NodeSpec) => {
          if (Array.isArray(spec) && spec[0] === tx && spec[1] === 'step1') {
            return [tx, 'step2'];
          }
          return spec;
        }
      };

      const plugin2: TooeyPlugin = {
        name: 'plugin2',
        beforeRender: (spec: NodeSpec) => {
          if (Array.isArray(spec) && spec[0] === tx && spec[1] === 'step2') {
            return [tx, 'step3'];
          }
          return spec;
        }
      };

      render(container, {
        r: [tx, 'step1']
      }, { plugins: [plugin1, plugin2] });

      expect(container.textContent).toBe('step3');
    });

    it('all plugins receive state changes', () => {
      const changes1: string[] = [];
      const changes2: string[] = [];

      const plugin1: TooeyPlugin = {
        name: 'plugin1',
        onStateChange: (key) => changes1.push(key)
      };

      const plugin2: TooeyPlugin = {
        name: 'plugin2',
        onStateChange: (key) => changes2.push(key)
      };

      const instance = render(container, {
        s: { x: 0 },
        r: [tx, { $: 'x' }]
      }, { plugins: [plugin1, plugin2] });

      instance.set('x', 1);

      expect(changes1).toEqual(['x']);
      expect(changes2).toEqual(['x']);
    });

    it('merges extend methods from multiple plugins', () => {
      const plugin1: TooeyPlugin = {
        name: 'plugin1',
        extend: {
          foo() { return 'foo'; }
        }
      };

      const plugin2: TooeyPlugin = {
        name: 'plugin2',
        extend: {
          bar() { return 'bar'; }
        }
      };

      const instance = render(container, {
        r: [tx, 'test']
      }, { plugins: [plugin1, plugin2] }) as TooeyInstance & {
        foo: () => string;
        bar: () => string;
      };

      expect(instance.foo()).toBe('foo');
      expect(instance.bar()).toBe('bar');
    });
  });

  describe('createTooey with plugins', () => {
    it('passes plugins through factory', () => {
      const onInit = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'factory-plugin',
        onInit
      };

      const tooey = createTooey({ plugins: [plugin] });
      const instance = tooey.render(container, { r: [tx, 'hello'] });

      expect(onInit).toHaveBeenCalledWith(instance);
    });

    it('combines theme and plugins in factory', () => {
      const onInit = vi.fn();
      const plugin: TooeyPlugin = {
        name: 'combo-plugin',
        onInit
      };

      const tooey = createTooey({
        theme: { colors: { primary: '#007bff' } },
        plugins: [plugin]
      });

      render(container, {
        r: [tx, 'hello', { fg: '$primary' }]
      }, { theme: tooey.theme, plugins: tooey.plugins });

      expect(onInit).toHaveBeenCalled();
      const span = container.querySelector('span')!;
      expect(span.style.color).toBe('rgb(0, 123, 255)');
    });
  });

  describe('real-world plugin examples', () => {
    it('logger plugin tracks state changes', () => {
      const logs: string[] = [];
      const loggerPlugin: TooeyPlugin = {
        name: 'logger',
        onStateChange: (key, oldVal, newVal) => {
          logs.push(`[${key}] ${oldVal} → ${newVal}`);
        }
      };

      const instance = render(container, {
        s: { count: 0 },
        r: [vs, [
          [tx, { $: 'count' }],
          [bt, '+', { c: ['count', '+'] }]
        ]]
      }, { plugins: [loggerPlugin] });

      instance.set('count', 1);
      instance.set('count', 2);

      expect(logs).toEqual([
        '[count] 0 → 1',
        '[count] 1 → 2'
      ]);
    });

    it('analytics plugin adds data attributes', () => {
      const analyticsPlugin: TooeyPlugin = {
        name: 'analytics',
        afterRender: (el, spec) => {
          if (Array.isArray(spec) && spec[0] === bt) {
            el.setAttribute('data-track', 'button-click');
          }
        }
      };

      render(container, {
        r: [vs, [
          [bt, 'click me'],
          [tx, 'text']
        ]]
      }, { plugins: [analyticsPlugin] });

      const button = container.querySelector('button')!;
      const span = container.querySelector('span')!;

      expect(button.getAttribute('data-track')).toBe('button-click');
      expect(span.getAttribute('data-track')).toBeNull();
    });

    it('counter plugin extends instance with increment/decrement', () => {
      const counterPlugin: TooeyPlugin = {
        name: 'counter',
        extend: {
          increment(this: TooeyInstance, key: unknown) {
            const current = this.get(key as string) as number;
            this.set(key as string, current + 1);
          },
          decrement(this: TooeyInstance, key: unknown) {
            const current = this.get(key as string) as number;
            this.set(key as string, current - 1);
          }
        }
      };

      const instance = render(container, {
        s: { count: 10 },
        r: [tx, { $: 'count' }]
      }, { plugins: [counterPlugin] }) as TooeyInstance & {
        increment: (key: string) => void;
        decrement: (key: string) => void;
      };

      expect(container.textContent).toBe('10');
      instance.increment('count');
      expect(container.textContent).toBe('11');
      instance.decrement('count');
      instance.decrement('count');
      expect(container.textContent).toBe('9');
    });
  });
});
