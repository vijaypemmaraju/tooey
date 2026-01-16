<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library for llm output

```
~39% fewer tokens than react | ~10kb minified | 0 deps
```

## install

```bash
npm install @tooey/ui
```

or via CDN:

```html
<script src="https://unpkg.com/@tooey/ui/dist/tooey.js"></script>
```

## usage

```javascript
tooey.render(document.getElementById('app'), {
  s: {n: 0},
  r: [V,[[T,{$:"n"}],[H,[[B,"-",{c:"n"}],[B,"+",{c:"n"}]],{g:8}]],{g:8}]
});
```

## components

```
layout    V H D G
text      T B
input     I Ta S C R
table     Tb Th Tbd Tr Td Tc
list      Ul Ol Li
media     M L Sv
```

## props

```
spacing   g p m w h mw mh
color     bg fg o
border    r bw bc bs
position  pos z t l rt
type      fs fw ff ta td lh ls
layout    ai jc flw cols rows
misc      cur ov sh tr pe us
element   v ph type href src alt dis ch ro opts rw sp rsp cls id

layout shortcuts: c=center sb=space-between fe=flex-end fs=flex-start st=stretch
```

## events

```
c   click
x   input/change
f   focus
bl  blur
k   keydown
e   mouseenter
lv  mouseleave
sub submit
```

## state ops

```javascript
// array form
["state", "+"]         // increment
["state", "-"]         // decrement
["state", "!", val]    // set
["state", "~"]         // toggle
["state", "<", item]   // append
["state", ">", item]   // prepend
["state", "X", idx]    // remove
["state", ".", [k,v]]  // set prop

// string shorthand (for events)
"state+"               // increment
"state-"               // decrement
"state~"               // toggle
"state!val"            // set value
"state"                // for inputs: set, for +/- buttons: infers op
```

## control flow

```javascript
// long form
{if: "show", then: [T, "yes"], else: [T, "no"]}
{map: "items", as: [Li, "$item"]}

// short form (saves tokens)
{?: "show", t: [T, "yes"], e: [T, "no"]}
{m: "items", a: [Li, "$item"]}

// equality check
{?: "step", is: 0, t: [T, "step 1"]}
```

## function components

create reusable components with functions:

```javascript
import { Component, V, T, H, B } from '@tooey/ui';

// simple component
const Card = (props, children) => [V, children, { bg: '#fff', p: 16, r: 8, ...props }];

// component with props
const Alert = ({ type = 'info', message }) =>
  [V, [[T, message]], { bg: type === 'error' ? '#fee' : '#eef', p: 12 }];

// usage
render(container, {
  s: {},
  r: [V, [
    [Card, [[T, 'Hello']]],
    [Alert, '', { type: 'error', message: 'Error!' }]
  ]]
});
```

components receive `(props, children)` and return a `NodeSpec`.

## api

```javascript
const app = tooey.render(el, spec);
app.get("key")           // read state
app.set("key", value)    // write state
app.destroy()            // cleanup
```

## examples

[/examples](./examples) - counter, todo, form, converter, table, tabs, modal, cart, wizard

## security

tooey includes several security features to protect against common vulnerabilities:

### xss protection
- all text content is escaped using `textContent` instead of `innerHTML`
- dynamic state values are sanitized before rendering

### url validation
- `href` and `src` props are validated against safe protocols
- blocked protocols: `javascript:`, `data:`, `vbscript:`
- allowed protocols: `http:`, `https:`, `mailto:`, `tel:`, `ftp:`
- relative urls and anchors are allowed

### best practices

1. **content security policy**: add csp headers to your deployment:
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://unpkg.com/@tooey/ui
```

2. **user input**: always validate user input before passing to tooey specs
3. **state values**: don't store sensitive data in state that gets rendered

### reporting security issues

report security vulnerabilities via github issues with the `security` label.

## llm reference

copy this into your system prompt for llms to generate tooey specs:

```
tooey: token-efficient UI lib. spec={s:{state},r:[component,content?,props?]}
components: V(vstack) H(hstack) D(div) G(grid) T(text) B(button) I(input) Ta(textarea) S(select) C(checkbox) R(radio) Tb/Th/Tbd/Tr/Td/Tc(table) Ul/Ol/Li(list) M(img) L(a) Sv(svg)
props: g(gap) p(padding) m(margin) w(width) h(height) mw mh bg(background) fg(color) o(opacity) r(radius) bw bc bs pos(position:rel/abs/fix) z t l rt b fs(font-size) fw ff ta td lh ls ai(align-items) jc(justify-content) flw cols rows cur ov sh tr pe us v(value) ph(placeholder) type href src alt dis(disabled) ch(checked) ro(readonly) opts cls id
layout shortcuts: c=center sb=space-between fe=flex-end fs=flex-start st=stretch
events: c(click) x(input) f(focus) bl(blur) k(keydown) e(mouseenter) lv(mouseleave) sub(submit)
state ops: "key+"(inc) "key-"(dec) "key~"(toggle) "key!val"(set) or ["key","op",val?] where op=+/-/!/~/</>/X/.
control: {?:"key",t:[...],e:[...]} {?:"key",is:val,t:[...]} {m:"arr",a:[...]}
state ref: {$:"key"} | in map: $item $index $item.prop
function components: const Comp=(props,children)=>[V,children,{...props}] | use: [Comp,content,props]
example: {s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n"}],[B,"+",{c:"n"}]],{g:8}]],{g:8}]}
```

## license

mit
