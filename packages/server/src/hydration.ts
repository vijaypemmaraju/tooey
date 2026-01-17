/**
 * @tooey/server hydration
 *
 * client-side hydration script generation
 */

import type { Island } from './types.js';

// ============ state serialization ============

/**
 * serialize state for transport to client
 * handles common types and circular references
 */
export function serializeState(state: Record<string, unknown>): string {
  try {
    // preprocess to wrap special types before JSON.stringify
    const processed = preprocessValue(state);
    return JSON.stringify(processed);
  } catch {
    console.warn('[tooey/server] failed to serialize state, using empty object');
    return '{}';
  }
}

/**
 * preprocess value to wrap special types
 * json.stringify calls toJSON on Date (loses type info) and
 * converts Set/Map to {} (loses data), so we must preprocess
 */
function preprocessValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() };
  }

  if (value instanceof Set) {
    return { __type: 'Set', value: Array.from(value).map(preprocessValue) };
  }

  if (value instanceof Map) {
    return {
      __type: 'Map',
      value: Array.from(value.entries()).map(([k, v]) => [k, preprocessValue(v)]),
    };
  }

  if (value instanceof RegExp) {
    return { __type: 'RegExp', value: value.toString() };
  }

  if (typeof value === 'function' || typeof value === 'symbol') {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(preprocessValue);
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const processed = preprocessValue(v);
      if (processed !== undefined) {
        result[k] = processed;
      }
    }
    return result;
  }

  return value;
}

/**
 * generate the reviver code for client-side deserialization
 */
export function generateReviverCode(): string {
  return `function __tooeyReviver(k,v){
  if(v&&v.__type==='Date')return new Date(v.value);
  if(v&&v.__type==='Set')return new Set(v.value);
  if(v&&v.__type==='Map')return new Map(v.value);
  if(v&&v.__type==='RegExp'){var m=v.value.match(/^\\/(.*)\\/(\\w*)$/);return m?new RegExp(m[1],m[2]):v;}
  return v;
}`;
}

// ============ hydration script generation ============

/**
 * generate the hydration script for all islands
 */
export function generateHydrationScript(
  islands: Island[],
  serializedState: string
): string {
  if (islands.length === 0 && serializedState === '{}') {
    return '';
  }

  const parts: string[] = [];

  // add reviver function
  parts.push(generateReviverCode());

  // add state
  parts.push(`window.__TOOEY_STATE__=JSON.parse('${escapeJs(serializedState)}',__tooeyReviver);`);

  // add island registry
  parts.push('window.__TOOEY_ISLANDS__=window.__TOOEY_ISLANDS__||{};');

  // add island specs
  for (const island of islands) {
    if (island.config.strategy !== 'none') {
      const islandSpec = JSON.stringify({
        id: island.config.id,
        strategy: island.config.strategy,
        media: island.config.media,
        rootMargin: island.config.rootMargin,
        clientPath: island.config.clientPath,
        props: island.props,
      });
      parts.push(`window.__TOOEY_ISLANDS__['${island.config.id}']=${islandSpec};`);
    }
  }

  // add hydration runtime
  parts.push(generateHydrationRuntime());

  // add initialization call
  parts.push('__tooeyHydrate();');

  return parts.join('\n');
}

/**
 * generate the hydration runtime code
 */
function generateHydrationRuntime(): string {
  return `
function __tooeyHydrate(){
  var islands=window.__TOOEY_ISLANDS__;
  var state=window.__TOOEY_STATE__;

  Object.keys(islands).forEach(function(id){
    var config=islands[id];
    var el=document.querySelector('[data-tooey-island="'+id+'"]');
    if(!el)return;

    var hydrate=function(){
      if(el.dataset.hydrated)return;
      el.dataset.hydrated='true';

      // load and hydrate the island
      if(config.clientPath&&window.__tooeyLoadIsland){
        window.__tooeyLoadIsland(config.clientPath,el,config.props);
      }else if(window.tooey&&window.tooey.hy){
        // use global tooey instance if available
        var spec={s:config.props||{},r:JSON.parse(el.dataset.spec||'null')};
        if(spec.r)window.tooey.hy(el,spec);
      }
    };

    switch(config.strategy){
      case 'load':
        hydrate();
        break;

      case 'idle':
        if('requestIdleCallback'in window){
          requestIdleCallback(hydrate,{timeout:2000});
        }else{
          setTimeout(hydrate,200);
        }
        break;

      case 'visible':
        if('IntersectionObserver'in window){
          var observer=new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
              if(entry.isIntersecting){
                observer.disconnect();
                hydrate();
              }
            });
          },{rootMargin:config.rootMargin||'0px'});
          observer.observe(el);
        }else{
          hydrate();
        }
        break;

      case 'media':
        if(config.media&&'matchMedia'in window){
          var mq=window.matchMedia(config.media);
          if(mq.matches){
            hydrate();
          }else{
            mq.addEventListener('change',function handler(e){
              if(e.matches){
                mq.removeEventListener('change',handler);
                hydrate();
              }
            });
          }
        }else{
          hydrate();
        }
        break;
    }
  });
}`;
}

// ============ inline hydration ============

/**
 * generate inline hydration script for a single island
 * useful for streaming scenarios
 */
export function generateInlineHydrationScript(island: Island): string {
  const { config } = island;

  if (config.strategy === 'none') {
    return '';
  }

  const id = config.id;
  const strategy = config.strategy;

  switch (strategy) {
    case 'load':
      return `<script>(function(){
var el=document.querySelector('[data-tooey-island="${id}"]');
if(el&&!el.dataset.hydrated){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${id}');}
})();</script>`;

    case 'idle':
      return `<script>(function(){
var el=document.querySelector('[data-tooey-island="${id}"]');
if(el&&!el.dataset.hydrated){
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${id}');};
  'requestIdleCallback'in window?requestIdleCallback(fn,{timeout:2000}):setTimeout(fn,200);
}
})();</script>`;

    case 'visible':
      return `<script>(function(){
var el=document.querySelector('[data-tooey-island="${id}"]');
if(el&&!el.dataset.hydrated&&'IntersectionObserver'in window){
  var o=new IntersectionObserver(function(e){e.forEach(function(x){
    if(x.isIntersecting){o.disconnect();el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${id}');}
  });},{rootMargin:'${config.rootMargin || '0px'}'});o.observe(el);
}
})();</script>`;

    case 'media':
      return `<script>(function(){
var el=document.querySelector('[data-tooey-island="${id}"]');
if(el&&!el.dataset.hydrated&&'matchMedia'in window){
  var m=window.matchMedia('${escapeJs(config.media || '')}');
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${id}');};
  if(m.matches)fn();else m.addEventListener('change',function h(e){if(e.matches){m.removeEventListener('change',h);fn();}});
}
})();</script>`;

    default:
      return '';
  }
}

// ============ partial hydration markers ============

/**
 * generate the tooey client loader script
 * this script loads the tooey library and provides hydration helpers
 */
export function generateClientLoader(tooeyUrl: string): string {
  return `<script type="module">
import{render,hy}from'${tooeyUrl}';
window.tooey={render,hy};
window.__tooeyHydrateIsland=function(id){
  var el=document.querySelector('[data-tooey-island="'+id+'"]');
  var config=window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__[id];
  if(!el||!config)return;
  var spec={s:config.props||{},r:JSON.parse(el.dataset.spec||'null')};
  if(spec.r)hy(el,spec);
};
if(window.__tooeyHydrate)window.__tooeyHydrate();
</script>`;
}

/**
 * generate script tag to load a specific island component
 */
export function generateIslandLoader(
  islandId: string,
  modulePath: string
): string {
  return `<script type="module">
import{default as Component}from'${modulePath}';
window.__tooeyLoadIsland=window.__tooeyLoadIsland||function(path,el,props){
  import(path).then(function(m){
    if(m.default&&window.tooey)window.tooey.render(el,m.default(props));
  });
};
window.__tooeyLoadIsland('${modulePath}',document.querySelector('[data-tooey-island="${islandId}"]'),window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__['${islandId}']&&window.__TOOEY_ISLANDS__['${islandId}'].props);
</script>`;
}

// ============ utilities ============

function escapeJs(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}
