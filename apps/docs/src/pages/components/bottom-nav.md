# Bottom navigation

`FBottomNav` is the thumb-reachable bar of top-level destinations — three to five
of them, no more. Each destination is an `FBottomNavItem`; selection is the
standard group contract, so `v-model` holds the selected item's `value`.

## Default

Give every item a `value`, an `icon` and a `text` label. `mandatory` keeps one
destination selected at all times — a bottom bar always reflects where you are.

<Example file="bottom-nav/default" />

## Grow

By default the items hug their content. `grow` makes them share the bar's width
equally.

<Example file="bottom-nav/grow" />

## Shift

`mode="shift"` hides the labels until an item is selected, so only the current
destination is spelled out.

<Example file="bottom-nav/shift" />

## Color & height

`color` tints the selected item — a theme color or any CSS color — and `height`
resizes the bar. Individual items can be `disabled`.

<Example file="bottom-nav/colors" />

## Hiding the bar

`active="false"` slides the bar out below the fold without unmounting it — the
usual "hide the chrome while the user scrolls" move.

<Example file="bottom-nav/active" />

## In an app layout

`app` pins the bar to the bottom of the viewport and registers it with the
`<f-layout>` system, so `<f-main>` insets its content by the bar's height and the
navbar and sidebar stack around it. `order` decides the stacking order when
several layout items share an edge.

```vue
<f-layout>
  <f-navbar app>…</f-navbar>
  <f-main>…</f-main>

  <f-bottom-nav v-model="tab" app grow mandatory>
    <f-bottom-nav-item value="home" icon="home" text="Home" />
    <f-bottom-nav-item value="search" icon="search" text="Search" />
    <f-bottom-nav-item value="account" icon="user" text="Account" />
  </f-bottom-nav>
</f-layout>
```

## Routing

An item with `to` pushes that path onto the router when it is tapped (when
`vue-router` is installed); `href` renders a real anchor instead, and takes
`target`. The selected item reports `aria-current="page"` either way.

```vue
<f-bottom-nav-item value="orders" icon="shopping-bag" text="Orders" to="/orders" />
```

## API

<ApiTable name="FBottomNav" />

<ApiTable name="FBottomNavItem" />
