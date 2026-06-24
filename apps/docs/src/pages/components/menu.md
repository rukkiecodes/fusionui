# Menu

`FMenu` is a floating menu anchored to an activator. The content is **teleported
to `<body>`** and positioned (fixed) relative to the activator, so it always
floats above everything — never clipped by an ancestor's `overflow` or trapped in
its stacking context. Click outside or press `Escape` to close.

## Default

Put the trigger in the `activator` slot and spread its `props`, then drop bare
items in the default slot — `FMenu` provides the surface (card, shadow, padding).

<Example file="menu/default" />

## Location

`location` places the menu relative to the activator: `bottom` (default),
`bottom-end`, `top`, or `top-end`. The `-end` variants align the right edges.

<Example file="menu/location" />

## Open on hover

`open-on-hover` opens the menu while the pointer is over the activator (and its
content), useful for nav dropdowns.

<Example file="menu/hover" />

## Controlled

Bind `v-model` to control the open state yourself. `offset` sets the gap (px)
between the activator and the menu; `close-on-content-click` (default `true`)
dismisses the menu when an item is clicked.

## API

<ApiTable name="FMenu" />
