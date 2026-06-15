# @rukkiecodes/tokens

The single source of design truth for FusionUI. Colors, spacing, radii,
typography, motion and elevation are authored once and generated for every
platform.

## Source

- `src/tokens/base.json` — theme-independent design tokens (radius, spacing,
  typography, motion, opacity, z-index, breakpoints, the 0–24 elevation ramp).
- `src/themes/light.json`, `src/themes/dark.json` — the two default theme color
  sets, authored in the runtime `ThemeDefinition` shape (palette + per-surface
  variables).

## Generated outputs

`node build.mjs` (run by `pnpm build`) regenerates `dist/`:

| Path                             | Format                                                          | Consumed by                         |
| -------------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| `dist/css/tokens.css`            | `--fui-*` custom properties, light + dark scopes                | any web app / SSR                   |
| `dist/scss/_tokens.scss`         | `$fui-*` SASS vars + `$fui-shadows` map                         | `@rukkiecodes/vue` component styles |
| `dist/ts/index.js` + `.d.ts`     | typed object (incl. theme defs)                                 | web logic + theme engine            |
| `dist/native/index.js` + `.d.ts` | RN-friendly object (ms, numbers, shadow objects — no CSS units) | `@rukkiecodes/native`               |

`dist/` is committed so consumers and CI need no extra build step.

## Package exports

```ts
import tokens, { radius, shadows, themes } from '@rukkiecodes/tokens'
import native from '@rukkiecodes/tokens/native'
import '@rukkiecodes/tokens/css' // CSS custom properties
// '@rukkiecodes/tokens/scss'             // SASS partial (@forward / @use)
```

## Note on tooling

The plan's recommended generator was Style Dictionary. We use a small hand-rolled
generator instead, a deliberate deviation under FusionUI.txt §12 ("change a
default with reason"): the established `--fui-*` variable names — notably the
composite `--fui-transition` and `--fui-transition-duration` — do not map cleanly
onto Style Dictionary's systematic path-based naming, so adopting it would force a
rename sweep across every component stylesheet and risk the pixel-identical
guarantee. The generator owns the two transforms the plan called for (RGB triplet
for web alpha composition; milliseconds for React Native) and keeps the package
dependency-free. The token JSON is DTCG-shaped, so moving to Style Dictionary
later remains straightforward.
