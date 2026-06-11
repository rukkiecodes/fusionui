# Batch 02 — Core Framework Runtime & Component Utilities

**Depends on:** 01 · **Blocks:** 04, 05, 06, 07, 08, 10, 11 · **Parallel with:** 03, 04

## Goal
Build the runtime spine of `vue-dl`: the `createVueDL()` plugin installer, the
provide/inject system, and the component-authoring utilities (`propsFactory`,
`defineComponent`, `genericComponent`, `useRender`) plus the foundational
composables. This is the layer every component sits on. Modeled directly on
Vuetify's `src/framework.ts` + `src/util/*` + `src/composables/*`.

## Deliverables
1. `createVueDL(options)` factory with `install(app)`.
2. Inject `Symbol`s + provider scaffolding for: defaults, display, theme, icons,
   locale (theme/icons land in Batches 03/04 — here we wire the slots).
3. Global component + directive registration loop and component aliases.
4. Component utilities: `propsFactory`, `defineComponent`/`genericComponent`,
   `useRender`, `getCurrentInstanceName`.
5. Foundational composables: `defaults`, `display`, `component` (class/style/tag),
   `dimension`, `elevation`, `rounded`, `border`, `density`, `variant`, `color`,
   `proxiedModel` (v-model), `group`/`groupItem`.
6. Directives: `v-ripple`, `v-click-outside`, `v-intersect` (ripple is core to the
   Vuesax look).
7. Public entry (`src/index.ts` / `entry-bundler.ts`) + type exports.

## File layout
```
packages/vue-dl/src/
├── framework.ts            # createVueDL()
├── index.ts                # public exports
├── entry-bundler.ts        # bundle entry (components + directives + createVueDL)
├── util/
│   ├── propsFactory.ts
│   ├── defineComponent.tsx # defineComponent + genericComponent + useRender
│   ├── getCurrentInstance.ts
│   ├── injectSelf.ts
│   ├── helpers.ts          # mergeDeep, getObjectValueByPath, etc.
│   └── colors.ts           # parseColor, RGBtoHex, getLuma, etc.
├── composables/
│   ├── defaults.ts
│   ├── display.ts
│   ├── component.ts        # makeComponentProps (class/style/id/tag)
│   ├── dimensions.ts
│   ├── elevation.ts
│   ├── rounded.ts
│   ├── border.ts
│   ├── density.ts
│   ├── variant.ts          # makeVariantProps + useVariant
│   ├── color.ts            # useColor → colorClasses/colorStyles
│   ├── proxiedModel.ts
│   └── group.ts
└── directives/
    ├── ripple/
    ├── click-outside/
    └── intersect/
```

## Implementation notes

### `createVueDL()` (port of Vuetify `framework.ts`)
```ts
export function createVueDL (options: VueDLOptions = {}) {
  const { blueprint, ...rest } = options
  const opts = mergeDeep(blueprint, rest)
  const scope = effectScope()
  return scope.run(() => {
    const defaults = createDefaults(opts.defaults)
    const display  = createDisplay(opts.display, opts.ssr)
    const theme    = createTheme(opts.theme)     // Batch 03
    const icons    = createIcons(opts.icons)     // Batch 04

    function install (app: App) {
      for (const key in directives) app.directive(key, directives[key])
      for (const key in components) app.component(key, components[key])
      for (const key in aliases)
        app.component(key, defineComponent({ ...aliases[key], name: key }))

      app.provide(DefaultsSymbol, defaults)
      app.provide(DisplaySymbol, display)
      app.provide(ThemeSymbol, theme)
      app.provide(IconSymbol, icons)
      theme.install(app)

      app.mixin({ computed: { $vuedl () { /* reactive accessor */ } } })
    }
    return { install, defaults, display, theme, icons }
  })!
}
```
- Use `effectScope()` so theme/display watchers can be torn down on `unmount`.
- `app.use(createVueDL({...}))` is the public install path. Also export an
  `app.use(VueDL)` zero-config default.

### `propsFactory` (port of Vuetify `util/propsFactory.ts`)
The cornerstone of prop composition. Returns a callable that merges and lets a
consumer override defaults:
```ts
export const makeVdBtnProps = propsFactory({
  flat: Boolean,
  icon: [Boolean, String, Object] as PropType<boolean | IconValue>,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeRoundedProps(),
  ...makeVariantProps({ variant: 'elevated' }),
}, 'VdBtn')
// usage: props: makeVdBtnProps()   OR   props: makeVdBtnProps({ variant: 'flat' })
```

### `genericComponent` / `useRender`
- `genericComponent<Slots>()(defineComponent({...}))` gives typed slots.
- Wrap setup's return JSX with `useRender(() => <Tag .../>)`.
- These wrappers also apply the `defaults` system (component-level default props).

### `useVariant` + `useColor` (the visual heart — bridges to Batch 03)
```ts
export function useVariant (props) {
  const variantClasses = toRef(() => `${name}--variant-${props.variant}`)
  const { colorClasses, colorStyles } = useColor(() => ({
    [['elevated','flat'].includes(props.variant) ? 'background' : 'text']: props.color,
  }))
  return { colorClasses, colorStyles, variantClasses }
}
```
`useColor` resolves a named color to `rgb(var(--vd-theme-primary))` **or** parses a
custom hex/rgb (Vuesax allows arbitrary colors — preserve that). It emits a class
when the value is a theme color and an inline style when it is custom.

### `proxiedModel` — v-model
Standard `useProxiedModel(props, 'modelValue', ...)` so every form component in
Batch 06 has consistent two-way binding.

### Directives — ripple
Port Vuetify's `v-ripple` (it gives the Vuesax click feedback). The ripple +
soft shadows + hover-lift are the three effects that make components "feel"
like Vuesax; ripple lives here because many components consume it.

## Acceptance criteria
- A throwaway `VdProbe` component using `propsFactory` + `genericComponent` +
  `useRender` mounts in a test app via `app.use(createVueDL())`.
- `useColor` resolves both `color="primary"` (class) and `color="#1f74ff"` (style).
- `v-ripple` works on a plain element in a Vitest browser-mode test.
- `pnpm --filter vue-dl typecheck` passes.

## Risks
- TSX + Vue typing is fiddly; lock `@vue/babel-plugin-jsx` / `@vitejs/plugin-vue-jsx`
  versions early. Mirror Vuetify's `defineComponent.tsx` closely to avoid
  reinventing the generics.
