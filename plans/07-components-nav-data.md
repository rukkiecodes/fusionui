# Batch 07 — Components C: Navigation, Layout, Overlays & Data

**Depends on:** 02, 03, 04 · **Parallel with:** 05, 06

## Goal
Port the structural, overlay, and data components. This batch includes the
**overlay primitive** (`VdMenu`/`VdOverlay`) that Select (B06) and the
programmatic services (B08) depend on, so prioritize it early.

## Components
- **Overlay core:** `VdOverlay`, `VdMenu`, `VdTooltip`, `VdPopup` (modal/dialog
  shell), `VdDropdown`.
- **Navigation:** `VdNavbar`, `VdSidebar` (drawer), `VdTabs` (+ `VdTab`,
  `VdTabPanel`), `VdBreadcrumb`, `VdPagination`.
- **Layout/disclosure:** `VdList` (+ items/groups), `VdCollapse` (accordion),
  `VdContainer`/`VdRow`/`VdCol` (grid, optional).
- **Data:** `VdTable` (sorting, selection, pagination, slots).

## Implementation notes

### Overlay core (build first)
- `VdOverlay`: teleport to body, scrim, transitions, scroll-lock, focus-trap,
  `v-model` open state, `click-outside` (directive from B02) to close.
- Positioning: a `useLocationStrategies`-style composable (anchor element +
  preferred side/align, flip on collision). Keep it small but reusable; `VdMenu`,
  `VdTooltip`, `VdDropdown`, and `VdSelect` (B06) all consume it.
- `VdTooltip`: hover/focus trigger, delay, Vuesax soft shadow + small arrow.
- `VdPopup`: dialog shell (header/body/footer slots, `closable`, persistent,
  sizes) — also the base used by the dialog service (B08).

### Navigation
- `VdNavbar`: fixed/sticky, color, shadow on scroll, slots (brand, links,
  actions), responsive collapse to a `VdSidebar` toggle.
- `VdSidebar`: left/right drawer, temporary/permanent/rail, mini variant,
  overlay on mobile, grouped `VdList` content.
- `VdTabs`: the Vuesax animated underline that slides between active tabs
  (measure tab rects, transition the indicator); `color`, `alignment`, `grow`,
  panels via `VdTabPanel`.
- `VdBreadcrumb`: items + Feather `chevron-right` divider, router links.
- `VdPagination`: page buttons, prev/next/first/last (Feather chevrons), ellipsis,
  `total`/`modelValue`, `color`.

### Disclosure / layout
- `VdList`: items, two-line/three-line, prepend/append (icon/avatar/action),
  selectable, nested groups (use `group` composable).
- `VdCollapse`: accordion with smooth height animation (animate to scrollHeight,
  Vuesax-style), single/multiple open.
- `VdContainer/Row/Col`: 12-col fl/grid + breakpoints from the `display`
  composable (B02). Optional if consumers prefer their own layout.

### VdTable
- Columns config, header slots, cell slots, client-side sort, row selection
  (checkbox via B06), pagination footer (`VdPagination`), loading state
  (`VdProgress`), empty slot, sticky header. Server-mode hooks (events for
  sort/page) for large data.

## Deliverables
- All components above; overlay primitive documented and reused.
- Example `.vue` files (B09) and unit tests (open/close, keyboard, sort).

## Acceptance criteria
- Overlay closes on outside-click/Esc, traps focus, locks scroll, teleports.
- Tabs indicator animates smoothly; Sidebar drawer works temporary + permanent.
- Table sorts, selects rows, paginates; slots override cells.
- Tooltip/Menu/Dropdown reposition on viewport collision.

## Risks
- Collision-aware positioning is the trickiest piece; consider wrapping
  `@floating-ui/dom` instead of hand-rolling, to save time and edge-case bugs.
- Focus-trap + scroll-lock must be robust for accessibility — reuse a vetted
  approach rather than improvising.
