# SSR & Hydration

FusionUI runs on the server. Not "mostly", not "with a wrapper" — server-side
rendering is a hard constraint of the project, and it is enforced by a test that
fails the build.

## The rule

**No component may touch `window` or `document` at module load.** Anything
browser-dependent is deferred to `onMounted`, or guarded with a
`typeof window === 'undefined'` check at the point of use. That is the whole
contract, and everything else on this page follows from it.

It applies to the plugin too. `createFusionUI` is safe to call on the server: the
theme's style injection and root-class toggle no-op without a `document`, and the
notification/dialog/loading services host is only mounted in the browser.

## How it is enforced

`packages/vue/src/__tests__/ssr.test.ts` runs under `@vitest-environment node` —
a real Node environment with **no DOM at all**. It:

1. Imports the entire library entry and asserts `typeof document === 'undefined'`,
   proving there is nothing to reach for. If any module in the barrel touched the
   DOM at import time, the file would throw before a single test ran.
2. Server-renders an `FBtn` with `renderToString` and asserts the markup and the
   slot content are in the HTML string.
3. **Server-renders every registered component.** It iterates the whole component
   map, mounts each one in a `createSSRApp` with `createFusionUI()` installed,
   renders it to a string, and collects any throw as a named failure. The test
   asserts that list is empty.

```ts
it('every registered component mounts under SSR without throwing', async () => {
  const failures: string[] = []
  for (const [name, comp] of Object.entries(components)) {
    try {
      const app = createSSRApp({ render: () => h(comp as never) })
      app.use(createFusionUI())
      await renderToString(app)
    } catch (e) {
      failures.push(`${name}: ${(e as Error).message}`)
    }
  }
  expect(failures).toEqual([])
})
```

A new component that reaches for the DOM during render doesn't get a code-review
comment — it gets a red CI run, with its own name in the failure list. This is why
FusionUI needs no Nuxt module: the library already runs on the Vue SSR path Nuxt
uses.

## Client-only content

Some things genuinely cannot exist on the server: a value read from
`localStorage`, a chart that measures its container, a timestamp formatted in the
visitor's own timezone. Rendering those on the server produces different output
than the client produces on hydration, and Vue reports a hydration mismatch.

`FNoSsr` is the escape hatch. It renders its default slot **only on the client,
after mount**:

<Example file="rendering/no-ssr" />

The important detail is the `placeholder` slot. It **is** server-rendered — so it
must be stable across server and client. The first client render has to match the
server's output exactly, which is precisely why `FNoSsr` waits for `onMounted`
instead of rendering the real content on the first client pass. A placeholder that
is itself non-deterministic (a random id, `Date.now()`, a value read from the DOM)
reintroduces the mismatch you were trying to avoid. Keep it dumb: a skeleton, a
dash, an empty box of the right size.

## FLazy

`FLazy` defers rendering until its content scrolls into view, using an
`IntersectionObserver`:

<Example file="rendering/lazy" />

It is set up in `onMounted`, so it is SSR-safe by construction — the server emits
the placeholder. Two behaviours worth knowing:

- **It fails open.** Where `IntersectionObserver` does not exist — an old browser,
  a jsdom test — `FLazy` shows the content immediately rather than hiding it
  forever. Content that appears when it shouldn't is a minor bug; content that can
  never appear is a broken page.
- **Reserve the space.** Set `min-height` so the placeholder occupies the room its
  content will, otherwise revealing it shifts the page.

## Nuxt

Two files, and neither of them is a module:

```ts
// plugins/fusionui.ts
import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'

// Nuxt renders on the server first, so FusionUI is installed onto the Vue app
// Nuxt already created rather than one we create ourselves.
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(
    createFusionUI({
      theme: { defaultTheme: 'light' },
      icons: {
        defaultSet: 'fusion',
        sets: { fusion: fusionSet },
        aliases: fusionAliases,
      },
    })
  )
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['@rukkiecodes/vue/styles'],
})
```

This is what `fusionui init --target nuxt` generates, and it was verified by
server-rendering the scaffolded app and asserting FusionUI markup in the server
HTML. See [Frameworks](/getting-started/frameworks) for the rest of the hosts.

## Two things to watch

**Theme variables are injected at install, in the browser.** The shipped
stylesheet carries the theme-independent tokens; the `--fui-theme-*` custom
properties are written into a `<style>` element by the theme runtime, and that
only happens where a `document` exists. Markup and layout are identical on both
sides — this is a paint concern, not a hydration mismatch — but if a flash of
unthemed colour on a server-rendered page bothers you, also load
`@rukkiecodes/tokens/css`, which defines the same variables statically for
`:root, .fui-theme--light` and `.fui-theme--dark`. The runtime style takes over on
hydration.

**Be careful with the `ssr` option.** `createFusionUI({ ssr: true })` forces the
display composable to start from a zero viewport instead of reading
`window.innerWidth`. You do not need it in the Nuxt setup above — `createDisplay`
already falls back to `0` when there is no `window` — and because a Nuxt plugin
also runs in the browser, setting it there leaves `useDisplay()` reporting a 0×0
viewport until the first resize event. If you do set it, call
`useDisplay().update()` on mount.

For the components themselves — `FHover`, `FLazy`, `FResponsive`, `FNoSsr` — see
[Rendering Utilities](/components/rendering).
