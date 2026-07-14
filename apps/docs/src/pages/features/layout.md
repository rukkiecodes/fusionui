# Layout System

An app shell is a pile of fixed-position chrome — a bar on top, a drawer down the
side, maybe a footer and a bottom bar — and a content region that has to know
exactly how much room they left it. Hard-coding that arithmetic is how you end up
with a heading hidden under the navbar on one route and a 64px gap on another.

`FLayout` removes the arithmetic. The chrome **registers** its side and its size
with the layout; the layout accumulates those registrations into offsets; and
`FMain` insets itself by whatever is left over. Nothing measures anything by hand,
and everything stays correct when a drawer opens, a bar grows a second line, or a
footer appears.

<Example file="features/app-shell" />

## The model

Every piece of chrome registers four things with the layout it is inside:

- **position** — `top`, `right`, `bottom` or `left`.
- **size** — how many pixels it takes along its own axis: the width of a drawer,
  the height of a bar. Bars that can change height (the navbar, an auto-height
  footer) report their measured height through a `ResizeObserver`, so a bar that
  wraps to two lines reserves two lines.
- **order** — a number. Lower is **outer**: it is accumulated first, so it gets
  the full edge, and later items fit into what it left.
- **active** — whether it currently takes up space. An inactive item reserves
  nothing and slides out of view instead of collapsing the layout.

The layout sorts the items by `order`, walks the list, and hands each item the
offsets accumulated _before_ it. So the navbar (registered first) spans the full
width, and the sidebar under it starts below the navbar and is only as tall as
what remains. What is left after every item has taken its slice becomes the main
region's inset, published as `--fui-layout-top` / `-right` / `-bottom` / `-left`.

`FMain` turns those four variables into its padding — that, and a transition on
it, is the entire component. Content therefore never sits under the chrome, and
when a drawer collapses, the padding animates rather than jumping.

Stacking follows the same order: an item's `z-index` is derived from its `order`,
so a lower-order item paints above a higher-order one where their edges meet (the
navbar always paints over the drawer, never the other way round). It is computed,
not registration-dependent, so the server and the client agree.

## The chrome

| Component    | Side                           | Space it reserves                                        | Default `order` | Active when                  |
| ------------ | ------------------------------ | -------------------------------------------------------- | --------------- | ---------------------------- |
| `FNavbar`    | top                            | its measured height                                      | `0`             | always, inside an `f-layout` |
| `FSidebar`   | left (`right` flips it)        | its `width` (default `260`)                              | `1`             | `permanent`                  |
| `FFooter`    | bottom                         | its measured height, or a pinned `height`                | `0`             | `app`                        |
| `FBottomNav` | bottom                         | its `height` (default `56`)                              | `0`             | `app` (and `active`)         |
| `FFab`       | from `location` (top / bottom) | nothing — unless `layout`, then its height plus a margin | `0`             | `app`                        |

The `app` flag is what promotes a component from "a box in the document" to "a
piece of the shell". Without it a footer is just the block at the end of the page
and a FAB just floats where you put it; with it, they dock to the layout and the
content makes room. `FNavbar` needs no flag — being inside an `f-layout` is the
flag — and `FSidebar` uses `permanent`, since a temporary drawer is an overlay
that deliberately covers content rather than displacing it.

Outside an `f-layout` all of them still work: the registration quietly no-ops and
each component falls back to its own positioning. You can drop a navbar on a
landing page without adopting the layout system.

## Order

`order` is the one knob that changes the shape of the shell. Lower is outer.

```vue
<!-- Default: the navbar spans the full width, the sidebar sits below it. -->
<f-layout>
  <f-navbar />
  <f-sidebar permanent />
  <f-main>…</f-main>
</f-layout>

<!-- Full-height sidebar with the navbar beside it. -->
<f-layout>
  <f-navbar :order="1" />
  <f-sidebar permanent :order="0" />
  <f-main>…</f-main>
</f-layout>
```

When two items share an order, a drawer is accumulated before a bar, which is why
`order="0"` on the sidebar is enough to make it full-height. The footer defaults
to `order: 0` for the same reason in reverse: it takes the full width at the
bottom, and the drawer above it stops at its top edge.

## Islands

`island` detaches a bar or drawer from the edge: it is inset by `island-margin`
(default `12`) on every side and fully rounded. The layout reserves the item's
size _plus_ the margin on both sides, so the main content clears the floating bar
by exactly the gap you see.

```vue
<f-navbar island :island-margin="16" />
<f-sidebar permanent island />
```

## Drawers, FABs and the rest

A sidebar without `permanent` is an overlay: it registers as inactive, reserves
nothing, and slides in over the content when you set `open`. The usual responsive
shell is one sidebar whose `permanent` is bound to a breakpoint from
`useDisplay()`, with the navbar's burger driving `open` below it.

```vue
<script setup>
import { ref } from 'vue'
import { useDisplay } from '@rukkiecodes/vue'

// `useDisplay()` returns a reactive object — read it through the object, don't
// destructure it.
const display = useDisplay()
const drawer = ref(false)
</script>

<template>
  <f-layout>
    <f-navbar>
      <template #left>
        <f-btn v-if="!display.mdAndUp" icon="menu" variant="text" @click="drawer = !drawer" />
      </template>
    </f-navbar>

    <f-sidebar v-model:open="drawer" :permanent="display.mdAndUp">…</f-sidebar>

    <f-main><router-view /></f-main>
  </f-layout>
</template>
```

A FAB with `app` rides above the content and clears the other chrome — it is
positioned in the leftover space, so it never lands on top of the sidebar or
under the bottom bar. Add `layout` when it should also _reserve_ space, pushing
the content up by its height rather than floating over it.

## API

The components are documented individually: [Layout](/components/layout),
[Navbar](/components/navbar), [Sidebar](/components/sidebar),
[Footer](/components/footer), [Bottom Navigation](/components/bottom-nav) and
[FAB](/components/fab).
