# Footer

`FFooter` is the closing surface of a page — a quiet strip, separated from the
content by a hairline, with muted links. On its own it is a plain block at the
end of the document; with `app` it becomes a real layout item that docks to the
bottom of an `<f-layout>`.

## Default

The footer is a flex row, so `FSpacer` is all you need to push a group of links
to the far end.

<Example file="footer/default" />

## Colors

`color` fills the footer with a theme color or any CSS color; the text and links
flip to the contrasting color and the hairline goes away.

<Example file="footer/colors" />

## Rich footer

Nothing stops the footer from holding a full sitemap — it is a surface, and the
content is yours.

<Example file="footer/rich" />

## App footer

Add `app` inside an `<f-layout>` and the footer registers as the bottom layout
item: it docks to the bottom of the viewport and `<f-main>` insets itself above
it, exactly the way `FNavbar` registers as the top one. `height` defaults to
`auto` (the rendered height is measured); pin it with a number when you want a
fixed reservation. `order` controls the stacking (lower sits outer) — the
default `0` puts the footer outside the sidebar, so a docked drawer stops above
it.

```vue
<template>
  <f-layout>
    <f-navbar />
    <f-sidebar permanent />

    <f-main>
      <!-- already inset above the footer -->
      <router-view />
    </f-main>

    <f-footer app border>
      <span>© 2026 Orbit Labs</span>
      <f-spacer />
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </f-footer>
  </f-layout>
</template>
```

## API

<ApiTable name="FFooter" />
