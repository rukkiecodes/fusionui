# Text & typography

Alignment, wrapping, weight, transforms, and emphasis — without writing CSS.

> Text **colors** (`text-primary`, `text-success`, …) come from the theme and
> are documented under [Theme & Colors](/getting-started/theme). This page
> covers the structural text helpers.

## Alignment

`text-left`, `text-center`, `text-right`, `text-justify`, and the RTL-aware
`text-start` / `text-end`. Responsive — `text-center text-md-left`.

<div class="u-demo">
  <p class="u-fill pa-2 ma-0 mb-2 text-left">text-left</p>
  <p class="u-fill pa-2 ma-0 mb-2 text-center">text-center</p>
  <p class="u-fill pa-2 ma-0 text-right">text-right</p>
</div>

## Weight & style

`font-weight-light` `-regular` `-medium` `-bold`, plus `font-italic`.

<div class="u-demo">
  <p class="ma-0 mb-1 font-weight-light">font-weight-light</p>
  <p class="ma-0 mb-1 font-weight-regular">font-weight-regular</p>
  <p class="ma-0 mb-1 font-weight-medium">font-weight-medium</p>
  <p class="ma-0 mb-1 font-weight-bold">font-weight-bold</p>
  <p class="ma-0 font-italic">font-italic</p>
</div>

## Emphasis

Layer opacity onto the foreground color for hierarchy: `text-high-emphasis`
(92%), `text-medium-emphasis` (60%), `text-disabled` (38%).

<div class="u-demo">
  <p class="ma-0 mb-1 text-high-emphasis">text-high-emphasis</p>
  <p class="ma-0 mb-1 text-medium-emphasis">text-medium-emphasis</p>
  <p class="ma-0 text-disabled">text-disabled</p>
</div>

## Transform & decoration

`text-uppercase`, `text-lowercase`, `text-capitalize`, `text-none`;
`text-decoration-underline`, `-overline`, `-line-through`, `-none`.

<div class="u-demo">
  <p class="ma-0 mb-1 text-uppercase">text-uppercase</p>
  <p class="ma-0 mb-1 text-capitalize">text capitalize each word</p>
  <p class="ma-0 text-decoration-underline">text-decoration-underline</p>
</div>

## Wrapping & truncation

`text-no-wrap` keeps text on one line; `text-truncate` adds an ellipsis;
`text-break` breaks long words; `text-wrap`, `text-pre`, `text-pre-line`,
`text-pre-wrap` control whitespace. `text-mono` switches to the monospace stack.

<div class="u-demo">
  <p class="u-fill pa-2 ma-0 text-truncate" style="max-width: 260px">
    text-truncate — this line is far too long to fit and gets cut off with an ellipsis
  </p>
</div>

## Reference

| Group      | Classes                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Align      | `text-left` · `text-center` · `text-right` · `text-justify` · `text-start` · `text-end` (responsive)           |
| Weight     | `font-weight-light` · `-regular` · `-medium` · `-bold`                                                         |
| Style      | `font-italic`                                                                                                  |
| Emphasis   | `text-high-emphasis` · `text-medium-emphasis` · `text-disabled`                                                |
| Transform  | `text-none` · `text-capitalize` · `text-lowercase` · `text-uppercase`                                          |
| Decoration | `text-decoration-none` · `-underline` · `-overline` · `-line-through`                                          |
| Wrapping   | `text-wrap` · `text-no-wrap` · `text-truncate` · `text-break` · `text-pre` · `text-pre-line` · `text-pre-wrap` |
| Family     | `text-mono`                                                                                                    |
