# Batch 05 — Components A: Foundation

**Depends on:** 02, 03, 04 · **Blocks:** 08, 09, 10 · **Parallel with:** 06, 07

## Goal
Ship the first wave of components — the visual proving ground that exercises the
runtime (02), theme (03) and icons (04) end-to-end and lets the docs site (09)
start previewing. These carry the most recognizable **Vuesax** styling.

## Components in this batch
`VdBtn`, `VdBtnGroup`, `VdIcon` (finalize from B04), `VdCard` (+ `VdCardTitle`,
`VdCardText`, `VdCardActions`, `VdCardMedia`), `VdAvatar`, `VdChip`, `VdAlert`,
`VdProgress` (linear + circular), `VdDivider`, `VdBadge`, `VdSpacer`.

## Component anatomy (standard pattern for ALL component batches)
Every component folder follows the Vuetify layout:
```
components/VdBtn/
├── VdBtn.tsx        # genericComponent + makeVdBtnProps + useRender
├── VdBtn.sass       # co-located styles using styles/tools + Vuesax tokens
├── _variables.scss  # component SASS tokens (!default)
└── index.ts         # export { VdBtn }
```
Authoring recipe:
1. `makeVdXProps = propsFactory({ ...makeComponentProps(), ...makeVariantProps(), ... }, 'VdX')`
2. In setup, pull composables: `provideTheme`, `useVariant`, `useColor`,
   `useBorder`, `useElevation`, `useRounded`, `useDensity`.
3. `useRender(() => <tag class={[...]} style={[...]} v-ripple={ripple}>…)`.
4. Styles via `@include tools.variant(...)`, `tools.elevation(...)`,
   `tools.states(...)` from Batch 03.

## Implementation notes per component

### VdBtn (flagship — port all six Vuesax variants)
- Props: `variant` (`elevated|flat|outlined|text|tonal|gradient|relief|line` —
  map Vuesax names to these), `color`, `size` (`x-small…x-large` + custom px),
  `rounded`, `icon` (icon-only round button), `prependIcon`/`appendIcon`,
  `loading` (shows VdProgress), `block`, `disabled`, `ripple`, `to`/`href` (router).
- Visuals: soft rest shadow; on hover colored glow `0 8px 25px -8px <color>`;
  ripple on click; gradient text-shadow; relief inset + sink-on-active. These are
  the Vuesax signatures — implemented in `tools/_variant.scss` (B03), consumed here.

### VdCard
- Slots: `media`, `title`/`header`, default, `actions`/`footer`.
- `$vd-shadow-card` rest shadow; `hover`/`actionable` prop → lift + image
  `scale(1.1)` zoom (Vuesax behavior). `rounded` default `md` (8px).

### VdAlert
- `type` (`success|info|warning|error`) → color + leading Feather icon via alias;
  `variant` (tonal default — soft 12% bg), `closable` (× via `$close` alias),
  `border` (start accent). Slide/scale dismiss transition.

### VdChip
- `color`, `variant` (tonal/outlined/elevated), `size`, `closable`, `prependIcon`,
  `pill`. Used later by Select/Table.

### VdAvatar
- `size`, `rounded`/`tile`, image slot, initials fallback, `color`.

### VdProgress (linear + circular)
- Circular = SVG stroke (drives VdBtn loading + the loading service in B08).
- Linear = track + indicator with `indeterminate` animation. `color`, `height`,
  `striped`.

### VdBadge, VdDivider, VdSpacer
- Badge: dot/content, position, color. Divider: `inset`, `vertical`. Spacer:
  flex-grow utility (Vuesax `vsSpacer`).

## Deliverables
- 11 components above, each with: TSX, SASS, `_variables.scss`, index, typed props.
- A `components/index.ts` barrel that the framework install loop consumes.
- One live example `.vue` per component placed in `apps/docs/src/examples/...`
  (so Batch 09 can render them immediately).
- Vitest unit test per component (render + key prop behavior).

## Acceptance criteria
- All render in the playground with correct Vuesax look in light & dark.
- `VdBtn` shows every variant; loading swaps in `VdProgress`; ripple fires.
- Theme color switch recolors all components reactively.
- `pnpm --filter vue-dl test` green for this batch.

## Risks
- Getting the Vuesax shadow/lift "feel" exact is iterative — compare against
  Vuesax docs screenshots; keep tokens centralized in B03 so tuning is one place.
