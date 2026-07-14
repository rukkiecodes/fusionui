# Theme & Defaults Providers

Two renderless-ish wrappers that change how everything beneath them looks
without touching a single child. `FThemeProvider` swaps the palette for a
subtree; `FDefaultsProvider` swaps the props components fall back to. Both are
the local, component-tree equivalents of the `theme` and `defaults` options you
pass to `createFusionUI`.

## Theme provider

`FThemeProvider` scopes a theme to whatever it wraps. FusionUI themes are CSS
custom properties, so the provider renders an element carrying the theme's
class — that element is what re-declares `--fui-theme-*` for everything inside
it. A dark island inside a light page (or the reverse) needs nothing more.

<Example file="providers/theme" />

### With background

By default the provider only redefines the colors; the surface behind it stays
whatever it was. `with-background` also paints the theme's `background` and
`on-background`, which is what you want when the scope is a real panel rather
than a recoloring of existing content.

<Example file="providers/theme-background" />

## Defaults provider

`FDefaultsProvider` sets the props components fall back to when the consumer
doesn't pass them. Keys are component names (`FBtn`, `FChip`, …); anything a
child sets explicitly still wins.

<Example file="providers/defaults" />

### Global defaults

The `global` key applies to every component that accepts the prop — handy for
dropping a whole region into a compact density.

<Example file="providers/defaults-global" />

### Nesting, scoped and disabled

Providers nest, and by default an inner one merges over the outer. `scoped`
drops the inherited defaults so the subtree sees only what you passed, and
`disabled` turns the provider into a pass-through — useful when the defaults
are computed and you want to switch them off without unmounting anything.

<Example file="providers/defaults-nested" />

## API

<ApiTable name="FThemeProvider" />

<ApiTable name="FDefaultsProvider" />
