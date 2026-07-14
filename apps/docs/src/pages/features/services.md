# Services

Some UI has no natural place in a template. A toast fired from an HTTP
interceptor, a "discard your changes?" confirmation inside a router guard, an
overlay opened by a store action — none of them belong to the component that
happens to be on screen when they happen.

FusionUI exposes three of those as **imperative services**: notifications,
dialogs and loading overlays. You call a function, you get a handle (or a
promise) back, and the library owns the rendering.

```ts
import { useNotify, useDialog, useLoading } from '@rukkiecodes/vue'

const { notify } = useNotify()
const dialog = useDialog()
const loading = useLoading()
```

Despite the `use` prefix, none of them inject anything: they are thin wrappers
over module-level reactive queues. That means you can call them **anywhere** —
outside `setup()`, in a Pinia store, in a route guard, in a fetch wrapper — and
the `use*()` call itself is free, so there is no reason to hoist it.

`createFusionUI()` mounts the hosts that render those queues into a
`div.fui-services-host` on `document.body`, in a small app of its own that shares
your theme, icons, display and defaults. It is skipped on the server and mounts
on hydration, so nothing here breaks SSR.

## Notifications

`useNotify()` returns `{ notify, dismiss, clear }`. `notify(options)` pushes a
toast and returns `{ id, dismiss() }`; it auto-dismisses after `duration`
(4000 ms) unless you set `duration: 0`, which keeps it up until something
dismisses it. Four shorthands — `notify.success`, `notify.error`,
`notify.warning`, `notify.info` — set a matching colour and icon and take the
same options.

The pattern worth stealing is a sticky loading toast that the outcome replaces:

<Example file="features/services-notify" />

The full option list is on the [Notification](/components/notification) page.
`dismiss(id)` closes one toast from outside its handle, and `clear()` empties the
stack — useful on logout or on a route change.

## Dialogs

`useDialog()` returns three promise-based dialogs. They are the browser's
`alert` / `confirm` / `prompt`, in your design system and without blocking the
main thread:

```ts
const dialog = useDialog()

await dialog.alert({ title: 'Heads up', text: '…' }) //   Promise<void>
const ok = await dialog.confirm({ title: 'Delete?' }) //  Promise<boolean>
const name = await dialog.prompt({ title: 'Rename' }) //  Promise<string | null>
```

`confirm` resolves `true` for accept and `false` for cancel. `prompt` resolves
with the entered string, or `null` if the user cancelled — so an empty input and
a cancellation stay distinguishable.

<Example file="features/services-dialog" />

| Option         | Type     | Default     | Applies to                                               |
| -------------- | -------- | ----------- | -------------------------------------------------------- |
| `title`        | `string` | —           | all                                                      |
| `text`         | `string` | —           | all                                                      |
| `acceptText`   | `string` | `'OK'`      | all                                                      |
| `cancelText`   | `string` | `'Cancel'`  | confirm, prompt                                          |
| `color`        | `string` | `'primary'` | all — colours the accept button (and the prompt's input) |
| `placeholder`  | `string` | —           | prompt                                                   |
| `defaultValue` | `string` | `''`        | prompt                                                   |

These are for decisions. When you need a modal with your own content, layout and
buttons, reach for the [`FDialog`](/components/dialog) component instead.

## Loading overlays

`useLoading()` returns `{ open, close, closeAll }`. `open(options)` returns
`{ id, close(), update(patch) }`. Omit `target` and the overlay covers the
viewport; pass an element (or a selector) and it covers exactly that element,
tracking its position on scroll and resize and matching its border radius.

`update(patch)` is the interesting half: it mutates the live overlay, which is
how you drive a determinate `progress` bar or a `percent` readout from an upload.

<Example file="features/services-loading" />

The eleven spinner `type`s and the full option list are on the
[Loading](/components/loading) page. `closeAll()` is a good thing to call in a
router `afterEach`, so a navigation can never leave a stuck overlay behind.

Nothing is dismissed automatically when a component unmounts — the queues are
global. If a component opens an overlay, it owns the handle and is responsible
for closing it.

## From the Options API

The plugin also installs a `$fui` global property, so templates and Options API
components can reach the same three services without importing anything:

```js
export default {
  methods: {
    async remove() {
      if (!(await this.$fui.dialog.confirm({ title: 'Delete?', color: 'danger' }))) return

      const overlay = this.$fui.loading.open({ text: 'Deleting…' })
      await this.api.remove()
      overlay.close()

      this.$fui.notify.success({ title: 'Deleted' })
    },
  },
}
```

## Mounting the hosts yourself

If you need the hosts somewhere other than the end of `<body>` — a shadow root,
a scoped container, an app that mounts several times — turn the automatic mount
off and render `FServices` yourself:

```ts
createFusionUI({ services: false })
```

```vue
<script setup>
import { FServices } from '@rukkiecodes/vue'
</script>

<template>
  <f-layout>
    <f-main><router-view /></f-main>
    <FServices />
  </f-layout>
</template>
```

`FServices` is the only component the plugin does _not_ register globally — it is
imported, because you only need it when you have opted out. It is just the three
hosts (`FNotifyHost`, `FLoadingHost`, `FDialogHost`) rendered together, and each
is exported on its own if you want only one of them. The queues are the same
either way: the services keep working, they simply render where you put them.
