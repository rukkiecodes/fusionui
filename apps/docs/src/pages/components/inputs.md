# Input

`VdInput` is a text field with the Vuesax look — a soft filled background, a
smooth focus glow, and the signature animated floating label.

## Usage

Configure an input live and copy the generated code.

<InputPlayground />

## Default

In its simplest form, an input just needs a `v-model`.

<Example file="input/basic" />

## Label

Use `label` for a label above the field, or add `label-placeholder` to get the
animated floating label that lifts on focus.

<Example file="input/label" />

## Colors

The `color` prop sets the focus accent — a theme color or any CSS color.

<Example file="input/colors" />

## Icons

Add `prepend-icon` / `append-icon`, and `clearable` to show a clear affordance
when the field has a value.

<Example file="input/icons" />

## Validation & states

Pass `rules` for validation, or `success-messages` / `hint` for other states.
The field colors its border, label, and message accordingly.

<Example file="input/states" />

## Icon card

Add `icon-card` to seat the prepend / append icon in a little card that lifts
out with a soft shadow when the field is focused.

<Example file="input/icon-card" />

## State

Force a state tint with the `state` prop — `success`, `danger`, `warning`, or
`primary`.

<Example file="input/state" />

## Password

`type="password"` adds a reveal toggle automatically.

<Example file="input/password" />

## Strength bar

Bind a 0–100 `progress` value for a bar under the field that shifts from red to
green as it fills — handy for password strength.

<Example file="input/strength" />

## Square & transparent

`square` removes the rounding; `transparent` drops the fill.

<Example file="input/square-transparent" />

## Loading

The `loading` prop shows an inline spinner.

<Example file="input/loading" />

## Variants

Three looks: the filled `default`, an `underlined` field with the Vuesax
center-out underline, and an elevated `shadow` field.

<Example file="input/variants" />

## Block

`block` stretches the field to the full width of its container.

<Example file="input/block" />

## API

<ApiTable name="VdInput" />
