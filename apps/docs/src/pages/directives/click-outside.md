# v-click-outside

`v-click-outside` calls your handler when a click lands anywhere that is not
inside the element. It is the primitive behind every dismiss-on-outside-click
behaviour: popovers, custom dropdowns, inline editors, anything that should get
out of the way when the user's attention moves on.

`createFusionUI()` registers it as **`click-outside`**, so it is available as
`v-click-outside` with no import.

## Usage

<Example file="directives/click-outside-default" />

## Value

The value is either a handler, or an object with a handler and an `include`
function:

```ts
type ClickOutsideValue =
  | ((e: MouseEvent) => void)
  | { handler: (e: MouseEvent) => void; include?: () => HTMLElement[] }
```

The handler receives the `MouseEvent` that fell outside — its `target` tells you
what was actually clicked, which is often enough to decide whether to close or
to close and act.

```html
<div v-click-outside="close">…</div>
<div v-click-outside="{ handler: close, include }">…</div>
```

## include

`include` returns extra elements that should count as **inside**. It is called
on every outside click, so it can return elements that come and go.

The case it exists for: a trigger button that sits outside the panel it opens.
Without `include`, clicking the trigger while the panel is open fires the
outside handler (which closes the panel) and _then_ the button's own click
handler (which reopens it) — the panel appears frozen open, and the toggle looks
broken. Naming the trigger as "inside" leaves its click to it alone:

```ts
const trigger = ref(null)
const include = () => (trigger.value ? [trigger.value] : [])
```

`include` must return DOM elements. With a component you need its root element —
`triggerRef.value?.$el` — not the component instance.

## Behaviour

- It listens for **`click`** on `document`, in the **capture** phase, so it runs
  before handlers deeper in the tree get a chance to stop it. Pointer, touch,
  focus and `Escape` are not covered — wire those yourself if you need them.
- The listener is registered inside a `requestAnimationFrame`, so the very click
  that mounted the element cannot immediately trigger it. This is what lets you
  put the directive on an element rendered by a `v-if` that the same click just
  flipped on.
- "Inside" is `element.contains(target)` for the element itself plus everything
  `include()` returns.
- The directive implements `mounted` and `unmounted` only: the handler and the
  `include` function are read once, when the element mounts. Replacing the
  handler with a different function later has no effect (the `include` callback
  is re-invoked per click, so dynamic _elements_ are fine). Keep the handler
  stable, or re-mount the element.

## SSR

`mounted` / `unmounted` only, and no `getSSRProps` — the directive contributes
nothing to the server-rendered HTML and never touches `document` during
rendering. The listener is attached after hydration.
