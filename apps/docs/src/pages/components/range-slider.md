# Range Slider

`FRangeSlider` selects a `[lower, upper]` range with two thumbs. It shares
`FSlider`'s track, fill and thumb — the two are the same design by construction,
not by coincidence.

## Default

`v-model` is a two-element array. The thumbs cannot cross: each is clamped by the
other.

<Example file="range-slider/default" />

## Min, max and step

`min`, `max` and `step` work exactly as they do on `FSlider`. Values snap to the
step and clamp to the bounds.

<Example file="range-slider/step" />

## Strict

By default the two thumbs may meet on the same value (an empty range). `strict`
keeps a full step of clear air between them, so the range can never collapse.

<Example file="range-slider/strict" />

## Colors

<Example file="range-slider/colors" />

## Accessibility

Each thumb is its own `role="slider"` with an `aria-label` from `thumb-labels`
(defaulting to "Lower bound" / "Upper bound"), so the two are announced as
distinct values rather than one anonymous pair. Each thumb also reports the range
it can actually travel — bounded by the _other_ thumb, not by the raw `min`/`max`
— which is what a screen reader needs to describe the handle truthfully.

Both thumbs are keyboard operable: <kbd>←</kbd>/<kbd>→</kbd> (and
<kbd>↑</kbd>/<kbd>↓</kbd>) step, <kbd>Home</kbd> and <kbd>End</kbd> jump to the
ends of that thumb's travel.

## API

<ApiTable name="FRangeSlider" />
