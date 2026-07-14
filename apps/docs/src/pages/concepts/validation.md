# Form Validation

One engine — `useValidation` — sits inside every FusionUI control that holds a
value worth checking: `FInput`, `FTextarea`, `FSelect`, `FAutocomplete`,
`FCombobox`, `FDateInput`, `FTimeInput` and `FColorInput`. It runs the rules,
owns the messages, and registers the field with the surrounding `FForm` if there
is one. Nothing else in the library knows how validation works, which is why
every field behaves the same.

## Rules

A rule is a function that receives the field's current value and returns `true`
if it passes, or the message to show if it doesn't. (A bare `true` / string
works too, for a rule that doesn't depend on the value.) Rules run in order,
every failure is collected, and the field shows the first one.

```ts
const rules = [
  v => !!String(v ?? '').trim() || 'A handle is required',
  v => String(v ?? '').length >= 3 || 'Use at least 3 characters',
]
```

There is no rule library and no schema to learn — a rule is a function, so
compose them the way you compose functions.

<Example file="concepts/validation-rules" />

## When rules run

`validate-on` decides what triggers a re-check:

- **`input`** (the default) — a watcher on the model, so the field re-checks on
  every keystroke. Right for a character limit; punishing for an email address.
- **`blur`** — when focus leaves the field. Right for anything the user needs to
  finish typing before the verdict means anything.
- **`submit`** — never on its own. The field only checks when the surrounding
  form validates.

Whatever the setting, `FForm.validate()` always runs every rule on every field —
`validate-on` controls the _early_ feedback, not what a submit checks.

<Example file="concepts/validation-validate-on" />

## Messages

Rules are not the only source of truth. `error-messages` and `success-messages`
take a string or an array and are merged with whatever the rules produced — the
field renders the first error, or, if there are none, the first success message,
and colours itself to match. That is where a verdict that no rule can compute
goes: a taken username, a declined card, a server that says no.

`error` (a boolean) puts the field in the error state without a message at all.

## Validity

Each field reports one of three values:

- `null` — pristine. It has rules but has not been checked yet.
- `true` — passing (a field with no rules is always `true`).
- `false` — a rule failed, or an `error-messages` entry / the `error` prop was
  set from outside.

`FForm` aggregates them with the same three-state logic: `false` if any field
failed, `null` if any field is still pristine, `true` only when everything
passes. `isValid === false` is therefore the honest disabled-guard for a submit
button — `!isValid` would disable it before the user has typed anything.

## FForm

`FForm` renders a real `<form>` with `novalidate`, so the browser's own bubbles
stay out of the way. Fields register themselves with it on mount and unregister
on unmount, so conditional fields are handled for free.

On submit it validates every registered field and **only emits `@submit` if all
of them pass** — by the time your handler runs, the client-side rules are
satisfied. Its default slot exposes the form's live state:

```html
<f-form v-slot="{ isValid, validate, reset, resetValidation }" @submit="save"></f-form>
```

`validate()` re-checks everything and returns a boolean. `reset()` and
`resetValidation()` both clear the validation state — the errors and the
pristine flag — but **not** the values: the values are yours, in your refs, so
clear them alongside.

Only controls that use the validation engine register. `FCheckbox`, `FSwitch`,
`FSlider` and `FRating` hold values but have no rules, so a "must accept the
terms" gate is an ordinary condition in your own code, not a rule.

## A sign-up form

Client-side rules, a `blur` check on the fields where it matters, a server-side
verdict fed back through `error-messages`, a submit guarded on `isValid` and a
reset that clears both halves. Try `taken@fusionui.dev` to see the server win an
argument with a form that passed every rule.

<Example file="concepts/validation-signup" />

## API

<ApiTable name="FForm" />
