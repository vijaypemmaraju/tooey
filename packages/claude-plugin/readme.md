# @tooey/claude-plugin

claude code plugin for generating token-efficient ui specs with tooey.

## installation

### option 1: marketplace (recommended)

first, add the tooey marketplace:

```bash
claude plugin marketplace add https://raw.githubusercontent.com/vijaypemmaraju/tooey/main/marketplace.json
```

then install the plugin:

```bash
claude plugin install tooey
```

### option 2: npx one-liner

```bash
npx -y @anthropic-ai/claude-code --plugin-dir $(npm pack @tooey/claude-plugin --pack-destination /tmp && tar -xzf /tmp/tooey-claude-plugin-*.tgz -C /tmp && echo /tmp/package)
```

### option 3: clone and load

```bash
git clone https://github.com/vijaypemmaraju/tooey
claude --plugin-dir ./tooey/packages/claude-plugin
```

### option 4: add to project settings

add to your project's `.claude/settings.json`:

```json
{
  "pluginDirs": ["./node_modules/@tooey/claude-plugin"]
}
```

then install the package:

```bash
npm install @tooey/claude-plugin
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
