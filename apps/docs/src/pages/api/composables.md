# Composables

FusionUI's components are assembled from a handful of composables, and the ones
worth using outside the library are exported. That is deliberate: the moment you
need a component FusionUI doesn't ship, you should be able to build it out of the
same pieces — same theme, same tokens, same BEM classes, same defaults — rather
than bolting something foreign onto the side of the design system.

They fall into two groups. The first (`useTheme`, `useDisplay`, `useDefaults`,
`useForm`) you reach for in application code. The second — the styling
primitives — you reach for when authoring a component.

## useTheme

Reads and drives the theme created by `createFusionUI({ theme })`. Injected, so
it must be called in `setup`.

```ts
function useTheme(): ThemeInstance

interface ThemeInstance {
  name: Ref<string> //           the active theme's key
  current: ComputedRef<ThemeDefinition> //  its { dark, colors, variables }
  themes: Ref<Record<string, ThemeDefinition>> // every registered theme
  isDark: ComputedRef<boolean>
  themeClasses: ComputedRef<string> //  e.g. 'fui-theme--dark'
  styles: ComputedRef<string> //        the generated CSS custom properties
  change: (name: string) => void //     switch to a theme by key
  toggle: (themes?: [string, string]) => void // defaults to ['light', 'dark']
  install: (app: App) => void //        called for you by the plugin
}
```

A theme switch, which is what most apps want:

```vue
<script setup lang="ts">
import { useTheme } from '@rukkiecodes/vue'

const { isDark, toggle, current } = useTheme()
</script>

<template>
  <f-btn variant="text" @click="toggle()">
    {{ isDark ? 'Light mode' : 'Dark mode' }}
  </f-btn>

  <!-- the live palette, if you need a raw value -->
  <span :style="{ color: current.colors.primary }">primary</span>
</template>
```

`change('midnight')` jumps straight to a named theme, and `toggle(['light',
'midnight'])` flips between any two. Both rewrite the `--fui-theme-*` custom
properties and swap the `fui-theme--*` class on `<html>`, so every component
follows without re-rendering. `change()` on an unregistered key is a no-op.

Note that `current` and `isDark` are refs on a plain object: in `<script setup>`
destructure them (as above) so the template unwraps them, or write
`theme.isDark.value` in script code.

## useDisplay

The breakpoint state — width, height, and the derived flags. It is a **reactive
object, not refs**: read through it (`display.mobile`) and don't destructure, or
you'll take a snapshot.

```ts
function useDisplay(): DisplayInstance

interface DisplayInstance {
  width: number
  height: number
  name: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' // the current breakpoint
  xs: boolean // exactly this breakpoint …
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  smAndUp: boolean // … or this one and wider
  mdAndUp: boolean
  lgAndUp: boolean
  mobile: boolean // below `mobileBreakpoint` (default: `lg`)
  thresholds: DisplayThresholds
  update: () => void
}
```

```vue
<script setup lang="ts">
import { useDisplay } from '@rukkiecodes/vue'

const display = useDisplay()
</script>

<template>
  <f-navbar v-if="display.mdAndUp">…</f-navbar>
  <f-bottom-nav v-else>…</f-bottom-nav>

  <f-dialog :fullscreen="display.mobile">…</f-dialog>
</template>
```

The defaults are `xs: 0`, `sm: 600`, `md: 960`, `lg: 1280`, `xl: 1920`,
`xxl: 2560` — the same numbers the [utility classes](/utilities/flexbox) are
generated from, so `display.mdAndUp` and `.d-md-flex` always agree. Override
them, and what counts as "mobile", at the plugin:

```ts
createFusionUI({
  display: {
    mobileBreakpoint: 'md',
    thresholds: { md: 900 },
  },
})
```

It is SSR-safe: with `ssr: true` the width starts at `0` and the first client
`resize` (or a manual `update()`) fills it in.

## useDefaults

The consumer side of [`FDefaultsProvider`](/components/providers). Wrap your own
component's `props` and every value the caller did **not** pass explicitly falls
back to the provided per-component default, then the `global` default, then the
prop's own `default`.

```ts
function useDefaults<T extends Record<string, unknown>>(props: T, name?: string): T
```

`name` defaults to the component's own `name` option. The return value is a
proxy over `props` with the same shape — use it everywhere you'd have used
`props`.

```ts
import { useDefaults } from '@rukkiecodes/vue'

export const MyCard = defineComponent({
  name: 'MyCard',
  props: { density: { type: String, default: 'default' }, elevation: [Number, String] },
  setup(props) {
    const resolved = useDefaults(props)
    // <f-defaults-provider :defaults="{ MyCard: { density: 'compact' } }">
    // now makes resolved.density === 'compact' unless the caller set it.
  },
})
```

Outside any provider it returns `props` untouched, so a component using it stays
usable standalone. `provideDefaults(defaults)` does the other half — it merges a
new layer over the injected one for a subtree, which is exactly what
`FDefaultsProvider` renders.

## useForm

Injects the surrounding [`FForm`](/components/form), or `null` when there isn't
one — so a control built on it still works on its own.

```ts
function useForm(): FormProvide | null

interface FormProvide {
  isValid: ComputedRef<boolean | null> // null = nothing validated yet
  validate: () => boolean //              run every field's rules
  reset: () => void //                    clear values + validation
  resetValidation: () => void //          keep values, clear errors
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  register: (field: FormField) => void // used by useValidation
  unregister: (id: number) => void
}
```

The three-state `isValid` matters: `null` means untouched, so a submit button
can stay enabled until the user has actually produced an error.

```vue
<script setup lang="ts">
import { useForm } from '@rukkiecodes/vue'

const form = useForm()
</script>

<template>
  <f-btn :disabled="form?.isValid.value === false" @click="form?.validate()"> Save </f-btn>
</template>
```

## useValidation

The engine underneath every FusionUI form control: it runs `rules` against the
component's `modelValue`, exposes the messages, and registers the field with the
surrounding form (unregistering on unmount). Pair it with `makeValidationProps()`
so your component takes the standard validation props.

```ts
function useValidation(props: {
  rules: ValidationRule[] //  (value: unknown) => string | boolean, or a literal
  error: boolean
  errorMessages: string | string[]
  successMessages: string | string[]
  validateOn: 'input' | 'blur' | 'submit'
  modelValue?: unknown
}): {
  errorMessages: ComputedRef<string[]> //  your messages + the rules' failures
  successMessages: ComputedRef<string[]>
  isValid: ComputedRef<boolean | null> //  null while pristine
  isPristine: Ref<boolean>
  validate: () => boolean
  reset: () => void
  resetValidation: () => void
}
```

```ts
import { makeValidationProps, useValidation, propsFactory } from '@rukkiecodes/vue'

const makeMyFieldProps = propsFactory(
  {
    modelValue: String,
    ...makeValidationProps(),
  },
  'MyField'
)

// in setup(props):
const { errorMessages, isValid, validate } = useValidation(props)
```

A rule returning `true` passes; returning a string fails with that string as the
message. With `validateOn: 'input'` (the default) the rules re-run on every
model change; `'blur'` and `'submit'` leave it to you and to
`FForm.validate()`. Note the value is read from the live component instance, so
the composable sees the current `modelValue` even if you never pass it in.

## useProxiedModel

Two-way binding that degrades gracefully. When the parent binds both the prop
and its `update:` listener (that is, uses `v-model`), the component is
controlled and the parent owns the value. When it doesn't, the component keeps
its own internal state and still works — which is what makes an uncontrolled
`<f-select>` behave sensibly.

```ts
function useProxiedModel<Props, Prop extends keyof Props, Inner = Props[Prop]>(
  props: Props,
  prop: Prop,
  defaultValue?: Props[Prop],
  transformIn?: (value?: Props[Prop]) => Inner, //  incoming prop → internal shape
  transformOut?: (value: Inner) => Props[Prop] //   internal shape → emitted value
): WritableComputedRef<Inner>
```

```ts
import { useProxiedModel } from '@rukkiecodes/vue'

// in setup(props) — declare emits: ['update:modelValue']
const model = useProxiedModel(props, 'modelValue')

model.value = 'next' // emits update:modelValue, and updates internally
```

The transforms are how a single-select and a multi-select share one
implementation: normalise to an array coming in, unwrap on the way out.

## Styling primitives

These are the composables you use to build a component that _belongs_ in
FusionUI. Each one takes the props (a plain object, ref or getter) and returns
classes and/or styles to spread onto your root element; each has a matching
`make*Props()` factory so your component takes the same props the built-ins do.

They generate **BEM classes scoped to your component's name**: the second
argument defaults to `getCurrentInstanceName()`, which maps `FBtn` → `fui-btn`,
so `useSize` emits `fui-btn--size-large` and your stylesheet can style it. Pass
an explicit name if your component is registered under a different one.

| Composable     | Props factory          | Returns                                         |
| -------------- | ---------------------- | ----------------------------------------------- |
| `useVariant`   | `makeVariantProps()`   | `variantClasses`, `colorClasses`, `colorStyles` |
| `useSize`      | `makeSizeProps()`      | `sizeClasses`, `sizeStyles`                     |
| `useDensity`   | `makeDensityProps()`   | `densityClasses`                                |
| `useRounded`   | `makeRoundedProps()`   | `roundedClasses`                                |
| `useElevation` | `makeElevationProps()` | `elevationClasses`                              |
| `useBorder`    | `makeBorderProps()`    | `borderClasses`                                 |
| `useColor`     | —                      | `colorClasses`, `colorStyles`                   |
| `useDimension` | `makeDimensionProps()` | `dimensionStyles`                               |

All of them return `ComputedRef`s.

- **`useVariant(props, name?)`** — takes `{ color, variant }`. `variant` is one
  of `elevated` · `flat` · `tonal` · `outlined` · `text` · `plain` · `gradient`
  · `relief` · `line` · `floating` · `shadow`, and becomes
  `fui-<name>--variant-<variant>`. It also resolves `color` for you: on the
  background for the filled variants (`elevated`, `flat`, `floating`,
  `gradient`, `relief`) and on the text for the rest.
- **`useSize(props, name?)`** — a named size (`x-small` · `small` · `default` ·
  `medium` · `large` · `x-large`) becomes a class; anything else (`40`, `'3rem'`)
  becomes inline `width`/`height`.
- **`useDensity(props, name?)`** — `default` · `comfortable` · `compact` →
  `fui-<name>--density-compact`.
- **`useRounded(props, name?)`** — `rounded` as a boolean gives the component's
  own radius; as a string it maps to the shared `rounded-*` utility classes
  (`rounded="lg"`, `rounded="t-xl"`). `tile` forces `rounded-0`.
- **`useElevation(props)`** — `elevation` `0`–`24` → the `elevation-N` utility
  class. Not name-scoped: elevation is a global token scale.
- **`useBorder(props, name?)`** — `true` for the component's own border, or a
  string mapping to the `border-*` utilities.
- **`useColor(colors)`** — the primitive under all of the above. Give it
  `{ background, text, border }`; theme color names become utility classes
  (`bg-primary`), while raw CSS colors (`#0f172a`, `rgb(…)`, `var(…)`) become
  inline styles. That is what keeps "any color, not just the palette" true across
  the library. `useTextColor(color)` is the one-argument shorthand.
- **`useDimension(props)`** — `width` · `height` · `minWidth` · `minHeight` ·
  `maxWidth` · `maxHeight`, numbers turning into px.

Put together, a card that behaves like a first-class FusionUI surface:

```tsx
import {
  makeVariantProps,
  makeRoundedProps,
  makeElevationProps,
  makeDimensionProps,
  useVariant,
  useRounded,
  useElevation,
  useDimension,
  propsFactory,
} from '@rukkiecodes/vue'

export const makeMyPanelProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'flat' }),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeDimensionProps(),
  },
  'MyPanel'
)

export const MyPanel = defineComponent({
  name: 'MyPanel',
  props: makeMyPanelProps(),
  setup(props, { slots }) {
    const { variantClasses, colorClasses, colorStyles } = useVariant(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { dimensionStyles } = useDimension(props)

    return () => (
      <div
        class={[
          'my-panel',
          variantClasses.value,
          colorClasses.value,
          roundedClasses.value,
          elevationClasses.value,
        ]}
        style={[colorStyles.value, dimensionStyles.value]}
      >
        {slots.default?.()}
      </div>
    )
  },
})
```

`<MyPanel color="primary" variant="tonal" rounded="lg" :elevation="4" />` now
does what every other FusionUI component does with those props — including
respecting `FDefaultsProvider` if you add `useDefaults(props)`.

Two more factories round this out: `makeComponentProps()` (the pass-through
`class` / `style`) and `makeTagProps()` (a `tag` prop, defaulting to `div`).

## useGroup / useGroupItem

Selection state shared between a parent and its items — the machinery behind
`FBtnToggle`, `FChipGroup`, `FItemGroup`, `FTabs` and `FWindow`. The parent
provides, the item injects, and they're joined by an `InjectionKey` you own, so
groups never capture each other's items.

```ts
function useGroup(props: GroupProps, injectKey: InjectionKey<GroupProvide>): GroupProvide
function useGroupItem(
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>
): GroupItemProvide | null // null when there is no group above
```

`makeGroupProps()` gives the parent `modelValue`, `multiple`, `mandatory`
(`true`, or `'force'` to guarantee a selection from the start), `max` and
`selectedClass`. `makeGroupItemProps()` gives each item `value`, `disabled` and
its own `selectedClass`.

```ts
// parent
const group = useGroup(props, MyGroupKey)
// group.selected.value → the selected values
// group.items.value    → [{ id, value }]

// item
const item = useGroupItem(props, MyGroupKey)
// item?.isSelected.value, item?.toggle(), item?.select(true)
// item?.selectedClass.value → the group's class + its own, while selected
```

The parent's `modelValue` is proxied (see `useProxiedModel`), so a single-select
group emits a value and a `multiple` group emits an array, from one code path.

## Signature-layer composables

`useLiquidGlass`, `useGooey` and `useChartDimensions` drive
[`FGlass`](/components/liquid-glass), [`FGoo`](/components/goo) and
[`FLineChart`](/components/chart), and `useLayout` is what
[`FMain`](/components/layout) uses to inset itself under the bars. They are part
of the [Labs](/labs) surface — the least settled part of the API — and today the
components, not the composables, are the supported way to use them. Their
signatures, for when you're reading the source:

```ts
// Registers the SVG displacement filter and returns the styles to bind.
useLiquidGlass(
  target: Ref<HTMLElement | null>,
  options?: Ref<Partial<GlassOptions>> | Partial<GlassOptions>
): {
  glassStyle: Ref<CSSProperties>      // bind to the glass element
  highlightStyle: Ref<CSSProperties>  // bind to the rim overlay child
  refracting: Ref<boolean>            // true only where real refraction runs
  field: Ref<GlassFieldMaps | null>
  update: () => void
}

// Runs the metaball simulation and hands back geometry to render.
useGooey(
  container: Ref<HTMLElement | null>,
  blobs: Blob[],
  options?: UseGooeyOptions
): {
  system: GooSystem
  path: Ref<string>                                        // contour mode
  circles: Ref<Array<{ cx: number; cy: number; r: number }>> // filter mode
  running: Ref<boolean>
  setPointer: (x: number, y: number) => void
  clearPointer: () => void
  impulse: (index: number, vx: number, vy: number) => void
  wake: () => void
}

// Observes an element and gives you the measured plot rect for a chart.
useChartDimensions(
  container: Ref<HTMLElement | null>,
  margins?: Partial<Margins>
): { dims: PlotRect } // reactive: width, height, innerWidth, innerHeight, margin

// The accumulated inset of every active layout item.
useLayout(): {
  hasLayout: boolean
  mainStyles: ComputedRef<CSSProperties>
}
```
