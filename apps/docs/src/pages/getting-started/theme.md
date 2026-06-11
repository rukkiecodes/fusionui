# Theme & Colors

Vue DL ships a light and dark theme seeded with the Vuesax palette. Colors are
exposed as CSS variables (`--vd-theme-primary`, …) so components can apply alpha.

## Named colors

Every color-aware component accepts a named color or any CSS color:

<Example file="chip/closable" />

## Switching themes

Use the `useTheme()` composable:

```ts
import { useTheme } from 'vue-dl'

const theme = useTheme()
theme.toggle() // light <-> dark
theme.change('dark')
```

Try the toggle in the top bar of this site — it flips the whole page live.

## Customizing

```ts
createVueDL({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: { primary: '#1f74ff', success: '#46c93a' /* … */ },
      },
    },
  },
})
```
