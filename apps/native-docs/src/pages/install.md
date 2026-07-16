# Getting started

FusionUI on mobile is **copy-in**, in the spirit of shadcn/ui: there's no component
package to install. You run one command, the component's source is written into
_your_ project, and from then on you own it — edit, theme and extend it freely.

## Initialize

From the root of your Expo app:

```bash
npx @rukkiecodes/native init
```

That writes a small `component.config.json` (where components should land) and copies
in the two you always want — **Text** and **Button**:

```
your-app/
  component.config.json        # { "outDir": "components/ui" }
  components/ui/
    text/    index.tsx types.ts const.ts helpers.ts
    button/  index.tsx types.ts
```

Then install the packages those components need — the command prints the exact line:

```bash
npx expo install expo-linear-gradient react-native-reanimated
```

> `react-native-reanimated` needs its Babel plugin — add `react-native-reanimated/plugin`
> as the **last** entry in `babel.config.js` (Expo's default config already includes it).

## Add more, on demand

Pull in any other component one at a time. Its source is copied into your `outDir`,
and its dependencies are printed for you:

```bash
npx @rukkiecodes/native add <name>
npx @rukkiecodes/native list          # see everything available
```

Useful flags: `--dir <path>` overrides the configured `outDir`; `--overwrite` replaces
existing files.

## Use them

```tsx
import { Text } from './components/ui/text'
import { Button } from './components/ui/button'

export default function Screen() {
  return (
    <>
      <Text.H1 color="primary">Welcome</Text.H1>
      <Button gradientColors={['#195bff', '#7d5fff']} onPress={save}>
        <Text color="#fff" weight="bold">
          Continue
        </Text>
      </Button>
    </>
  )
}
```

Each component page shows its exact usage and props. Copy the component in and it
runs in your Expo app straight away.

Next: [browse the components →](/components)

---

Components are adapted from [reacticx](https://github.com/rit3zh/reacticx) (MIT ©
rit3zh), rebranded for FusionUI.
