# Goo

`FGoo` is a real gooey / metaball surface with honest physics — not a
`blur()` + `contrast()` screen-space trick. It computes the metaball scalar
field, traces the **0.5 isocontour with marching squares** into vector
geometry, and moves the blobs with genuine surface tension, viscosity, gather
and volume. The bridge that forms between two blobs is a real surface you can
query, not a bloom.

<GooPlayground />

Move your cursor through the field — the blobs flee (or chase, flip the
`pointer` sign) and the surface re-bridges in real time. Lower `reach` for
longer goo bridges; raise `gather` to pull a scattered clump into one body.

## Usage

```vue
<script setup lang="ts">
import { FGoo } from '@rukkiecodes/vue'
</script>

<template>
  <!-- a gooey field that coalesces and reacts to the cursor -->
  <FGoo :count="7" :pointer="-600" mode="contour" style="width: 100%; height: 320px" />
</template>
```

Or drive the system directly for a custom component:

```ts
import { useGooey } from '@rukkiecodes/vue'

const root = ref<HTMLElement | null>(null)
const { path, impulse, setPointer } = useGooey(root, myBlobs, {
  mode: 'contour', // true vector isosurface ('filter' = fast SVG goo filter)
  params: { field: { kernel: 'cubic', threshold: 0.5 } },
})
// render <path :d="path" /> inside an <svg> sized to root
```

## Soft-body droplet

For a single squishy blob (a gooey _button_), the pressurised spring-mass
`SoftBody` holds its volume, deforms when poked, and wobbles back:

```ts
import { SoftBody } from '@rukkiecodes/vue'

const drop = new SoftBody({ cx: 130, cy: 120, radius: 60 })
drop.poke(px, py, -2000, 90) // press inward
// each frame: drop.step(dt); render drop.toPath()
drop.area() / drop.restArea // ~1.0 — it holds its volume
```

## Render modes & performance

| mode      | what it is                                                                       | cost                                                    |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `contour` | the true vector isosurface (marching squares) — crisp at any zoom, exact bridges | marches each frame; great for hero/interactive elements |
| `filter`  | blob circles through an SVG goo filter (blur + alpha contrast)                   | cheap; for many instances or backgrounds                |

The sim **auto-sleeps** when kinetic energy settles and wakes on interaction, so
an idle gooey background costs ~nothing. Under `prefers-reduced-motion` the
field settles once to a resting frame and never animates.

## Options

| prop        | default       | meaning                                                                         |
| ----------- | ------------- | ------------------------------------------------------------------------------- |
| `count`     | `6`           | number of auto-seeded blobs (or pass `blobs`)                                   |
| `kernel`    | `'cubic'`     | `cubic` (controllable) · `inverseSquare` (longest reach) · `gaussian` (softest) |
| `reach`     | `0.5`         | merge reach 0..1 — **lower reaches further** (field threshold)                  |
| `cohesion`  | `45`          | surface tension pulling the fluid together                                      |
| `gather`    | `4`           | centroid pull (0 = free-float)                                                  |
| `viscosity` | `1.4`         | settling damping                                                                |
| `mode`      | `'contour'`   | `contour` (vector isosurface) or `filter`                                       |
| `pointer`   | `0`           | cursor force: `+` attracts, `−` repels, `0` off                                 |
| `cell`      | `8`           | marching-squares grid px (contour mode); lower = smoother + slower              |
| `color`     | theme primary | fill of the goo                                                                 |

## API

<ApiTable name="FGoo" />
