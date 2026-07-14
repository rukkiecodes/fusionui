# Color Picker & Input

`FColorPicker` is a saturation/brightness canvas with hue and alpha sliders,
numeric inputs per mode and optional swatches. `FColorInput` is a text field that
opens one in a menu.

Everything is keyboard operable — the canvas thumb takes the arrow keys (`Shift`
for a coarse step, `Home`/`End` for the extremes) and hue and alpha are native
range inputs — and the value is always readable as text, never conveyed by color
alone.

## Default

The model can be a string (`#2563eb`, `rgb(…)`, `hsl(…)`) or an object
(`{ r, g, b }`, `{ h, s, l }`, `{ h, s, v }`), and it keeps whichever shape it
started with as the user drags.

<Example file="color-picker/default" />

## Modes

`mode` decides which channels the numeric inputs edit — `hex`, `hexa`, `rgb`,
`rgba`, `hsl`, `hsla` — and whether the alpha slider is shown. The button beside
the inputs cycles through `modes`; bind `v-model:mode` to follow it, or
`hide-mode-switch` to pin one format.

<Example file="color-picker/modes" />

## Swatches

`show-swatches` adds a palette below the picker. `swatches` replaces the default
set — the natural way to hold a team to its brand colors.

<Example file="color-picker/swatches" />

## Hiding the parts

`hide-canvas`, `hide-sliders` and `hide-inputs` each remove one section, so the
picker can be pared down to just the piece you want. `width` and `canvas-height`
resize it; `elevation` and `rounded` control the surface.

<Example file="color-picker/compact" />

## Color input

`FColorInput` wears the same `FField` chrome as `FInput` — label, hint, rules,
clear button — with a swatch in the prepend slot that previews the current color
and opens the picker. The text stays editable, so a value can always be typed or
pasted rather than only dragged; anything unparseable snaps back to the last good
color.

<Example file="color-picker/input" />

### Swatches in the menu

The input passes `mode`, `swatches`, `show-swatches` and the `hide-*` props
through to its picker — a swatch-only menu makes a tidy "pick a label color"
control.

<Example file="color-picker/input-swatches" />

## API

<ApiTable name="FColorPicker" />

<ApiTable name="FColorInput" />
