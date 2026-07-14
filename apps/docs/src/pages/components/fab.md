# FAB & Speed Dial

`FFab` is a floating action button — the one primary action of a screen, sitting
above the content instead of in it. The button itself is an `FBtn` (same
variants, colors, sizes, loading and disabled states); `FFab` only owns _where it
floats_. `FSpeedDial` turns a FAB into a disclosure that fans out a column of
secondary actions.

## Default

Give it an `icon`. `color` and `variant` are handed straight to the underlying
button, so anything `FBtn` can wear, a FAB can wear.

<Example file="fab/default" />

## Sizes

`size` runs from `x-small` to `x-large` — the circle and its icon scale together.

<Example file="fab/sizes" />

## Variants & states

`variant` picks the button treatment, and `loading` / `disabled` behave exactly
as they do on `FBtn`.

<Example file="fab/variants" />

## Extended

`extended` grows the circle into a pill with a label beside the icon. Use `text`,
or fill the default slot.

<Example file="fab/extended" />

## Location

`absolute` pins the FAB to the nearest positioned ancestor, `app` pins it to the
viewport. `location` takes a side and an alignment — `bottom end` (the default),
`bottom start`, `top end`, `top start` — and `offset` makes it straddle the edge
it is anchored to.

Inside an `<f-layout>`, an `app` FAB registers as a layout item, so it clears the
navbar and sidebar rather than overlapping them; add `layout` to also reserve
space in `<f-main>` so content can never hide underneath it.

<Example file="fab/location" />

## Show & hide

`v-model` controls visibility — the button scales out of view and back in. Add
`appear` to animate the very first render too.

<Example file="fab/toggle" />

## Speed dial

`FSpeedDial` wraps a FAB in a disclosure. The `activator` slot receives the props
to bind to the button; the default slot holds the actions, which stagger into
place as the fan opens.

Positioning, teleporting, outside-click and `Escape` come from `FMenu`. The speed
dial adds the disclosure semantics on top: `aria-expanded` / `aria-haspopup` on
the activator, arrow-key roving between the actions, and focus handed back to the
FAB when the fan closes. Each action needs its own accessible name — they are
icon-only buttons, so pass an `aria-label`.

<Example file="fab/speed-dial" />

### Fan direction & hover

`location` (`top`, `bottom`, `top-end`, `bottom-end`) decides which way the
actions fan out, `offset` sets the gap between the FAB and the first action, and
`open-on-hover` opens the fan on pointer intent instead of on click — clicking
still works, and the gap stays forgiving enough to cross with the pointer.

<Example file="fab/speed-dial-hover" />

## API

<ApiTable name="FFab" />

<ApiTable name="FSpeedDial" />
