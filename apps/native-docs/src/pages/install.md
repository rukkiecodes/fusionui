# Installation

**`@rukkiecodes/native`** is FusionUI for Expo + React Native — the same design
language as the web, reimplemented for the phone. Add it to any Expo project.

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

> **Reanimated** needs its Babel plugin. Add `react-native-reanimated/plugin` as
> the **last** entry in `babel.config.js` — Expo's default config includes it.

## Usage

Wrap your app in `FusionProvider` — the native counterpart of `createFusionUI`.
It feeds the `@rukkiecodes/tokens` native output to every component:

```tsx
import { FusionProvider, FButton, FCard, FInput } from '@rukkiecodes/native'

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

## Every variant runs live

Each component page carries a live **Expo Snack** per variant — a self-contained,
pure-RN mirror so it runs without a build step, but every value still traces to
`@rukkiecodes/tokens`. Edit inline in the browser, or press _My Device_ and scan
the QR with [Expo Go](https://expo.dev/go) to run it on your phone. The press
springs are [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and
the liquid glass is [Skia](https://shopify.github.io/react-native-skia/) — the same
engines the package ships, so the feel matches the web.

Next: [browse the components →](/components)
