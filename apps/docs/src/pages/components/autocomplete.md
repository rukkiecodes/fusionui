# Autocomplete & Combobox

`FAutocomplete` is a select whose menu filters as you type. Its value is always
one of `items` — text that never matched an option is reverted when the field is
left. `FCombobox` is the same component with one difference: it also accepts
values of its own, so the user can invent entries that aren't in the list.

Both implement the WAI-ARIA combobox pattern — `aria-expanded`,
`aria-activedescendant`, arrow keys, `Home`/`End`, `Enter` to commit, `Escape` to
close — and both wear the same `FField` chrome as `FInput` and `FSelect`, so
labels, hints, errors, rules and the clear button behave identically.

## Default

`items` takes plain strings or `{ title, value }` objects (rename those keys with
`item-title` / `item-value`). An entry with a `header` key becomes a
non-selectable group heading.

<Example file="autocomplete/default" />

## Multiple

`multiple` collects an array. `Backspace` on an empty field removes the last
selection.

<Example file="autocomplete/multiple" />

## Chips

`chips` renders the selection as chips; `closable-chips` gives each one a close
button, and `collapse-chips` reduces a long selection to two chips and a `+N`
counter.

<Example file="autocomplete/chips" />

## Custom filter

`custom-filter` replaces the default "does the title contain the query" match. It
receives the option's `title`, the `query`, and the raw item — so a search can
look at fields the label never shows. `auto-select-first` highlights the first
match, so `Enter` commits it straight away.

<Example file="autocomplete/custom-filter" />

## Async items

For a server-side search, set `no-filter` so the menu shows exactly what came
back instead of filtering it a second time, and `loading` while the request is in
flight. `no-data-text` (or the `no-data` slot) covers the empty state.

<Example file="autocomplete/async" />

## Combobox

`FCombobox` commits whatever is typed when you press `Enter` or leave the field,
even when nothing in `items` matches — the list becomes a set of suggestions
rather than the only allowed answers.

<Example file="autocomplete/combobox" />

### Tags

With `multiple`, every entry the user commits becomes another chip. That makes
the combobox the component to reach for when collecting tags.

<Example file="autocomplete/combobox-tags" />

## API

<ApiTable name="FAutocomplete" />

<ApiTable name="FCombobox" />
