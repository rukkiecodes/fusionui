# Two-way Binding

Every stateful component in FusionUI runs its state through one composable,
`useProxiedModel`. It is what makes `v-model` work, and it is why a component
still works when you _don't_ bind one.

## The basics

`v-model` on a FusionUI component is the ordinary Vue contract: it passes the
`modelValue` prop and listens for `update:modelValue`. Inputs, selects,
switches, sliders, ratings, checkboxes, the OTP field — they all take the value
they hold.

<Example file="concepts/model-basic" />

## Controlled and uncontrolled

`useProxiedModel` checks, per render, whether the parent is actually driving the
prop — that means **both** the prop and its `onUpdate:` listener were passed,
which is exactly what `v-model` compiles to. If they were, the parent's value is
the truth and the component only emits. If they weren't, the component keeps the
value internally and still behaves.

That is what lets a menu, a dialog, an alert or an expansion panel work with no
binding at all: bind a model when something outside the component needs to know
or needs to drive it, and leave it off when nothing does.

<Example file="concepts/model-uncontrolled" />

Passing only the prop — `:model-value="open"` with no listener — is the
read-only case: the component takes the value as its starting point and then
manages it itself. Reach for it deliberately, not by accident.

## Named models

A component often has more than one piece of state worth exposing. Vue's named
models (`v-model:<name>`) map onto the same mechanism: the prop is `<name>` and
the event is `update:<name>`. Each one is independent — bind the ones you care
about and let the component own the rest.

| Component                   | Named models                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `FDataTable`                | `page`, `items-per-page`, `sort-by`, `group-by`, `expanded` (rows selected by `v-model`) |
| `FDataIterator`             | `page`, `items-per-page`, `sort-by`                                                      |
| `FTreeview`                 | `opened`, `selected`, `activated`                                                        |
| `FDatePicker`               | `view`, `month`, `year`                                                                  |
| `FDateInput`, `FColorInput` | `menu`                                                                                   |
| `FSidebar`                  | `open`                                                                                   |
| `FAlert`                    | `page`, `hidden-content`                                                                 |

<Example file="concepts/model-named" />

`FAutocomplete` and `FCombobox` are the exception worth knowing: the query box
is _not_ a model. There is no `search` prop — the component owns the text and
emits `update:search` as it changes, which is what you listen to when a server
does the filtering:

```html
<f-autocomplete :items="items" :loading="loading" @update:search="fetchOptions" />
```

## Transforming in and out

`useProxiedModel` takes an optional `transformIn` / `transformOut` pair, and
components use it to keep an ergonomic public shape while working with whatever
is efficient internally.

`FDataTable`'s expansion is the clearest case. The public model is a plain array
of row keys — trivial to write, trivial to persist — while the table needs
constant-time lookups per row, so it transforms the array into a `Set` on the
way in and back into an array on the way out:

```ts
const expanded = useProxiedModel(
  props,
  'expanded',
  [],
  v => new Set(Array.isArray(v) ? v : v == null ? [] : [v]), // in
  v => [...v.values()] // out
)
```

Your side of the binding never sees the `Set`:

<Example file="concepts/model-transform" />

The same hook is what makes the loose props forgiving elsewhere: `page` and
`items-per-page` run through `Number()`, so a value straight out of a query
string (`page="2"`) works, and `FRating` coerces its model to a number.
