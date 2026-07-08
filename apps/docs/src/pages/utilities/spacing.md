# Spacing

Control margin and padding with `m`/`p` helper classes. The scale is FusionUI's
spacing tokens — the same values components use — so spacing stays consistent
everywhere.

The class is built from **property + side + size**:

- **property** — `m` margin · `p` padding
- **side** — `a` all · `x` left+right · `y` top+bottom · `t` top · `b` bottom ·
  `l` left · `r` right · `s` inline-start · `e` inline-end
- **size** — `0`–`7` from the scale below (margins also take `auto` and
  negatives, e.g. `ma-n3`)

So `pa-4` is padding 16px on all sides, `mt-2` is margin-top 8px, `mx-auto`
centers a fixed-width block.

| Size  | `0` | `1` | `2` | `3`  | `4`  | `5`  | `6`  | `7`  |
| ----- | --- | --- | --- | ---- | ---- | ---- | ---- | ---- |
| Value | 0   | 4px | 8px | 12px | 16px | 24px | 32px | 48px |

## Padding

<div class="u-demo d-flex ga-4 align-center flex-wrap">
  <span class="u-fill pa-2"><span class="u-tile">pa-2</span></span>
  <span class="u-fill pa-4"><span class="u-tile">pa-4</span></span>
  <span class="u-fill pa-6"><span class="u-tile">pa-6</span></span>
</div>

```html
<div class="pa-2">…</div>
<div class="px-6 py-3">…</div>
```

## Margin

The dashed frames below share an edge; the margin classes push the tiles apart.

<div class="u-demo d-flex align-center flex-wrap">
  <span class="u-tile ma-0">ma-0</span>
  <span class="u-tile ma-2">ma-2</span>
  <span class="u-tile ma-5">ma-5</span>
</div>

```html
<div class="mt-4">…</div>
<div class="mx-auto" style="width: 200px">centered</div>
```

## Negative margin & auto

Margins accept `auto` (great for centering or pushing to one side) and negatives
`n1`–`n7` to pull elements outward.

<div class="u-demo d-flex align-center">
  <span class="u-tile">start</span>
  <span class="u-tile ms-auto">ms-auto →</span>
</div>

```html
<div class="d-flex">
  <div>start</div>
  <div class="ms-auto">pushed to the end</div>
</div>
```

## Responsive

Every spacing class takes a breakpoint infix — `pa-2 pa-md-6` is 8px of padding
that grows to 32px from the `md` breakpoint up.

## Reference

`{m|p}{a|x|y|t|b|l|r|s|e}-{0..7 | auto*}` — `*auto` and negatives (`-n1`…`-n7`)
are margin-only. All support `-sm`/`-md`/`-lg`/`-xl`/`-xxl`.

| Prefix                    | Property                              |
| ------------------------- | ------------------------------------- |
| `ma` / `pa`               | margin / padding (all sides)          |
| `mx` / `px`               | inline (left + right)                 |
| `my` / `py`               | block (top + bottom)                  |
| `mt` `mr` `mb` `ml`       | single physical side                  |
| `ms` / `me` · `ps` / `pe` | inline-start / inline-end (RTL-aware) |
