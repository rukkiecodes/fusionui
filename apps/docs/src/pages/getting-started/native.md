# Native (mobile)

FusionUI extends to mobile via **`@rukkiecodes/native`** — Expo + React Native
components that mirror the web component contracts, share the same design
tokens, and carry the signature liquid glass identity to native via Skia.

You can't run a Vue component inside React Native, so "same components" means
**three shared layers + two implementations**: the token values, the component
API (names, props, variants, states), the interaction/a11y semantics, and the
visual identity are shared; only the rendering code is reimplemented.
`<FButton variant="primary" loading>` feels identical on web and mobile.

## Components, live

Each component runs for real in its **own Expo Snack** — edit the code inline, or
press _My Device_ and scan the QR with [Expo Go](https://expo.dev/go) to run it on
your phone. The press springs are [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
and the liquid glass is [Skia](https://shopify.github.io/react-native-skia/), the
same engines the package uses — so the feel matches the web. Each Snack is a
self-contained mirror rather than an import of `@rukkiecodes/native`, so it can run
without a build step, but every value still comes from `@rukkiecodes/tokens`.

### Button

<NativeSnack name="button" deps="react-native-reanimated,expo-linear-gradient" :height="620" />

### Input

<NativeSnack name="input" deps="react-native-reanimated" :height="600" />

### Switch

<NativeSnack name="switch" deps="react-native-reanimated" :height="520" />

### Card

<NativeSnack name="card" deps="react-native-reanimated" :height="560" />

### Alert

<NativeSnack name="alert" deps="react-native-reanimated,expo-linear-gradient" :height="720" />

### Liquid glass

The signature effect — a Skia refraction slab over a live backdrop, rendered in the
browser via CanvasKit (`WithSkiaWeb`). On a real device this is the GPU `BackdropFilter`
(or iOS 26's `UIGlassEffect`).

<NativeSnack name="glass" deps="@shopify/react-native-skia" :height="640" />

## Install

```bash
npx expo install @shopify/react-native-skia react-native-reanimated expo-linear-gradient
npm i @rukkiecodes/native @rukkiecodes/tokens
# iOS 26 real Liquid Glass (optional):
npx expo install expo-glass-effect
```

`react-native-reanimated` drives the press springs and the switch/focus
transitions; `expo-linear-gradient` backs the `gradient` button variant (it
falls back to a solid fill if absent); `@shopify/react-native-skia` renders the
liquid glass.

## Usage

```tsx
import { FusionProvider, FButton, FCard, FInput, LiquidGlassView } from '@rukkiecodes/native'

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

| Web (`@rukkiecodes/vue`) | Native (`@rukkiecodes/native`) | Shared contract                                                                    |
| ------------------------ | ------------------------------ | ---------------------------------------------------------------------------------- |
| `<f-btn>`                | `<FButton>`                    | `variant`, `color`, `size`, `loading`, `disabled`, `block`                         |
| `<f-card>`               | `<FCard>`                      | `flat`, `padding`, `radius`                                                        |
| `<f-input>`              | `<FInput>`                     | `label`, `value`, `disabled`, `error`, `message`                                   |
| `<f-switch>`             | `<FSwitch>`                    | `value`, `color`, `disabled`                                                       |
| `<f-alert>`              | `<FAlert>`                     | `variant`, `color`, `type`, `title`, `text`, `closable`, `progress`                |
| `<f-glass>`              | `<LiquidGlassView>`            | `radius`, glass `options` — same SDF→Snell engine                                  |
| navbar + sidebar shell   | `<FShell>`                     | the fluid goo junction, drawn with Skia from the same `engine/shell` path commands |

Unit tests enforce that the native `FButton` and `FAlert` variant unions are
subsets of their web counterparts, so the platforms can't silently drift.

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

`FusionProvider` feeds the `@rukkiecodes/tokens` **native** output — durations in
milliseconds, dimensions as numbers, shadows as `{ color, offsetX, offsetY,
blur, opacity }` objects (no CSS units). The native palette is the _same_ Vuesax
palette as the web, generated from one source, so a brand re-theme applies to
both platforms at once.
