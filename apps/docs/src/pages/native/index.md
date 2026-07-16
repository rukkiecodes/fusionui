# FusionUI for Expo

The mobile documentation for **`@rukkiecodes/native`** — the same design language
as the web, reimplemented for Expo + React Native. Everything below runs for real
in an Expo Snack: edit inline, or press _My Device_ and scan the QR with
[Expo Go](https://expo.dev/go) to run it on your phone.

<RouterLink to="/getting-started/native" class="native-back">← Back to the overview</RouterLink>

## Install

```bash
npx expo install @shopify/react-native-skia react-native-reanimated expo-linear-gradient
npm i @rukkiecodes/native @rukkiecodes/tokens
# iOS 26 real Liquid Glass (optional):
npx expo install expo-glass-effect
```

`react-native-reanimated` drives the press springs and the switch/focus
transitions; `expo-linear-gradient` backs the `gradient` button variant (it falls
back to a solid fill if absent); `@shopify/react-native-skia` renders the liquid
glass.

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

## Components, live

Each component runs in its **own Expo Snack** — a self-contained mirror rather than
an import, so it runs without a build step, but every value still comes from
`@rukkiecodes/tokens`. The press springs are
[Reanimated](https://docs.swmansion.com/react-native-reanimated/) and the liquid
glass is [Skia](https://shopify.github.io/react-native-skia/), the same engines the
package ships — so the feel matches the web.

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
browser via CanvasKit (`WithSkiaWeb`). On a real device this is the GPU
`BackdropFilter` (or iOS 26's `UIGlassEffect`).

<NativeSnack name="glass" deps="@shopify/react-native-skia" :height="640" />

## Styles — tokens drive everything

There is no stylesheet to maintain: `FusionProvider` feeds the
`@rukkiecodes/tokens` **native** output — durations in milliseconds, dimensions as
numbers, shadows as `{ color, offsetX, offsetY, blur, opacity }` objects (no CSS
units). The native palette is the _same_ palette as the web, generated from one
source, so a brand re-theme applies to both platforms at once.

```tsx
import { useFusionTheme, shadowStyle } from '@rukkiecodes/native'

function Panel() {
  const theme = useFusionTheme()
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.space[4],
        ...shadowStyle(theme.shadowRest, 4),
      }}
    />
  )
}
```

Colour, spacing, radii, type, motion, and elevation all resolve from the theme, so
a component never hard-codes a value and the web and the phone can't drift apart.

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
- **Android / older iOS** → a `@shopify/react-native-skia` `BackdropFilter` running
  `GLASS_SKSL`, the same refraction math transliterated to SKSL, with chromatic
  aberration at the rim.

The Android backdrop-sampling limit is physics, not a bug: an app can't read pixels
behind an arbitrary native view, so the Skia path refracts what's _inside its
canvas_. Render the backdrop in-canvas, or snapshot it with `useBackdropSnapshot`.
