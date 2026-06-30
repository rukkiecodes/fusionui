# @rukkiecodes/vue

## 0.9.0

### Minor Changes

- Rework `FSwitch` with the vuesax-style toggle animation: a colored circle slides in from the left to fill the track with a circular wipe, the thumb slides with an active "stretch", and the track presses in (`scale`) on tap. Adds a `__bg` element; tunes track/thumb sizing, the on-state thumb glow, square + indeterminate + icon variants, and reduced-motion handling.

## 0.8.0

### Minor Changes

- Add the **Notification** (snackbar) service. `useNotify()` pushes toast notifications that reveal with a clip-path circle animation and stack in six screen positions. Supports `color`, `border`, `flat`, `square`, `icon`, `progress`, `loading`, `width`, `notPadding`, `clickClose`, `duration`/sticky, plus `notify.success`/`error`/`warning`/`info` shorthands. Design, transition and animation modelled on the vuesax notification.

## 0.1.0

### Minor Changes

- 68b6a9e: Initial public release of FusionUI — a Vue 3 design library with the engineering
  stability of Vuetify and the look of Vuesax v4, blended with Apple-style
  typography and whitespace. Includes 50+ components, the Feather icon set,
  programmatic notify/dialog/loading services, a documentation site, and the
  `npm create fusionui` scaffolder.

### Patch Changes

- Updated dependencies [68b6a9e]
  - @rukkiecodes/icons@0.1.0
  - @rukkiecodes/tokens@0.1.0
