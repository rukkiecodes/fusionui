# Data Table

`FDataTable` is the full-strength table: columns described once in `headers`,
rows handed over in `items`, and everything else — sorting, paging, searching,
selection, expansion, grouping — done for you, in the browser. `FDataTableServer`
is the same table with the thinking taken out: it renders exactly the page it is
given and tells you, through a single `update:options` event, what to fetch next.

Reach for `FTable` instead when you only need the rows laid out well and none of
the machinery.

## Default

Every column needs a `key` (the item property it reads — dotted paths work) and
usually a `title`. Without `headers` the columns are inferred from the first
item. Rows are identified by `item-value`, which defaults to `id`.

<Example file="data-table/basic" />

## Sorting

Column headings are sort buttons: a click cycles ascending → descending →
unsorted. `multi-sort` keeps every clicked column instead of replacing the
previous one — a numbered badge then shows each column's place in the sort — and
`must-sort` forbids the unsorted state. `sortable: false` opts a column out;
`sort` on a header (or `custom-key-sort` on the table) supplies your own
comparator.

<Example file="data-table/sorting" />

## Pagination

The footer carries a rows-per-page select, the current range and the pager.
`items-per-page-options` sets the choices — `-1` means "all" — and `page-text`
is the template behind "1–10 of 42" (`{0}` first row, `{1}` last, `{2}` total).
`hide-default-footer` removes the whole strip.

<Example file="data-table/pagination" />

## Row selection

`show-select` adds a checkbox column, and `v-model` holds the `item-value` of
every selected row. The header checkbox reflects its scope exactly: checked when
all of it is selected, indeterminate (a dash, and `indeterminate` on the native
input, so screen readers hear "mixed") when only part of it is. `select-strategy`
decides that scope — `page` (the default) covers the visible page, `all` reaches
across every filtered row, and `single` allows one row and drops the header
checkbox altogether. `item-selectable` marks rows that cannot be picked.

<Example file="data-table/selection" />

## Expandable rows

`show-expand` adds a chevron column, and whatever you put in the `expanded-row`
slot is rendered in a full-width row underneath. `expand-on-click` lets the whole
row toggle, `expand-strategy="single"` keeps only one row open at a time, and
`v-model:expanded` holds the open rows.

<Example file="data-table/expandable" />

## Grouping

`group-by` takes one entry per level — `[{ key: 'department' }, { key: 'location' }]`
nests locations inside departments. Each group gets a collapsible header row with
a count; `open-all` starts them expanded and `v-model:opened` tracks which ones
are. Grouping keys are folded into the sort so a group's rows always stay
together, and the `group-header` slot replaces the default toggle.

<Example file="data-table/grouping" />

## Search

`search` filters the rows on a case-insensitive substring match across every
column. Narrow it with `filter-keys`, or replace the match entirely with
`custom-filter` — `(value, query, item) => boolean`, run against each column
value of a row. The `top` slot is a good home for the field itself, and `no-data`
covers the "nothing matched" case.

<Example file="data-table/search" />

## Custom columns

`item.<key>` takes over a single cell and receives `{ item, value, index, internalItem, columns }`
— enough to drop in an avatar, a status chip or a row menu. `header.<key>` does
the same for a column heading (the cell stays sortable; you are replacing the
title, not the button). A header's `value` resolves the cell from somewhere other
than its `key`, which is how a nested field becomes a sortable column.

<Example file="data-table/custom-columns" />

## Loading & empty

`loading` draws a hairline progress bar under the header — or, when there are no
rows yet, shows `loading-text` (or the `loading` slot) in the body. With no rows
and nothing in flight the table falls back to `no-data-text`, and the `no-data`
slot turns that dead end into something useful.

<Example file="data-table/states" />

## Server-side

`FDataTableServer` never filters, sorts or slices — it renders what you give it.
It emits `update:options` with `{ page, itemsPerPage, sortBy, groupBy, search }`
whenever any of them changes, and once immediately, so a single handler can drive
the first fetch and every one after it. Tell it how many rows exist behind the
query with `items-length` and it works out the page count for you; `loading`
covers the wait.

<Example file="data-table/server" />

## API

<ApiTable name="FDataTable" />

<ApiTable name="FDataTableServer" />
