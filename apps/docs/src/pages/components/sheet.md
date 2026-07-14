# Sheet

`FSheet` is the base surface primitive — a themed block with a color, an
elevation, a radius, an optional border and explicit dimensions. It carries no
layout opinions of its own, which is exactly why it is useful: most other
surfaces (card, banner, footer) are a sheet with opinions layered on top, and
anywhere you need "a piece of the theme's surface" you can reach for it
directly.

## Default

On its own a sheet is the theme's surface color with the theme's text color. It
has no padding — space the content yourself.

<Example file="sheet/default" />

## Colors

`color` fills the sheet with a theme color (`primary`, `secondary`, `success`,
`danger`, `warning`) or any CSS color. The text flips to the contrasting
`on-*` color automatically.

<Example file="sheet/colors" />

## Elevation

`elevation` takes `0`–`24` and applies the matching shadow token.

<Example file="sheet/elevation" />

## Rounded

Sheets use the medium radius by default. `rounded` switches to the softer large
radius, `rounded="sm|md|lg|xl|pill|circle"` picks one explicitly, and `tile`
squares the corners off.

<Example file="sheet/rounded" />

## Border

`border` draws a hairline that follows the sheet's own text color — so it stays
visible on a colored fill. Pass a value (`border="md"`, `border="s-lg"`) to
target a weight or a single side.

<Example file="sheet/border" />

## Dimensions

`width`, `height`, `min-width`, `min-height`, `max-width` and `max-height` take
a number (px) or any CSS length.

<Example file="sheet/dimensions" />

## API

<ApiTable name="FSheet" />
