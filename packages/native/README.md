# @fusionui/native

FusionUI for mobile — Expo + React Native components that **mirror the web
component contracts** (same names, props, variants, states), share the same
design tokens, and carry the signature **liquid glass** identity to native via
Skia.

> What's shared with `@fusionui/vue`: token values, component API (names, props,
> variants, states), interaction/a11y semantics, and the visual identity. What's
> reimplemented: the rendering code (RN instead of Vue). `<FButton variant="primary" loading>`
> should feel identical on web and mobile.

## Install

```bash
npx expo install @shopify/react-native-skia react-native-reanimated
npm i @fusionui/native @fusionui/tokens
# iOS 26 real Liquid Glass (optional): npx expo install expo-glass-effect
```

## Usage

```tsx
import { FusionProvider, FButton, FCard, FInput, FSwitch, LiquidGlassView } from '@fusionui/native'

export default function App() {
  return (
    <FusionProvider theme="light">
      <FCard>
        <FInput label="Email" placeholder="you@example.com" />
        <FButton variant="elevated" color="primary" onPress={save}>
          Save
        </FButton>
        <FSwitch value={on} onValueChange={setOn} />
      </FCard>

      <LiquidGlassView radius={28} options={{ depth: 16, chromaticAberration: 0.4 }}>
        <Text>Frosted toolbar</Text>
      </LiquidGlassView>
    </FusionProvider>
  )
}
```

## Component parity

| Web (`@fusionui/vue`) | Native (`@fusionui/native`) | Shared contract                                                                                |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `<FBtn>`              | `<FButton>`                 | `variant` (elevated/flat/tonal/outlined/text), `color`, `size`, `loading`, `disabled`, `block` |
| `<FCard>`             | `<FCard>`                   | `flat`, `padding`, `radius`; Vuesax soft shadow                                                |
| `<FInput>`/`<FField>` | `<FInput>`                  | `label`, `value`/`onChangeText`, `disabled`, `error`, `message`, `color`                       |
| `<FSwitch>`           | `<FSwitch>`                 | `value`/`onValueChange`, `color`, `disabled`                                                   |
| `<FGlass>`            | `<LiquidGlassView>`         | `radius`, glass `options` (bezel/depth/ior/…); same SDF→Snell engine                           |

The `FButton` variants are a guaranteed **subset** of the web `allowedVariants`
(enforced by a unit test). More MVP components (Checkbox/Radio, Modal, Navbar,
Tooltip) are a fast-follow.

## Liquid glass on native

One physics model, two backends — the same `engine/liquid-glass` core as the web
package (SDF → surface normal → Snell refraction), here driving the GPU:

- **iOS 26+** → `expo-glass-effect` (`UIGlassEffect` — system-composited, live
  backdrop sampling, free).
- **Android / older iOS** → `@shopify/react-native-skia` `BackdropFilter`
  running `GLASS_SKSL` — the same refraction math transliterated to SKSL, with
  chromatic aberration at the rim.

The Android backdrop-sampling constraint is physics, not a bug: an app can't read
pixels behind an arbitrary native view, so the Skia path refracts what's _inside
its canvas_ — render the backdrop in-canvas, or snapshot it with
`useBackdropSnapshot`.

## Theme

`FusionProvider` feeds the `@fusionui/tokens` **native** output (durations in ms,
dimensions as numbers, shadows as `{color,offsetX,offsetY,blur,opacity}` objects).
`useFusionTheme()` reads it; `shadowStyle(token, elevation)` maps a shadow token
to RN's iOS `shadow*` + Android `elevation` in one call.

## Verification

`typecheck` + Vitest unit tests cover the pure layers: token parity (the native
palette equals the web palette, from one source), the shared glass engine math
(plateau refracts to zero), the shadow mapping, and the FButton↔FBtn variant
subset. Component rendering and the live glass effect require a device/simulator
(jest-expo / EAS) — out of scope for CI here.
