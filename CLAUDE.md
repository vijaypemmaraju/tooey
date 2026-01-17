# CLAUDE.md

project guide for @tooey/ui - token-efficient ui library for llm output

## overview

tooey provides a declarative, compact syntax for building reactive UIs with ~39% fewer tokens than React.

- zero production dependencies (~10kb minified)
- single-letter component abbreviations for token efficiency
- reactive state management with signals
- es2020 target, works in all modern browsers

## monorepo structure

```
tooey/
├── packages/
│   ├── ui/                    # @tooey/ui - core library
│   │   ├── src/
│   │   │   └── tooey.ts       # single source file (~1000 lines)
│   │   ├── tests/
│   │   ├── dist/
│   │   ├── examples/
│   │   └── package.json
│   │
│   └── components/            # @tooey/components - component library
│       ├── src/
│       └── package.json
│
├── .github/workflows/
├── pnpm-workspace.yaml
├── package.json               # root workspace config
├── tsconfig.base.json         # shared typescript config
├── API.md
├── ECOSYSTEM.md
└── readme.md
```

## commands

```bash
# root commands (run all packages)
pnpm install         # install all dependencies
pnpm build           # build all packages
pnpm test            # run all tests
pnpm lint            # lint all packages
pnpm typecheck       # type check all packages
pnpm dev             # watch mode for all packages

# package-specific (from packages/ui/)
pnpm build           # build umd + esm bundles + typescript declarations
pnpm dev             # watch mode (no minification)
pnpm test            # run tests
pnpm test:coverage   # tests with coverage report
```

## architecture

### single-file design
the entire library is in `packages/ui/src/tooey.ts`. intentional for simplicity, auditability, zero internal dependencies, and easy bundling.

### component abbreviations
```
layout    vs hs dv gr       (vstack, hstack, div, grid)
text      tx bt             (span, button)
input     In ta sl cb rd    (input, textarea, select, checkbox, radio)
table     tb th bd Tr Td tc
list      ul ol li
media     im ln sv          (img, link, svg)
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

### style
- **use lowercase throughout** - all documentation, commit messages, comments, and markdown files should use lowercase
- this includes headings, sentences, and code comments
- only exceptions: proper nouns in documentation, constant values in code

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
- tests are in `packages/ui/tests/` directory
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
{ '?': 'show', t: [tx, 'yes'], e: [tx, 'no'] }

// equality check
{ '?': 'tab', is: 'home', t: [tx, 'Home'] }

// list rendering
{ m: 'items', a: [li, '$item'] }
```

### error boundaries
```javascript
{
  boundary: true,
  child: [Component, ...],
  fallback: [tx, 'Error occurred'],
  onError: (error) => console.error(error)
}
```

## versioning

**follow semver strictly.** bump version in `packages/ui/package.json` when making changes:

- **patch** (1.0.x): bug fixes, security patches, dependency updates
  - fixing a rendering bug
  - updating dependencies for security
  - fixing typos in error messages

- **minor** (1.x.0): new features, backwards-compatible additions
  - adding a new component type
  - adding a new prop
  - adding a new event handler
  - adding a new state operation

- **major** (x.0.0): breaking changes
  - removing or renaming a component
  - changing prop behavior
  - changing the spec format
  - removing a feature

**always increment version** when functionality changes. the publish workflow auto-publishes to npm when version in `package.json` differs from npm registry.

## ci/cd

github actions workflows:

**ci.yml** (runs on PRs and pushes to main):
1. type checking (`pnpm typecheck`)
2. linting (`pnpm lint`)
3. build (`pnpm build`)
4. tests with coverage (`pnpm test:coverage`)
5. security audit (`pnpm audit`)

**publish.yml** (runs on push to main):
1. runs all ci checks
2. compares package.json version to npm registry
3. if version changed: publishes to npm and creates git tag

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
