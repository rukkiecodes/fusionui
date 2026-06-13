# Native (mobile)

FusionUI extends to mobile via **`@fusionui/native`** — Expo + React Native
components that mirror the web component contracts, share the same design
tokens, and carry the signature liquid glass identity to native via Skia.

You can't run a Vue component inside React Native, so "same components" means
**three shared layers + two implementations**: the token values, the component
API (names, props, variants, states), the interaction/a11y semantics, and the
visual identity are shared; only the rendering code is reimplemented.
`<FButton variant="primary" loading>` feels identical on web and mobile.

## Preview

<NativePreview />

## Run it live

The same screen, running for real in **Expo Snack** — edit the code inline, or
press _My Device_ and scan the QR with [Expo Go](https://expo.dev/go) to run it
on your phone. The components are inlined as pure React Native (Snack can't
import the unpublished `@fusionui/native`), but every value comes straight from
`@fusionui/tokens` — so this is what ships on a device.

<NativeSnack />

## Install

```bash
npx expo install @shopify/react-native-skia react-native-reanimated
npm i @fusionui/native @fusionui/tokens
# iOS 26 real Liquid Glass (optional):
npx expo install expo-glass-effect
```

## Usage

```tsx
import { FusionProvider, FButton, FCard, FInput, LiquidGlassView } from '@fusionui/native'

export default function App() {
  return (
    <FusionProvider theme="light">
      <FCard>
        <FInput label="Email" placeholder="you@example.com" />
        <FButton variant="elevated" color="primary" onPress={save}>
          Save
        </FButton>
      </FCard>
    </FusionProvider>
  )
}
```

## Component parity

| Web (`@fusionui/vue`)  | Native (`@fusionui/native`) | Shared contract                                                                    |
| ---------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `<f-btn>`              | `<FButton>`                 | `variant`, `color`, `size`, `loading`, `disabled`, `block`                         |
| `<f-card>`             | `<FCard>`                   | `flat`, `padding`, `radius`                                                        |
| `<f-input>`            | `<FInput>`                  | `label`, `value`, `disabled`, `error`, `message`                                   |
| `<f-switch>`           | `<FSwitch>`                 | `value`, `color`, `disabled`                                                       |
| `<f-glass>`            | `<LiquidGlassView>`         | `radius`, glass `options` — same SDF→Snell engine                                  |
| navbar + sidebar shell | `<FShell>`                  | the fluid goo junction, drawn with Skia from the same `engine/shell` path commands |

A unit test enforces that the native `FButton` variants are a subset of the web
`allowedVariants`, so the two can't silently drift.

## Liquid glass on native

The same `engine/liquid-glass` core as the web package (SDF → surface normal →
Snell refraction) drives the GPU on mobile:

- **iOS 26+** → `expo-glass-effect` — the real `UIGlassEffect`, system-composited
  with live backdrop sampling.
- **Android / older iOS** → a `@shopify/react-native-skia` `BackdropFilter`
  running `GLASS_SKSL`, the same refraction math transliterated to SKSL, with
  chromatic aberration at the rim.

The Android backdrop-sampling limit is physics, not a bug: an app can't read
pixels behind an arbitrary native view, so the Skia path refracts what's _inside
its canvas_. Render the backdrop in-canvas, or snapshot it with
`useBackdropSnapshot`.

## Tokens drive everything

`FusionProvider` feeds the `@fusionui/tokens` **native** output — durations in
milliseconds, dimensions as numbers, shadows as `{ color, offsetX, offsetY,
blur, opacity }` objects (no CSS units). The native palette is the _same_ Vuesax
palette as the web, generated from one source, so a brand re-theme applies to
both platforms at once.
