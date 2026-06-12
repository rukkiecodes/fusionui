# Vue DL — Design Language (Vuesax v4 × Apple)

> This document supersedes the original "Vuesax look" tokens in
> `03-theme-design-tokens.md`. The library and documentation should follow the
> **Vuesax v4** (vuesax-next) visual language — softer, larger radii; refined
> blue-gray text; colored floating shadows — blended with **Apple** cues:
> system/SF typography, generous whitespace, restrained borders, balanced
> padding/margins.
>
> Reference clones studied: `vuesax-next/packages/vuesax` (v4 components) and
> `vuesax-next/packages/vuepress-theme-vuesax` (docs).

## 1. The five Apple cues we adopt

1. **Font** — Apple system font first (`-apple-system, BlinkMacSystemFont, 'SF Pro Display'`),
   then **Inter** as the refined cross-platform fallback. The docs load Inter so
   non-Apple devices match. Slight negative tracking (`-0.011em`, headings to `-0.03em`).
2. **Borders** — minimal/subtle: 1px hairlines at ~7–9% opacity; controls use a
   2px **transparent** border that colors on focus (no heavy outlines).
3. **Padding** — comfortable control padding; inputs `2px 14px` / 44px min-height.
4. **Margins** — vertical rhythm in docs (h2 `56px` top, paragraphs `14px`).
5. **Whitespace** — generous: docs gutter `40px`, content max `920px`, example
   preview padding `40px`, sidebar `264px`.

## 2. Color palette (Vuesax v4)

| Token | Light | Dark |
|---|---|---|
| primary | `#195BFF` | `#195BFF` |
| secondary | `#7D33FF` | `#9B6BFF` |
| success | `#46C93A` | `#46C93A` |
| danger | `#FF4757` | `#FF4757` |
| warning | `#FFBA00` | `#FFBA00` |
| background | `#FFFFFF` | `#1E2023` |
| surface | `#FFFFFF` | `#26282C` |
| **on-surface (body text)** | `#2C3E50` | `#FFFFFF` |
| light | `#F4F7F8` | `#2A2C30` |
| surface-2 (input fill) | `#F4F7F8` | `#26282C` |
| surface-3 | `#F0F3F4` | `#1C1E21` |

Curated `on-*`: white on primary/secondary/success/danger, `#1E1E1E` on warning,
`#2C3E50` on light/background/surface. Colors are emitted as RGB triplets
(`--vd-theme-primary: 25,91,255`) for alpha composition.

## 3. Radius (softer, Apple-like)

| Token | Value | Used by |
|---|---|---|
| `--vd-radius-sm` | **8px** | small controls, list items, options |
| `--vd-radius-md` | **12px** | **buttons, inputs, select, menus** (default) |
| `--vd-radius-lg` | **20px** | **cards**, popups, example boxes |
| `--vd-radius-xl` | 28px | large surfaces |
| pill | 9999px | chips |

Buttons scale radius with size: x-small 7 · small 9 · default 12 · large 15 · x-large 20.

## 4. Shadows (the signature)

- **Resting** (`$vd-shadow-rest`): `0 5px 20px 0 rgba(0,0,0,.05)` — cards, menus.
- **Colored hover lift** (`$vd-shadow-hover-spread`): `0 10px 20px -10px <color>`
  with `translateY(-3px)`. Floating: `0 8px 20px -6px <color>`.
- Elevation scale 0–24 retained for the `elevation-*` utility.
- Dark mode shadow opacity rises (`.05 → .4`).

## 5. Motion

`0.25s ease` everywhere (the Vuesax heartbeat); fast interactions `0.15s ease`.
Hover lifts `-3px`; relief sinks `+3px`.

## 6. Typography scale

- Family: Apple/SF → Inter → system. Weights 400 / 500 / 600.
- Body 16px, line-height ~1.5 (app) / 1.72 (docs prose).
- Docs headings: h1 `2.6rem`, h2 `1.7rem`, h3 `1.25rem` (tightened tracking).
- Mono: `'SF Mono', source-code-pro, Menlo, Monaco, Consolas`.

## 7. Documentation aesthetic

- Translucent, blurred top bar (`backdrop-filter: saturate(180%) blur(20px)`).
- Sidebar 264px, pill-rounded nav links, uppercase section labels.
- Content max 920px, 40px gutter, 48px top padding.
- Example "showcase" card: 20px radius, 40px preview padding, subtle border +
  `0 5px 20px rgba(0,0,0,.04)` shadow, toolbar with source/copy.
- Code panel dark (`#1d1f2b`), mono font.

## 8. Implementation status

Applied in code (this revision): theme palette + `surface-2/3` (theme.ts),
radii/font/spacing tokens (`settings/_variables.scss`), shadows
(`settings/_elevation.scss`), `-3px` lift (`tools/_states`, `_variant`),
component radius remaps (VdBtn 12, VdCard 20, VdField/VdInputNumber/VdSelect 12 +
gray input fill), base typography (`main.scss`), and the docs redesign
(`apps/docs` Inter + `docs.scss`). New components from Batch 08 onward must use
these tokens; earlier components already updated.
