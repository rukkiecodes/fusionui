# Switch

`FSwitch` is a Vuesax-style toggle with a sliding thumb and a soft colored glow.
Bind `v-model` to a boolean, drop text or icons inside the track, or collect
several values into an array.

## Default

<Example file="switch/default" />

## Color

`color` takes a theme color (`primary`, `success`, `danger`, `warning`…) or any
CSS color.

<Example file="switch/colors" />

## Text

Put labels inside the track with the `#on` and `#off` slots — the track grows to
fit them.

<Example file="switch/text" />

## Icons

The `#on` / `#off` slots also take icons; the `#circle` slot puts an icon in the
thumb. Add `icon` for a transparent thumb (icon-only).

<Example file="switch/icons" />

## Square

`square` swaps the pill for rounded-square corners.

<Example file="switch/square" />

## Loading

`loading` shows a spinner in the thumb and blocks interaction.

<Example file="switch/loading" />

## Indeterminate

`indeterminate` centers the thumb for an undetermined, disabled state.

<Example file="switch/indeterminate" />

## Array

Bind several switches to one array via `v-model`, each with a `val` — flipped
switches add their value to the array.

<Example file="switch/array" />

## API

<ApiTable name="FSwitch" />
