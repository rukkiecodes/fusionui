# Liquid glass

`FGlass` is FusionUI's signature surface — a real refractive lens, not a frosted
blur. One physics model (SDF → surface normal → Snell's-law refraction →
displacement) bends the backdrop at the rim while the plateau stays perfectly
readable. That readable-centre-with-a-lensing-edge is the iOS-26 behaviour, and
it falls out of the optics for free.

<GlassPlayground />

Drag the slab across the backdrop: the rim lenses the stripes underneath while
the middle passes through undistorted. Lower the IOR toward 1 to flatten the
bend; raise depth and bezel to thicken the glass.

## Usage

```vue
<script setup lang="ts">
import { FGlass } from '@fusionui/vue'
</script>

<template>
  <FGlass :radius="28" :depth="16" :ior="1.45" interactive>
    <nav class="toolbar">…</nav>
  </FGlass>
</template>
```

Or drive the engine on any element with the composable:

```ts
import { useLiquidGlass } from '@fusionui/vue'

const el = ref<HTMLElement | null>(null)
const { glassStyle, highlightStyle, refracting } = useLiquidGlass(el, {
  bezelWidth: 22,
  depth: 16,
  ior: 1.45,
  profile: 'lens',
})
```

The displacement map regenerates only on resize or an option change
(`ResizeObserver` + rAF). While you drag or scroll, `backdrop-filter` resamples
the live backdrop through the _existing_ map — zero per-frame JavaScript.

## Browser truth table

The refraction rides on an SVG filter inside `backdrop-filter`. Support differs,
so `FGlass` detects the capability and always renders _something_ convincing —
never a broken filter.

| Engine                         | Path                                         | Result                |
| ------------------------------ | -------------------------------------------- | --------------------- |
| Chromium (Chrome, Edge, Brave) | SVG `feDisplacementMap` in `backdrop-filter` | full rim refraction   |
| Safari / Firefox               | `blur` + `saturate` + rim highlight + bevel  | frosted approximation |
| `prefers-reduced-transparency` | opaque surface                               | solid panel, no blur  |
| `prefers-reduced-motion`       | refraction kept, press transition dropped    | static                |

## Options

| prop          | default                  | meaning                                          |
| ------------- | ------------------------ | ------------------------------------------------ |
| `radius`      | `24`                     | corner radius px (also drives the lens geometry) |
| `bezel`       | `18`                     | width px of the light-bending rim                |
| `depth`       | `14`                     | slab thickness px — scales how hard light bends  |
| `ior`         | `1.45`                   | index of refraction (glass ≈ 1.45–1.52)          |
| `profile`     | `'lens'`                 | `'lens'` (iOS look) or `'smooth'`                |
| `blur`        | `2`                      | backdrop blur px before refraction               |
| `saturation`  | `1.6`                    | backdrop saturation multiplier                   |
| `tint`        | `rgba(255,255,255,0.10)` | tint laid over the glass                         |
| `interactive` | `false`                  | press-to-squish like an iOS control              |

## Where it earns its keep

Liquid glass is opt-in, never default-on. Reach for it where a surface floats
over content and depth reads as quality: a scrolled navbar, a sidebar overlay, a
dialog or popup, a floating toolbar. Use it sparingly — overused, it cheapens the
identity.
