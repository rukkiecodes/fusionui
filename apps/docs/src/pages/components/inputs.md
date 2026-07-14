# Input

`FInput` is a text field with the signature look — a soft filled background, a
stable focus, and the signature animated floating label.

> **Fluid by default.** Inputs (and every field built on `FField` — select,
> textarea, number) now fill the **full width** of their container, so they line
> up cleanly in forms and grids. Constrain one by wrapping it or setting a
> `max-width` / `width` on the field.

## Usage

Configure an input live and copy the generated code.

<InputPlayground />

## Default

In its simplest form, an input just needs a `v-model`.

<Example file="input/basic" />

## Label

Use `label` for a label pinned above the field, or add `label-placeholder` to
get the animated label that reads as a placeholder and floats up on focus.

<Example file="input/label" />

## Color

The `color` prop colors the focus — the bottom border, icons, and floated label
take the accent. It accepts a theme color or any HEX / RGB value.

<Example file="input/colors" />

## Icons

Add `prepend-icon` / `append-icon` — the icon sits in a little card that lifts
out with a soft shadow when the field is focused.

<Example file="input/icons" />

## Message

Add colored helper text below the field with the `message-success`,
`message-danger`, `message-warn`, and `message-primary` slots.

<Example file="input/message" />

## State

Tint the whole field with the `state` prop — `primary`, `success`, `danger`,
`warning`, or `dark`.

<Example file="input/state" />

## Progress

Bind a 0–100 `progress` value for a validation bar under the field that shifts
from red to green — most commonly used for password strength.

<Example file="input/strength" />

## Loading

The `loading` prop shows an inline spinner.

<Example file="input/loading" />

## Input types

The `type` prop is the native HTML input type.

<Example file="input/types" />

## Password

`type="password"` adds a reveal toggle automatically.

<Example file="input/password" />

## Border

The `underlined` variant strips the fill down to an animated underline.

<Example file="input/border" />

## Shadow

The `shadow` variant floats the field on a soft shadow.

<Example file="input/shadow" />

## Textarea

`FTextarea` is the multi-line sibling. It wears the same `FField` chrome — label,
color, hint, validation — and `rows` sets its initial height.

<Example file="input/textarea" />

## Number

`FInputNumber` is a stepper: an input flanked by decrement / increment buttons.
`min`, `max` and `step` clamp the value, and the buttons disable themselves at
each end of the range.

<Example file="input/number" />

## API

<ApiTable name="FInput" />

<ApiTable name="FTextarea" />

<ApiTable name="FInputNumber" />

`FField` is the chrome every field is built on — the label, hint, message and
validation surface. You rarely render it directly, but its props are forwarded by
`FInput`, `FSelect` and `FTextarea`.

<ApiTable name="FField" />
