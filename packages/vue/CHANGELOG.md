# @rukkiecodes/vue

## 0.15.0

### Minor Changes

- Complete the Vuetify-parity component set — 58 new components, taking the library
  from 60 to 118.

  **Data:** `FDataTable` and `FDataTableServer` (sorting incl. multi-sort,
  pagination, selection with an indeterminate select-all, expandable rows,
  grouping, search, loading/empty states; the two share one render module so the
  client and server tables can never drift), `FDataIterator`, `FTreeview`,
  `FVirtualScroll`, `FInfiniteScroll`, `FSparkline`.

  **Inputs:** `FAutocomplete`, `FCombobox`, `FDatePicker`/`FDateInput`,
  `FTimePicker`/`FTimeInput`, `FColorPicker`/`FColorInput`, `FCalendar`,
  `FRating`, `FRangeSlider`, `FConfirmEdit`.

  **Selection groups & navigation:** `FItemGroup`/`FItem`, `FBtnToggle`,
  `FChipGroup`, `FWindow`, `FSlideGroup`, `FExpansionPanels`, `FFab`,
  `FSpeedDial`, `FBottomNav`, `FBottomSheet`, `FPullToRefresh`.

  **Surfaces, feedback & utilities:** `FSheet`, `FBanner`, `FSkeleton`,
  `FTimeline`, `FKbd`, `FCode`, `FFooter`, `FSystemBar`, `FParallax`, `FLabel`,
  `FMessages`, `FCounter`, `FIconBtn`, `FThemeProvider`, `FDefaultsProvider`,
  `FHover`, `FLazy`, `FResponsive`, `FNoSsr`.

  Everything is token-driven, SSR-safe, keyboard accessible and honours
  `prefers-reduced-motion`. The date, time and colour pickers add no dependencies —
  their maths is implemented in-package.

  ### Fixes
  - **Design tokens were not all emitted.** `@rukkiecodes/vue/styles` declared only
    a subset of the token set as CSS custom properties: `--fui-space-1…7`,
    `--fui-font-family-mono`, `--fui-hover-opacity`, the elevation ramp and the
    z-index scale were missing. A `var()` that is read but never defined makes its
    whole declaration invalid, so `padding: var(--fui-space-4)` resolved to _no
    padding at all_. The stylesheet now emits the full set.
  - **Borders using `--fui-border-color` were not drawn.** It is an RGB triplet, so
    `border: 1px solid var(--fui-border-color)` is invalid; these now use
    `rgba(var(--fui-border-color), …)`.
  - **A selected `FChip` was invisible.** It applied the theme's `text-*` utility,
    which is injected `!important` into the last cascade layer and therefore beat
    the chip's own selected-state colour, rendering primary text on a primary fill.
    `FChip` now carries its colour on `--fui-variant-color`/`--fui-variant-on` (the
    `FBtn` pattern) instead of the utility classes.
  - **`FAutocomplete`/`FCombobox` never emitted `update:search`** — the event was
    declared but `emit` was never passed into the shared core, so a server-side
    filter had nothing to listen to.
  - **`FDataTable`/`FDataTableServer` never emitted `click:row`** — declared in
    `emits`, but the row handler only toggled expansion.

### Patch Changes

- Updated dependencies
  - @rukkiecodes/tokens@0.2.0

## 0.14.0

### Minor Changes

- Complete the Vuetify-parity utility-class system. A shared data-driven generator
  now emits the full catalog of global helper classes — spacing (`m*`/`p*` incl.
  auto and negatives), sizing (`w-*`/`h-*`, `fill-height`), borders + radius
  (`border*`, `rounded*`, per-side/corner via logical properties),
  text/typography (align, weight, transform, decoration, wrap/truncate, emphasis,
  mono), position, inset, cursor, opacity, overflow, float, and elevation — each
  with responsive `-sm`/`-md`/`-lg`/`-xl`/`-xxl` variants where applicable. Docs
  gain a dedicated "Utility classes" section with a page per category.

## 0.13.0

### Minor Changes

- Add the layout grid system — `FContainer`, `FRow`, and `FCol`. A Vuetify-style
  12-column flexbox grid: a centered/fluid container, a row that owns the gutter
  (token-driven density gutters, `no-gutters`, `gap`, custom `columns`, and
  per-breakpoint `align`/`justify`/`align-content`), and gap-aware responsive
  columns (`cols` + `sm`/`md`/`lg`/`xl`/`xxl` spans, `auto`, `n/total` totals,
  `offset`, `order` incl. `first`/`last`, and `align-self`). SSR-safe — layout
  resolves entirely in CSS.

- Add a responsive flexbox utility layer — global helper classes (`d-flex`,
  `flex-row`/`column`, `flex-fill`, `justify-*`, `align-*`, `align-content-*`,
  `align-self-*`, `order-*`, and `ga-*`/`gr-*`/`gc-*` gaps), each with
  `-sm`/`-md`/`-lg`/`-xl`/`-xxl` breakpoint variants. Generated data-driven from
  a `$utilities`-style map, matching Vuetify's flex helpers.

## 0.12.0

### Minor Changes

- **FCarousel lightbox: zoom & pan.** The fullscreen lightbox is now a zoomable image viewer — zoom with the on-screen buttons, the scroll wheel or a double-click (1–4×), then drag to pan when zoomed. Adds `+` / `-` / `0` keyboard shortcuts, clamps panning to the image bounds, and resets zoom when the slide changes or the lightbox closes.

## 0.11.0

### Minor Changes

- **FCarousel: fullscreen `lightbox` mode.** Add the `lightbox` prop — clicking a slide (or the new expand button) opens the image in a fullscreen overlay with its own prev/next arrows, counter and thumbnail strip. Supports arrow-key navigation, <kbd>Esc</kbd> / backdrop-click to close, body scroll-lock, and a shared active index with the inline carousel.

## 0.10.0

### Minor Changes

- Add `FImage` and `FCarousel` (with `FCarouselItem`).

  - **FImage** — a responsive image in the spirit of Vuetify's `v-img`: lazy loading with a blur-up `lazy-src` placeholder, `cover`/`contain`, `aspect-ratio`, dimensions, `gradient` overlay, `eager`, fade-in on load, and `#placeholder` / `#error` slots plus `load` / `error` events.
  - **FCarousel** / **FCarouselItem** — a carousel in the spirit of `v-carousel`: `cycle`, `interval`, `continuous`, `show-arrows` (`true`/`false`/`'hover'`), `hide-delimiters`, `delimiter-icon`, `progress`, `height`, `prev`/`next` slots, swipe and keyboard navigation. Slides render through `FImage`. Adds FusionUI conveniences: an `items` prop, a `thumbnails` strip, and a `counter`.

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
