# Batch 04 — Icon System + Feather Icon Package

**Depends on:** 01, 02 · **Blocks:** 05, 06, 07, 08 · **Parallel with:** 03

## Goal
Build the icon abstraction (`<VdIcon>` + icon-set resolver, modeled on Vuetify's
`composables/icons.tsx`) and ship the 287 Feather SVGs as `@vue-dl/icons-feather`,
the **default** icon set. Provide a documented pipeline to author additional
custom icons in the same Feather visual style (24×24, `stroke="currentColor"`,
2px stroke, round caps/joins).

## Deliverables
1. `createIcons()` + `IconSymbol` + `useIcon()` resolver.
2. Icon render components: `VdSvgIcon`, `VdClassIcon`, `VdComponentIcon`.
3. `<VdIcon>` public component (size, color via theme, spin, tag).
4. Icon alias system (`$close`, `$success`, `$prev` …) → semantic icons used
   internally by other components.
5. `@vue-dl/icons-feather` package generated from `feather.zip` (287 icons) with
   tree-shakeable per-icon exports + an "all" aggregate set.
6. A build script that converts Feather SVGs → typed icon modules.
7. Custom-icon authoring guide + generator script (`add-icon`).

## File layout
```
packages/vue-dl/src/
├── composables/icons.tsx     # createIcons, useIcon, VdSvg/Class/ComponentIcon
├── components/VdIcon/VdIcon.tsx
└── iconsets/
    └── feather.ts            # binds the feather set component

packages/icons-feather/
├── scripts/build-icons.ts    # SVG → modules generator
├── svg/                      # raw feather svgs (extracted from feather.zip)
├── src/
│   ├── index.ts              # export * (all icons) + `aliases`
│   └── icons/                # generated: bell.ts, activity.ts, ...
└── package.json              # exports: '.', './bell', etc.
```

## Implementation notes

### Feather SVG shape (verified from `feather.zip`)
Each icon is `viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` with one or more
`<path>/<polyline>/<circle>/<line>` children — **not** a single `d` path. So the
icon set must carry **inner SVG markup**, not just a path string. Two viable
representations:

- **(Recommended) Component icons:** each icon = a tiny functional component that
  renders the inner nodes. `useIcon` routes these through `VdComponentIcon`.
  Preserves multi-node Feather icons exactly and is fully tree-shakeable.
- Raw-children string set: store inner markup string, render via `v-html` inside
  the SVG wrapper (simpler, slightly less safe). Keep component icons as default.

### Generator (`build-icons.ts`)
1. Read each `svg/*.svg`.
2. Strip the outer `<svg>` (the wrapper is provided by `VdSvgIcon`/`VdComponentIcon`),
   keep inner nodes; convert kebab attrs → camelCase for JSX (`stroke-width` →
   `strokeWidth`).
3. Emit `src/icons/<name>.ts`:
   ```ts
   import { defineFeatherIcon } from '../runtime'
   export const bell = defineFeatherIcon('bell', (h) => [
     h('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
     h('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' }),
   ])
   ```
4. Emit `src/index.ts` re-exporting all + an `aliases` map binding semantic names
   (`close → x`, `success → check-circle`, `warning → alert-triangle`,
   `prev → chevron-left`, `next → chevron-right`, `dropdown → chevron-down`,
   `delete → trash-2`, `clear → x-circle`, …). These satisfy the internal aliases
   other components reference.
5. Generate `package.json#exports` per icon for deep imports.

### `useIcon` resolver (port of Vuetify `icons.tsx`)
```ts
const iconData = computed(() => {
  let icon = toValue(props)
  if (typeof icon === 'string' && icon.startsWith('$'))
    icon = icons.aliases?.[icon.slice(1)]          // semantic alias
  if (typeof icon !== 'string') return { component: VdComponentIcon, icon }
  const setName = Object.keys(icons.sets).find(s => icon.startsWith(`${s}:`))
  const name = setName ? icon.slice(setName.length + 1) : icon
  const set  = icons.sets[setName ?? icons.defaultSet]
  return { component: set.component, icon: name }
})
```
- Default config wires the Feather set as `defaultSet: 'feather'`, so
  `<vd-icon icon="bell" />` "just works".
- Still supports `icon="feather:bell"`, custom component icons, and raw SVG.

### `<VdIcon>` component
Props: `icon` (IconValue), `size` (token or px), `color` (theme/custom → reuse
`useColor` from Batch 02), `start`/`end` (margin helpers for use inside buttons),
`spin`. Renders the resolved set component. Size maps to `font-size`/`width`.

### Default plugin registration
`createIcons` default: `{ defaultSet: 'feather', sets: { feather }, aliases }`.
Importing `vue-dl` pulls `@vue-dl/icons-feather` as a dependency so the default
set is always available; consumers can swap/extend sets.

### Custom-icon authoring
- `pnpm --filter @vue-dl/icons-feather add-icon <name> <path-to-svg>`: drop a
  24×24 stroke SVG into `svg/`, rerun generator. Document the Feather constraints
  (2px stroke, round caps, currentColor) so new icons match.
- Document registering a wholly separate custom set in user apps via
  `createVueDL({ icons: { sets: { my: {...} } } })`.

## Acceptance criteria
- `<vd-icon icon="bell" />` renders the correct multi-path Feather bell.
- `<vd-icon icon="$success" color="success" />` resolves the alias + theme color.
- Tree-shaking: importing one icon in an app bundle does not pull all 287.
- `add-icon` produces a working module that renders.

## Risks
- Multi-node Feather icons rule out the single-path-string shortcut some libs use
  — the generator must preserve all child nodes (covered above).
- Keep the generator deterministic (sorted output) so diffs stay clean.
