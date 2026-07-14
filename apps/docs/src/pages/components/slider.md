# Slider

`FSlider` picks a number from a continuous range by dragging a thumb along a
track. Reach for it when the exact value matters less than the feel of it —
volume, brightness, a price ceiling, a temperature — and use a number input when
people need to type a precise figure.

## Default

`v-model` binds the value; the range is 0–100 unless you say otherwise. Drag the
thumb, or focus it and use the arrow keys.

<Example file="slider/default" />

## Min, max and step

`min` and `max` set the range and `step` the granularity — it can be fractional.
Values are clamped to the range and snapped to the nearest step.

<Example file="slider/steps" />

## Color

`color` paints the fill and the thumb, and tints the focus ring around it.

<Example file="slider/colors" />

## Disabled

`disabled` dims the slider and takes it out of the tab order.

<Example file="slider/disabled" />

## API

<ApiTable name="FSlider" />
