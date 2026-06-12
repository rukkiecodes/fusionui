# Batch 03 — Theme System & Design Tokens (Vuesax Visual DNA)

> ⚠️ **Token values updated.** The concrete colors/radii/shadows below were
> revised to the **Vuesax v4 × Apple** language — see
> [`design-language.md`](./design-language.md) for the authoritative catalog
> (primary `#195BFF`, radii 8/12/20, blue-gray `#2C3E50` text, colored
> `0 10px 20px -10px` hover lift, Apple/SF + Inter font). The architecture below
> is unchanged.

**Depends on:** 01 · **Blocks:** 05, 06, 07, 08 · **Parallel with:** 02, 04

## Goal
Build the theming engine (CSS-variable generation, light/dark, named + custom
colors, runtime theme switching) using **Vuetify's architecture** but seeded with
**Vuesax's design tokens** so everything that renders looks like Vuesax: soft
shadows, gentle radii, smooth `ease` transitions, lift-on-hover.

## Deliverables
1. `createTheme()` composable + `ThemeInstance` (port of Vuetify `composables/theme.ts`).
2. CSS-variable generator emitting `--vd-theme-*` and `--vd-*` design tokens into
   a managed `<style>` / head injection, wrapped in `@layer`.
3. Default light & dark themes seeded with Vuesax colors.
4. The SASS settings/tools layer: `styles/settings/*`, `styles/tools/*`,
   `styles/main.sass`, utilities (`.bg-*`, `.text-*`, `.border-*`, elevation,
   rounded).
5. **Vuesax token catalog** baked into settings (shadows, radii, transitions).
6. `useTheme()`, `provideTheme()`, `theme.change()`, `theme.toggle()`.

## File layout
```
packages/vue-dl/src/
├── composables/theme.ts
└── styles/
    ├── settings/
    │   ├── _colors.scss
    │   ├── _elevation.scss     # Vuesax soft-shadow scale
    │   ├── _variables.scss     # radii, transitions, spacing
    │   └── _index.scss
    ├── tools/
    │   ├── _layer.scss
    │   ├── _elevation.scss
    │   ├── _states.scss        # hover/focus overlay states
    │   ├── _variant.scss       # filled/border/flat/line/gradient/relief
    │   └── _index.scss
    ├── utilities/              # generated atomic classes
    ├── main.sass               # full bundle
    └── core.scss               # settings+tools only (for consumers)
```

## Implementation notes

### Theme instance (port of Vuetify `theme.ts`)
- `genCssVariables(theme, 'vd-')` emits:
  - `--vd-theme-primary: 31,116,255` (raw RGB triplets so components do
    `rgb(var(--vd-theme-primary))` and can add alpha).
  - `--vd-theme-on-primary` (auto contrast via YIQ/luma — port Vuesax
    `contrastColor` + Vuetify on-color generation).
  - overlay multipliers per color.
- Output wrapped: `@layer vd-theme { :root { … } .vd-theme--dark { … } }`.
- Inject via `<style id="vue-dl-theme">` (use `@unhead/vue` if present, else a
  managed style element — exactly Vuetify's fallback).
- `theme.change(name)` / `theme.toggle(['light','dark'])` reactive switching.

### Vuesax design tokens → SASS settings (THE look)
Port these literal values from Vuesax `src/style/{colors,vars,mixins}.styl`:

```scss
// settings/_colors.scss  (Vuesax v4 palette — see design-language.md)
$vd-colors-light: (
  primary:   #195bff,   // Vuesax v4 blue
  secondary: #7d33ff,   // violet
  success:   #46c93a,   // green
  danger:    #ff4757,   // red
  warning:   #ffba00,   // amber
  dark:      #1e1e1e,
  light:     #f4f7f8,   // gray-2 surface
  background: #ffffff,
  surface:    #ffffff,
  on-surface: #2c3e50,  // refined blue-gray body text (NOT pure black)
);

// settings/_variables.scss  (Vuesax v4 × Apple: softer corners)
$vd-radius-sm: 8px;     // small controls, list items
$vd-radius-md: 12px;    // buttons, inputs, select, menus (default)
$vd-radius-lg: 20px;    // cards, popups
$vd-radius-xl: 28px;
$vd-transition-duration: .25s;
$vd-transition-timing: ease;        // Vuesax uses plain ease, not cubic-bezier
$vd-transition: all $vd-transition-duration $vd-transition-timing;

// Apple/SF first, Inter fallback (the headline typographic cue)
$vd-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter',
  'Segoe UI', Roboto, sans-serif;
$vd-letter-spacing: -0.011em;

// settings/_elevation.scss  (the signature "Vuesax shadow")
$vd-shadow-rest:  0 5px 20px 0 rgba(0,0,0,.05);   // very soft default
$vd-shadow-hover-spread: 0 10px 20px -10px;       // + color → colored lift on hover
$vd-shadow-floating: 0 8px 20px -6px;             // + color → floating variant
```

The input surface uses a subtle gray fill (`surface-2` = `#f4f7f8`) with a 2px
**transparent** border that colors on focus — the Vuesax v4 input look.

### Variant tool (port Vuesax button modes into SASS mixin)
`tools/_variant.scss` implements the six Vuesax button looks as a reusable mixin
so VdBtn (Batch 05) and others consume it:
- **filled** — solid bg, on-hover colored soft shadow `0 8px 25px -8px <color>`.
- **border** — 1px border, 8% alpha bg on hover, ripple persists.
- **flat** — no border, 8% alpha hover bg.
- **line** — bottom accent that expands from origin; text lifts `translateY(-2px)`.
- **gradient** — `linear-gradient(<dir>, c1, c2)` + subtle text-shadow.
- **relief** — inset bottom shadow (3D), sinks `3px` on `:active`.

### Hover-lift / states tool
`tools/_states.scss` provides the card/button "lift": on hover apply
`$vd-shadow-hover` with the component's color and the small transform Vuesax uses.
Keep transitions on `$vd-transition`.

### Utilities
Generate `.bg-primary`, `.text-primary`, `.border-primary`, `.elevation-{n}`,
`.rounded-{sm,md,lg}` from the theme at build (Vuetify pattern). Components use
these + CSS vars; consumers get them for free.

## Acceptance criteria
- `createVueDL({ theme: { defaultTheme: 'dark' } })` flips `--vd-theme-*` vars and
  the `.vd-theme--dark` class on the root.
- A test div with `class="bg-primary text-on-primary"` renders Vuesax blue with
  correct contrast text.
- `useTheme().toggle()` swaps light/dark at runtime without reload.
- Shadows/radii/transitions visibly match Vuesax sample screenshots.

## Risks
- Auto contrast (`on-*`) for arbitrary custom colors must be correct or text
  becomes unreadable — unit-test the luma threshold against Vuesax's `contrastColor`.
- Keep theme CSS in a low-priority `@layer` so consumer overrides win.
