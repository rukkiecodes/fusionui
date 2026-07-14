# Confirm edit

`FConfirmEdit` wraps an editable control and holds its edits in a draft: the
bound value only changes when the user confirms with **OK**. **Cancel** throws the
draft away and puts the original back.

The draft is a deep clone, so an object or an array model works exactly like a
string one — and if the committed value changes underneath the component (a
websocket push, another tab), the draft re-clones rather than leaving a stale
edit behind.

## Default

The default slot receives `model` — a ref holding the draft — so bind the control
to `model.value`. Both buttons stay disabled while the draft still matches the
committed value.

<Example file="confirm-edit/default" />

## Placing the actions

The slot also hands you `actions`. Render it yourself and the default button row
is suppressed, so the buttons can sit wherever the layout wants them. `ok-text`,
`cancel-text` and `color` restyle them; `isPristine` tells you whether anything
has changed yet.

<Example file="confirm-edit/actions" />

## Your own buttons

`hide-actions` renders no buttons at all — drive `save` and `cancel` from the
slot instead. `save` also emits `@save` with the committed value, and `cancel`
emits `@cancel`.

`disabled` can take the two actions apart: `true` disables both, while
`:disabled="['save']"` disables only OK.

<Example file="confirm-edit/hide-actions" />

## API

<ApiTable name="FConfirmEdit" />
