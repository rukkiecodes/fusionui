# Global Configuration & Defaults

Every FusionUI component is declared through an internal `defineComponent` that
runs its props through the defaults system before `setup()` sees them. That means
**any prop of any component can be given a new fallback** — globally, or for one
region of the tree — without wrapping the component, aliasing it, or repeating
yourself on every usage.

A default is only a fallback. Anything the consumer writes on the tag still wins.

## The plugin options

`createFusionUI()` takes the whole configuration of the library:

| Option       | Type                        | What it does                                                           |
| ------------ | --------------------------- | ---------------------------------------------------------------------- |
| `defaults`   | `DefaultsInstance`          | Per-component and global prop fallbacks (this page).                   |
| `theme`      | `ThemeOptions`              | The palettes and the starting theme.                                   |
| `icons`      | `IconOptions`               | The icon sets and the `$alias` map.                                    |
| `display`    | `DisplayOptions`            | The breakpoint thresholds behind `useDisplay()`.                       |
| `components` | `Record<string, Component>` | Extra components to register globally alongside the built-ins.         |
| `directives` | `Record<string, unknown>`   | Extra directives to register globally.                                 |
| `services`   | `boolean`                   | Set `false` to skip auto-mounting the notify / dialog / loading hosts. |
| `ssr`        | `boolean`                   | Tells the display composable it is rendering on the server.            |
| `blueprint`  | `Partial<FusionUIOptions>`  | A preset object deep-merged **under** everything above.                |

`blueprint` exists so a team can package its house style — theme, icons and
defaults — as one object and still override any part of it per app:

```ts
createFusionUI({
  blueprint: acmeBlueprint,
  theme: { defaultTheme: 'dark' }, // wins over the blueprint's theme
})
```

## Global defaults

The `defaults` option is a map of **component name → props**, plus an optional
`global` bucket that applies to every component that declares the prop:

```ts
// main.ts
import { createApp } from 'vue'
import { createFusionUI } from '@rukkiecodes/vue'
import '@rukkiecodes/vue/styles'
import App from './App.vue'

const fusionui = createFusionUI({
  defaults: {
    // Applies to any component with a `size` prop.
    global: { size: 'small' },

    // Per-component. Keys are the component's PascalCase name, values are its
    // props in camelCase.
    FBtn: { variant: 'tonal', color: 'primary' },
    FChip: { variant: 'flat' },
    FInput: { color: 'primary', clearable: true },
    FSidebar: { width: 220 },
  },
})

createApp(App).use(fusionui).mount('#app')
```

Now `<f-btn>Save</f-btn>` renders a small tonal primary button everywhere in the
app, and `<f-btn variant="flat">` still renders a flat one.

Two rules are worth internalising, because they are the whole model:

- A **per-component** entry beats the **global** entry for the same prop. If
  `global` sets `size: 'small'` and `FBtn` sets `size: 'large'`, buttons are
  large and everything else is small.
- `global` only reaches props that a component actually declares. A component
  with no `size` prop never sees `global.size`; there is no filtering to
  configure and nothing to opt out of.

The defaults are reactive — `fusionui.defaults` is the `Ref` the components read
through, so mutating it at runtime re-renders them:

```ts
const fusionui = createFusionUI({ defaults: { FBtn: { variant: 'tonal' } } })

// later, e.g. from a density toggle
fusionui.defaults.value.global = { size: 'small' }
```

## Scoping defaults to a subtree

`FDefaultsProvider` is the same mechanism, bounded by the component tree. Give it
a `defaults` object and everything rendered inside it — at any depth — picks the
values up.

<Example file="features/defaults-scope" />

Providers **merge** by default: an inner provider is deep-merged over whatever it
inherits, so it only has to state what it changes. Two props adjust that:

- `scoped` drops the inherited defaults; the subtree sees only what this provider
  passes.
- `disabled` ignores this provider's own `defaults` and passes the inherited ones
  straight through — useful when the defaults are computed and you want to switch
  them off without unmounting the subtree.

## Precedence

For a given prop on a given component, the first of these that is set wins:

1. **The prop written on the tag.** An explicit prop always beats every default —
   including one written in kebab-case (`prepend-icon` and `prependIcon` are the
   same prop here).
2. **The nearest `FDefaultsProvider`**, component key first, then its `global`
   key. Because providers merge, "nearest" already carries the values inherited
   from the providers above it.
3. **The `defaults` passed to `createFusionUI()`**, again component key first,
   then `global`.
4. **The component's own prop default** — `variant: 'elevated'` on `FBtn`, and so
   on.

<Example file="features/defaults-precedence" />

## Where to use which

Put the things that are true of the whole product in `createFusionUI()` — a
house button variant, a house input colour, a density. Reach for
`FDefaultsProvider` when a _region_ is different: a compact toolbar, a dense data
panel, a marketing section that wants larger controls than the app around it.

## Your own components

The defaults system is not limited to the built-ins. A component of yours joins
it by running its props through `useDefaults()`, keyed by its own `name` — after
which `{ MyCard: { density: 'compact' } }` works on it exactly as it does on
`FBtn`. See [`useDefaults`](/api/composables) for the signature, and
[Providers](/components/providers) for `FDefaultsProvider`'s own API.
