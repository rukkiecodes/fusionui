# Shaders

`@fusionui/shaders` is the signature GPU layer — a small, **lazy-loaded** WebGL2
runtime and a catalogue of tasteful effects. The runtime never sits in the
critical path: it loads only when a surface scrolls into view, the browser
supports WebGL2, and the user hasn't asked to minimise motion. Otherwise the
surface shows a static CSS fallback that matches the live look.

<ShaderPlayground />

Switch effects and colours above. Pick `displace` and move your cursor over the
surface — only that effect tracks the pointer.

## Usage

```vue
<script setup lang="ts">
import { FShaderSurface } from '@fusionui/shaders'
</script>

<template>
  <FShaderSurface effect="gradient" color-a="#195bff" color-b="#7d33ff" style="height: 240px">
    <h2>Hero</h2>
  </FShaderSurface>
</template>
```

Or the `v-shader` directive on any element:

```vue
<div v-shader="{ effect: 'glow', colorA: '#195bff', colorB: '#7d33ff' }">…</div>
```

Register `<FShaderSurface>` + `v-shader` globally with the plugin:

```ts
import { FusionShaders } from '@fusionui/shaders'
app.use(FusionShaders)
```

## The catalogue

| effect     | tracks pointer | static fallback            | why it earns its place              |
| ---------- | -------------- | -------------------------- | ----------------------------------- |
| `gradient` | –              | CSS linear-gradient        | living depth behind hero surfaces   |
| `grain`    | –              | SVG `feTurbulence` texture | warms flat digital fills            |
| `glow`     | –              | CSS radial-gradient        | a breathing "alive / important" cue |
| `displace` | ✓              | repeating-linear-gradient  | physical, responsive hover          |

Every effect ships **(a)** a static CSS fallback, **(b)** a reduced-motion path
(it simply _is_ the fallback — the loop never starts), and **(c)** a one-line
reason it improves the component beyond decoration. The third rule is a review
gate, not a suggestion.

## Discipline

- **Lazy:** the WebGL runtime is a dynamic `import()` — a separate ~1.3 kB-gz
  chunk that loads on the first on-screen frame, never on initial paint. This
  docs site is fully usable with that chunk blocked.
- **Capability + preference gated:** no WebGL2 or `prefers-reduced-motion` →
  static fallback, runtime never fetched.
- **Battery-aware:** an `IntersectionObserver` pauses the render loop off-screen;
  the loop is FPS-capped (30 by default) with a device-pixel-ratio cap.
