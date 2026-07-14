# Rating

`FRating` collects a star rating. It is built as a radio group rather than a row
of buttons: one Tab stop lands on the control, the arrow keys move within it, and
each star announces its own value — so it works without a mouse.

## Default

`v-model` holds the number. `length` sets how many items the scale has.

<Example file="rating/default" />

## Half increments

`half-increments` lets the scale land on halves. The half is drawn by clipping a
filled icon over the empty one, so it works with any icon — no special half-star
glyph needed.

<Example file="rating/half" />

## Hover preview

`hover` previews the value the pointer is over before it is committed.

<Example file="rating/hover" />

## Colors and sizes

`color` tints the filled items; `size` takes a named size (`x-small` … `x-large`).

<Example file="rating/colors" />

## Custom icons

`full-icon` and `empty-icon` swap the glyph — useful for a heart, a flame, or a
thumbs-up scale.

<Example file="rating/icons" />

## Item labels

`item-labels` writes a caption under each item, which turns an abstract 1–5 into
something a reader can actually interpret.

<Example file="rating/labels" />

## Readonly and clearable

`readonly` shows a rating without allowing edits — the usual case when you are
displaying an average. `clearable` lets a click on the current value reset it
to zero.

<Example file="rating/readonly" />

## Accessibility

The container is a `radiogroup` with an `aria-label` (set it via `aria-label`),
and each item is a `radio` carrying `aria-checked`, `aria-setsize` and
`aria-posinset`. A roving tabindex keeps the whole control to a single Tab stop.

| Key                         | Action                    |
| --------------------------- | ------------------------- |
| <kbd>→</kbd> / <kbd>↑</kbd> | Raise by one step         |
| <kbd>←</kbd> / <kbd>↓</kbd> | Lower by one step         |
| <kbd>Home</kbd>             | Jump to the lowest value  |
| <kbd>End</kbd>              | Jump to the highest value |

Each star's spoken name comes from `item-aria-label`, which defaults to
"3 of 5". Override it when the scale means something more specific.

## API

<ApiTable name="FRating" />
