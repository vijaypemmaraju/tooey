# Claude Project Guide: tooey

## Project Overview

tooey is a token-efficient UI library designed for LLM output. It provides a declarative, compact syntax for building reactive UIs with ~39% fewer tokens than React.

**Key characteristics:**
- Zero production dependencies (~10KB minified)
- Single-letter component abbreviations for token efficiency
- Reactive state management with signals
- ES2020 target, works in all modern browsers

## Project Structure

```
tooey/
├── src/
│   └── tooey.ts          # Single source file (~1000 lines)
├── dist/
│   ├── tooey.js          # UMD bundle
│   ├── tooey.esm.js      # ESM bundle
│   └── tooey.d.ts        # TypeScript declarations
├── tests/
│   ├── tooey.test.ts     # Core functionality tests
│   ├── ui.test.ts        # Comprehensive UI tests
│   ├── security.test.ts  # Security feature tests
│   ├── accessibility.test.ts
│   └── compatibility.test.ts
├── examples/             # HTML demo files
├── tsconfig.json         # TypeScript config (includes tests)
├── tsconfig.build.json   # Build-only config (src only)
├── vitest.config.ts      # Test configuration
└── eslint.config.js      # Linting rules
```

## Development Commands

```bash
npm run build        # Build UMD + ESM bundles + TypeScript declarations
npm run dev          # Watch mode (no minification)
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run test         # Run tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Tests with coverage report
```

## Architecture Decisions

### Single-file architecture
The entire library is in `src/tooey.ts`. This is intentional for:
- Simplicity and auditability
- Zero internal dependencies
- Easy bundling

### Component abbreviations
Components use single/double letter codes to minimize tokens:
- Layout: `V` (vstack), `H` (hstack), `D` (div), `G` (grid)
- Text: `T` (span), `B` (button)
- Input: `I` (input), `Ta` (textarea), `S` (select), `C` (checkbox), `R` (radio)
- Table: `Tb`, `Th`, `Tbd`, `Tr`, `Td`, `Tc`
- List: `Ul`, `Ol`, `Li`
- Media: `M` (img), `L` (link), `Sv` (svg)

### Props abbreviations
Props use short keys: `g` (gap), `p` (padding), `bg` (background), `fg` (color), etc.

### Spec format
```javascript
{
  s: { stateName: initialValue },  // State
  r: [Component, content?, props?] // Root node
}
```

## Code Conventions

### TypeScript
- Strict mode enabled
- All functions should have explicit types
- Use `StateValue` for state values (alias for `unknown`)
- Prefix intentionally unused variables with `_`

### Error handling
- Use `console.warn` for non-critical errors (don't crash the app)
- Throw errors only for critical issues (invalid container, missing root)
- Format: `[tooey] error message`

### Security
- Always use `textContent` instead of `innerHTML` for dynamic content
- Validate URLs with `sanitizeUrl()` before setting `href`/`src`
- Safe protocols: `http:`, `https:`, `mailto:`, `tel:`, `ftp:`
- Block: `javascript:`, `data:`, `vbscript:`

### Testing
- Tests are in `tests/` directory
- Use `vitest` with `jsdom` environment
- Each test creates its own container and cleans up
- Cast DOM elements when needed: `container.querySelector('input') as HTMLInputElement`

## Key Patterns

### State operations
```javascript
'+' // increment
'-' // decrement
'!' // set value
'~' // toggle boolean
'<' // append to array
'>' // prepend to array
'X' // remove from array
'.' // set object property
```

### Event shorthand
```javascript
"state+"   // increment
"state-"   // decrement
"state~"   // toggle
"state!val" // set to val
```

### Control flow
```javascript
// Conditional (short form)
{ '?': 'show', t: [T, 'yes'], e: [T, 'no'] }

// Equality check
{ '?': 'tab', is: 'home', t: [T, 'Home'] }

// List rendering
{ m: 'items', a: [Li, '$item'] }
```

### Error boundaries
```javascript
{
  boundary: true,
  child: [Component, ...],
  fallback: [T, 'Error occurred'],
  onError: (error) => console.error(error)
}
```

## CI/CD

The GitHub Actions workflow (`ci.yml`) runs:
1. Type checking (`npm run typecheck`)
2. Linting (`npm run lint`)
3. Build (`npm run build`)
4. Tests with coverage (`npm run test:coverage`)
5. Security audit (`npm audit`)

## Common Tasks

### Adding a new component type
1. Add to `ComponentType` union in types section
2. Add case in `createElement` switch statement
3. Add constant export at bottom
4. Add to exports
5. Add tests

### Adding a new prop
1. Add to `Props` interface with type
2. Add handling in `applyStyles` or `createElement`
3. Add tests
4. Document in README and API.md

### Adding a new event
1. Add to `Props` interface (e.g., `newEvent?: EventHandler`)
2. Add `addEventListener` call in event handling section
3. Add tests

## Important Notes

- The `update()` method on TooeyInstance requires a full `TooeySpec` with both `s` and `r` (TypeScript enforces this)
- Coverage thresholds are set to 80% for statements/functions/lines, 75% for branches
- ESLint rules are relaxed for test files (unused vars, any types allowed)
- Two tsconfig files: `tsconfig.json` for type checking (includes tests), `tsconfig.build.json` for building (src only)
