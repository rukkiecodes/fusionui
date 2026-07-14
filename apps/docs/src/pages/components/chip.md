# Chip

`FChip` is a compact pill that carries a small piece of metadata — a tag, a
category, a filter, a status. Reach for it when a word needs to look like an
object you can scan, count or dismiss, rather than plain text. Chips are inline
elements, so they sit happily inside a sentence, a table cell or a toolbar.

## Default

Put the label in the default slot, or pass it as `text`. Chips use the `tonal`
variant in `primary` unless you say otherwise.

<Example file="chip/default" />

## Colors

`color` takes any theme color — `primary`, `secondary`, `success`, `warning`,
`danger`, `dark`.

<Example file="chip/colors" />

## Variants

`variant` switches the treatment: `tonal` (the default tinted fill), `outlined`
for a quieter border-only chip, and `flat` / `elevated` for a solid fill in the
color.

<Example file="chip/variants" />

## Sizes

`size` accepts `small`, the default, and `large`.

<Example file="chip/sizes" />

## Icons

`prepend-icon` puts an icon before the label — an alias like `$success` or any
icon name from the set.

<Example file="chip/icons" />

## Label

Chips are pill-shaped by default (`pill` says so explicitly). `label` squares
the corners down to the small radius, which reads more like a tag.

<Example file="chip/label" />

## Link

`link` makes the chip feel clickable: it gets the pointer cursor and a ripple on
press, so you can wire it to a router link or a filter handler.

<Example file="chip/link" />

## Closable

`closable` adds a close button. Clicking it hides the chip (it writes `false`
into `model-value`) and emits `click:close`, so bind `v-model` to keep the state
or listen to the event to remove the item from your own list.

<Example file="chip/closable" />

<Example file="chip/removable" />

## API

<ApiTable name="FChip" />
