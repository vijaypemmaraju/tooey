"use strict";var E=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var $e=Object.getOwnPropertyNames;var Oe=Object.prototype.hasOwnProperty;var ke=(e,t)=>{for(var r in t)E(e,r,{get:t[r],enumerable:!0})},He=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of $e(t))!Oe.call(e,o)&&o!==r&&E(e,o,{get:()=>t[o],enumerable:!(n=Ce(t,o))||n.enumerable});return e};var Ee=e=>He(E({},"__esModule",{value:!0}),e);var ze={};ke(ze,{ProgressiveRenderer:()=>O,bodyParser:()=>_e,collectIslands:()=>C,compose:()=>B,compress:()=>xe,cors:()=>Te,createContext:()=>Ae,createDocumentShell:()=>x,createFileRouter:()=>J,createIsland:()=>w,createRouter:()=>H,createStream:()=>ge,err:()=>X,error:()=>X,fileToPattern:()=>k,generateClientLoader:()=>te,generateHydrationScript:()=>T,generateInlineHydrationScript:()=>ee,generateIslandLoader:()=>re,generateReviverCode:()=>M,generateSeoMeta:()=>fe,generateStateScript:()=>ue,getLocal:()=>Ie,isl:()=>w,islI:()=>q,islL:()=>L,islM:()=>j,islS:()=>D,islV:()=>N,islandIdle:()=>q,islandLoad:()=>L,islandMedia:()=>j,islandPlaceholder:()=>de,islandSlot:()=>ce,islandStatic:()=>D,islandVisible:()=>N,json:()=>be,log:()=>Z,logger:()=>Z,mw:()=>B,page:()=>V,pg:()=>V,pipeToWritable:()=>we,rateLimit:()=>Q,rd:()=>G,redirect:()=>G,renderIsland:()=>R,renderIslands:()=>se,renderPage:()=>z,renderPartial:()=>U,renderToResponse:()=>pe,renderToStream:()=>W,renderToStreamWithIslands:()=>he,renderToString:()=>b,rl:()=>Q,rt:()=>H,rtf:()=>J,rtp:()=>z,rtpr:()=>U,rts:()=>b,rtst:()=>W,scanRoutes:()=>Re,sec:()=>K,securityHeaders:()=>K,serializeState:()=>S,setLocal:()=>ve,streamToString:()=>ye});module.exports=Ee(ze);var F=require("@tooey/ui");function S(e){try{let t=A(e);return JSON.stringify(t)}catch{return console.warn("[tooey/server] failed to serialize state, using empty object"),"{}"}}function A(e){if(e==null)return e;if(e instanceof Date)return{__type:"Date",value:e.toISOString()};if(e instanceof Set)return{__type:"Set",value:Array.from(e).map(A)};if(e instanceof Map)return{__type:"Map",value:Array.from(e.entries()).map(([t,r])=>[t,A(r)])};if(e instanceof RegExp)return{__type:"RegExp",value:e.toString()};if(!(typeof e=="function"||typeof e=="symbol")){if(Array.isArray(e))return e.map(A);if(typeof e=="object"){let t={};for(let[r,n]of Object.entries(e)){let o=A(n);o!==void 0&&(t[r]=o)}return t}return e}}function M(){return`function __tooeyReviver(k,v){
  if(v&&v.__type==='Date')return new Date(v.value);
  if(v&&v.__type==='Set')return new Set(v.value);
  if(v&&v.__type==='Map')return new Map(v.value);
  if(v&&v.__type==='RegExp'){var m=v.value.match(/^\\/(.*)\\/(\\w*)$/);return m?new RegExp(m[1],m[2]):v;}
  return v;
}`}function T(e,t){if(e.length===0&&t==="{}")return"";let r=[];r.push(M()),r.push(`window.__TOOEY_STATE__=JSON.parse('${ne(t)}',__tooeyReviver);`),r.push("window.__TOOEY_ISLANDS__=window.__TOOEY_ISLANDS__||{};");for(let n of e)if(n.config.strategy!=="none"){let o=JSON.stringify({id:n.config.id,strategy:n.config.strategy,media:n.config.media,rootMargin:n.config.rootMargin,clientPath:n.config.clientPath,props:n.props});r.push(`window.__TOOEY_ISLANDS__['${n.config.id}']=${o};`)}return r.push(Me()),r.push("__tooeyHydrate();"),r.join(`
`)}function Me(){return`
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
}`}function ee(e){let{config:t}=e;if(t.strategy==="none")return"";let r=t.id;switch(t.strategy){case"load":return`<script>(function(){
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
  var m=window.matchMedia('${ne(t.media||"")}');
  var fn=function(){el.dataset.hydrated='true';window.__tooeyHydrateIsland&&window.__tooeyHydrateIsland('${r}');};
  if(m.matches)fn();else m.addEventListener('change',function h(e){if(e.matches){m.removeEventListener('change',h);fn();}});
}
})();</script>`;default:return""}}function te(e){return`<script type="module">
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
</script>`}function re(e,t){return`<script type="module">
import{default as Component}from'${t}';
window.__tooeyLoadIsland=window.__tooeyLoadIsland||function(path,el,props){
  import(path).then(function(m){
    if(m.default&&window.tooey)window.tooey.render(el,m.default(props));
  });
};
window.__tooeyLoadIsland('${t}',document.querySelector('[data-tooey-island="${e}"]'),window.__TOOEY_ISLANDS__&&window.__TOOEY_ISLANDS__['${e}']&&window.__TOOEY_ISLANDS__['${e}'].props);
</script>`}function ne(e){return e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}var oe=require("@tooey/ui"),Pe=0;function w(e,t="load",r={}){return{config:{id:r.id||`island-${++Pe}`,strategy:t,...r},spec:e,props:e.s}}function L(e,t){return w(e,"load",{id:t})}function q(e,t){return w(e,"idle",{id:t})}function N(e,t){return w(e,"visible",{id:t?.id,rootMargin:t?.rootMargin||"0px"})}function j(e,t,r){return w(e,"media",{id:r,media:t})}function D(e,t){return w(e,"none",{id:t})}function R(e,t){let{config:r,spec:n}=e,o=(0,oe.rts)(n,{theme:t});if(r.strategy==="none")return o;let i=[`data-tooey-island="${r.id}"`,`data-hydrate="${r.strategy}"`];return r.media&&i.push(`data-media="${P(r.media)}"`),r.rootMargin&&i.push(`data-root-margin="${P(r.rootMargin)}"`),r.clientPath&&i.push(`data-client-path="${P(r.clientPath)}"`),`<div ${i.join(" ")}>${o}</div>`}function se(e,t){let r=new Map;for(let n of e)r.set(n.config.id,R(n,t));return r}function C(e){let t=[];function r(n){if(n){if(Le(n)){t.push(qe(n));return}if(Array.isArray(n)){let[,o]=n;if(Array.isArray(o))for(let i of o)Ne(i)&&r(i)}if(ae(n)){let o=n;r(o.t||o.then),r(o.e||o.else)}if(ie(n)){let o=n;r(o.a||o.as)}}}return r(e.r),t}function Le(e){return typeof e=="object"&&e!==null&&"island"in e&&typeof e.island=="object"}function qe(e){let{island:t}=e;return w(t.spec,t.strategy||"load",{id:t.id,media:t.media,rootMargin:t.rootMargin,clientPath:t.clientPath})}function ae(e){return typeof e=="object"&&e!==null&&("?"in e||"if"in e)}function ie(e){return typeof e=="object"&&e!==null&&("m"in e||"map"in e)}function Ne(e){return Array.isArray(e)||ae(e)||ie(e)}function P(e){return e.replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function de(e){return`<!-- island:${e} -->`}function ce(e){return["tx",`<!-- island:${e.config.id} -->`]}function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function $(e){return Object.entries(e).map(([t,r])=>`${t}="${m(r)}"`).join(" ")}function je(e){let t=[];return e.charset&&t.push(`charset="${e.charset}"`),e.name&&t.push(`name="${m(e.name)}"`),e.property&&t.push(`property="${m(e.property)}"`),e.httpEquiv&&t.push(`http-equiv="${m(e.httpEquiv)}"`),e.content&&t.push(`content="${m(e.content)}"`),`<meta ${t.join(" ")}>`}function De(e){let t=[`rel="${m(e.rel)}"`,`href="${m(e.href)}"`];return e.type&&t.push(`type="${m(e.type)}"`),e.as&&t.push(`as="${m(e.as)}"`),e.crossorigin&&t.push(`crossorigin="${m(e.crossorigin)}"`),`<link ${t.join(" ")}>`}function Fe(e){let t=[];e.src&&t.push(`src="${m(e.src)}"`),e.type?t.push(`type="${m(e.type)}"`):e.module&&t.push('type="module"'),e.defer&&t.push("defer"),e.async&&t.push("async");let r=t.length>0?" "+t.join(" "):"",n=e.content||"";return`<script${r}>${n}</script>`}function le(e){let t=[];return t.push('<meta charset="utf-8">'),t.push('<meta name="viewport" content="width=device-width, initial-scale=1">'),e.title&&t.push(`<title>${m(e.title)}</title>`),e.meta&&t.push(...e.meta.map(je)),e.links&&t.push(...e.links.map(De)),e.baseUrl&&t.push(`<base href="${m(e.baseUrl)}">`),e.styles&&e.styles.length>0&&t.push(`<style>${e.styles.join(`
`)}</style>`),e.head&&t.push(e.head),t.join(`
    `)}function b(e,t={}){let r=(0,F.rts)(e,{theme:t.theme});if(t.partial)return r;let n=t.htmlAttrs?" "+$(t.htmlAttrs):' lang="en"',o=t.bodyAttrs?" "+$(t.bodyAttrs):"",i=le(t),s=t.scripts?t.scripts.map(Fe).join(`
    `):"";return`<!DOCTYPE html>
<html${n}>
  <head>
    ${i}
  </head>
  <body${o}>
    <div id="app" data-tooey-root="true">${r}</div>
    ${s}
  </body>
</html>`}function z(e,t={},r=[]){let n=r.length>0?r:C(e),o=(0,F.rts)(e,{theme:t.theme});for(let a of n){let d=R(a,t.theme),p=`<!-- island:${a.config.id} -->`;o.includes(p)&&(o=o.replace(p,d))}let i=S(e.s||{}),s=n.length>0?T(n,i):"",c=[...t.scripts||[],...s?[{content:s}]:[]];return{html:b(e,{...t,scripts:c}),hydrationScript:s,serializedState:i}}function U(e,t={}){return b(e,{...t,partial:!0})}function pe(e,t={}){let r=b(e,t);return{body:r,headers:{"Content-Type":"text/html; charset=utf-8","Content-Length":String(Buffer.byteLength(r,"utf-8")),"Cache-Control":"no-cache"}}}function x(e={}){let t=e.htmlAttrs?" "+$(e.htmlAttrs):' lang="en"',r=e.bodyAttrs?" "+$(e.bodyAttrs):"",n=le(e);return{head:`<!DOCTYPE html>
<html${t}>
  <head>
    ${n}
  </head>
  <body${r}>
    <div id="app" data-tooey-root="true">`,bodyStart:"",bodyEnd:`</div>
  </body>
</html>`}}function ue(e){return`<script>window.__TOOEY_STATE__=${S(e)}</script>`}function fe(e){let t=[];return e.description&&t.push({name:"description",content:e.description}),t.push({property:"og:title",content:e.title}),e.description&&t.push({property:"og:description",content:e.description}),e.image&&t.push({property:"og:image",content:e.image}),e.url&&t.push({property:"og:url",content:e.url}),t.push({property:"og:type",content:e.type||"website"}),e.siteName&&t.push({property:"og:site_name",content:e.siteName}),t.push({name:"twitter:card",content:e.twitterCard||"summary"}),t.push({name:"twitter:title",content:e.title}),e.description&&t.push({name:"twitter:description",content:e.description}),e.image&&t.push({name:"twitter:image",content:e.image}),e.twitterSite&&t.push({name:"twitter:site",content:e.twitterSite}),t}var Y=require("@tooey/ui");var y=new TextEncoder;function W(e,t={}){let{theme:r,onChunk:n,flushInterval:o=0}=t;return new ReadableStream({async start(i){try{let s=x(t),c={type:"head",content:s.head};n?.(c),i.enqueue(y.encode(s.head)),o>0&&await I(o);let l=(0,Y.rts)(e,{theme:r});n?.({type:"body",content:l}),i.enqueue(y.encode(l)),o>0&&await I(o);let d={type:"end",content:s.bodyEnd};n?.(d),i.enqueue(y.encode(s.bodyEnd)),i.close()}catch(s){i.error(s)}}})}function he(e,t,r={}){let{theme:n,onChunk:o,flushInterval:i=0}=r;return new ReadableStream({async start(s){try{let c=x(r),l={type:"head",content:c.head};o?.(l),s.enqueue(y.encode(c.head)),i>0&&await I(i);let d=(0,Y.rts)(e,{theme:n});for(let u of t){let _=`<!-- island:${u.config.id} -->`,v=`<div data-tooey-island="${u.config.id}" data-loading="true">loading...</div>`;d=d.replace(_,v)}o?.({type:"body",content:d}),s.enqueue(y.encode(d)),i>0&&await I(i);for(let u of t){let _=R(u,n),v=me(u.config.id,_);o?.({type:"island",content:v}),s.enqueue(y.encode(v)),i>0&&await I(i)}let f=S(e.s||{}),h=T(t,f);if(h){let u={type:"script",content:`<script>${h}</script>`};o?.(u),s.enqueue(y.encode(`<script>${h}</script>`))}let g={type:"end",content:c.bodyEnd};o?.(g),s.enqueue(y.encode(c.bodyEnd)),s.close()}catch(c){s.error(c)}}})}function ge(e){return new ReadableStream({async start(t){try{for await(let r of e)t.enqueue(y.encode(r));t.close()}catch(r){t.error(r)}}})}var O=class{constructor(t={}){this.options=t;this.controller=null;this.closed=!1;this.sentChunks=new Set;this.theme=t.theme}getStream(){return new ReadableStream({start:t=>{this.controller=t}})}sendShell(){if(this.closed||!this.controller)return;let t=x(this.options);this.write(t.head,"head")}sendContent(t,r){if(this.closed||!this.controller)return;let n=r||`content-${this.sentChunks.size}`;this.sentChunks.has(n)||(this.write(t,"body"),this.sentChunks.add(n))}sendIsland(t){if(this.closed||!this.controller)return;let r=R(t,this.theme),n=me(t.config.id,r);this.write(n,"island")}sendHydrationScript(t,r){if(this.closed||!this.controller)return;let n=S(r),o=T(t,n);o&&this.write(`<script>${o}</script>`,"script")}close(){if(this.closed||!this.controller)return;let t=x(this.options);this.write(t.bodyEnd,"end"),this.controller.close(),this.closed=!0}abort(t){this.closed||!this.controller||(this.controller.error(t),this.closed=!0)}write(t,r){if(!this.controller)return;let n={type:r,content:t};this.options.onChunk?.(n),this.controller.enqueue(y.encode(t))}};function me(e,t){let r=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$");return`<script>
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
</script>`}function I(e){return new Promise(t=>setTimeout(t,e))}async function ye(e){let t=new TextDecoder,r=e.getReader(),n=[];for(;;){let{done:o,value:i}=await r.read();if(o)break;n.push(t.decode(i,{stream:!0}))}return n.push(t.decode()),n.join("")}async function we(e,t){let r=e.getReader(),n=t.getWriter();try{for(;;){let{done:o,value:i}=await r.read();if(o)break;await n.write(i)}}finally{n.close()}}function H(e={}){let t=[],r=e.base||"";function n(a){let d=[],p=a.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g,(f,h)=>(d.push(h),"([^/]+)")).replace(/\*/g,"(.*)");return{regex:new RegExp(`^${p}$`),params:d}}function o(a,d){for(let p of t){if(p.methods&&!p.methods.includes(d))continue;let f=a.match(p.pattern);if(f){let h={};return p.paramNames.forEach((g,u)=>{h[g]=f[u+1]||""}),{route:p,params:h}}}return null}function i(a){let d={},p=a.indexOf("?");return p===-1||new URLSearchParams(a.slice(p+1)).forEach((h,g)=>{d[g]=h}),d}function s(a,d){return{req:a,prm:d,qry:i(a.url),body:a.body,loc:{},hdr:p=>a.headers[p.toLowerCase()]}}async function c(a){let p=new URL(a.url,"http://localhost").pathname;r&&p.startsWith(r)&&(p=p.slice(r.length)||"/");let f=o(p,a.method);if(!f){if(e.notFound){let g=s(a,{}),u=await e.notFound(g);return l(u)}return{status:404,headers:{},body:"not found"}}let h=s(a,f.params);try{if(e.mw&&e.mw.length>0){let u=0,_=async()=>{u<e.mw.length&&await e.mw[u++](h,_)};await _()}let g=await f.route.handler(h);return l(g)}catch(g){if(e.onError){let u=e.onError(g,h);return l(u)}return{status:500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:g.message})}}}function l(a){if("pg"in a){let d=b(a.pg,a.opts);return{status:200,headers:{"Content-Type":"text/html; charset=utf-8"},body:d}}return"api"in a?{status:a.status||200,headers:{"Content-Type":"application/json"},body:JSON.stringify(a.api)}:"rd"in a?{status:a.status||302,headers:{Location:a.rd},body:""}:"html"in a?{status:a.status||200,headers:{"Content-Type":"text/html; charset=utf-8"},body:a.html}:"err"in a?{status:a.status||500,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:a.err})}:{status:500,headers:{},body:"unknown response type"}}return{rt(a,d,p){let{regex:f,params:h}=n(r+a);return t.push({pattern:f,paramNames:h,handler:d,methods:p}),this},pg(a,d){return this.rt(a,async p=>{let f=await d(p);return"spec"in f?{pg:f.spec,opts:f.opts}:f},["GET"])},api(a,d){let p=Object.keys(d);return this.rt(a,async f=>{let h=f.req.method,g=d[h];if(!g)return{err:"method not allowed",status:405};let u=await g(f);return"data"in u?{api:u.data,status:u.status}:u},p)},handle:c,get routes(){return t.map(a=>({pattern:a.pattern.source,params:a.paramNames,methods:a.methods}))}}}function k(e){let t=e.replace(/\.(ts|js|tsx|jsx)$/,"").replace(/\/index$/,"").replace(/^index$/,"").replace(/\[\.\.\.([^\]]+)\]/g,"*").replace(/\[([^\]]+)\]/g,":$1");return t.startsWith("/")||(t="/"+t),t===""&&(t="/"),t}function Re(e,t="pages",r="api"){let n=[];for(let o of e){let i=o.startsWith(r+"/")||o.startsWith(r+"\\"),s=o.startsWith(t+"/")||o.startsWith(t+"\\");if(!i&&!s)continue;let c=i?o.slice(r.length+1):o.slice(t.length+1),l=i?"/api"+k(c):k(c);n.push({file:o,pattern:l,isApi:i})}return n.sort((o,i)=>{let s=Se(o.pattern);return Se(i.pattern)-s}),n}function Se(e){let t=0,r=e.split("/").filter(Boolean);for(let n of r)n.startsWith(":")?t-=1:n==="*"?t-=10:t+=10;return t}function J(e,t,r={}){let n=H(r);for(let o of e)o.isApi?n.rt(o.pattern,async i=>{let s=await t(o.file),c=i.req.method,l=s[c];if(!l)return{err:"method not allowed",status:405};let a=await l(i);return"data"in a?{api:a.data,status:a.status}:a}):n.pg(o.pattern,async i=>{let s=await t(o.file);return s.default?s.default(i):{err:"page handler not found",status:500}});return n}function be(e,t=200,r){return{data:e,status:t,headers:r}}function G(e,t=302){return{rd:e,status:t}}function X(e,t=500){return{err:e,status:t}}function V(e,t){return{spec:e,opts:t}}function B(...e){return async(t,r)=>{let n=-1;async function o(i){if(i<=n)throw new Error("next() called multiple times");n=i,i<e.length?await e[i](t,()=>o(i+1)):await r()}await o(0)}}function Te(e={}){let{origin:t="*",methods:r=["GET","POST","PUT","DELETE","PATCH","OPTIONS"],headers:n=["Content-Type","Authorization"],credentials:o=!1,maxAge:i=86400}=e;return async(s,c)=>{let l=s.request.headers.origin||"",a="*";if(typeof t=="string"?a=t:Array.isArray(t)?a=t.includes(l)?l:t[0]:typeof t=="function"&&(a=t(l)?l:""),s.response.headers=s.response.headers||{},s.response.headers["Access-Control-Allow-Origin"]=a,s.response.headers["Access-Control-Allow-Methods"]=r.join(", "),s.response.headers["Access-Control-Allow-Headers"]=n.join(", "),o&&(s.response.headers["Access-Control-Allow-Credentials"]="true"),s.request.method==="OPTIONS"){s.response.headers["Access-Control-Max-Age"]=String(i),s.response.status=204,s.response.body="";return}await c()}}function Z(e={}){let{format:t="short",skip:r}=e;return async(n,o)=>{if(r?.(n)){await o();return}let i=Date.now(),{method:s,url:c}=n.request;await o();let l=Date.now()-i,a=n.response.status||200;switch(t){case"tiny":console.log(`${s} ${c} ${a} ${l}ms`);break;case"short":console.log(`[${new Date().toISOString()}] ${s} ${c} ${a} ${l}ms`);break;case"full":console.log(`[${new Date().toISOString()}] ${s} ${c} ${a} ${l}ms`,`
  headers: ${JSON.stringify(n.request.headers)}`);break}}}function Q(e={}){let{max:t=100,window:r=6e4,keyFn:n=s=>s.request.headers["x-forwarded-for"]||"unknown",message:o="too many requests"}=e,i=new Map;return setInterval(()=>{let s=Date.now();for(let[c,l]of i)l.reset<s&&i.delete(c)},r),async(s,c)=>{let l=n(s),a=Date.now(),d=i.get(l);if((!d||d.reset<a)&&(d={count:0,reset:a+r},i.set(l,d)),d.count++,s.response.headers=s.response.headers||{},s.response.headers["X-RateLimit-Limit"]=String(t),s.response.headers["X-RateLimit-Remaining"]=String(Math.max(0,t-d.count)),s.response.headers["X-RateLimit-Reset"]=String(Math.ceil(d.reset/1e3)),d.count>t){s.response.status=429,s.response.headers["Retry-After"]=String(Math.ceil((d.reset-a)/1e3)),s.response.body=JSON.stringify({error:o});return}await c()}}function xe(e={}){let{threshold:t=1024,encodings:r=["gzip","deflate","br"]}=e;return async(n,o)=>{await o();let i=n.request.headers["accept-encoding"]||"",s=n.response.body;if(!(typeof s!="string"||s.length<t)){for(let c of r)if(i.includes(c)){n.response.headers=n.response.headers||{},n.response.headers["Content-Encoding"]=c,n.locals._compress=c;break}}}}function K(e={}){let{hsts:t=!0,noSniff:r=!0,xssFilter:n=!0,frameOptions:o="DENY",csp:i=!1}=e;return async(s,c)=>{if(s.response.headers=s.response.headers||{},t){let l=typeof t=="object"?t:{},a=l.maxAge||31536e3,d=l.includeSubDomains!==!1;s.response.headers["Strict-Transport-Security"]=`max-age=${a}${d?"; includeSubDomains":""}`}r&&(s.response.headers["X-Content-Type-Options"]="nosniff"),n&&(s.response.headers["X-XSS-Protection"]="1; mode=block"),o&&(s.response.headers["X-Frame-Options"]=o),i&&(s.response.headers["Content-Security-Policy"]=i),await c()}}function _e(e={}){let{maxSize:t=1024*1024,types:r=["application/json","application/x-www-form-urlencoded"]}=e;return async(n,o)=>{let i=n.request.headers["content-type"]||"";if(parseInt(n.request.headers["content-length"]||"0",10)>t){n.response.status=413,n.response.body=JSON.stringify({error:"payload too large"});return}if(!r.some(l=>i.includes(l))){await o();return}n.locals.body=n.request.body,await o()}}function Ae(e){return{request:e,response:{status:200,headers:{}},params:{},locals:{}}}function Ie(e,t){return e.locals[t]}function ve(e,t,r){e.locals[t]=r}
//# sourceMappingURL=server.js.map
