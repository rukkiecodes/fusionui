# Radio

`FRadio` is a Vuesax-style radio with a draw-in dot and a soft colored glow.
Group them with `FRadioGroup` (which shares the `v-model`, color and disabled
state), or bind a standalone radio's own `v-model`.

## Default

Each `FRadio` has a `value`; the group's `v-model` holds the selected one.

<Example file="radio/default" />

## Inline

`inline` lays the group's radios out in a row.

<Example file="radio/inline" />

## Color

`color` takes a theme color (`primary`, `success`…) or any CSS color — set it on
the group or per radio.

<Example file="radio/colors" />

## Icon

Pass `icon` to show a custom mark inside the circle when selected.

<Example file="radio/icons" />

## Loading

`loading` swaps the dot for a spinner and disables the radio.

<Example file="radio/loading" />

## Disabled

`disabled` on the group (or a single radio) blocks interaction.

<Example file="radio/disabled" />

## API

<ApiTable name="FRadio" />
