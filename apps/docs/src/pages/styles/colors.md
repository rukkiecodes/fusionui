# Colors

The palette is authored once in `@rukkiecodes/tokens` (`src/themes/light.json`,
`src/themes/dark.json`) and turned into CSS custom properties at runtime by the
theme engine. Nothing in the library hard-codes a hex value, and neither should
your app — read the variables instead.

## The palette

Nine colors per theme. `primary`, `success`, `danger` and `warning` are shared
across both themes; the neutrals and `secondary` are not.

| Color        | Light     | Dark      | Utilities                                        |
| ------------ | --------- | --------- | ------------------------------------------------ |
| `primary`    | `#195bff` | `#195bff` | `bg-primary` · `text-primary` · `border-primary` |
| `secondary`  | `#7d33ff` | `#9b6bff` | `bg-secondary` · `text-secondary` · …            |
| `success`    | `#46c93a` | `#46c93a` | `bg-success` · `text-success` · …                |
| `danger`     | `#ff4757` | `#ff4757` | `bg-danger` · `text-danger` · …                  |
| `warning`    | `#ffba00` | `#ffba00` | `bg-warning` · `text-warning` · …                |
| `dark`       | `#1e1e1e` | `#f4f7f8` | `bg-dark` · `text-dark` · …                      |
| `light`      | `#f4f7f8` | `#2a2c30` | `bg-light` · `text-light` · …                    |
| `background` | `#ffffff` | `#1e2023` | `bg-background` · …                              |
| `surface`    | `#ffffff` | `#26282c` | `bg-surface` · …                                 |

Note that `dark` and `light` are _roles_, not literal shades: they invert
between themes, so `bg-dark` stays a high-contrast tile in both.

<Example file="styles/palette" />

## Contrast colors

Every color has an `on-*` counterpart — the foreground you put on top of it.

| Color           | Light     | Dark      |
| --------------- | --------- | --------- |
| `on-primary`    | `#ffffff` | `#ffffff` |
| `on-secondary`  | `#ffffff` | `#ffffff` |
| `on-success`    | `#ffffff` | `#ffffff` |
| `on-danger`     | `#ffffff` | `#ffffff` |
| `on-warning`    | `#1e1e1e` | `#1e1e1e` |
| `on-light`      | `#2c3e50` | `#ffffff` |
| `on-background` | `#2c3e50` | `#ffffff` |
| `on-surface`    | `#2c3e50` | `#ffffff` |

If a theme defines a color without an `on-*` counterpart, the theme engine
derives one: it computes the relative luminance and picks black (`0,0,0`) above
a threshold of `0.18`, white (`255,255,255`) below it. `on-dark` is the example
— it isn't in the token file, so it resolves to white in the light theme (on
`#1e1e1e`) and to black in the dark theme (on `#f4f7f8`). Custom colors you add
to a theme get the same treatment for free.

## The variables are RGB triplets, not colors

This is the one thing to internalise before writing any CSS against FusionUI.

`--fui-theme-primary` does **not** hold `#195bff`. It holds three numbers:

```css
--fui-theme-primary: 25, 91, 255;
```

So the variable is not a usable color on its own — you have to wrap it:

```css
/* WRONG — `color: 25,91,255` is not a valid color. The declaration is dropped
   at computed-value time, silently: no color, no console warning. */
color: var(--fui-theme-primary);

/* RIGHT */
color: rgb(var(--fui-theme-primary));
background-color: rgba(var(--fui-theme-primary), 0.12);
border: 1px solid rgba(var(--fui-theme-primary), 0.24);
```

The triplet exists so that **any** color can be composed at **any** alpha from a
single token — a tonal fill at 12%, a hover wash at 8%, a focus ring at 24% —
without shipping a separate variable for every opacity. Every `--fui-theme-*`
variable follows this convention, as do `--fui-border-color`, `--fui-surface-2`
and `--fui-surface-3` below.

## Surface & emphasis variables

Alongside the palette, each theme contributes a set of per-surface variables:

| Variable                        | Light                           | Dark                           |
| ------------------------------- | ------------------------------- | ------------------------------ |
| `--fui-border-color`            | `44,62,80` (triplet)            | `255,255,255` (triplet)        |
| `--fui-border-opacity`          | `0.12`                          | `0.16`                         |
| `--fui-high-emphasis-opacity`   | `0.92`                          | `1`                            |
| `--fui-medium-emphasis-opacity` | `0.6`                           | `0.7`                          |
| `--fui-disabled-opacity`        | `0.38`                          | `0.5`                          |
| `--fui-surface-2`               | `244,247,248` (triplet)         | `38,40,44` (triplet)           |
| `--fui-surface-3`               | `240,243,244` (triplet)         | `28,30,33` (triplet)           |
| `--fui-shadow-rest`             | `0 5px 20px 0 rgba(0,0,0,0.05)` | `0 5px 20px 0 rgba(0,0,0,0.4)` |

The conversion rule is mechanical: a theme variable whose value is a hex string
becomes a triplet; anything else is passed through verbatim. That is why
`--fui-shadow-rest` is a complete `box-shadow` value and the only one in the
table you do _not_ wrap in `rgb()`.

Typical use — the standard hairline border, and a raised surface:

```css
.panel {
  background-color: rgb(var(--fui-surface-2));
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity));
  box-shadow: var(--fui-shadow-rest);
}
```

## Color utility classes

The theme generates four classes for every key in the active theme's palette and
injects them into the page at runtime:

| Class            | Declares                                                     |
| ---------------- | ------------------------------------------------------------ |
| `bg-{name}`      | `background-color: rgb(…)` **and** `color: rgb(… on-{name})` |
| `text-{name}`    | `color: rgb(…)`                                              |
| `border-{name}`  | `border-color: rgb(…)`                                       |
| `text-on-{name}` | `color: rgb(… on-{name})`                                    |

```html
<div class="bg-primary">white text, automatically</div>
<span class="text-danger">something went wrong</span>
<div class="border-success" style="border: 1px solid">approved</div>
```

`bg-*` sets the foreground too, so a colored tile is always legible without you
picking the text color. Add a color to your theme and its four classes appear
with it — nothing to register.

## The `!important` caveat

Read this before you try to restyle a colored component.

The generated color classes are injected into `@layer fui-utilities` — the
**last** cascade layer — and every declaration carries `!important`. Two
consequences:

1. They beat every component rule. Component CSS lives in the earlier
   `fui-components` layer, so `.text-primary` wins over anything a component
   says about its own `color`, no matter how specific that rule is.
2. A component therefore **cannot** color itself with these classes and still
   change color in a later state. `FBtn`'s outlined variant fills solid on
   `:focus-visible` and flips its label to the contrast color — an `!important`
   `.text-primary` on the root would freeze the label and break that.

That is why color-aware components don't put these classes on themselves. `FBtn`
writes two inline custom properties instead —

```css
--fui-variant-color: var(--fui-theme-primary); /* accent, as a triplet */
--fui-variant-on: var(--fui-theme-on-primary); /* its contrast */
```

— and derives every fill, border, hover wash, ripple and pressed state from
them. If you are writing your own component against FusionUI, copy that pattern:
color from a variable, not from a utility class. See
[Cascade layers](/styles/layers) for the full ordering rules, including why an
`!important` utility cannot be overridden even with your own `!important`.

## Named colors vs. any CSS color

Every `color` prop accepts either. The resolution happens in `useColor`: a value
that looks like a CSS color (`#…`, `rgb(…`, `hsl(…`, `var(--…`) is applied as an
inline style; anything else is treated as a theme color name and becomes one of
the utility classes above.

```html
<f-avatar color="primary" />
<!-- theme color → .bg-primary -->
<f-avatar color="#6d28d9" />
<!-- CSS color   → inline style -->
```

## Changing the palette

Pass your themes when you create the plugin. The `themes` map **replaces** the
built-in one rather than merging into it, so start from the token themes and
spread what you want to keep:

```ts
import { createFusionUI } from '@rukkiecodes/vue'
import { themes } from '@rukkiecodes/tokens'

createFusionUI({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        ...themes.light,
        colors: {
          ...themes.light.colors,
          primary: '#ec4899',
          brand: '#0f766e', // → --fui-theme-brand, --fui-theme-on-brand, .bg-brand, …
        },
      },
      dark: themes.dark,
    },
  },
})
```

A key you add is a full citizen: it gets its variable, a derived `on-*` contrast
color, and the four utility classes — nothing to register.

Switching, per-subtree themes and the `useTheme()` composable are covered in
[Theme & Colors](/getting-started/theme); the generated token outputs in
[Design tokens](/getting-started/design-tokens).
