import{rts as J}from"@tooey/ui";function b(e){try{let t=C(e);return JSON.stringify(t)}catch{return console.warn("[tooey/server] failed to serialize state, using empty object"),"{}"}}function C(e){if(e==null)return e;if(e instanceof Date)return{__type:"Date",value:e.toISOString()};if(e instanceof Set)return{__type:"Set",value:Array.from(e).map(C)};if(e instanceof Map)return{__type:"Map",value:Array.from(e.entries()).map(([t,r])=>[t,C(r)])};if(e instanceof RegExp)return{__type:"RegExp",value:e.toString()};if(!(typeof e=="function"||typeof e=="symbol")){if(Array.isArray(e))return e.map(C);if(typeof e=="object"){let t={};for(let[r,n]of Object.entries(e)){let o=C(n);o!==void 0&&(t[r]=o)}return t}return e}}function L(){return`function __tooeyReviver(k,v){
  if(v&&v.__type==='Date')return new Date(v.value);
  if(v&&v.__type==='Set')return new Set(v.value);
  if(v&&v.__type==='Map')return new Map(v.value);
  if(v&&v.__type==='RegExp'){var m=v.value.match(/^\\/(.*)\\/(\\w*)$/);return m?new RegExp(m[1],m[2]):v;}
  return v;
}`}function T(e,t){if(e.length===0&&t==="{}")return"";let r=[];r.push(L()),r.push(`window.__TOOEY_STATE__=JSON.parse('${j(t)}',__tooeyReviver);`),r.push("window.__TOOEY_ISLANDS__=window.__TOOEY_ISLANDS__||{};");for(let n of e)if(n.config.strategy!=="none"){let o=JSON.stringify({id:n.config.id,strategy:n.config.strategy,media:n.config.media,rootMargin:n.config.rootMargin,clientPath:n.config.clientPath,props:n.props});r.push(`window.__TOOEY_ISLANDS__['${n.config.id}']=${o};`)}return r.push(pe()),r.push("__tooeyHydrate();"),r.join(`
`)}function pe(){return`
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
}`}function le(e){let{config:t}=e;if(t.strategy==="none")return"";let r=t.id;switch(t.strategy){case"load":return`<script>(function(){
var el=document.querySelector('[data-tooey-island="${r}"]');
if(el&&!el.dataset.hydrated){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');}
})();</script>`;case"idle":return`<script>(function(){
var el=document.querySelector('[data-tooey-island="${r}"]');
if(el&&!el.dataset.hydrated){
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');};
  'requestIdleCallback'in window?requestIdleCallback(fn,{timeout:2000}):setTimeout(fn,200);
}
})();</script>`;case"visible":return`<script>(function(){
var el=document.querySelector('[data-tooey-island="${r}"]');
if(el&&!el.dataset.hydrated&&'IntersectionObserver'in window){
  var o=new IntersectionObserver(function(e){e.forEach(function(x){
    if(x.isIntersecting){o.disconnect();el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');}
  });},{rootMargin:'${t.rootMargin||"0px"}'});o.observe(el);
}
})();</script>`;case"media":return`<script>(function(){
var el=document.querySelector('[data-tooey-island="${r}"]');
if(el&&!el.dataset.hydrated&&'matchMedia'in window){
  var m=window.matchMedia('${j(t.media||"")}');
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');};
  if(m.matches)fn();else m.addEventListener('change',function h(e){if(e.matches){m.removeEventListener('change',h);fn();}});
}
})();</script>`;default:return""}}function ue(e){return`<script type="module">
import{render,hy}from'${e}';
window.tooey={render,hy};
window.__tooeyHydrateIsland=function(id){
  var el=document.querySelector('[data-tooey-island="'+id+'"]');
  var config=window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__[id];
  if(!el||!config)return;
  var spec={s:config.props||{},r:JSON.parse(el.dataset.spec||'null')};
  if(spec.r)hy(el,spec);
};
if(window.__tooeyHydrate)window.__tooeyHydrate();
</script>`}function fe(e,t){return`<script type="module">
import{default as Component}from'${t}';
window.__tooeyLoadIsland=window.__tooeyLoadIsland||function(path,el,props){
  import(path).then(function(m){
    if(m.default&&window.tooey)window.tooey.render(el,m.default(props));
  });
};
window.__tooeyLoadIsland('${t}',document.querySelector('[data-tooey-island="${e}"]'),window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__['${e}']&&window.__TOOEY_ISLANDS__['${e}'].props);
</script>`}function j(e){return e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}import{rts as he}from"@tooey/ui";var me=0;function S(e,t="load",r={}){return{config:{id:r.id||`island-${++me}`,strategy:t,...r},spec:e,props:e.s}}function N(e,t){return S(e,"load",{id:t})}function D(e,t){return S(e,"idle",{id:t})}function F(e,t){return S(e,"visible",{id:t?.id,rootMargin:t?.rootMargin||"0px"})}function U(e,t,r){return S(e,"media",{id:r,media:t})}function z(e,t){return S(e,"none",{id:t})}function x(e,t){let{config:r,spec:n}=e,o=he(n,{theme:t});if(r.strategy==="none")return o;let a=[`data-tooey-island="${r.id}"`,`data-hydrate="${r.strategy}"`];return r.media&&a.push(`data-media="${O(r.media)}"`),r.rootMargin&&a.push(`data-root-margin="${O(r.rootMargin)}"`),r.clientPath&&a.push(`data-client-path="${O(r.clientPath)}"`),`<div ${a.join(" ")}>${o}</div>`}function ge(e,t){let r=new Map;for(let n of e)r.set(n.config.id,x(n,t));return r}function P(e){let t=[];function r(n){if(n){if(ye(n)){t.push(we(n));return}if(Array.isArray(n)){let[,o]=n;if(Array.isArray(o))for(let a of o)Re(a)&&r(a)}if(Y(n)){let o=n;r(o.t||o.then),r(o.e||o.else)}if(W(n)){let o=n;r(o.a||o.as)}}}return r(e.r),t}function ye(e){return typeof e=="object"&&e!==null&&"island"in e&&typeof e.island=="object"}function we(e){let{island:t}=e;return S(t.spec,t.strategy||"load",{id:t.id,media:t.media,rootMargin:t.rootMargin,clientPath:t.clientPath})}function Y(e){return typeof e=="object"&&e!==null&&("?"in e||"if"in e)}function W(e){return typeof e=="object"&&e!==null&&("m"in e||"map"in e)}function Re(e){return Array.isArray(e)||Y(e)||W(e)}function O(e){return e.replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Se(e){return`<!-- island:${e} -->`}function be(e){return["tx",`<!-- island:${e.config.id} -->`]}function y(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function k(e){return Object.entries(e).map(([t,r])=>`${t}="${y(r)}"`).join(" ")}function xe(e){let t=[];return e.charset&&t.push(`charset="${e.charset}"`),e.name&&t.push(`name="${y(e.name)}"`),e.property&&t.push(`property="${y(e.property)}"`),e.httpEquiv&&t.push(`http-equiv="${y(e.httpEquiv)}"`),e.content&&t.push(`content="${y(e.content)}"`),`<meta ${t.join(" ")}>`}function Ae(e){let t=[`rel="${y(e.rel)}"`,`href="${y(e.href)}"`];return e.type&&t.push(`type="${y(e.type)}"`),e.as&&t.push(`as="${y(e.as)}"`),e.crossorigin&&t.push(`crossorigin="${y(e.crossorigin)}"`),`<link ${t.join(" ")}>`}function Te(e){let t=[];e.src&&t.push(`src="${y(e.src)}"`),e.type?t.push(`type="${y(e.type)}"`):e.module&&t.push('type="module"'),e.defer&&t.push("defer"),e.async&&t.push("async");let r=t.length>0?" "+t.join(" "):"",n=e.content||"";return`<script${r}>${n}</script>`}function G(e){let t=[];return t.push('<meta charset="utf-8">'),t.push('<meta name="viewport" content="width=device-width, initial-scale=1">'),e.title&&t.push(`<title>${y(e.title)}</title>`),e.meta&&t.push(...e.meta.map(xe)),e.links&&t.push(...e.links.map(Ae)),e.baseUrl&&t.push(`<base href="${y(e.baseUrl)}">`),e.styles&&e.styles.length>0&&t.push(`<style>${e.styles.join(`
`)}</style>`),e.head&&t.push(e.head),t.join(`
    `)}function A(e,t={}){let r=J(e,{theme:t.theme});if(t.partial)return r;let n=t.htmlAttrs?" "+k(t.htmlAttrs):' lang="en"',o=t.bodyAttrs?" "+k(t.bodyAttrs):"",a=G(t),i=t.scripts?t.scripts.map(Te).join(`
    `):"";return`<!DOCTYPE html>
<html${n}>
  <head>
    ${a}
  </head>
  <body${o}>
    <div id="app" data-tooey-root="true">${r}</div>
    ${i}
  </body>
</html>`}function V(e,t={},r=[]){let n=r.length>0?r:P(e),o=J(e,{theme:t.theme});for(let p of n){let s=x(p,t.theme),l=`<!-- island:${p.config.id} -->`;o.includes(l)&&(o=o.replace(l,s))}let a=b(e.s||{}),i=n.length>0?T(n,a):"",d=[...t.scripts||[],...i?[{content:i}]:[]];return{html:A(e,{...t,scripts:d}),hydrationScript:i,serializedState:a}}function X(e,t={}){return A(e,{...t,partial:!0})}function _e(e,t={}){let r=A(e,t);return{body:r,headers:{"Content-Type":"text/html; charset=utf-8","Content-Length":String(Buffer.byteLength(r,"utf-8")),"Cache-Control":"no-cache"}}}function _(e={}){let t=e.htmlAttrs?" "+k(e.htmlAttrs):' lang="en"',r=e.bodyAttrs?" "+k(e.bodyAttrs):"",n=G(e);return{head:`<!DOCTYPE html>
<html${t}>
  <head>
    ${n}
  </head>
  <body${r}>
    <div id="app" data-tooey-root="true">`,bodyStart:"",bodyEnd:`</div>
  </body>
</html>`}}function Ce(e){return`<script>window.__TOOEY_STATE__=${b(e)}</script>`}function ve(e){let t=[];return e.description&&t.push({name:"description",content:e.description}),t.push({property:"og:title",content:e.title}),e.description&&t.push({property:"og:description",content:e.description}),e.image&&t.push({property:"og:image",content:e.image}),e.url&&t.push({property:"og:url",content:e.url}),t.push({property:"og:type",content:e.type||"website"}),e.siteName&&t.push({property:"og:site_name",content:e.siteName}),t.push({name:"twitter:card",content:e.twitterCard||"summary"}),t.push({name:"twitter:title",content:e.title}),e.description&&t.push({name:"twitter:description",content:e.description}),e.image&&t.push({name:"twitter:image",content:e.image}),e.twitterSite&&t.push({name:"twitter:site",content:e.twitterSite}),t}import{rts as B}from"@tooey/ui";var w=new TextEncoder;function Z(e,t={}){let{theme:r,onChunk:n,flushInterval:o=0}=t;return new ReadableStream({async start(a){try{let i=_(t),d={type:"head",content:i.head};n?.(d),a.enqueue(w.encode(i.head)),o>0&&await v(o);let c=B(e,{theme:r});n?.({type:"body",content:c}),a.enqueue(w.encode(c)),o>0&&await v(o);let s={type:"end",content:i.bodyEnd};n?.(s),a.enqueue(w.encode(i.bodyEnd)),a.close()}catch(i){a.error(i)}}})}function Ie(e,t,r={}){let{theme:n,onChunk:o,flushInterval:a=0}=r;return new ReadableStream({async start(i){try{let d=_(r),c={type:"head",content:d.head};o?.(c),i.enqueue(w.encode(d.head)),a>0&&await v(a);let s=B(e,{theme:n});for(let m of t){let g=`<!-- island:${m.config.id} -->`,R=`<div data-tooey-island="${m.config.id}" data-loading="true">loading...</div>`;s=s.replace(g,R)}o?.({type:"body",content:s}),i.enqueue(w.encode(s)),a>0&&await v(a);for(let m of t){let g=x(m,n),R=Q(m.config.id,g);o?.({type:"island",content:R}),i.enqueue(w.encode(R)),a>0&&await v(a)}let f=b(e.s||{}),h=T(t,f);if(h){let m={type:"script",content:`<script>${h}</script>`};o?.(m),i.enqueue(w.encode(`<script>${h}</script>`))}let u={type:"end",content:d.bodyEnd};o?.(u),i.enqueue(w.encode(d.bodyEnd)),i.close()}catch(d){i.error(d)}}})}function He(e){return new ReadableStream({async start(t){try{for await(let r of e)t.enqueue(w.encode(r));t.close()}catch(r){t.error(r)}}})}var E=class{constructor(t={}){this.options=t;this.controller=null;this.closed=!1;this.sentChunks=new Set;this.theme=t.theme}getStream(){return new ReadableStream({start:t=>{this.controller=t}})}sendShell(){if(this.closed||!this.controller)return;let t=_(this.options);this.write(t.head,"head")}sendContent(t,r){if(this.closed||!this.controller)return;let n=r||`content-${this.sentChunks.size}`;this.sentChunks.has(n)||(this.write(t,"body"),this.sentChunks.add(n))}sendIsland(t){if(this.closed||!this.controller)return;let r=x(t,this.theme),n=Q(t.config.id,r);this.write(n,"island")}sendHydrationScript(t,r){if(this.closed||!this.controller)return;let n=b(r),o=T(t,n);o&&this.write(`<script>${o}</script>`,"script")}close(){if(this.closed||!this.controller)return;let t=_(this.options);this.write(t.bodyEnd,"end"),this.controller.close(),this.closed=!0}abort(t){this.closed||!this.controller||(this.controller.error(t),this.closed=!0)}write(t,r){if(!this.controller)return;let n={type:r,content:t};this.options.onChunk?.(n),this.controller.enqueue(w.encode(t))}};function Q(e,t){let r=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$");return`<script>
(function(){
  var el = document.querySelector('[data-tooey-island="${e}"][data-loading]');
  if (el) {
    var temp = document.createElement('div');
    temp.innerHTML = \`${r}\`;
    var newEl = temp.firstElementChild;
    if (newEl) {
      el.parentNode.replaceChild(newEl, el);
    }
  }
})();
</script>`}function v(e){return new Promise(t=>setTimeout(t,e))}async function ke(e){let t=new TextDecoder,r=e.getReader(),n=[];for(;;){let{done:o,value:a}=await r.read();if(o)break;n.push(t.decode(a,{stream:!0}))}return n.push(t.decode()),n.join("")}async function $e(e,t){let r=e.getReader(),n=t.getWriter();try{for(;;){let{done:o,value:a}=await r.read();if(o)break;await n.write(a)}}finally{n.close()}}function M(e={}){let t=[],r=e.base||"";function n(s){let l=[],f=s.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g,(h,u)=>(l.push(u),"([^/]+)")).replace(/\*/g,"(.*)");return{regex:new RegExp(`^${f}$`),params:l}}function o(s,l){for(let f of t){if(f.methods&&!f.methods.includes(l))continue;let h=s.match(f.pattern);if(h){let u={};return f.paramNames.forEach((m,g)=>{try{u[m]=decodeURIComponent(h[g+1]||"")}catch{u[m]=h[g+1]||""}}),{route:f,params:u}}}return null}function a(s){let l={},f=s.indexOf("?");return f===-1||new URLSearchParams(s.slice(f+1)).forEach((u,m)=>{l[m]=u}),l}function i(s,l){return{req:s,prm:l,qry:a(s.url),body:s.body,loc:{},hdr:f=>s.headers[f.toLowerCase()],response:{headers:{}}}}async function d(s){let f=new URL(s.url,"http://localhost").pathname;r&&f.startsWith(r)&&(f=f.slice(r.length)||"/");let h=o(f,s.method),u=i(s,h?.params||{});try{let m=!1;if(e.mw&&e.mw.length>0){let R=0,$=async()=>{R<e.mw.length&&await e.mw[R++](u,$)};await $(),u.response.body!==void 0&&u.response.status&&(m=!0)}if(m)return{status:u.response.status,headers:u.response.headers||{},body:u.response.body};if(!h){if(e.notFound){let R=await e.notFound(u);return c(p(R),u.response.headers)}return c({status:404,headers:{},body:"not found"},u.response.headers)}let g=await h.route.handler(u);return c(p(g),u.response.headers)}catch(m){if(e.onError){let g=e.onError(m,u);return c(p(g),u.response.headers)}return c({status:500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:m.message})},u.response.headers)}}function c(s,l){return!l||Object.keys(l).length===0?s:{...s,headers:{...l,...s.headers}}}function p(s){if("pg"in s){let l=A(s.pg,s.opts);return{status:200,headers:{"Content-Type":"text/html; charset=utf-8"},body:l}}return"api"in s?{status:s.status||200,headers:{"Content-Type":"application/json"},body:JSON.stringify(s.api)}:"rd"in s?{status:s.status||302,headers:{Location:s.rd},body:""}:"html"in s?{status:s.status||200,headers:{"Content-Type":"text/html; charset=utf-8"},body:s.html}:"err"in s?{status:s.status||500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:s.err})}:{status:500,headers:{},body:"unknown response type"}}return{rt(s,l,f){let{regex:h,params:u}=n(r+s);return t.push({pattern:h,paramNames:u,handler:l,methods:f}),this},pg(s,l){return this.rt(s,async f=>{let h=await l(f);return"spec"in h?{pg:h.spec,opts:h.opts}:h},["GET"])},api(s,l){let f=Object.keys(l);return this.rt(s,async h=>{let u=h.req.method,m=l[u];if(!m)return{err:"method not allowed",status:405};let g=await m(h);return"data"in g?{api:g.data,status:g.status}:g},f)},handle:d,get routes(){return t.map(s=>({pattern:s.pattern.source,params:s.paramNames,methods:s.methods}))}}}function q(e){let t=e.replace(/\.(ts|js|tsx|jsx)$/,"").replace(/\/index$/,"").replace(/^index$/,"").replace(/\[\.\.\.([^\]]+)\]/g,"*").replace(/\[([^\]]+)\]/g,":$1");return t.startsWith("/")||(t="/"+t),t===""&&(t="/"),t}function Oe(e,t="pages",r="api"){let n=[];for(let o of e){let a=o.startsWith(r+"/")||o.startsWith(r+"\\"),i=o.startsWith(t+"/")||o.startsWith(t+"\\");if(!a&&!i)continue;let d=a?o.slice(r.length+1):o.slice(t.length+1),c=a?"/api"+q(d):q(d);n.push({file:o,pattern:c,isApi:a})}return n.sort((o,a)=>{let i=K(o.pattern);return K(a.pattern)-i}),n}function K(e){let t=0,r=e.split("/").filter(Boolean);for(let n of r)n.startsWith(":")?t-=1:n==="*"?t-=10:t+=10;return t}function ee(e,t,r={}){let n=M(r);for(let o of e)o.isApi?n.rt(o.pattern,async a=>{let i=await t(o.file),d=a.req.method,c=i[d];if(!c)return{err:"method not allowed",status:405};let p=await c(a);return"data"in p?{api:p.data,status:p.status}:p}):n.pg(o.pattern,async a=>{let i=await t(o.file);return i.default?i.default(a):{err:"page handler not found",status:500}});return n}function Pe(e,t=200,r){return{data:e,status:t,headers:r}}function te(e,t=302){return{rd:e,status:t}}function re(e,t=500){return{err:e,status:t}}function ne(e,t){return{spec:e,opts:t}}function I(e){return e.req}function oe(...e){return async(t,r)=>{let n=-1;async function o(a){if(a<=n)throw new Error("next() called multiple times");n=a,a<e.length?await e[a](t,()=>o(a+1)):await r()}await o(0)}}function Ee(e={}){let{origin:t="*",methods:r=["GET","POST","PUT","DELETE","PATCH","OPTIONS"],headers:n=["Content-Type","Authorization"],credentials:o=!1,maxAge:a=86400}=e;return async(i,d)=>{let c=I(i),p=c.headers.origin||"",s="*";if(typeof t=="string"?s=t:Array.isArray(t)?s=t.includes(p)?p:t[0]:typeof t=="function"&&(s=t(p)?p:""),i.response.headers=i.response.headers||{},i.response.headers["Access-Control-Allow-Origin"]=s,i.response.headers["Access-Control-Allow-Methods"]=r.join(", "),i.response.headers["Access-Control-Allow-Headers"]=n.join(", "),o&&(i.response.headers["Access-Control-Allow-Credentials"]="true"),c.method==="OPTIONS"){i.response.headers["Access-Control-Max-Age"]=String(a),i.response.status=204,i.response.body="";return}await d()}}function se(e={}){let{format:t="short",skip:r}=e;return async(n,o)=>{if(r?.(n)){await o();return}let a=I(n),i=Date.now(),{method:d,url:c}=a;await o();let p=Date.now()-i,s=n.response.status||200;switch(t){case"tiny":console.log(`${d} ${c} ${s} ${p}ms`);break;case"short":console.log(`[${new Date().toISOString()}] ${d} ${c} ${s} ${p}ms`);break;case"full":console.log(`[${new Date().toISOString()}] ${d} ${c} ${s} ${p}ms`,`
  headers: ${JSON.stringify(a.headers)}`);break}}}function ae(e={}){let{max:t=100,window:r=6e4,keyFn:n=i=>I(i).headers["x-forwarded-for"]||"unknown",message:o="too many requests"}=e,a=new Map;return setInterval(()=>{let i=Date.now();for(let[d,c]of a)c.reset<i&&a.delete(d)},r),async(i,d)=>{let c=n(i),p=Date.now(),s=a.get(c);if((!s||s.reset<p)&&(s={count:0,reset:p+r},a.set(c,s)),s.count++,i.response.headers=i.response.headers||{},i.response.headers["X-RateLimit-Limit"]=String(t),i.response.headers["X-RateLimit-Remaining"]=String(Math.max(0,t-s.count)),i.response.headers["X-RateLimit-Reset"]=String(Math.ceil(s.reset/1e3)),s.count>t){i.response.status=429,i.response.headers["Retry-After"]=String(Math.ceil((s.reset-p)/1e3)),i.response.body=JSON.stringify({error:o});return}await d()}}function qe(e={}){let{threshold:t=1024,encodings:r=["gzip","deflate","br"]}=e;return async(n,o)=>{await o();let i=I(n).headers["accept-encoding"]||"",d=n.response.body;if(!(typeof d!="string"||d.length<t)){for(let c of r)if(i.includes(c)){n.response.headers=n.response.headers||{},n.response.headers["Content-Encoding"]=c,n.loc._compress=c;break}}}}function ie(e={}){let{hsts:t=!0,noSniff:r=!0,xssFilter:n=!0,frameOptions:o="DENY",csp:a=!1}=e;return async(i,d)=>{if(i.response.headers=i.response.headers||{},t){let c=typeof t=="object"?t:{},p=c.maxAge||31536e3,s=c.includeSubDomains!==!1;i.response.headers["Strict-Transport-Security"]=`max-age=${p}${s?"; includeSubDomains":""}`}r&&(i.response.headers["X-Content-Type-Options"]="nosniff"),n&&(i.response.headers["X-XSS-Protection"]="1; mode=block"),o&&(i.response.headers["X-Frame-Options"]=o),a&&(i.response.headers["Content-Security-Policy"]=a),await d()}}function Me(e={}){let{maxSize:t=1024*1024,types:r=["application/json","application/x-www-form-urlencoded"]}=e;return async(n,o)=>{let a=I(n),i=a.headers["content-type"]||"";if(parseInt(a.headers["content-length"]||"0",10)>t){n.response.status=413,n.response.body=JSON.stringify({error:"payload too large"});return}if(!r.some(p=>i.includes(p))){await o();return}n.loc.body=n.body,await o()}}function Le(e){let t=new URL(e.url,"http://localhost"),r={};return t.searchParams.forEach((n,o)=>{r[o]=n}),{req:e,prm:{},qry:r,body:void 0,loc:{},hdr:n=>e.headers[n.toLowerCase()],response:{status:200,headers:{}}}}function je(e,t){return e.loc[t]}function Ne(e,t,r){e.loc[t]=r}function de(e,t){return async(r,n)=>{let o=await e.toRequest(r),a=await t(o);return e.toResponse(a,n)}}var ce={name:"edge",async toRequest(e){let t=e,r=t.url,n=t.method,o={};t.headers.forEach((i,d)=>{o[d.toLowerCase()]=i});let a;return["POST","PUT","PATCH"].includes(n)&&(a=await De(t)),{url:r,method:n,headers:o,body:a}},toResponse(e){let t={status:e.status,headers:e.headers};return typeof e.body=="string"?new Response(e.body,t):e.body instanceof ReadableStream?new Response(e.body,t):new Response(null,t)}};async function De(e){let t=e.headers.get("content-type")||"";try{if(t.includes("application/json"))return await e.json();if(t.includes("application/x-www-form-urlencoded")){let r=await e.text();return Object.fromEntries(new URLSearchParams(r))}if(t.includes("multipart/form-data")){let r=await e.formData(),n={};return r.forEach((o,a)=>{n[a]=o}),n}return await e.text()}catch{return}}function H(e){let t=de(ce,e);return async r=>{try{return await t(r)}catch(n){return console.error("[tooey/server] request error:",n),new Response(JSON.stringify({error:"internal server error"}),{status:500,headers:{"Content-Type":"application/json"}})}}}function Fe(e){let t=H(e);return async(r,n,o)=>t(r)}function Ue(e){return H(e)}function ze(e){return H(e)}function Ye(e){return H(e)}export{E as ProgressiveRenderer,Me as bodyParser,P as collectIslands,oe as compose,qe as compress,Ee as cors,Ye as createBunHandler,Fe as createCfHandler,Le as createContext,Ue as createDenoHandler,_ as createDocumentShell,H as createFetchHandler,ee as createFileRouter,S as createIsland,M as createRouter,He as createStream,ze as createVercelHandler,ce as edgeAdapter,re as err,re as error,q as fileToPattern,ue as generateClientLoader,T as generateHydrationScript,le as generateInlineHydrationScript,fe as generateIslandLoader,L as generateReviverCode,ve as generateSeoMeta,Ce as generateStateScript,je as getLocal,S as isl,D as islI,N as islL,U as islM,z as islS,F as islV,D as islandIdle,N as islandLoad,U as islandMedia,Se as islandPlaceholder,be as islandSlot,z as islandStatic,F as islandVisible,Pe as json,se as log,se as logger,oe as mw,ne as page,ne as pg,$e as pipeToWritable,ae as rateLimit,te as rd,te as redirect,x as renderIsland,ge as renderIslands,V as renderPage,X as renderPartial,_e as renderToResponse,Z as renderToStream,Ie as renderToStreamWithIslands,A as renderToString,ae as rl,M as rt,ee as rtf,V as rtp,X as rtpr,A as rts,Z as rtst,Oe as scanRoutes,ie as sec,ie as securityHeaders,b as serializeState,Ne as setLocal,ke as streamToString};
//# sourceMappingURL=server.esm.js.map
