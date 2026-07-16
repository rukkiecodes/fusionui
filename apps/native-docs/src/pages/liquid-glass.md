# Liquid glass on native

The signature effect — a refraction slab over a live backdrop. The same
`engine/liquid-glass` core as the web package (SDF → surface normal → Snell
refraction) drives the GPU on mobile:

- **iOS 26+** → `expo-glass-effect` — the real `UIGlassEffect`, system-composited
  with live backdrop sampling.
- **Android / older iOS** → a `@shopify/react-native-skia` `BackdropFilter`
  running `GLASS_SKSL`, the same refraction math transliterated to SKSL, with
  chromatic aberration at the rim.

```tsx
import { LiquidGlassView } from '@rukkiecodes/native'
;<LiquidGlassView radius={28} style={{ padding: 20 }}>
  <Text>Frosted, refracted, live.</Text>
</LiquidGlassView>
```

## The Android backdrop limit

The Android backdrop-sampling limit is physics, not a bug: an app can't read
pixels behind an arbitrary native view, so the Skia path refracts what's _inside
its canvas_. Render the backdrop in-canvas, or snapshot it with
`useBackdropSnapshot`.

## Same engine, both platforms

`GLASS_SKSL`, `makeGlassUniforms`, `resolveOptions` and `DEFAULT_GLASS_OPTIONS`
are exported from `@rukkiecodes/native/engine/liquid-glass` — the identical
option surface and refraction constants as the web `<f-glass>`. Tune the bezel,
the refraction strength and the aberration once; both platforms honour it.

> A live, interactive glass Snack lands here alongside the remaining component
> pages. For now, the effect ships in the package and runs on device today.
