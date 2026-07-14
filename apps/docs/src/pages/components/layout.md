# Layout

`FLayout` coordinates an app shell. Drop a `<f-navbar>` (top), a `<f-sidebar>`
(left) and a `<f-main>` inside it — the navbar and sidebar **register their size
and position**, and `<f-main>` automatically **insets itself** by the accumulated
offsets so your content never sits under the chrome. No manual padding, no magic
numbers.

```vue
<template>
  <f-layout>
    <f-navbar>
      <template #left><strong>Acme</strong></template>
      <template #right><f-avatar text="A" /></template>
    </f-navbar>

    <f-sidebar permanent :model-value="active">
      <f-sidebar-item id="home"><f-icon icon="home" /> Home</f-sidebar-item>
      <f-sidebar-item id="settings"><f-icon icon="settings" /> Settings</f-sidebar-item>
    </f-sidebar>

    <f-main>
      <!-- your page; already inset below the navbar and beside the sidebar -->
      <router-view />
    </f-main>
  </f-layout>
</template>
```

## Stacking order

Both the navbar and sidebar take an `order` (a number — lower sits **outer**).
The defaults give the common "navbar on top, full-width" look:

- **navbar `order="0"`** → spans the full width, above the sidebar
- **sidebar `order="1"`** → sits below the navbar

Set the sidebar to `order="0"` instead for a full-height sidebar with the navbar
beside it.

```vue
<f-layout>
  <f-navbar order="0" />          <!-- full width on top (default) -->
  <f-sidebar order="1" permanent />
  <f-main> … </f-main>
</f-layout>
```

## Island mode

Add `island` to the navbar or sidebar to float it with a margin on every side
and full rounding — a detached, card-like bar. Tune the gap with `island-margin`.

```vue
<f-navbar island :island-margin="16" />
<f-sidebar island permanent />
```

## Inverse corner

By default the sidebar has rounded top-right and bottom-right edges. Add
`inverse-corner` to draw a **concave** fillet at the top-right, so the sidebar
flows seamlessly into the navbar (the "goo" junction). `corner-size` sets its
radius; `square` removes all rounding.

```vue
<f-sidebar permanent inverse-corner :corner-size="22" />
```

## Mobile

Below the navbar's breakpoint, drop `permanent` from the sidebar and drive its
`open` state from the navbar's burger to get an overlay drawer.

## API

`FLayout` and `FMain` are near zero-config coordinators — beyond the shared
`class` / `style` (and a `theme` on the layout) they take nothing; just nest them.
The layout behaviour is controlled by the navbar and sidebar props below.

### FLayout

<ApiTable name="FLayout" />

### FMain

<ApiTable name="FMain" />

### FNavbar

<ApiTable name="FNavbar" />

### FSidebar

<ApiTable name="FSidebar" />
