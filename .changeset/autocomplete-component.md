---
'@rukkiecodes/native': minor
---

Add the Autocomplete component — mirrors the web FAutocomplete: a select whose
menu filters as you type, where the value is always one of `items` and text that
never matched an option is reverted when the field is left. Built on the same
field shell as the Input and Select (variants, state tints, floating & pinned
labels, prepend/chevron icon cards, clearable, loading, hint / error / success
messages), plus single or multiple selection with collapsible chips,
`autoSelectFirst`, `customFilter`, `noDataText`, and `noFilter` +
`onSearchChange` for server-side search.

The suggestion menu is anchored inline rather than in a Modal, so the field
keeps focus and the keyboard stays up while the list filters.
