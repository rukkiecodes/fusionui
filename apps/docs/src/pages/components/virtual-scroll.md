# Virtual & Infinite Scroll

Two ways to survive a list that is too long for the DOM. `FVirtualScroll` keeps
the whole data set in memory but only renders the rows you can see.
`FInfiniteScroll` keeps the DOM small by never having the whole data set: it asks
you for the next batch as the reader approaches the edge.

## Virtual scroll

Give it `items` and a fixed `item-height` and it is pure arithmetic: only the
rows intersecting the viewport (plus a `buffer` of pixels above and below) exist
in the DOM, while padding stands in for the rest so the scrollbar still measures
the full list. `item-key` keeps row identity stable across a slide of the window.

<Example file="virtual-scroll/basic" />

### Dynamic heights

Leave `item-height` out and rows are measured after they render, feeding a
prefix-sum index. Unmeasured rows are assumed to be `estimated-item-height` tall,
so the scrollbar is honest from the first frame and corrects itself as rows come
into view.

<Example file="virtual-scroll/dynamic" />

### Scrolling to a row

The component exposes `scrollToIndex(index)` — reach it with a template ref. It
works on both paths, measured or estimated.

<Example file="virtual-scroll/scroll-to" />

## Infinite scroll

`FInfiniteScroll` puts a sentinel just past the active edge and emits `load` with
`{ side, done }` when the reader comes within range. Call `done` when the fetch
settles — `'ok'` to arm the next request, `'empty'` when there is nothing left,
`'error'` to show the message and a retry button — and nothing else fires until
you do. `side` picks the edge (`end`, `start` for a chat log that grows upward,
or `both`), and `margin` decides how early the request goes out.

<Example file="virtual-scroll/infinite" />

### Manual mode

`mode="manual"` swaps the sentinel for a "Load more" button. That button is also
the automatic fallback wherever `IntersectionObserver` is unavailable, so the
list never becomes a dead end. `load-more-text`, `empty-text`, `error-text` and
`retry-text` re-word it; the `load-more`, `loading`, `empty` and `error` slots
replace it entirely. A side that has reported `empty` or `error` can be re-armed
with the exposed `reset(side?)`.

<Example file="virtual-scroll/infinite-manual" />

## API

<ApiTable name="FVirtualScroll" />

<ApiTable name="FInfiniteScroll" />
