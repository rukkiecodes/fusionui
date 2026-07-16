# Styles — tokens drive everything

There is no stylesheet to maintain. `FusionProvider` feeds the
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

## The token surface

| Group    | Shape                                          | Example                      |
| -------- | ---------------------------------------------- | ---------------------------- |
| `colors` | `Record<string, string>` (hex)                 | `theme.colors['on-primary']` |
| `radius` | `sm · md · lg · xl · pill · circle`            | `theme.radius.lg` → `20`     |
| `space`  | numeric scale (`1`–`6`) + `spacer`             | `theme.space[4]` → `16`      |
| `motion` | `duration.{base,fast}` (ms), `lift`, `sink`    | `theme.motion.duration.fast` |
| `font`   | `family.mono`, sizes, weights                  | `theme.font.family.mono`     |
| shadows  | `shadowRest`, `shadowStyle(shadow, elevation)` | `shadowStyle(rest, 4)`       |

## The token-driven style layer

Beyond raw tokens, `@rukkiecodes/native` ships the primitives that replace the
web's utility classes — `resolveVariant`, `withAlpha`, `boxStyle`, the `useTokens`
/ `useVariant` / `useBreakpoints` hooks, `FBox`, and the `FPressable` motion
wrapper. Components are built from these, so they stay consistent with the tokens
without a CSS cascade.

Next: [component parity →](/parity)
