# Programmatic Services

Vue DL ships imperative feedback APIs as composables. The hosts are mounted
automatically by `createVueDL` — no wrapper component needed.

<Example file="services/feedback" />

## Notifications

```ts
import { useNotify } from 'vue-dl'

const { notify } = useNotify()
notify.success({ title: 'Saved', text: 'All good', progress: true })
notify({ text: 'Custom', color: 'primary', position: 'bottom-center', duration: 0 })
```

## Dialogs (Promise-based)

```ts
import { useDialog } from 'vue-dl'

const dialog = useDialog()
const ok = await dialog.confirm({ title: 'Delete?', color: 'danger' })
const name = await dialog.prompt({ title: 'Your name?' }) // string | null
await dialog.alert({ title: 'Done' })
```

## Loading

```ts
import { useLoading } from 'vue-dl'

const loader = useLoading().open({ text: 'Loading…' }) // fullscreen
// scoped: useLoading().open({ target: '#panel' })
loader.close()
```

Options-API users can also reach these via `this.$vd.notify` / `this.$vd.dialog`
/ `this.$vd.loading`.
