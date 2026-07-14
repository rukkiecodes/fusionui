# Icon button

`FIconBtn` is the icon-only button: a square-or-circular `FBtn` that holds a
single glyph. Everything visual — variants, colors, sizes, ripple, the loader —
is `FBtn`'s; what `FIconBtn` locks in is the icon-only shape and the accessible
name.

`aria-label` is **required**. An icon is not a label, so without one a screen
reader has nothing to announce but "button" — every example on this page passes a
real one, and so should yours.

## Default

<Example file="icon-button/default" />

## Variants

`variant` picks the treatment: `flat` (the default), `tonal`, `outlined`, `text`,
`elevated`, `gradient`, `relief` and `floating`.

<Example file="icon-button/variants" />

## Colors

`color` takes a theme color or any CSS color.

<Example file="icon-button/colors" />

## Sizes

<Example file="icon-button/sizes" />

## Shape

A bare `rounded` makes it a circle — the usual icon-button shape. A named value
(`sm` … `pill`, or `0` for a hard square) falls through to the radius scale.

<Example file="icon-button/rounded" />

## Toggle

Set `active` and the button renders pressed _and_ reports `aria-pressed`. Leave
it unset and the button stays a plain action — it never claims to be a toggle it
isn't.

<Example file="icon-button/toggle" />

## Loading & disabled

`loading` swaps the glyph for a spinner and blocks the click; `disabled` does the
same without the spinner.

<Example file="icon-button/states" />

## API

<ApiTable name="FIconBtn" />
