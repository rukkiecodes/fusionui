# Why FusionUI

Most component libraries optimise for safe and familiar — another Material or
Bootstrap clone, competent and forgettable. The ones that look distinctive tend
to trade away the engineering: shaky accessibility, no SSR story, a theming
system that fights you the moment your brand isn't the default blue.

FusionUI refuses that trade. It wants both: a distinctive look — soft shadows,
gentle radii, ripples, lift-on-hover — on serious engineering, with the WAI-ARIA
patterns implemented properly, an SSR story that holds, and a token system that
is the single source of truth for both web and mobile.

<Example file="button/variants" />

## One design language, two runtimes

You cannot run a Vue component inside React Native, and FusionUI does not
pretend otherwise. "The same components everywhere" is implemented honestly, as
three shared layers and two implementations:

- **Token values** — colour, spacing, type, radii, motion, elevation — authored
  once in `@rukkiecodes/tokens` and generated for CSS, SASS, TypeScript and
  React Native.
- **Component contracts** — the same names, props, variants and states.
  `<f-btn variant="primary" loading>` on the web and
  `<FButton variant="primary" loading>` on mobile are the same component in two
  languages.
- **Interaction and accessibility semantics**, plus the visual identity.

Only the rendering code is reimplemented per platform. Unit tests assert that
the native variant unions are subsets of their web counterparts, so the two
sides cannot silently drift. See the
[mobile documentation](https://rukkiecodes.github.io/fusionui-mobile/) for the
React Native components.

## A signature visual layer that always degrades

The differentiator is real GPU work used deliberately: liquid glass
([`FGlass`](/components/liquid-glass) — a signed-distance field resolved into
surface normals, then Snell refraction and displacement), metaball physics
([`FGoo`](/components/goo)). On mobile the same maths runs
through Skia, or through iOS 26's `UIGlassEffect` where it exists.

The discipline around it matters more than the effects themselves. Every effect
must have:

1. a **static CSS fallback** — the component is fully usable if WebGL is
   unavailable, blocked, or the device is weak;
2. a **`prefers-reduced-motion` path** — motion stops, the surface stays;
3. a reason it improves the component, beyond decoration.

Both effects paint their fallback first and upgrade only where the browser
genuinely supports the real thing; both pause off-screen and on
`visibilitychange`, so neither is ever in the critical path. No component
_requires_ an effect to function.

## Accessibility is a blocker, not a backlog item

A component is not "done" until keyboard support, screen-reader semantics, focus
management and reduced-motion all pass. That is a gate in the workflow, not a
follow-up ticket. `pnpm a11y` runs axe-core over the docs in both themes.

The honest part: it fails the build on `critical` violations and reports
`serious` ones for triage, and there is a backlog it has not burned down yet —
`FSelect` still needs proper `combobox` roles, some muted text falls under AA
contrast, and icon-only buttons inside the docs demos need names. That backlog
is written down in
[`HARDENING.md`](https://github.com/rukkiecodes/fusionui/blob/main/HARDENING.md)
rather than quietly ignored.

## Tokens are the single source of truth

No hard-coded hex or px values in components — ever. Themes are token overrides
riding on CSS custom properties (`--fui-*`), switched at runtime by setting
variables on a root scope: zero re-render, SSR-safe, and brands re-skin without
forking component source. The same token source feeds the React Native theme
provider, so a re-brand lands on both platforms at once. See
[Design Tokens](/getting-started/design-tokens).

## SSR-safe by construction

Nothing touches `window` or `document` at module load. This is not a promise, it
is a test: the suite server-renders **every registered component** to a string in
a Node environment with no DOM. A module that reaches for the browser at import
time fails CI. That is why FusionUI works in Nuxt with a plugin and a stylesheet
import — no bespoke module required.

## What FusionUI is not

Scope discipline is part of the design.

- **Not a state manager, a router, or a data-fetching layer.** FusionUI is
  presentational and design-system concerns only. The scaffolder can wire up
  Pinia, Vue Router or VueUse for you, and you can delete any of them without
  touching FusionUI.
- **Not a Material, Ant or Bootstrap clone.** The look is deliberately its own.
- **Not a write-once-run-everywhere codebase.** Shared tokens and contracts —
  not the same `.vue` files running on a phone.
- **Not a Vue 2 library.** Vue 3 with `<script setup>` is the only first-class
  path; the Options API is not a supported target.
- **Not a CSS-in-JS framework.** Co-located SASS plus CSS custom properties.

## The honest caveat

FusionUI is pre-1.0. It is young, and the API can still change in a minor
release. If what you need is a decade of production mileage and an ecosystem to
match, one of the long-established Vue frameworks is the safer call —
[Is FusionUI for you?](/introduction/comparison) says so plainly.
