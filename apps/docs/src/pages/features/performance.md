# Performance & Bundle Size

Every commit to FusionUI is measured. `tools/check-bundle-size.mjs` gzips each
shipped artefact, compares it against a ceiling, and exits non-zero if it is over
— and CI runs it after the build on every push and every pull request. The
numbers below are those budgets, not estimates.

## The budgets

| Artefact                    | Ceiling (gzip) | What it is                                                          |
| --------------------------- | -------------- | ------------------------------------------------------------------- |
| `@rukkiecodes/vue` — JS     | 125 kB         | the full barrel: all 133 components, every composable and directive |
| `@rukkiecodes/vue` — CSS    | 46 kB          | the whole stylesheet: components + the utility layer                |
| `@rukkiecodes/tokens` — CSS | 3 kB           | the design tokens as custom properties                              |

The library currently sits a little under each of those. The ceilings are set
with roughly 5% headroom, so a real regression trips them; loosening one takes a
reason in review.

The JS figure is the number worth understanding. It is the **whole library** —
133 components at around 0.9 kB gz each, plus the composables underneath them. It
is not a per-route cost, and it is not the price of a button; it is the price of
having every component. When 58 components landed at once, that number went from
62 to 119 kB gz without the per-component cost moving at all. There is simply
more library.

## Tree-shaking

The published build is ESM, and `sideEffects` is declared as CSS and SCSS only,
so a bundler is free to drop any JavaScript export you never reference. Importing
a component by name gives you that component and the composables it uses, and
nothing else — a build whose only FusionUI import is `FBtn` keeps about 5 kB gz
of the barrel.

Global registration is the thing that pulls the rest in. `createFusionUI()`
registers every built-in component on the app so that `<f-btn>` works in any
template with no import, and a bundler cannot prove that a map it iterates over is
partly unused. So the convenience has a price, and the price is the full barrel:
that is exactly why the budget tracks the full barrel rather than a synthetic
minimal app. What the budget buys you is that the ceiling stays where it is, and
that CI notices the day it doesn't.

The signature visual layer (`FGlass`, `FGoo`) is counted inside that barrel — it
is part of `@rukkiecodes/vue`, not a separate download — but it costs nothing at
runtime until you render one, and nothing at all to a user who has asked for
reduced motion.

## The CSS layer

The stylesheet is a single global import:

```ts
import '@rukkiecodes/vue/styles'
```

It is **not** tree-shaken, and it cannot be: the utility classes
([spacing](/utilities/spacing), [flexbox](/utilities/flexbox),
[sizing](/utilities/sizing), and the rest) are generated across six breakpoints
and only exist as CSS. They dominate the stylesheet — which is why adding 58
components grew the CSS by about 6 kB gz while growing the JS by 57 kB gz.

Treat the CSS as a fixed cost you pay once, on the first load, and then never
again: it is one file, it caches, and it does not grow with your app. If you
never touch the utility classes, it is still the same file — the ceiling is
what it is.

## The visual layer never blocks paint

The GPU layer is the most expensive thing FusionUI can do, so it is the most
carefully gated. `FGlass` paints its **static fallback immediately** — a
`blur` + `saturate` frost with the rim and bevel still drawn — and only upgrades
to real refraction where the browser genuinely supports an SVG displacement map
inside `backdrop-filter`. `FGoo` settles its field to a single resting frame and
renders it statically under `prefers-reduced-motion`, so the shape survives and
the motion does not.

Both pause when they scroll off-screen (an `IntersectionObserver` decides), so an
effect below the fold costs nothing at all.

## Effects pause when nobody is watching

A running effect is a running `requestAnimationFrame` loop, and an animation
nobody can see is pure battery drain. The same `IntersectionObserver` that starts
an effect stops it: scroll the surface off screen and the loop stops; scroll it
back and it resumes. A `visibilitychange` listener covers the case the observer
can't — a surface still on screen in a tab you have backgrounded. The loop is
also FPS-capped (30 by default) rather than running as fast as the display will
let it.

The same primitives are exported for your own content:
[`FLazy`](/components/rendering) defers rendering until an element is near the
viewport, and the `v-intersect` directive is the observer, unwrapped.

## Enforced, not aspirational

```bash
pnpm build && pnpm size
```

That is what CI runs — on Linux and Windows, on Node 20 and 22 — alongside lint,
typecheck and the test suite. A commit that pushes any artefact over its ceiling
fails before it can be merged. The budgets are the contract; the numbers on this
page are what the contract currently permits.
