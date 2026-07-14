# Form & Validation

Every FusionUI input — `FInput`, `FSelect`, `FTextarea` — shares one validation
engine. Give a control a `rules` array and it checks itself, shows the first
failure under the field, and turns red. Wrap a group of them in `FForm` and the
form takes over: it collects every control inside it, validates them all before
letting a submit through, and reports whether the form as a whole is valid.

`FField` sits one level below all of that. It's the chrome — the label, the
prepend/append icons, the hint line, the error and success messages — that the
inputs render themselves into, and you can wrap your own control in it when the
library doesn't ship the one you need.

## Rules

A rule is a function that receives the field's current value and returns `true`
when it passes, or the message to show when it doesn't. Rules run in order and
the first failure wins.

<Example file="form/rules" />

## A sign-up form

`FForm` renders a `<form>` with `novalidate`, so the browser's own bubbles stay
out of the way. On submit it validates every registered field and only emits
`@submit` if they all pass. Its default slot exposes `isValid`, `validate`,
`reset` and `resetValidation` — note that `reset` clears the _validation state_,
not the values, so clear your own refs alongside it.

`isValid` is `null` until a field has been validated, `true` when everything
passes and `false` when something fails, which makes it a good disabled-guard
for the submit button.

<Example file="form/signup" />

## When rules run

`validate-on` decides when a control re-checks itself: `input` (the default) on
every keystroke, `blur` when focus leaves it, and `submit` only when the
surrounding form validates. Email fields tend to feel better on `blur` — nobody
wants to be told their address is invalid halfway through typing it.

<Example file="form/validate-on" />

## Messages

You don't need rules to show a message. Pass `error-messages` or
`success-messages` directly when the verdict comes from somewhere else — a
server response, an availability check — and the field colors itself to match.

<Example file="form/messages" />

## Custom controls

`FField` provides the label, icons, hint and message line; its default slot
gives you the generated `id` so your control and the `<label>` stay tied
together. Native `input`, `textarea` and `select` elements are styled for you.
Wire `focused` and `active` to the control's own state if you want the floating
label and the clear button to react.

<Example file="form/field" />

## API

<ApiTable name="FForm" />

<ApiTable name="FField" />
