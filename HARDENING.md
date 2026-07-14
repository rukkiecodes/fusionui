# FusionUI — hardening & v1 status

The Batch 18 hardening posture: what's enforced, what's measured, and the
honest backlog before a 1.0 tag.

## Enforced in CI

| Gate           | How                                             | Status               |
| -------------- | ----------------------------------------------- | -------------------- |
| Lint           | `pnpm lint` (ESLint + Prettier)                 | ✅ green             |
| Typecheck      | `pnpm typecheck` (8 projects)                   | ✅ green             |
| Unit tests     | `pnpm test` (tokens, vue, shaders, native, cli) | ✅ ~110 tests        |
| Bundle budgets | `pnpm size` — gzip ceilings per shipped bundle  | ✅ all within budget |
| Build          | packages + docs                                 | ✅ green             |

## SSR / hydration

`packages/vue/src/__tests__/ssr.test.ts` runs in a **Node environment** (no DOM):
it imports the whole library and **server-renders every registered component**
to a string. If any module touches `window`/`document` at import — or a
component reaches for the DOM during render — this test fails. This is the
"SSR-safe" guarantee turned into a gate, and it resolves Open Decision 4 at the
"SSR-safe so it works" level (Nuxt runs on the same Vue SSR path; a dedicated
Nuxt module is a fast-follow, not a blocker).

## Performance budgets

`tools/check-bundle-size.mjs` tracks the gzipped size of each shipped bundle
against a ceiling (run in CI via `pnpm size`). Current:

- `@rukkiecodes/vue` full barrel: ~39 kB gz (apps tree-shake to a fraction)
- `@rukkiecodes/vue` CSS: ~11 kB gz
- `@rukkiecodes/shaders` entry: ~4 kB gz; the WebGL runtime is a **lazy ~1.3 kB-gz
  chunk** loaded only on first on-screen use
- `@rukkiecodes/tokens` CSS: ~1.2 kB gz

## Accessibility

`tools/a11y-check.mjs` runs **axe-core** over the docs pages in light + dark
(`pnpm a11y`, against a running preview). It fails on `critical` and tracks
`serious` for design triage.

**Fixed (library level):**

- Form-control labelling — `FField` now owns a stable id, binds the `<label for>`
  to the slotted control, and passes the id down via a scoped slot (`FInput`,
  `FTextarea` consume it). The `label` critical class is cleared.
- Global icon buttons (theme toggle, docs example toolbar) have accessible names.
- Chart has a text alternative (`role="img"` + `aria-label`); decorative goo/
  shader canvases are `aria-hidden`.

**Backlog (tracked, not yet green):**

- `button-name` — icon-only buttons inside docs **demos** (the card showcase,
  the button playground) need per-demo `aria-label`s. These are documentation
  content, not a library gap (an icon button's name is the consumer's call).
- `FSelect` is a `div`-based combobox; it needs `role="combobox"` +
  `aria-labelledby`/`aria-label` rather than `for`/`id`.
- `color-contrast` (serious) — muted text (medium-emphasis ~0.6 opacity, code
  spans) falls under AA in places. This is a design-token decision (bump the
  muted opacity / token) to make deliberately, not a mechanical sweep.

`pnpm a11y` is wired as a reporting command; it is **not** in the blocking CI
gate until the demo-button and contrast backlog is burned down.

## Tokens

No hard-coded design values in components — the Batch 14 single-source rule.
The Batch 18 sweep replaced the remaining `FCard`/`FAlert` literal radii with
`var(--fui-radius-*)` (pixel-identical). Bespoke per-size button radii and
one-off compound radii are intentional, not debt.

## Reduced motion / transparency

Every signature effect has a static fallback and a reduced-motion path: `FGlass`
(reduced-transparency → opaque; reduced-motion → no press transition), `FGoo`
(settles to a static frame), `@rukkiecodes/shaders` (the CSS fallback _is_ the
reduced-motion path; the GL loop also pauses on `visibilitychange`).

## Release

Changesets + semver are in place, and the packages are **published to npm** under
the `@rukkiecodes` scope (`@rukkiecodes/vue`, `tokens`, `native`, `shaders`,
`icons`, plus `create-fusionui`). Publishing still requires explicit, fresh
authorization and credentials at release time — see the memory note on the
release flow. Use `pnpm -r publish`, never `npm publish`: pnpm is what rewrites
the `workspace:*` dependencies into real versions.
