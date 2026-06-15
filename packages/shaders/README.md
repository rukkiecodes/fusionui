# @rukkiecodes/shaders

FusionUI's signature shader layer — a small, **lazy-loaded** WebGL2 runtime and a
catalogue of tasteful effects. The runtime never sits in the critical path: it
loads only when a surface scrolls into view, the browser supports WebGL2, and the
user hasn't asked to minimise motion. Otherwise the surface shows a static CSS
fallback.

## Usage

```vue
<script setup lang="ts">
import { FShaderSurface } from '@rukkiecodes/shaders'
</script>

<template>
  <FShaderSurface effect="gradient" color-a="#195bff" color-b="#7d33ff" style="height: 240px">
    <h2>Hero</h2>
  </FShaderSurface>
</template>
```

Or the directive on any element:

```vue
<div v-shader="{ effect: 'glow', colorA: '#195bff', colorB: '#7d33ff' }">…</div>
```

Register both globally with the plugin:

```ts
import { FusionShaders } from '@rukkiecodes/shaders'
app.use(FusionShaders)
```

## Effect catalogue

| effect     | reads pointer | static fallback            | reason to exist                   |
| ---------- | ------------- | -------------------------- | --------------------------------- |
| `gradient` | –             | CSS linear-gradient        | living depth behind hero surfaces |
| `grain`    | –             | SVG `feTurbulence` texture | warms flat digital fills          |
| `glow`     | –             | CSS radial-gradient        | a breathing "alive/important" cue |
| `displace` | ✓             | repeating-linear-gradient  | physical, responsive hover        |

Every effect has **(a)** a static CSS fallback, **(b)** a reduced-motion path
(the fallback — the loop never starts), and **(c)** a one-line `rationale` for why
it improves the component beyond decoration. That third rule is a review gate.

## Discipline

- **Lazy:** the WebGL runtime (`runtime/gl.ts`) is a dynamic `import()` — a
  separate chunk that loads on first on-screen frame, never on initial paint.
- **Capability + preference gated:** no WebGL2 or `prefers-reduced-motion` →
  static fallback, runtime never fetched.
- **Battery-aware:** an `IntersectionObserver` pauses the render loop off-screen,
  and the loop is FPS-capped (30 by default) with a device-pixel-ratio cap.

## Authoring an effect

Implement `ShaderEffect`: a `#version 300 es` fragment shader using the shared
uniforms (`u_time`, `u_resolution`, `u_pointer`, `u_colorA`, `u_colorB`,
`u_intensity`), a `fallback(colorA, colorB, intensity)` returning CSS, and a
`rationale`. GLSL correctness reference: `extras/GLSL` (the Khronos spec).
