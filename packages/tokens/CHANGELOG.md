# @rukkiecodes/tokens

## 0.3.0

### Minor Changes

- Every palette color now ships a full shade ramp — `50` through `900`.

  The ramp is **derived** from the palette rather than hand-authored, so a shade can
  never drift from the color it belongs to: step `500` IS the base color, and a test
  asserts it.

  Available in all three outputs:

  ```css
  /* CSS custom properties — RGB triplets, like every other color token,
     so alpha works on them too. */
  .callout {
    background: rgb(var(--fui-primary-50));
    border-inline-start: 3px solid rgb(var(--fui-primary-500));
    color: rgb(var(--fui-primary-800));
  }
  .callout:hover {
    background: rgba(var(--fui-primary-100), 0.6);
  }
  ```

  ```ts
  import { shades, palette } from '@rukkiecodes/tokens'

  shades.primary[700] // '#1242b8'
  palette.primary // '#195bff'  (=== shades.primary[500])
  ```

  SASS gets `settings.$fui-shades`.

  Note the ramp is **not** theme-aware: unlike `--fui-theme-*` these are fixed values
  that do not change between light and dark. Reach for `--fui-theme-primary` when you
  mean "the brand color", and `--fui-primary-300` when you mean that specific tint.

## 0.2.0

### Minor Changes

- Expose the stacking-order scale to SASS as `$fui-z-index`, alongside the CSS
  custom properties it already emitted. `@rukkiecodes/vue` needs it at build time
  so its stylesheet can declare `--fui-z-*` itself — a component reading
  `var(--fui-z-menu)` has to find it defined even when the consumer imports only
  the vue package's stylesheet.

## 0.1.0

### Minor Changes

- 68b6a9e: Initial public release of FusionUI — a Vue 3 design library with the engineering
  stability of Vuetify and the look of Vuesax v4, blended with Apple-style
  typography and whitespace. Includes 50+ components, the Feather icon set,
  programmatic notify/dialog/loading services, a documentation site, and the
  `npm create fusionui` scaffolder.
