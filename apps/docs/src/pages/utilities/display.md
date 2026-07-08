# Display

Set the CSS `display` value, toggle visibility responsively, and control
overflow and float.

## Display

`d-none`, `d-inline`, `d-inline-block`, `d-block`, `d-flex`, `d-inline-flex`,
`d-table`, `d-table-row`, `d-table-cell`.

<div class="u-demo">
  <span class="u-tile d-inline-block ma-1">inline-block</span>
  <span class="u-tile d-inline-block ma-1">inline-block</span>
  <div class="u-tile d-block ma-1">block</div>
</div>

```html
<div class="d-flex">…</div>
<span class="d-block">now a block</span>
```

## Responsive visibility

Combine `d-none` with a breakpoint variant to show or hide by width. `d-none
d-md-flex` is hidden on phones and a flex row from `md` up; `d-md-none` hides
from `md` up.

```html
<!-- hidden on mobile, shown from md up -->
<div class="d-none d-md-block">desktop only</div>

<!-- shown on mobile, hidden from md up -->
<div class="d-md-none">mobile only</div>
```

Every `d-*` value takes `-sm`/`-md`/`-lg`/`-xl`/`-xxl`.

## Overflow

`overflow-auto`, `overflow-hidden`, `overflow-visible`, `overflow-scroll`, plus
single-axis `overflow-x-*` and `overflow-y-*`.

<div class="u-demo">
  <div class="u-fill overflow-y-auto pa-3" style="max-height: 90px; max-width: 260px">
    <p class="ma-0">This box has <code>overflow-y-auto</code>. Content taller than the box scrolls
    inside it instead of pushing the layout. Keep reading — there is more text here than fits,
    so a scrollbar appears on the right edge of the box.</p>
  </div>
</div>

## Float

`float-left`, `float-right`, `float-none`, and the RTL-aware `float-start` /
`float-end`. Responsive.

```html
<img class="float-left mr-3" src="…" />
<p>Text wraps around the floated image…</p>
```

## Reference

| Group    | Classes                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Display  | `d-none` · `d-inline` · `d-inline-block` · `d-block` · `d-flex` · `d-inline-flex` · `d-table` · `d-table-row` · `d-table-cell` (responsive) |
| Overflow | `overflow-auto` · `overflow-hidden` · `overflow-visible` · `overflow-scroll` · `overflow-x-*` · `overflow-y-*`                              |
| Float    | `float-none` · `float-left` · `float-right` · `float-start` · `float-end` (responsive)                                                      |
