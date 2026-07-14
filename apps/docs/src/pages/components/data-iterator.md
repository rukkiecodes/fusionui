# Data Iterator

`FDataIterator` is the data table with the table taken away. It filters, sorts
and paginates a list, then hands the current slice to its default slot — the
markup is entirely yours. Use it for a card grid, a masonry wall, a media list:
anything that needs a table's machinery but not its rows and columns.

## Card grid

The default slot receives the current page as `items`, along with the whole
pager state (`page`, `pageCount`, `itemsLength`, `isFirst`, `isLast`) and its
controls. `items-per-page` defaults to `5`; `-1` shows everything.

<Example file="data-iterator/card-grid" />

## Pagination

`header` and `footer` are rendered on either side of the items and receive the
same slot props, so the pager lives wherever you put it. `prevPage`, `nextPage`
and `setPage` move through the pages; `isFirst` / `isLast` tell you when to
disable a button.

<Example file="data-iterator/pagination" />

## Search

`search` filters items on a case-insensitive substring match. By default every
own value of an item is searched — narrow that with `filter-keys` (dot paths
allowed) or replace the match with `filter`, `(item, search) => boolean`. A
search that strands the reader past the last page walks them back automatically,
and `no-data` covers the empty result.

<Example file="data-iterator/search" />

## Sorting

`v-model:sort-by` takes `[{ key, order }]` (or a bare `['name']`). There are no
column headings to click, so the controls are yours: the slots hand you
`toggleSort(key)` — asc → desc → unsorted — and `sortOrder(key)` to render the
current state. `multi-sort` stacks keys instead of replacing them.

<Example file="data-iterator/sorting" />

## Server-side

Set `items-length` and the iterator stops filtering, sorting and slicing: it
renders `items` exactly as given and only does the page arithmetic, leaving the
fetch to you. `loading` swaps the items for a spinner (or the `loading` slot),
and `update:page` / `update:items-per-page` / `update:sort-by` tell you what to
ask the server for.

## API

<ApiTable name="FDataIterator" />
