# @tooey/claude-plugin

claude code plugin for generating token-efficient ui specs with tooey.

## installation

### from plugin marketplace

```bash
claude plugin install tooey
```

### manual installation

clone or download this directory and load it directly:

```bash
claude --plugin-dir ./packages/claude-plugin
```

or add to your project's `.claude/settings.json`:

```json
{
  "plugins": ["@tooey/claude-plugin"]
}
```

## usage

### slash command

use `/tooey:ui` followed by a description of the ui you want:

```
/tooey:ui a counter with increment and decrement buttons
/tooey:ui a login form with username and password fields
/tooey:ui a modal dialog with title, content, and close button
/tooey:ui a tabbed interface with home and settings tabs
```

### automatic skill

the plugin also includes a skill that claude can automatically invoke when you ask for ui generation. just describe what you need:

```
create a todo list with add/remove functionality
build a settings panel with toggle switches
make a shopping cart component
```

## what is tooey?

tooey is a token-efficient ui library that uses ~75% fewer output tokens than react while maintaining full functionality.

```javascript
// tooey counter (53 tokens)
{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n-"}],[B,"+",{c:"n+"}]],{g:8}]],{g:8}]}

// equivalent react (142 tokens)
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
};
```

## rendering tooey specs

```javascript
import { render, V, H, T, B } from '@tooey/ui';

render(document.getElementById('app'), spec);
```

or via cdn:

```html
<script src="https://unpkg.com/@tooey/ui/dist/tooey.js"></script>
<script>
  tooey.render(document.getElementById('app'), spec);
</script>
```

## license

mit
