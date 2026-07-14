# Bottom sheet

`FBottomSheet` is a dialog that slides up from the bottom edge — the
thumb-friendly place for a share menu, a filter panel or a set of contextual
actions. It is `FOverlay` with a different geometry, so the scrim, the teleport,
the body scroll lock and `Escape` all behave exactly as they do for a dialog, and
sheets stack with dialogs and menus instead of fighting them.

Focus moves into the sheet when it opens, `Tab` cycles inside it, and the element
that opened it gets focus back on close.

## Default

Either open it from the `activator` slot — it receives the props to bind to your
trigger — or drive it with `v-model`. The default slot gets a `close` function,
so an action can dismiss the sheet as it fires.

<Example file="bottom-sheet/default" />

## Inset

`inset` lifts the sheet off the edges into a floating, fully rounded card.

<Example file="bottom-sheet/inset" />

## Persistent

`persistent` stops the backdrop click and `Escape` from dismissing the sheet —
the user has to answer. `not-handle` removes the drag-handle affordance, which is
the right call when the sheet is not dismissible by dragging anyway.

<Example file="bottom-sheet/persistent" />

## Scrollable

`scrollable` lets a tall sheet scroll its own body (capped at 90% of the
viewport) instead of growing past the fold.

<Example file="bottom-sheet/scrollable" />

## Scrim

`scrim` dims the page behind the sheet. Pass `false` for no scrim at all, or a
CSS color for a custom one.

```vue
<f-bottom-sheet v-model="open" :scrim="false">…</f-bottom-sheet>
<f-bottom-sheet v-model="open" scrim="rgba(109, 40, 217, 0.4)">…</f-bottom-sheet>
```

## API

<ApiTable name="FBottomSheet" />
