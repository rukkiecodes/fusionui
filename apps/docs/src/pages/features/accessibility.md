# Accessibility

Accessibility is treated as a blocker, not a backlog item: a component isn't
"done" until keyboard, screen reader, focus management and reduced motion all
pass. This page describes what is actually implemented, how it is checked, and —
at the bottom — what is still open. Nothing here is aspirational.

## The WAI-ARIA patterns

Composite widgets follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
pattern for what they are, rather than approximating it with clickable `div`s.

| Component                                                                                           | Pattern                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`FAutocomplete`, `FCombobox`](/components/autocomplete)                                            | **Combobox.** The input carries `role="combobox"`, `aria-autocomplete="list"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; the menu is a `listbox` of `option`s with `aria-selected`.                                                  |
| [`FTreeview`](/components/treeview)                                                                 | **Tree.** `role="tree"` over `treeitem`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (branches only), `aria-selected`, `aria-checked="mixed"` for a partially selected branch, and `aria-busy` while a lazy branch loads. Children sit in a `role="group"`. |
| [`FRating`](/components/rating)                                                                     | **Radio group.** The container is a `radiogroup`, each star a `radio` with `aria-checked`, `aria-setsize`, `aria-posinset` and its own spoken name (`"3 of 5"`).                                                                                                                    |
| [`FCalendar`](/components/calendar), [`FDatePicker`](/components/date-picker)                       | **Grid.** A real `role="grid"` — `row`, `columnheader`, `gridcell` — with one tabbable cell, each day labelled in full ("Monday, March 3, 2026") and today marked `aria-current="date"`.                                                                                            |
| [`FDataTable`](/components/data-table)                                                              | A semantic `<table>`: `<th scope="col">` headers carrying `aria-sort` (`ascending` / `descending` / `none`), with the sort control a real `<button>` rather than a click handler on the header.                                                                                     |
| [`FExpansionPanels`](/components/expansion-panels)                                                  | **Accordion.** Headers are buttons with `aria-expanded`; a collapsed panel's content is `inert`, so it leaves the tab order and the accessibility tree instead of being merely invisible.                                                                                           |
| [`FCheckbox`](/components/checkbox), [`FRadio`](/components/radio), [`FSwitch`](/components/switch) | Real `<input>` elements under the skin — checked state, labelling and screen-reader behaviour come from the platform, not from ARIA.                                                                                                                                                |
| [`FField`](/components/form-chrome)                                                                 | Owns a stable id, binds `<label for>` to the control it wraps and passes that id down via a scoped slot, so `FInput` / `FTextarea` are labelled without you doing anything. Validation messages render in an `aria-live="polite"` region.                                           |

## Keyboard

The conventions are consistent, so what you learn on one widget transfers:

- **Arrow keys move within a widget; Tab moves between widgets.** Composite
  controls use a **roving tabindex** — exactly one item is a tab stop, and the
  arrows move focus among the rest. `FRating`, `FTreeview`, `FCalendar` and
  `FDatePicker` all work this way.
- **Home / End** jump to the first and last item — the first and last star, the
  first and last visible tree node, the first and last option in an open
  autocomplete menu, the ends of a month.
- **Escape** closes the transient thing you're in — an open menu, a dialog, an
  overlay — without touching anything behind it.
- **Enter / Space** activate. In a tree, Space toggles a checkbox where there is
  one; `*` expands every sibling branch.
- **PageUp / PageDown** step the date picker a month at a time.
- The autocomplete opens on <kbd>↓</kbd> or <kbd>↑</kbd>, commits on Enter, closes
  on Tab, and — when multiple — removes the last selection on Backspace in an
  empty field.
- Disabled days in the date picker stay focusable (`aria-disabled`, not the
  `disabled` attribute), so arrow-keying across a month never silently skips
  cells.

Dialogs and overlays expose `role="dialog"` with `aria-modal="true"`, close on
Escape (unless `prevent-close` / `persistent`), and lock body scroll while open —
ref-counted, so stacked dialogs unlock cleanly, with padding compensating for the
removed scrollbar so the page doesn't shift. `FBottomSheet` additionally traps
Tab inside the sheet, moves focus into it on open and returns focus to whatever
opened it on close.

## Reduced motion

Every signature effect must have a static fallback and a reduced-motion path —
that is a rule the visual layer is held to, not a best effort:

- **Goo** (`FGoo`, the navbar/sidebar junction) — the animation settles to a
  static frame instead of running.
- **Parallax** (`FParallax`) — no scroll binding at all; the image is simply
  placed. The same happens where `IntersectionObserver` is missing.
- **Liquid glass** (`FGlass`) — reduced transparency makes the surface opaque;
  reduced motion drops the press transition.
- **Sparkline**, **slide group**, **pull-to-refresh** — the draw-in and the
  spring become instant.
- Component stylesheets carry their own `prefers-reduced-motion` blocks that drop
  the transition. There is no global kill-switch; each animated component opts
  out for itself, which is why the ones that don't move don't need one.

Nothing is _removed_ under reduced motion — the component keeps working, it just
stops moving.

## Colour is never the only signal

State is always carried by something other than hue. Alerts of a given `type`
render a matching icon; sorted table columns show a direction arrow and expose
`aria-sort`; validation failures render a message, not just a red border;
selected, checked and disabled states change shape, opacity and content — not only
colour. Themes can be re-skinned freely without turning a component mute.

## The automated gate

```bash
pnpm a11y
```

`tools/a11y-check.mjs` drives a headless Chromium (Playwright) over the built
docs, injects **axe-core** and runs it against a set of pages — the home page,
Button, Card, Inputs, Alert and Design Tokens — **in both light and dark**,
toggling the theme between passes. It exits non-zero on any `critical`
violation, and reports `serious` ones as a tracked count rather than failing on
them, because those are almost entirely colour-contrast findings on muted text
and want a design-token decision, not a mechanical fix.

It needs a running preview:

```bash
pnpm --filter @rukkiecodes/docs build
pnpm --filter @rukkiecodes/docs preview --port 4173 &
A11Y_BASE=http://localhost:4173 node tools/a11y-check.mjs
```

## What is not done yet

Being honest about the gaps is more useful than claiming perfection. From
`HARDENING.md`, the tracked backlog:

- **`FSelect` is not yet a proper combobox.** It is a `div`-based control and
  still needs `role="combobox"` plus `aria-labelledby` / `aria-label` instead of
  `for`/`id` labelling. [`FAutocomplete`](/components/autocomplete) already
  implements the pattern in full — prefer it where the semantics matter.
- **`FDialog` and `FOverlay` do not trap focus.** They are `role="dialog"`,
  `aria-modal="true"`, Escape-closable and scroll-locking, but Tab can still
  leave the dialog, and focus is not restored to the opener on close.
  `FBottomSheet` does both — that implementation is the model the others need.
- **`button-name` violations remain in the docs demos** — icon-only buttons in
  the card showcase and the button playground need per-demo labels. That is
  documentation content rather than a library gap (an icon button's accessible
  name is the consumer's call), but axe counts it, and it is why…
- **`pnpm a11y` is a reporting command, not a blocking CI gate** — it will
  become one once the demo-button and contrast backlog is burned down.
- **Colour contrast** — medium-emphasis text (~0.6 opacity) and code spans fall
  under AA in places. Fixing it means moving a token, which is a deliberate design
  decision rather than a sweep.
