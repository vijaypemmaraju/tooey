# CLAUDE.md

project guide for tooey - token-efficient ui library for llm output

## overview

tooey provides a declarative, compact syntax for building reactive UIs with ~39% fewer tokens than React.

- zero production dependencies (~10kb minified)
- single-letter component abbreviations for token efficiency
- reactive state management with signals
- es2020 target, works in all modern browsers

## structure

```
tooey/
├── src/
│   └── tooey.ts          # single source file (~1000 lines)
├── dist/
│   ├── tooey.js          # umd bundle
│   ├── tooey.esm.js      # esm bundle
│   └── tooey.d.ts        # typescript declarations
├── tests/
│   ├── tooey.test.ts     # core functionality tests
│   ├── ui.test.ts        # comprehensive ui tests
│   ├── security.test.ts  # security feature tests
│   ├── accessibility.test.ts
│   └── compatibility.test.ts
├── examples/             # html demo files
├── tsconfig.json         # typescript config (includes tests)
├── tsconfig.build.json   # build-only config (src only)
├── vitest.config.ts      # test configuration
└── eslint.config.js      # linting rules
```

## commands

```bash
npm run build        # build umd + esm bundles + typescript declarations
npm run dev          # watch mode (no minification)
npm run typecheck    # typescript type checking
npm run lint         # eslint
npm run test         # run tests
npm run test:watch   # watch mode for tests
npm run test:coverage # tests with coverage report
```

## architecture

### single-file design
the entire library is in `src/tooey.ts`. intentional for simplicity, auditability, zero internal dependencies, and easy bundling.

### component abbreviations
```
layout    V H D G       (vstack, hstack, div, grid)
text      T B           (span, button)
input     I Ta S C R    (input, textarea, select, checkbox, radio)
table     Tb Th Tbd Tr Td Tc
list      Ul Ol Li
media     M L Sv        (img, link, svg)
```

### props abbreviations
short keys: `g` (gap), `p` (padding), `bg` (background), `fg` (color), etc.

### spec format
```javascript
{
  s: { stateName: initialValue },  // state
  r: [Component, content?, props?] // root node
}
```

## conventions

### typescript
- strict mode enabled
- all functions should have explicit types
- use `StateValue` for state values (alias for `unknown`)
- prefix intentionally unused variables with `_`

### error handling
- use `console.warn` for non-critical errors (don't crash the app)
- throw errors only for critical issues (invalid container, missing root)
- format: `[tooey] error message`

### security
- always use `textContent` instead of `innerHTML` for dynamic content
- validate urls with `sanitizeUrl()` before setting `href`/`src`
- safe protocols: `http:`, `https:`, `mailto:`, `tel:`, `ftp:`
- block: `javascript:`, `data:`, `vbscript:`

### testing
- tests are in `tests/` directory
- use `vitest` with `jsdom` environment
- each test creates its own container and cleans up
- cast dom elements when needed: `container.querySelector('input') as HTMLInputElement`

## patterns

### state operations
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

### event shorthand
```javascript
"state+"   // increment
"state-"   // decrement
"state~"   // toggle
"state!val" // set to val
```

### control flow
```javascript
// conditional (short form)
{ '?': 'show', t: [T, 'yes'], e: [T, 'no'] }

// equality check
{ '?': 'tab', is: 'home', t: [T, 'Home'] }

// list rendering
{ m: 'items', a: [Li, '$item'] }
```

### error boundaries
```javascript
{
  boundary: true,
  child: [Component, ...],
  fallback: [T, 'Error occurred'],
  onError: (error) => console.error(error)
}
```

## ci/cd

github actions workflow (`ci.yml`) runs:
1. type checking (`npm run typecheck`)
2. linting (`npm run lint`)
3. build (`npm run build`)
4. tests with coverage (`npm run test:coverage`)
5. security audit (`npm audit`)

## common tasks

### adding a new component type
1. add to `ComponentType` union in types section
2. add case in `createElement` switch statement
3. add constant export at bottom
4. add to exports
5. add tests

### adding a new prop
1. add to `Props` interface with type
2. add handling in `applyStyles` or `createElement`
3. add tests
4. document in readme and api.md

### adding a new event
1. add to `Props` interface (e.g., `newEvent?: EventHandler`)
2. add `addEventListener` call in event handling section
3. add tests

## notes

- `update()` method on TooeyInstance requires a full `TooeySpec` with both `s` and `r` (typescript enforces this)
- coverage thresholds: 80% statements/functions/lines, 75% branches
- eslint rules relaxed for test files (unused vars, any types allowed)
- two tsconfig files: `tsconfig.json` for type checking (includes tests), `tsconfig.build.json` for building (src only)
