# @tooey/components

component library for [@tooey/ui](../ui)

## status

coming soon - see [ECOSYSTEM.md](../../ECOSYSTEM.md) for planned components.

## planned components

| component | abbrev | description |
|-----------|--------|-------------|
| Card | `Cd` | container with shadow/border |
| Modal | `Mdl` | overlay dialog |
| Alert | `Al` | status message |
| Dropdown | `Dd` | select with custom options |
| Tooltip | `Tt` | hover info |
| Tabs | `Tbs` | tabbed content |

## usage (planned)

```javascript
import { Cd, Mdl, Al } from '@tooey/components';
import { render, V, T } from '@tooey/ui';

render(el, {
  r: [Cd, [[T, 'Card content']], { variant: 'elevated' }]
});
```

## license

mit
