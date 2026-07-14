# Changelog

Every release is recorded with [Changesets](https://github.com/changesets/changesets)
and tagged in the repository. The canonical, per-release detail lives in the
package changelogs; this page is the narrative summary.

- [`@rukkiecodes/vue` changelog](https://github.com/rukkiecodes/fusionui/blob/main/packages/vue/CHANGELOG.md)
- [Release tags](https://github.com/rukkiecodes/fusionui/tags) —
  one per published version, e.g. `@rukkiecodes/vue@0.15.0`
- [The package on npm](https://www.npmjs.com/package/@rukkiecodes/vue)

FusionUI is pre-1.0, so a minor bump may contain a breaking change. Read the
entry before you upgrade.

## `@rukkiecodes/vue`

### 0.15.0 — the complete component set

The largest release so far: **58 new components**, taking the library from 60 to 118. Data components (`FDataTable` and `FDataTableServer` — sharing a single
render module so the client and server tables cannot drift — plus
`FDataIterator`, `FTreeview`, `FVirtualScroll`, `FInfiniteScroll`,
`FSparkline`), the remaining inputs (`FAutocomplete`, `FCombobox`, the date, time
and colour pickers, `FCalendar`, `FRating`, `FRangeSlider`, `FConfirmEdit`),
selection groups and navigation (`FItemGroup`, `FBtnToggle`, `FChipGroup`,
`FWindow`, `FSlideGroup`, `FExpansionPanels`, `FFab`, `FSpeedDial`, `FBottomNav`,
`FBottomSheet`, `FPullToRefresh`), and a long tail of surfaces, feedback and
utility components. The pickers add no dependencies — their maths is implemented
in-package.

It also fixed a set of real bugs, the worst of which was structural: the
stylesheet declared only a subset of the token set as CSS custom properties, and
a `var()` that is read but never defined invalidates its whole declaration — so
`padding: var(--fui-space-4)` resolved to _no padding at all_. The full token set
is now emitted. Alongside it: borders built on the `--fui-border-color` RGB
triplet now go through `rgba()`, a selected `FChip` is no longer invisible
(the theme's `!important` utility classes were beating its own selected-state
colour), and `FAutocomplete` / `FCombobox` / `FDataTable` now actually emit the
`update:search` and `click:row` events they had always declared.

Shipped with `@rukkiecodes/tokens` 0.2.0.

### 0.14.0 — the utility-class system

A data-driven generator now emits the full catalog of global helper classes:
spacing (`m*` / `p*`, including auto and negative values), sizing, borders and
radius, text and typography, position, inset, cursor, opacity, overflow, float
and elevation — each with responsive `-sm` / `-md` / `-lg` / `-xl` / `-xxl`
variants where they make sense. The docs gained a
[Utility classes](/utilities/spacing) section with a page per category.

### 0.13.0 — the layout grid

`FContainer`, `FRow` and `FCol` — a 12-column flexbox grid with token-driven
gutters, `no-gutters`, custom `columns`, per-breakpoint alignment, and gap-aware
responsive columns (`cols` plus `sm` … `xxl` spans, `auto`, `offset`, `order`,
`align-self`). Layout resolves entirely in CSS, so it is SSR-safe. Released with
the responsive flexbox utility layer (`d-flex`, `justify-*`, `align-*`,
`order-*`, the `ga-*` gap helpers) and their breakpoint variants.

### 0.12.0 and 0.11.0 — the carousel lightbox

0.11.0 added `FCarousel`'s fullscreen `lightbox` mode: clicking a slide opens it
in an overlay with its own arrows, counter and thumbnail strip, arrow-key
navigation, <kbd>Esc</kbd> and backdrop-click to close, and a body scroll lock.
0.12.0 turned that overlay into a proper image viewer — zoom via buttons, the
scroll wheel or a double-click (1–4×), drag to pan with the pan clamped to the
image bounds, and `+` / `-` / `0` keyboard shortcuts.

### 0.10.0 — images and the carousel

`FImage` — lazy loading with a blur-up `lazy-src` placeholder, `cover` /
`contain`, `aspect-ratio`, a `gradient` overlay, fade-in on load, and
`#placeholder` / `#error` slots — and `FCarousel` / `FCarouselItem`, with
`cycle`, `continuous`, swipe and keyboard navigation, a thumbnail strip and a
counter.

### 0.9.0 — the signature switch

`FSwitch` reworked around a new toggle animation: a coloured circle wipes in
from the left to fill the track, the thumb slides with an active stretch, and the
track presses in on tap — with square, indeterminate and icon variants, and a
reduced-motion path.

### 0.8.0 — notifications

The snackbar service. `useNotify()` pushes toast notifications that reveal with a
`clip-path` circle animation and stack in six screen positions, with `color`,
`border`, `icon`, `progress`, `loading` and duration options, plus
`notify.success` / `error` / `warning` / `info` shorthands. See
[Notification](/components/notification).

### 0.2.0 – 0.7.5

These versions were published without per-release changelog entries; the commit
history is the record for them. It is the stretch where the layout and app-shell
system landed (`FLayout`, `FMain`, `FHero`, `FSection`, `FAuthLayout`) along with
the teleporting `FMenu`, and — across the repository rather than the library
alone — where the documentation became agent-readable (raw Markdown and JSON for
every page, `llms.txt`) and `create-fusionui` got its polished starter template.

### 0.1.0 — initial public release

FusionUI 0.1.0: a soft, modern Vue 3 design library — a distinctive look on
serious engineering, blended with Apple-style typography and whitespace —
50+ components, the Feather icon set, the programmatic notify / dialog / loading
services, the documentation site, and the `npm create fusionui` scaffolder.

## The other packages

`@rukkiecodes/tokens` is at **0.2.0** — it exposes the stacking-order scale to
SASS as `$fui-z-index` alongside the CSS custom properties it already emitted, so
`@rukkiecodes/vue` can declare the `--fui-z-*` variables in its own stylesheet
and a component reading `var(--fui-z-menu)` always finds it defined.

`@rukkiecodes/native` (**0.1.1**),
`@rukkiecodes/icons` (**0.1.0**) and `create-fusionui` (**0.1.2**) are all still
close to their initial release. Their changelogs live beside each package in the
[repository](https://github.com/rukkiecodes/fusionui/tree/main/packages).
