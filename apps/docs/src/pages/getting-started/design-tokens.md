# Design tokens

FusionUI's design language lives in one place — the **`@rukkiecodes/tokens`**
package. Colors, spacing, radii, typography, motion and elevation are authored
once and generated for every platform:

| Output                                                                          | Consumed by                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------ |
| `@rukkiecodes/tokens/css` — `--fui-*` custom properties (light + dark scopes)   | any web app, SSR, no-JS                          |
| `@rukkiecodes/tokens/scss` — `$fui-*` SASS vars/maps                            | `@rukkiecodes/vue` component styles (build time) |
| `@rukkiecodes/tokens` — typed TS object                                         | web logic + the runtime theme engine             |
| `@rukkiecodes/tokens/native` — RN-friendly object (ms, numbers, shadow objects) | `@rukkiecodes/native`                            |

Components never hard-code a hex or pixel value — they read tokens. Re-theming a
brand is a token override, not a fork. Everything below is rendered live from the
generated TS output.

## Color

The FusionUI palette. Each named color is emitted as an RGB triplet
(`--fui-theme-primary: 25,91,255`) so components can compose alpha. Light and
dark values are shown side by side.

<TokensCatalog group="color" />

## Radius

Soft, Apple-like corners — 8px small controls, 12px buttons/inputs, 20px cards.

<TokensCatalog group="radius" />

## Spacing

A 4px base scale for consistent, generous whitespace.

<TokensCatalog group="space" />

## Elevation

The signature soft shadow — gentle, low-alpha, large-blur. A 0–24 ramp;
a representative slice is shown.

<TokensCatalog group="shadow" />

## Typography

Apple system font first, Inter as the refined cross-platform fallback, with
slightly tightened tracking.

<TokensCatalog group="type" />

## Motion

The heartbeat of the system — `0.25s ease` everywhere, `0.15s` for fast interactions,
a `-3px` hover lift.

<TokensCatalog group="motion" />
