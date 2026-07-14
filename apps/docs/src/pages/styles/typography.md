# Typography

One font stack, three weights, slightly negative tracking. FusionUI does not ship
a type scale of named heading classes — components size their own text in `rem`
and you own the document's headings.

## Tokens

Emitted as custom properties on `:root`, in the `fui-tokens` layer.

| Custom property             | Value                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--fui-font-family`         | `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| `--fui-font-family-mono`    | `'SF Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`                                                        |
| `--fui-font-size-root`      | `16px`                                                                                                                                 |
| `--fui-font-weight-regular` | `400`                                                                                                                                  |
| `--fui-font-weight-medium`  | `500`                                                                                                                                  |
| `--fui-font-weight-bold`    | `600`                                                                                                                                  |
| `--fui-letter-spacing`      | `-0.011em`                                                                                                                             |

The stack is Apple-system-first — SF on macOS and iOS, Segoe on Windows, Roboto
on Android — with **Inter** sitting in the middle as the refined cross-platform
fallback if you choose to load it. Nothing is fetched for you: FusionUI ships no
`@font-face` and no web font, so there is no network cost and no FOUT out of the
box. If you want Inter guaranteed everywhere, load it yourself; the stack will
pick it up.

`--fui-letter-spacing` is `-0.011em` — a hair tighter than default, which is what
makes the UI read as typeset rather than as a browser default.

There is no `bold` beyond 600 and no `light` token. The heaviest weight in the
system is semibold; if a design asks for 700+, that's a deviation, not a token.

## The base rule

FusionUI applies its typography through a single class, `fui-application`, in the
`fui-base` layer:

```css
.fui-application {
  font-family: var(--fui-font-family);
  line-height: 1.5;
  letter-spacing: -0.011em;
  background-color: rgb(var(--fui-theme-background));
  color: rgba(var(--fui-theme-on-background), var(--fui-high-emphasis-opacity, 0.92));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Put it on your app root to inherit the font, the tracking, the page background
and the high-emphasis foreground:

```html
<div id="app" class="fui-application">…</div>
```

Note the foreground is not opaque: it's the theme's `on-background` at
`--fui-high-emphasis-opacity` (0.92 in light, 1 in dark). Body text is
deliberately a touch softer than pure black.

Components that teleport to `<body>` (`FDialog`, `FBottomSheet`) land outside
that element, so their stylesheets restate `font-family: var(--fui-font-family)`
themselves — they will look right even if you never add the class.

## What an override actually changes

The distinction matters, and it isn't obvious:

- **`--fui-font-family` is read at runtime.** Component stylesheets reference it
  through `var()`, so redefining it re-fonts the whole library instantly:

  ```css
  :root {
    --fui-font-family: 'Inter', system-ui, sans-serif;
  }
  ```

  Your rule is unlayered, so it beats the `fui-tokens` layer without
  `!important` — see [Cascade layers](/styles/layers).

- **The weights and the tracking are compiled in.** Component SCSS reads those
  tokens at _build_ time (`settings.$fui-font-weight-medium` → literal `500`), so
  redefining `--fui-font-weight-medium` or `--fui-letter-spacing` in your CSS
  will **not** restyle a button. The custom properties exist so that _your_ CSS
  can stay token-driven. To change them library-wide, change the value in
  `@rukkiecodes/tokens` and rebuild — see
  [Design tokens](/getting-started/design-tokens).

- **`--fui-font-size-root` is a record, not a rule.** FusionUI never sets
  `font-size` on `html`. The token documents the 16px baseline that the library's
  `rem` sizes assume; if your app changes the root size, FusionUI scales with it.

## Utilities

Alignment, weight, transform, decoration, wrapping, truncation, emphasis and the
monospace switch are all covered by the text utility classes — see
[Text & typography utilities](/utilities/text) for the full reference.

Two details that belong here:

- `font-weight-light` maps to **300**, which is the one weight with no token
  behind it. Use it knowing the system font may synthesise it.
- `text-mono` is the class form of `--fui-font-family-mono`; both point at the
  same stack.

Text **colors** (`text-primary`, `text-danger`, …) are generated by the theme, not
by the text utilities — they're documented under [Colors](/styles/colors).
