# Batch 08 — Programmatic Services (Notify, Dialog, Loading)

**Depends on:** 02, 03, 05 (and 07's `VdPopup` for dialog) · **Parallel with:** 09

## Goal
Recreate Vuesax's beloved imperative APIs — `this.$vs.notify()`,
`this.$vs.loading()`, `this.$vs.dialog()` — as **Vue 3 composables + a plugin
service**, the modern idiom. Provide both `useNotify()/useDialog()/useLoading()`
and an optional global `app.config.globalProperties.$vd` for Options-API parity.

## Deliverables
1. Service architecture: a singleton controller per service, mounted once into a
   teleport host, driven by a reactive queue/store.
2. `useNotify()` → toast notifications.
3. `useLoading()` → fullscreen or container-scoped loading overlay.
4. `useDialog()` → alert / confirm / prompt dialogs (Promise-based).
5. Auto-registration: `createVueDL()` installs the service hosts; expose `$vd`
   global + composables.

## File layout
```
packages/vue-dl/src/services/
├── notify/{useNotify.ts, VdNotifyHost.tsx, VdNotifyItem.tsx, notify.sass}
├── loading/{useLoading.ts, VdLoadingHost.tsx, loading.sass}
├── dialog/{useDialog.ts, VdDialogHost.tsx}     # dialog reuses VdPopup (B07)
└── index.ts                                     # registerServices(app)
```

## Implementation notes

### Pattern (replaces Vuesax `src/functions/*` + global `$vs` mixin)
- Each service exposes a composable returning imperative methods. Internally they
  push to a module-level reactive store; a single host component (teleported to
  `body`, mounted by `createVueDL`) renders from that store. No per-call
  `createApp`/manual mount (cleaner than Vuesax's Vue 2 approach).

```ts
// useNotify.ts
const queue = reactive<NotifyItem[]>([])
export function useNotify () {
  function notify (opts: NotifyOptions) {
    const id = nextId()
    queue.push({ id, ...withDefaults(opts) })
    if (opts.duration !== 0) setTimeout(() => dismiss(id), opts.duration ?? 4000)
    return { id, dismiss: () => dismiss(id) }
  }
  notify.success = (o) => notify({ ...o, color: 'success' })
  notify.error   = (o) => notify({ ...o, color: 'danger' })
  return { notify, dismiss, clear }
}
```

### Notify (port Vuesax `vsNotifications`)
- Options: `title`, `text`, `color`, `icon` (Feather/alias), `position`
  (`top-right` etc.), `duration`, `progress` bar, `onClick`, `closable`.
- `VdNotifyHost` groups by position, stacks, animates in/out (slide+fade), shows
  the soft Vuesax shadow and color accent.

### Loading (port Vuesax `vsLoading`)
- `const loader = useLoading().open({ target?, type, color, text, scale })` →
  returns a handle with `.close()`. Without `target`, covers viewport; with a ref
  element, scopes to that container (Vuesax behavior). Spinner = `VdProgress`
  circular (B05). Reference-counted so nested opens are safe.

### Dialog (port Vuesax `vsDialog`)
- Promise-based: `await useDialog().confirm({ title, text, acceptText, color })`
  resolves `true/false`; `prompt` resolves the input value (with validation);
  `alert` resolves on close. Renders through `VdPopup` (B07) for consistent
  styling/focus-trap. Options: `type`, buttons text, `color`, `closable`.

### Global `$vd` (Options API parity)
```ts
app.config.globalProperties.$vd = {
  notify: useNotify().notify,
  loading: useLoading(),
  dialog: useDialog(),
}
```
Document both styles; recommend composables for `<script setup>`.

## Acceptance criteria
- `useNotify().notify({...})` shows a toast that auto-dismisses and stacks.
- `useLoading().open()` covers screen and a scoped `open({ target })` covers a div.
- `await useDialog().confirm(...)` returns a boolean; `prompt` returns input.
- Services work without the consumer manually mounting any host.

## Risks
- SSR: hosts must mount client-side only; guard `document` access.
- Z-index/stacking with overlays (B07) — centralize z-index tokens in B03.
