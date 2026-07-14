# Window

`FWindow` is the sliding-pane primitive: one `FWindowItem` is visible at a time,
and changing the model transitions between them. Tabs and carousels are this
idea plus chrome — reach for the window when you want the motion on its own:
onboarding, a stepped form, a wizard.

## Default

Bind a model and give each item a `value`. If nothing is selected, the window
adopts the first item. `show-arrows` renders the built-in prev/next controls,
and a swipe along the window's axis moves between items.

<Example file="window/default" />

## Vertical

`direction="vertical"` slides along the y-axis instead, and swipes follow.

<Example file="window/vertical" />

## Continuous

`continuous` wraps around at the ends instead of stopping. `show-arrows="hover"`
only reveals the controls while the window is hovered or focused.

<Example file="window/continuous" />

## External controls

Leave `show-arrows` off and drive the model yourself — the window is just a
transition between values. `touch="false"` disables the swipe gesture, which is
what you want when the panes contain inputs.

<Example file="window/wizard" />

## Transitions

The item slides in from the side it is travelling towards; `reverse` inverts
that. `prev-icon` and `next-icon` swap the arrow icons, and the `prev` / `next`
slots replace the controls entirely (each receives `{ props }` with the click
handler, disabled state and label already wired). The `additional` slot renders
below the container — a natural home for pagination dots.

## API

<ApiTable name="FWindow" />

<ApiTable name="FWindowItem" />
