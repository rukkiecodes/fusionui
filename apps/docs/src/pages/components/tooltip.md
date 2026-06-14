# Tooltip

`FTooltip` wraps a trigger and floats a labelled bubble beside it on hover or
focus. The bubble is rendered with fixed positioning measured from the trigger,
so it never gets clipped by a scrolling or `overflow: hidden` parent.

## Default

Put the trigger in the default slot and the label in `text` (or the `tooltip`
slot).

<Example file="tooltip/default" />

## Positions

`location` places the bubble on the `top` (default), `bottom`, `left` or
`right` of the trigger.

<Example file="tooltip/positions" />

## Colors

`color` fills the bubble with a theme color (`primary`, `success`…) or any CSS
color. The default is a theme-aware dark bubble.

<Example file="tooltip/colors" />

## Styles

`shadow`, `border` and `border-thick` swap the solid fill for lighter,
surface-colored looks.

<Example file="tooltip/styles" />

## Shape & arrow

`circle` and `square` change the corners; `not-arrow` hides the pointer.

<Example file="tooltip/shapes" />

## Loading

`loading` shows a spinner and dims the label — handy while an action resolves.

<Example file="tooltip/loading" />

## Interactivity

`interactivity` keeps the bubble open while the pointer is over it, so you can
put a link or button inside.

<Example file="tooltip/interactivity" />

## Controlled

`not-hover` stops hover from opening it; drive visibility with `v-model`
instead (it closes on an outside click).

<Example file="tooltip/controlled" />

## API

<ApiTable name="FTooltip" />
