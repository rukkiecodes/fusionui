# Pagination

`FPagination` is the page strip you put under a table or a results grid. Bind
`v-model` to the current page and tell it how many pages there are with `length`;
it renders prev/next buttons, the page numbers, and collapses the middle into an
ellipsis when the list is long. It is a `<nav>`, and the current page carries
`aria-current="page"`.

## Default

`length` is the number of pages, `v-model` the one you are on.

<Example file="pagination/default" />

## Total visible

`total-visible` caps how many page buttons are drawn (7 by default). The first
and last page always stay put; everything the cap cannot fit collapses into an
ellipsis.

<Example file="pagination/total-visible" />

## Colors

`color` tints the active page and the hover wash with any theme color.

<Example file="pagination/colors" />

## Disabled

`disabled` freezes the whole control — useful while the next page of results is
still loading.

<Example file="pagination/disabled" />

## API

<ApiTable name="FPagination" />
