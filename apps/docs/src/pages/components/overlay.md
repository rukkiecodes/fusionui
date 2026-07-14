# Overlay & Popup

`FOverlay` is the plumbing every floating surface in FusionUI sits on: it
teleports your content to the end of `<body>`, drops a scrim behind it, locks
the page scroll, closes on Escape or a click on the scrim, and marks the content
`role="dialog"`. Reach for it directly when you need a floating surface of your
own design — a lightbox, a command palette, a sheet.

`FPopup` is the ready-made one: an overlay with a titled, rounded card inside,
a close button in the corner, and a footer for the actions. Most of the time
that's the one you want.

## Popup

Put the trigger in the `activator` slot and bind the `props` it hands you — the
popup wires the click for you. Content goes in the default slot.

<Example file="overlay/popup" />

## Actions

The `actions` slot is the footer, divided off from the body and aligned to the
end. It receives `close`, so a "cancel" button needs no state of its own. `width`
sizes the card (440px by default) and it shrinks on narrow screens.

<Example file="overlay/popup-actions" />

## Persistent

`persistent` means the popup ignores Escape and clicks on the scrim — the user
has to choose one of your actions. It also disables the slot's `close`, so drive
the popup from `v-model` and hide the corner button with `:closable="false"`.

<Example file="overlay/persistent" />

## Bare overlay

`FOverlay` centers whatever you give it and does nothing else to it. The default
slot receives `isActive` and `close`.

<Example file="overlay/default" />

## Scrim

`scrim` takes any CSS color to tint the backdrop, or `false` to remove it
altogether. Without a scrim there is nothing to click on, so the overlay closes
on Escape or on whatever button you put inside it.

<Example file="overlay/scrim" />

## API

<ApiTable name="FPopup" />

<ApiTable name="FOverlay" />
