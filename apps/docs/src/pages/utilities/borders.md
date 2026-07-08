# Borders

Add borders and round corners with token-driven helper classes.

## Border

`border` adds a 1px border on all sides; add a side letter for one edge:
`border-t` (top / block-start), `border-b` (bottom), `border-s` (inline-start),
`border-e` (inline-end). Width presets: `border-0`, `border-sm` (1px),
`border-md` (2px), `border-lg` (4px), `border-xl` (8px).

<div class="u-demo d-flex ga-4 flex-wrap">
  <span class="u-tile border pa-4">border</span>
  <span class="u-tile border-md pa-4">border-md</span>
  <span class="u-tile border-lg pa-4">border-lg</span>
  <span class="u-tile border-t border-md pa-4">border-t</span>
</div>

```html
<div class="border">1px all round</div>
<div class="border-md border-dashed">2px dashed</div>
```

## Style & opacity

`border-solid`, `border-dashed`, `border-dotted`, `border-double`. Retune the
border color's alpha with `border-opacity-0/25/50/75/100`.

<div class="u-demo d-flex ga-4 flex-wrap">
  <span class="u-tile border-md border-dashed pa-4">dashed</span>
  <span class="u-tile border-md border-dotted pa-4">dotted</span>
  <span class="u-tile border-md border-opacity-100 pa-4">opacity-100</span>
</div>

## Border radius

`rounded` applies the default radius; scale with `rounded-0`, `rounded-sm`,
`rounded-lg`, `rounded-xl`, `rounded-pill`, `rounded-circle`, `rounded-shaped`.
Target a side or corner: `rounded-t`, `rounded-b`, `rounded-s`, `rounded-e`, and
corners `rounded-ts` / `-te` / `-bs` / `-be` (logical, RTL-aware).

<div class="u-demo d-flex ga-4 flex-wrap align-center">
  <span class="u-block rounded-sm" style="width:56px;height:56px"></span>
  <span class="u-block rounded-lg" style="width:56px;height:56px"></span>
  <span class="u-block rounded-xl" style="width:56px;height:56px"></span>
  <span class="u-block rounded-pill" style="width:96px;height:56px"></span>
  <span class="u-block rounded-circle" style="width:56px;height:56px"></span>
  <span class="u-block rounded-shaped" style="width:56px;height:56px"></span>
</div>

```html
<div class="rounded-lg">20px corners</div>
<img class="rounded-circle" src="…" />
<div class="rounded-t-xl">rounded top only</div>
```

## Reference

| Group              | Classes                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Border             | `border` · `border-0` · `border-thin` · `border-sm` · `border-md` · `border-lg` · `border-xl` |
| Side               | `border-t` · `border-b` · `border-s` · `border-e`                                             |
| Style              | `border-solid` · `border-dashed` · `border-dotted` · `border-double` · `border-none`          |
| Opacity            | `border-opacity-0` · `-25` · `-50` · `-75` · `-100`                                           |
| Radius             | `rounded` · `rounded-0` · `-sm` · `-md` · `-lg` · `-xl` · `-pill` · `-circle` · `-shaped`     |
| Radius side/corner | `rounded-t` · `-b` · `-s` · `-e` · `-ts` · `-te` · `-bs` · `-be`                              |
