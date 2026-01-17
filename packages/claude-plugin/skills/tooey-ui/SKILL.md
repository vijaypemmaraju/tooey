---
name: tooey-ui
description: generate token-efficient ui specs using tooey syntax - 75% fewer tokens than react
---

# tooey ui generation skill

use this skill when the user asks to generate ui components, forms, interactive elements, or frontend code. tooey uses ~75% fewer output tokens than react while maintaining full functionality.

## when to use

- user asks to create a ui component (counter, form, modal, tabs, etc.)
- user wants token-efficient ui generation
- user mentions "tooey" or asks for compact ui syntax
- user asks for ui that can be rendered in a browser

## tooey reference

```
tooey: token-efficient UI lib. spec={s:{state},r:[component,content?,props?]}
components: vs(vstack) hs(hstack) dv(div) gr(grid) tx(text) bt(button) In(input) ta(textarea) sl(select) cb(checkbox) rd(radio) tb/th/bd/Tr/Td/tc(table) ul/ol/li(list) im(img) ln(a) sv(svg)
props: g(gap) p(padding) m(margin) w(width) h(height) mw mh bg(background) fg(color) o(opacity) r(radius) bw bc bs pos(position:rel/abs/fix) z t l rt b fs(font-size) fw ff ta td lh ls ai(align-items) jc(justify-content) flw cols rows cur ov sh tr pe us v(value) ph(placeholder) type href src alt dis(disabled) ch(checked) ro(readonly) opts cls id show(conditional display)
layout shortcuts: c=center sb=space-between fe=flex-end fs=flex-start st=stretch
events: c(click) x(input) f(focus) bl(blur) k(keydown) e(mouseenter) lv(mouseleave) sub(submit)
state ops: "key+"(inc) "key-"(dec) "key~"(toggle) "key!val"(set) or ["key","op",val?] where op=+/-/!/~/</>/X/.
control: {?:"key",t:[...],e:[...]} {?:"key",is:val,t:[...]} {m:"arr",a:[...]}
state ref: {$:"key"} | in map: $item $index $item.prop
function components: const Comp=(props,children)=>[vs,children,{...props}] | use: [Comp,content,props]
```

## examples

counter:
```javascript
{s:{n:0},r:[vs,[[tx,{$:"n"}],[hs,[[bt,"-",{c:"n-"}],[bt,"+",{c:"n+"}]],{g:8}]],{g:8}]}
```

toggle:
```javascript
{s:{v:false},r:[vs,[[tx,{$:"v"}],[bt,"Toggle",{c:"v~"}]],{g:8}]}
```

input preview:
```javascript
{s:{t:""},r:[vs,[[In,"",{v:{$:"t"},x:"t"}],[tx,{$:"t"}]],{g:8}]}
```

tabs:
```javascript
{s:{t:0},r:[vs,[[hs,[[bt,"Home",{c:"t!0"}],[bt,"About",{c:"t!1"}]],{g:8}],{?:"t",is:0,t:[tx,"Home content"]},{?:"t",is:1,t:[tx,"About content"]}],{g:12}]}
```

login form:
```javascript
{s:{u:"",p:""},r:[vs,[[vs,[[tx,"Username"],[In,"",{v:{$:"u"},x:"u"}]],{g:4}],[vs,[[tx,"Password"],[In,"",{type:"password",v:{$:"p"},x:"p"}]],{g:4}],[bt,"Login"]],{g:16}]}
```

modal:
```javascript
{s:{o:false},r:[vs,[[bt,"Open",{c:"o~"}],[dv,[[vs,[[tx,"Title",{fw:700}],[tx,"Content"],[bt,"Close",{c:"o~"}]],{bg:"#fff",p:16,r:8,g:8}]],{show:"o",pos:"fix",w:"100vw",h:"100vh",bg:"#0008",jc:"c",ai:"c"}]],{g:8}]}
```

## rendering

to render tooey specs:

```javascript
import { render, vs, hs, tx, bt, In, dv } from '@tooey/ui';

render(document.getElementById('app'), spec);
```

or via cdn:

```html
<script src="https://unpkg.com/@tooey/ui/dist/tooey.js"></script>
<script>
  tooey.render(document.getElementById('app'), spec);
</script>
```

## output format

when generating tooey specs, output the compact javascript object format. keep state names short (1-2 chars). use abbreviations for all props and components.
