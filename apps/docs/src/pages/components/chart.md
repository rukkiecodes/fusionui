# Chart

FusionUI ships a charting **engine**, not a chart library. It gives you the
correct math — scales, ticks, curves, shapes, stats — and emits
**renderer-agnostic path commands**, so the same geometry draws as an SVG
`<path>` on web or an `SkPath` on native. `FLineChart` is a _reference_
component built on top: copy it as the starting point for your own charts.

<ChartPlayground />

## Usage

```vue
<script setup lang="ts">
import { FLineChart } from '@fusionui/vue'

const series = [
  { x: 'Mon', y: 12 },
  { x: 'Tue', y: 19 },
  // …
]
</script>

<template>
  <FLineChart :data="series" curve="monotone" area :tick-count="6" />
</template>
```

`curve` accepts `monotone` (default, honest) · `linear` · `catmullRom` ·
`step` / `stepBefore` / `stepAfter` · `basis`.

## Build your own (the pattern)

`FLineChart` is a worked example. The pattern is always: measure → scales →
curve → `pathToSvg` → axes from ticks.

```ts
import { useChartDimensions } from '@fusionui/vue'
import { scalePoint, scaleLinear, line, axisTicks, pathToSvg, curves, extent } from '@fusionui/vue'

const { dims } = useChartDimensions(root)
const x = scalePoint(
  data.map(d => d.x),
  [0, dims.innerWidth]
)
const y = scaleLinear(extent(data.map(d => d.y)), [dims.innerHeight, 0]).nice(6)
const pts = data.map(d => [(x(d.x) ?? 0) + x.bandwidth() / 2, y(d.y)] as [number, number])
const d = pathToSvg(line(pts, { curve: curves.monotone }))
// render <path :d="d" /> and map axisTicks(y, 6) to <text>/<line>
```

## Why an engine

Chart libraries make the choices for you. This is the layer underneath — the
primitives. The math is verified, not asserted: continuous scales round-trip
exactly (`s.invert(s(v)) === v`, essential for tooltips/brushing), ticks land on
1-2-5 round numbers, **`curveMonotoneX` provably never overshoots the data**,
pie slices sum to exactly 2π, and stacks sum to their column totals.

## API surface

- **Scales** — `scaleLinear`, `scaleLog`, `scaleTime`, `scaleBand`, `scalePoint`
- **Ticks** — `ticks`, `tickStep`, `niceDomain`, `timeTicks`, `formatNumber`
- **Curves** — `curveMonotoneX`, `curveCatmullRom`, `curveStep*`, `curveBasis`, `curves`
- **Shapes** — `line`, `area`, `stack`, `bars`, `barPath`, `pie`, `arc`
- **Stats** — `extent`, `bin`, `linearRegression`
- **Axis** — `axisTicks`, `bandAxisTicks`
- **Path** — `pathToSvg`, `pathToCanvas`, `PathBuilder`
