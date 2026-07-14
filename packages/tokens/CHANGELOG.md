# @rukkiecodes/tokens

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
