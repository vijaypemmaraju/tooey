<p align="center">
  <img src="logo.svg" width="64" height="64" alt="tooey">
</p>

# tooey

token-efficient ui library for llm output

```
~39% fewer tokens than react | ~10kb minified | 0 deps
```

## install

```html
<script src="https://unpkg.com/tooey/dist/tooey.js"></script>
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

## api

```javascript
const app = tooey.render(el, spec);
app.get("key")           // read state
app.set("key", value)    // write state
app.destroy()            // cleanup
```

## examples

[/examples](./examples) - counter, todo, form, converter, table, tabs, modal, cart, wizard

## license

mit
