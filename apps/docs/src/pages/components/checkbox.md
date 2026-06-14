# Checkbox

`FCheckbox` is a Vuesax-style checkbox with a drawn check mark, a soft colored
glow, and a label slot. Bind `v-model` to a boolean — or to an array to collect
several values at once.

## Default

<Example file="checkbox/default" />

## Color

`color` takes a theme color (`primary`, `success`, `danger`, `warning`…) or any
CSS color.

<Example file="checkbox/colors" />

## Icon

Pass `icon` (or the `#icon` slot) to show a custom mark in the box when checked.

<Example file="checkbox/icon" />

## Array

Bind several checkboxes to one array via `v-model`, each with a `value` — checked
boxes add their value to the array.

<Example file="checkbox/array" />

## Indeterminate

`indeterminate` shows a dash for a partial selection — handy for a "select all"
parent.

<Example file="checkbox/indeterminate" />

## Line through

`line-through` strikes the label when checked — a tidy to-do list.

<Example file="checkbox/linethrough" />

## Loading

`loading` swaps the mark for a spinner and blocks interaction.

<Example file="checkbox/loading" />

## Disabled

<Example file="checkbox/disabled" />

## API

<ApiTable name="FCheckbox" />
