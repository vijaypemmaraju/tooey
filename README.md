<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library for llm output

```
~45% fewer tokens than react | ~9kb minified | 0 deps
```

## install

```html
<script src="https://unpkg.com/tooey/dist/tooey.js"></script>
```

## usage

```javascript
tooey.render(document.getElementById('app'), {
  s: {n: 0},
  r: [V,[[T,{$:"n"}],[B,"+",{c:["n","+"]}]],{g:8}]
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
["state", "+"]         // increment
["state", "-"]         // decrement
["state", "!", val]    // set
["state", "~"]         // toggle
["state", "<", item]   // append
["state", ">", item]   // prepend
["state", "X", idx]    // remove
["state", ".", [k,v]]  // set prop
```

## control flow

```javascript
{if: "show", then: [T, "yes"], else: [T, "no"]}
{map: "items", as: [Li, "$item"]}
```

## api

```javascript
const app = tooey.render(el, spec);
app.get("key")           // read state
app.set("key", value)    // write state
app.destroy()            // cleanup
```

## examples

[/examples](./examples) - counter, todo, form, converter, table

## license

mit
