# Input

`VdInput` is a text field with the Vuesax look — a soft filled background, a
stable focus, and the signature animated floating label.

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

## API

<ApiTable name="VdInput" />
