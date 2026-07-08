# Position

Set the CSS `position` value, pin to an edge, and change the cursor.

## Position

`position-static`, `position-relative`, `position-absolute`, `position-fixed`,
`position-sticky`.

<div class="u-demo">
  <div class="u-fill position-relative" style="height: 110px">
    <span class="u-tile position-absolute" style="top: 8px; left: 8px">absolute</span>
    <span class="u-tile position-absolute" style="bottom: 8px; right: 8px">absolute</span>
  </div>
</div>

```html
<div class="position-relative">
  <span class="position-absolute top-0 right-0">badge</span>
</div>
```

## Inset

Pin an absolutely/fixed-positioned element to an edge with `top-0`, `right-0`,
`bottom-0`, `left-0`.

<div class="u-demo">
  <div class="u-fill position-relative" style="height: 90px">
    <span class="u-block position-absolute top-0 left-0" style="width:40px;height:40px"></span>
    <span class="u-block position-absolute bottom-0 right-0" style="width:40px;height:40px"></span>
  </div>
</div>

## Cursor

`cursor-pointer`, `cursor-default`, `cursor-wait`, `cursor-text`, `cursor-move`,
`cursor-help`, `cursor-not-allowed`, `cursor-progress`, `cursor-grab`,
`cursor-grabbing`, `cursor-none`, `cursor-auto`. Hover the tiles:

<div class="u-demo d-flex ga-3 flex-wrap">
  <span class="u-tile cursor-pointer">pointer</span>
  <span class="u-tile cursor-help">help</span>
  <span class="u-tile cursor-not-allowed">not-allowed</span>
  <span class="u-tile cursor-grab">grab</span>
</div>

## Reference

| Group    | Classes                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Position | `position-static` · `position-relative` · `position-absolute` · `position-fixed` · `position-sticky`   |
| Inset    | `top-0` · `right-0` · `bottom-0` · `left-0`                                                            |
| Cursor   | `cursor-{auto\|default\|pointer\|wait\|text\|move\|help\|not-allowed\|progress\|grab\|grabbing\|none}` |
