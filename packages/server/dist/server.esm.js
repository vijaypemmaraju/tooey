import{rts as W}from"@tooey/ui";function b(e){try{let t=C(e);return JSON.stringify(t)}catch{return console.warn("[tooey/server] failed to serialize state, using empty object"),"{}"}}function C(e){if(e==null)return e;if(e instanceof Date)return{__type:"Date",value:e.toISOString()};if(e instanceof Set)return{__type:"Set",value:Array.from(e).map(C)};if(e instanceof Map)return{__type:"Map",value:Array.from(e.entries()).map(([t,r])=>[t,C(r)])};if(e instanceof RegExp)return{__type:"RegExp",value:e.toString()};if(!(typeof e=="function"||typeof e=="symbol")){if(Array.isArray(e))return e.map(C);if(typeof e=="object"){let t={};for(let[r,n]of Object.entries(e)){let o=C(n);o!==void 0&&(t[r]=o)}return t}return e}}function L(){return`function __tooeyReviver(k,v){
  if(v&&v.__type==='Date')return new Date(v.value);
  if(v&&v.__type==='Set')return new Set(v.value);
  if(v&&v.__type==='Map')return new Map(v.value);
  if(v&&v.__type==='RegExp'){var m=v.value.match(/^\\/(.*)\\/(\\w*)$/);return m?new RegExp(m[1],m[2]):v;}
  return v;
}`}function A(e,t){if(e.length===0&&t==="{}")return"";let r=[];r.push(L()),r.push(`window.__TOOEY_STATE__=JSON.parse('${N(t)}',__tooeyReviver);`),r.push("window.__TOOEY_ISLANDS__=window.__TOOEY_ISLANDS__||{};");for(let n of e)if(n.config.strategy!=="none"){let o=JSON.stringify({id:n.config.id,strategy:n.config.strategy,media:n.config.media,rootMargin:n.config.rootMargin,clientPath:n.config.clientPath,props:n.props});r.push(`window.__TOOEY_ISLANDS__['${n.config.id}']=${o};`)}return r.push(ie()),r.push("__tooeyHydrate();"),r.join(`
`)}function ie(){return`
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
}`}function de(e){let{config:t}=e;if(t.strategy==="none")return"";let r=t.id;switch(t.strategy){case"load":return`<script>(function(){
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
  var m=window.matchMedia('${N(t.media||"")}');
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');};
  if(m.matches)fn();else m.addEventListener('change',function h(e){if(e.matches){m.removeEventListener('change',h);fn();}});
}
})();</script>`;default:return""}}function ce(e){return`<script type="module">
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
</script>`}function pe(e,t){return`<script type="module">
import{default as Component}from'${t}';
window.__tooeyLoadIsland=window.__tooeyLoadIsland||function(path,el,props){
  import(path).then(function(m){
    if(m.default&&window.tooey)window.tooey.render(el,m.default(props));
  });
};
window.__tooeyLoadIsland('${t}',document.querySelector('[data-tooey-island="${e}"]'),window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__['${e}']&&window.__TOOEY_ISLANDS__['${e}'].props);
</script>`}function N(e){return e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}import{rts as le}from"@tooey/ui";var ue=0;function R(e,t="load",r={}){return{config:{id:r.id||`island-${++ue}`,strategy:t,...r},spec:e,props:e.s}}function q(e,t){return R(e,"load",{id:t})}function j(e,t){return R(e,"idle",{id:t})}function D(e,t){return R(e,"visible",{id:t?.id,rootMargin:t?.rootMargin||"0px"})}function F(e,t,r){return R(e,"media",{id:r,media:t})}function U(e,t){return R(e,"none",{id:t})}function x(e,t){let{config:r,spec:n}=e,o=le(n,{theme:t});if(r.strategy==="none")return o;let i=[`data-tooey-island="${r.id}"`,`data-hydrate="${r.strategy}"`];return r.media&&i.push(`data-media="${k(r.media)}"`),r.rootMargin&&i.push(`data-root-margin="${k(r.rootMargin)}"`),r.clientPath&&i.push(`data-client-path="${k(r.clientPath)}"`),`<div ${i.join(" ")}>${o}</div>`}function fe(e,t){let r=new Map;for(let n of e)r.set(n.config.id,x(n,t));return r}function H(e){let t=[];function r(n){if(n){if(he(n)){t.push(ge(n));return}if(Array.isArray(n)){let[,o]=n;if(Array.isArray(o))for(let i of o)me(i)&&r(i)}if(z(n)){let o=n;r(o.t||o.then),r(o.e||o.else)}if(Y(n)){let o=n;r(o.a||o.as)}}}return r(e.r),t}function he(e){return typeof e=="object"&&e!==null&&"island"in e&&typeof e.island=="object"}function ge(e){let{island:t}=e;return R(t.spec,t.strategy||"load",{id:t.id,media:t.media,rootMargin:t.rootMargin,clientPath:t.clientPath})}function z(e){return typeof e=="object"&&e!==null&&("?"in e||"if"in e)}function Y(e){return typeof e=="object"&&e!==null&&("m"in e||"map"in e)}function me(e){return Array.isArray(e)||z(e)||Y(e)}function k(e){return e.replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ye(e){return`<!-- island:${e} -->`}function we(e){return["tx",`<!-- island:${e.config.id} -->`]}function y(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function $(e){return Object.entries(e).map(([t,r])=>`${t}="${y(r)}"`).join(" ")}function Se(e){let t=[];return e.charset&&t.push(`charset="${e.charset}"`),e.name&&t.push(`name="${y(e.name)}"`),e.property&&t.push(`property="${y(e.property)}"`),e.httpEquiv&&t.push(`http-equiv="${y(e.httpEquiv)}"`),e.content&&t.push(`content="${y(e.content)}"`),`<meta ${t.join(" ")}>`}function Re(e){let t=[`rel="${y(e.rel)}"`,`href="${y(e.href)}"`];return e.type&&t.push(`type="${y(e.type)}"`),e.as&&t.push(`as="${y(e.as)}"`),e.crossorigin&&t.push(`crossorigin="${y(e.crossorigin)}"`),`<link ${t.join(" ")}>`}function be(e){let t=[];e.src&&t.push(`src="${y(e.src)}"`),e.type?t.push(`type="${y(e.type)}"`):e.module&&t.push('type="module"'),e.defer&&t.push("defer"),e.async&&t.push("async");let r=t.length>0?" "+t.join(" "):"",n=e.content||"";return`<script${r}>${n}</script>`}function J(e){let t=[];return t.push('<meta charset="utf-8">'),t.push('<meta name="viewport" content="width=device-width, initial-scale=1">'),e.title&&t.push(`<title>${y(e.title)}</title>`),e.meta&&t.push(...e.meta.map(Se)),e.links&&t.push(...e.links.map(Re)),e.baseUrl&&t.push(`<base href="${y(e.baseUrl)}">`),e.styles&&e.styles.length>0&&t.push(`<style>${e.styles.join(`
`)}</style>`),e.head&&t.push(e.head),t.join(`
    `)}function T(e,t={}){let r=W(e,{theme:t.theme});if(t.partial)return r;let n=t.htmlAttrs?" "+$(t.htmlAttrs):' lang="en"',o=t.bodyAttrs?" "+$(t.bodyAttrs):"",i=J(t),a=t.scripts?t.scripts.map(be).join(`
    `):"";return`<!DOCTYPE html>
<html${n}>
  <head>
    ${i}
  </head>
  <body${o}>
    <div id="app" data-tooey-root="true">${r}</div>
    ${a}
  </body>
</html>`}function G(e,t={},r=[]){let n=r.length>0?r:H(e),o=W(e,{theme:t.theme});for(let p of n){let s=x(p,t.theme),l=`<!-- island:${p.config.id} -->`;o.includes(l)&&(o=o.replace(l,s))}let i=b(e.s||{}),a=n.length>0?A(n,i):"",c=[...t.scripts||[],...a?[{content:a}]:[]];return{html:T(e,{...t,scripts:c}),hydrationScript:a,serializedState:i}}function X(e,t={}){return T(e,{...t,partial:!0})}function xe(e,t={}){let r=T(e,t);return{body:r,headers:{"Content-Type":"text/html; charset=utf-8","Content-Length":String(Buffer.byteLength(r,"utf-8")),"Cache-Control":"no-cache"}}}function _(e={}){let t=e.htmlAttrs?" "+$(e.htmlAttrs):' lang="en"',r=e.bodyAttrs?" "+$(e.bodyAttrs):"",n=J(e);return{head:`<!DOCTYPE html>
<html${t}>
  <head>
    ${n}
  </head>
  <body${r}>
    <div id="app" data-tooey-root="true">`,bodyStart:"",bodyEnd:`</div>
  </body>
</html>`}}function Te(e){return`<script>window.__TOOEY_STATE__=${b(e)}</script>`}function Ae(e){let t=[];return e.description&&t.push({name:"description",content:e.description}),t.push({property:"og:title",content:e.title}),e.description&&t.push({property:"og:description",content:e.description}),e.image&&t.push({property:"og:image",content:e.image}),e.url&&t.push({property:"og:url",content:e.url}),t.push({property:"og:type",content:e.type||"website"}),e.siteName&&t.push({property:"og:site_name",content:e.siteName}),t.push({name:"twitter:card",content:e.twitterCard||"summary"}),t.push({name:"twitter:title",content:e.title}),e.description&&t.push({name:"twitter:description",content:e.description}),e.image&&t.push({name:"twitter:image",content:e.image}),e.twitterSite&&t.push({name:"twitter:site",content:e.twitterSite}),t}import{rts as V}from"@tooey/ui";var w=new TextEncoder;function B(e,t={}){let{theme:r,onChunk:n,flushInterval:o=0}=t;return new ReadableStream({async start(i){try{let a=_(t),c={type:"head",content:a.head};n?.(c),i.enqueue(w.encode(a.head)),o>0&&await I(o);let d=V(e,{theme:r});n?.({type:"body",content:d}),i.enqueue(w.encode(d)),o>0&&await I(o);let s={type:"end",content:a.bodyEnd};n?.(s),i.enqueue(w.encode(a.bodyEnd)),i.close()}catch(a){i.error(a)}}})}function _e(e,t,r={}){let{theme:n,onChunk:o,flushInterval:i=0}=r;return new ReadableStream({async start(a){try{let c=_(r),d={type:"head",content:c.head};o?.(d),a.enqueue(w.encode(c.head)),i>0&&await I(i);let s=V(e,{theme:n});for(let g of t){let m=`<!-- island:${g.config.id} -->`,S=`<div data-tooey-island="${g.config.id}" data-loading="true">loading...</div>`;s=s.replace(m,S)}o?.({type:"body",content:s}),a.enqueue(w.encode(s)),i>0&&await I(i);for(let g of t){let m=x(g,n),S=Z(g.config.id,m);o?.({type:"island",content:S}),a.enqueue(w.encode(S)),i>0&&await I(i)}let f=b(e.s||{}),h=A(t,f);if(h){let g={type:"script",content:`<script>${h}</script>`};o?.(g),a.enqueue(w.encode(`<script>${h}</script>`))}let u={type:"end",content:c.bodyEnd};o?.(u),a.enqueue(w.encode(c.bodyEnd)),a.close()}catch(c){a.error(c)}}})}function Ce(e){return new ReadableStream({async start(t){try{for await(let r of e)t.enqueue(w.encode(r));t.close()}catch(r){t.error(r)}}})}var E=class{constructor(t={}){this.options=t;this.controller=null;this.closed=!1;this.sentChunks=new Set;this.theme=t.theme}getStream(){return new ReadableStream({start:t=>{this.controller=t}})}sendShell(){if(this.closed||!this.controller)return;let t=_(this.options);this.write(t.head,"head")}sendContent(t,r){if(this.closed||!this.controller)return;let n=r||`content-${this.sentChunks.size}`;this.sentChunks.has(n)||(this.write(t,"body"),this.sentChunks.add(n))}sendIsland(t){if(this.closed||!this.controller)return;let r=x(t,this.theme),n=Z(t.config.id,r);this.write(n,"island")}sendHydrationScript(t,r){if(this.closed||!this.controller)return;let n=b(r),o=A(t,n);o&&this.write(`<script>${o}</script>`,"script")}close(){if(this.closed||!this.controller)return;let t=_(this.options);this.write(t.bodyEnd,"end"),this.controller.close(),this.closed=!0}abort(t){this.closed||!this.controller||(this.controller.error(t),this.closed=!0)}write(t,r){if(!this.controller)return;let n={type:r,content:t};this.options.onChunk?.(n),this.controller.enqueue(w.encode(t))}};function Z(e,t){let r=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$");return`<script>
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
</script>`}function I(e){return new Promise(t=>setTimeout(t,e))}async function Ie(e){let t=new TextDecoder,r=e.getReader(),n=[];for(;;){let{done:o,value:i}=await r.read();if(o)break;n.push(t.decode(i,{stream:!0}))}return n.push(t.decode()),n.join("")}async function ve(e,t){let r=e.getReader(),n=t.getWriter();try{for(;;){let{done:o,value:i}=await r.read();if(o)break;await n.write(i)}}finally{n.close()}}function M(e={}){let t=[],r=e.base||"";function n(s){let l=[],f=s.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g,(h,u)=>(l.push(u),"([^/]+)")).replace(/\*/g,"(.*)");return{regex:new RegExp(`^${f}$`),params:l}}function o(s,l){for(let f of t){if(f.methods&&!f.methods.includes(l))continue;let h=s.match(f.pattern);if(h){let u={};return f.paramNames.forEach((g,m)=>{try{u[g]=decodeURIComponent(h[m+1]||"")}catch{u[g]=h[m+1]||""}}),{route:f,params:u}}}return null}function i(s){let l={},f=s.indexOf("?");return f===-1||new URLSearchParams(s.slice(f+1)).forEach((u,g)=>{l[g]=u}),l}function a(s,l){return{req:s,prm:l,qry:i(s.url),body:s.body,loc:{},hdr:f=>s.headers[f.toLowerCase()],response:{headers:{}}}}async function c(s){let f=new URL(s.url,"http://localhost").pathname;r&&f.startsWith(r)&&(f=f.slice(r.length)||"/");let h=o(f,s.method),u=a(s,h?.params||{});try{let g=!1;if(e.mw&&e.mw.length>0){let S=0,O=async()=>{S<e.mw.length&&await e.mw[S++](u,O)};await O(),u.response.body!==void 0&&u.response.status&&(g=!0)}if(g)return{status:u.response.status,headers:u.response.headers||{},body:u.response.body};if(!h){if(e.notFound){let S=await e.notFound(u);return d(p(S),u.response.headers)}return d({status:404,headers:{},body:"not found"},u.response.headers)}let m=await h.route.handler(u);return d(p(m),u.response.headers)}catch(g){if(e.onError){let m=e.onError(g,u);return d(p(m),u.response.headers)}return d({status:500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:g.message})},u.response.headers)}}function d(s,l){return!l||Object.keys(l).length===0?s:{...s,headers:{...l,...s.headers}}}function p(s){if("pg"in s){let l=T(s.pg,s.opts);return{status:200,headers:{"Content-Type":"text/html; charset=utf-8"},body:l}}return"api"in s?{status:s.status||200,headers:{"Content-Type":"application/json"},body:JSON.stringify(s.api)}:"rd"in s?{status:s.status||302,headers:{Location:s.rd},body:""}:"html"in s?{status:s.status||200,headers:{"Content-Type":"text/html; charset=utf-8"},body:s.html}:"err"in s?{status:s.status||500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:s.err})}:{status:500,headers:{},body:"unknown response type"}}return{rt(s,l,f){let{regex:h,params:u}=n(r+s);return t.push({pattern:h,paramNames:u,handler:l,methods:f}),this},pg(s,l){return this.rt(s,async f=>{let h=await l(f);return"spec"in h?{pg:h.spec,opts:h.opts}:h},["GET"])},api(s,l){let f=Object.keys(l);return this.rt(s,async h=>{let u=h.req.method,g=l[u];if(!g)return{err:"method not allowed",status:405};let m=await g(h);return"data"in m?{api:m.data,status:m.status}:m},f)},handle:c,get routes(){return t.map(s=>({pattern:s.pattern.source,params:s.paramNames,methods:s.methods}))}}}function P(e){let t=e.replace(/\.(ts|js|tsx|jsx)$/,"").replace(/\/index$/,"").replace(/^index$/,"").replace(/\[\.\.\.([^\]]+)\]/g,"*").replace(/\[([^\]]+)\]/g,":$1");return t.startsWith("/")||(t="/"+t),t===""&&(t="/"),t}function $e(e,t="pages",r="api"){let n=[];for(let o of e){let i=o.startsWith(r+"/")||o.startsWith(r+"\\"),a=o.startsWith(t+"/")||o.startsWith(t+"\\");if(!i&&!a)continue;let c=i?o.slice(r.length+1):o.slice(t.length+1),d=i?"/api"+P(c):P(c);n.push({file:o,pattern:d,isApi:i})}return n.sort((o,i)=>{let a=Q(o.pattern);return Q(i.pattern)-a}),n}function Q(e){let t=0,r=e.split("/").filter(Boolean);for(let n of r)n.startsWith(":")?t-=1:n==="*"?t-=10:t+=10;return t}function K(e,t,r={}){let n=M(r);for(let o of e)o.isApi?n.rt(o.pattern,async i=>{let a=await t(o.file),c=i.req.method,d=a[c];if(!d)return{err:"method not allowed",status:405};let p=await d(i);return"data"in p?{api:p.data,status:p.status}:p}):n.pg(o.pattern,async i=>{let a=await t(o.file);return a.default?a.default(i):{err:"page handler not found",status:500}});return n}function Oe(e,t=200,r){return{data:e,status:t,headers:r}}function ee(e,t=302){return{rd:e,status:t}}function te(e,t=500){return{err:e,status:t}}function re(e,t){return{spec:e,opts:t}}function v(e){return e.req}function ne(...e){return async(t,r)=>{let n=-1;async function o(i){if(i<=n)throw new Error("next() called multiple times");n=i,i<e.length?await e[i](t,()=>o(i+1)):await r()}await o(0)}}function ke(e={}){let{origin:t="*",methods:r=["GET","POST","PUT","DELETE","PATCH","OPTIONS"],headers:n=["Content-Type","Authorization"],credentials:o=!1,maxAge:i=86400}=e;return async(a,c)=>{let d=v(a),p=d.headers.origin||"",s="*";if(typeof t=="string"?s=t:Array.isArray(t)?s=t.includes(p)?p:t[0]:typeof t=="function"&&(s=t(p)?p:""),a.response.headers=a.response.headers||{},a.response.headers["Access-Control-Allow-Origin"]=s,a.response.headers["Access-Control-Allow-Methods"]=r.join(", "),a.response.headers["Access-Control-Allow-Headers"]=n.join(", "),o&&(a.response.headers["Access-Control-Allow-Credentials"]="true"),d.method==="OPTIONS"){a.response.headers["Access-Control-Max-Age"]=String(i),a.response.status=204,a.response.body="";return}await c()}}function oe(e={}){let{format:t="short",skip:r}=e;return async(n,o)=>{if(r?.(n)){await o();return}let i=v(n),a=Date.now(),{method:c,url:d}=i;await o();let p=Date.now()-a,s=n.response.status||200;switch(t){case"tiny":console.log(`${c} ${d} ${s} ${p}ms`);break;case"short":console.log(`[${new Date().toISOString()}] ${c} ${d} ${s} ${p}ms`);break;case"full":console.log(`[${new Date().toISOString()}] ${c} ${d} ${s} ${p}ms`,`
  headers: ${JSON.stringify(i.headers)}`);break}}}function se(e={}){let{max:t=100,window:r=6e4,keyFn:n=a=>v(a).headers["x-forwarded-for"]||"unknown",message:o="too many requests"}=e,i=new Map;return setInterval(()=>{let a=Date.now();for(let[c,d]of i)d.reset<a&&i.delete(c)},r),async(a,c)=>{let d=n(a),p=Date.now(),s=i.get(d);if((!s||s.reset<p)&&(s={count:0,reset:p+r},i.set(d,s)),s.count++,a.response.headers=a.response.headers||{},a.response.headers["X-RateLimit-Limit"]=String(t),a.response.headers["X-RateLimit-Remaining"]=String(Math.max(0,t-s.count)),a.response.headers["X-RateLimit-Reset"]=String(Math.ceil(s.reset/1e3)),s.count>t){a.response.status=429,a.response.headers["Retry-After"]=String(Math.ceil((s.reset-p)/1e3)),a.response.body=JSON.stringify({error:o});return}await c()}}function He(e={}){let{threshold:t=1024,encodings:r=["gzip","deflate","br"]}=e;return async(n,o)=>{await o();let a=v(n).headers["accept-encoding"]||"",c=n.response.body;if(!(typeof c!="string"||c.length<t)){for(let d of r)if(a.includes(d)){n.response.headers=n.response.headers||{},n.response.headers["Content-Encoding"]=d,n.loc._compress=d;break}}}}function ae(e={}){let{hsts:t=!0,noSniff:r=!0,xssFilter:n=!0,frameOptions:o="DENY",csp:i=!1}=e;return async(a,c)=>{if(a.response.headers=a.response.headers||{},t){let d=typeof t=="object"?t:{},p=d.maxAge||31536e3,s=d.includeSubDomains!==!1;a.response.headers["Strict-Transport-Security"]=`max-age=${p}${s?"; includeSubDomains":""}`}r&&(a.response.headers["X-Content-Type-Options"]="nosniff"),n&&(a.response.headers["X-XSS-Protection"]="1; mode=block"),o&&(a.response.headers["X-Frame-Options"]=o),i&&(a.response.headers["Content-Security-Policy"]=i),await c()}}function Ee(e={}){let{maxSize:t=1024*1024,types:r=["application/json","application/x-www-form-urlencoded"]}=e;return async(n,o)=>{let i=v(n),a=i.headers["content-type"]||"";if(parseInt(i.headers["content-length"]||"0",10)>t){n.response.status=413,n.response.body=JSON.stringify({error:"payload too large"});return}if(!r.some(p=>a.includes(p))){await o();return}n.loc.body=n.body,await o()}}function Pe(e){let t=new URL(e.url,"http://localhost"),r={};return t.searchParams.forEach((n,o)=>{r[o]=n}),{req:e,prm:{},qry:r,body:void 0,loc:{},hdr:n=>e.headers[n.toLowerCase()],response:{status:200,headers:{}}}}function Me(e,t){return e.loc[t]}function Le(e,t,r){e.loc[t]=r}export{E as ProgressiveRenderer,Ee as bodyParser,H as collectIslands,ne as compose,He as compress,ke as cors,Pe as createContext,_ as createDocumentShell,K as createFileRouter,R as createIsland,M as createRouter,Ce as createStream,te as err,te as error,P as fileToPattern,ce as generateClientLoader,A as generateHydrationScript,de as generateInlineHydrationScript,pe as generateIslandLoader,L as generateReviverCode,Ae as generateSeoMeta,Te as generateStateScript,Me as getLocal,R as isl,j as islI,q as islL,F as islM,U as islS,D as islV,j as islandIdle,q as islandLoad,F as islandMedia,ye as islandPlaceholder,we as islandSlot,U as islandStatic,D as islandVisible,Oe as json,oe as log,oe as logger,ne as mw,re as page,re as pg,ve as pipeToWritable,se as rateLimit,ee as rd,ee as redirect,x as renderIsland,fe as renderIslands,G as renderPage,X as renderPartial,xe as renderToResponse,B as renderToStream,_e as renderToStreamWithIslands,T as renderToString,se as rl,M as rt,K as rtf,G as rtp,X as rtpr,T as rts,B as rtst,$e as scanRoutes,ae as sec,ae as securityHeaders,b as serializeState,Le as setLocal,Ie as streamToString};
//# sourceMappingURL=server.esm.js.map
