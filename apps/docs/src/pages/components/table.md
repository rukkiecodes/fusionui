# Table

`FTable` renders a plain data table from a `headers` definition and an `items`
array — a soft surface, quiet rules between rows, and a hover highlight. It
handles the presentation (alignment, striping, single-column sorting, custom
cells) and nothing else: no paging, no filtering, no selection. Reach for it
whenever you already have the rows in memory and just want them laid out well.

## Default

Describe the columns with `headers` — each one needs a `title` and the `key` it
reads from the row — then hand it the `items`.

<Example file="table/default" />

## Sorting

Mark a header `sortable` and its title becomes a button. Clicking cycles the
column through ascending, descending, then back to the original order, and an
arrow shows which way it currently points.

<Example file="table/sorting" />

## Alignment

`align` on a header (`start`, `center`, `end`) aligns the header cell and every
body cell in that column. Numbers read best aligned to the `end`.

<Example file="table/align" />

## Custom cells

The `item.<key>` slot takes over a single column. It receives the whole `item`
and the cell's `value`, so you can drop an avatar, a status chip or a row menu
where the raw text would have gone.

<Example file="table/custom-cells" />

## Striped

`striped` tints alternating rows — useful for wide tables where the eye has to
travel across many columns.

<Example file="table/striped" />

## Hover

Rows highlight on hover by default. Set `:hover="false"` for a static, purely
informational table.

<Example file="table/hover" />

## Empty

With no items the table shows a single "No data available" row. Fill the `empty`
slot to say something more useful — an `FEmptyState` fits neatly.

<Example file="table/empty" />

## API

<ApiTable name="FTable" />
