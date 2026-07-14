# Labels, Messages & Counter

`FLabel`, `FMessages` and `FCounter` are the three pieces of chrome that sit
around a form control: the thing that names it, the thing that tells you what
went wrong, and the thing that counts what you typed. `FInput`, `FSelect` and
friends already render all three for you — reach for these primitives when you
are wiring up a control of your own and want it to look and behave like the
rest of the library.

## Label

`FLabel` renders a real `<label>`. Point `for` at the id of the control it
names and the browser does the rest: clicking the label focuses the control,
and screen readers announce the two together.

<Example file="form-chrome/label" />

### States

A label bound to a control is already clickable; `clickable` advertises it with
a pointer cursor and an accent on hover. `disabled` dims it and stops it
forwarding clicks, so it matches a control that isn't accepting input.

<Example file="form-chrome/label-states" />

## Messages

`FMessages` renders hint and validation text below a control. Pass a single
string or an array — every entry gets its own line — and toggle the whole block
with `active` so messages slide in and out instead of popping.

<Example file="form-chrome/messages" />

### Colors

`color` takes any theme color. The convention across the library is neutral for
hints, `danger` for errors and `success` for confirmations.

<Example file="form-chrome/messages-color" />

### Validation

Bind `messages` to your validation output and `active` to whether there is
anything to say. The list is keyed, so replacing one error with another
animates the swap; changes are announced politely, never interrupting the
typist mid-word.

<Example file="form-chrome/messages-validation" />

## Counter

`FCounter` is the "34 / 60" readout that lives in the corner of a text input.
Give it a `value` and, optionally, a `max`. On its own, `value` renders as a
plain count.

<Example file="form-chrome/counter" />

### Live

`active` controls visibility — most inputs reveal the counter on focus and hide
it again on blur. Once `value` passes `max` the counter turns `danger` and
announces itself, which is the only moment it is worth interrupting for.

<Example file="form-chrome/counter-live" />

## Composing them

Together they make a complete field: a label above, the control in the middle,
messages and a counter sharing the row underneath.

<Example file="form-chrome/composed" />

## API

<ApiTable name="FLabel" />

<ApiTable name="FMessages" />

<ApiTable name="FCounter" />
