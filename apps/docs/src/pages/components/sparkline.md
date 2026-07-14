# Sparkline

`FSparkline` is a word-sized chart: one series, no axes, no grid, no legend. It
belongs inside a stat card, a table cell or a sentence — wherever the shape of
the data matters more than its exact values. The geometry comes from the same
engine as `FLineChart`, so a sparkline and a full chart of the same numbers agree
down to the pixel.

Pass the series as `model-value` — plain numbers, or `{ value, label }` objects.
It renders as `role="img"` with a generated description, so give it an
`aria-label` when it carries meaning, or mark it `decorative` when the number
next to it already says everything.

## Trend

The default. `line-width` is the stroke, `color` takes a theme color or any CSS
color, and `min` / `max` pin the domain when several sparklines have to be read
against each other.

<Example file="sparkline/trend" />

## Bar

`type="bar"` draws one bar per value against a zero baseline — negative values
dip below it — and `line-width` becomes the bar width. `smooth` rounds the caps.

<Example file="sparkline/bar" />

## Smooth

`smooth` curves a trend line with a monotone interpolation, so it never
overshoots a data point on its way to the next one. Pass a number for a tighter
or looser curve.

<Example file="sparkline/smooth" />

## Fill & gradient

`fill` paints the area under a trend line. `gradient` takes a list of CSS colors
— read from the far end of `gradient-direction` (`top`, `bottom`, `left`,
`right`) back to the near end — and applies to the fill, or to the stroke itself
when there is no fill.

<Example file="sparkline/fill" />

## Auto-draw

`auto-draw` animates the series in on mount and whenever the data changes: a bare
trend line traces itself, a filled shape or a bar chart wipes up from the
baseline. `auto-draw-duration` and `auto-draw-easing` tune it. Under
`prefers-reduced-motion: reduce` the animation is skipped entirely and the final
geometry — which is what the path already holds — simply appears.

<Example file="sparkline/auto-draw" />

## Labels

`show-labels` prints a caption under each point, sized by `label-size` (in
viewBox units, and the viewBox grows to make room). The text is the item's
`label`, falling back to its value; the `label` slot receives `{ index, value }`
and can rewrite it.

<Example file="sparkline/labels" />

## API

<ApiTable name="FSparkline" />
