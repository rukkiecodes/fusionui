# Dialog

`FDialog` is a Vuesax-style modal: the backdrop fades in while the panel
**bounces** up to scale, with a floating rounded close button perched on the
top-right corner. Bind it with `v-model` and fill the `header`, default and
`footer` slots.

## Default

A header, some content and a footer. Click the backdrop or press `Escape` to
close.

<Example file="dialog/default" />

## Blur

`blur` frosts the page behind the dialog.

<Example file="dialog/blur" />

## Prevent close

`prevent-close` stops the backdrop and `Escape` from dismissing the dialog —
clicking away nudges it with a little shake instead, so you must use a button.

<Example file="dialog/prevent-close" />

## Loading

`loading` covers the panel with a spinner while an action resolves.

<Example file="dialog/loading" />

## Scrollable

`scroll` keeps the header, footer and close button fixed while the content
area scrolls.

<Example file="dialog/scroll" />

## Full screen

`full-screen` expands the dialog to fill the viewport.

<Example file="dialog/full-screen" />

## Width

`width` sets a custom width (a number of pixels or any CSS length).

<Example file="dialog/width" />

## API

<ApiTable name="FDialog" />
