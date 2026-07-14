# Variants

A variant is a visual treatment — how a component uses the colour it was given.
`color` says _which_ colour; `variant` says _where it lands_ and _how it moves_.
The two props are defined once, in `makeVariantProps`, and shared by every
component that has a fill to paint: `FBtn`, `FIconBtn`, `FChip`, `FChipGroup`,
`FFab` and `FBtnToggle`.

## The eleven variants

Six are the conventional set you'd expect (`elevated`, `flat`, `tonal`,
`outlined`, `text`, `plain`), and five are the signature looks (`gradient`,
`relief`, `line`, `floating`, `shadow`). The prop validates
against that list, so a typo warns in development instead of silently rendering
the default.

<Example file="concepts/variant-scale" />

Each component picks the default that suits it: `elevated` for `FBtn` and
`FFab`, `flat` for `FIconBtn`, `tonal` for `FChip`, `FChipGroup` and
`FBtnToggle`.

## Colour

`color` takes a theme colour name — `primary`, `secondary`, `success`,
`danger`, `warning`, `light` — or any HEX / RGB value. A theme name resolves to
that theme's token, so the same button follows the light and dark palettes; a
literal colour is parsed once and its contrast text colour is chosen from its
luminance.

<Example file="concepts/variant-color" />

## Fill or ink

The variant decides whether the accent paints the surface or the content:

| Accent on the background                                 | Accent on the foreground                                    |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `elevated` · `flat` · `floating` · `gradient` · `relief` | `tonal` · `outlined` · `text` · `plain` · `line` · `shadow` |

The foreground group still derives its tints from the same accent —
`tonal` fills at 15% alpha, `outlined` borders at full strength and washes on
hover — which is why one prop is enough to restyle a component completely.

Because the treatment lives in the variant system rather than in each
component, the same value means the same thing everywhere:

<Example file="concepts/variant-across" />

## How the colour is carried

A component does **not** colour itself with the `bg-*` / `text-*` utility
classes. It resolves `color` to a pair of CSS variables and writes them inline:

```html
<button
  class="fui-btn fui-btn--variant-outlined"
  style="--fui-variant-color: var(--fui-theme-danger); --fui-variant-on: var(--fui-theme-on-danger);"
></button>
```

`--fui-variant-color` is the accent and `--fui-variant-on` is the colour that
reads against it, both as raw `r, g, b` triplets — which is what lets every
variant rule derive its own tint from them (`rgb(var(--fui-variant-color))`,
`rgba(var(--fui-variant-color), 0.15)`).

This is not a stylistic preference. The theme runtime emits the colour
utilities into `@layer fui-utilities` — the **last** layer in the cascade —
and every one of them is `!important`:

```css
.text-danger {
  color: rgb(var(--fui-theme-danger)) !important;
}
```

A component that painted its label with `.text-danger` could never change that
label again. And it needs to: an `outlined` button is transparent with a red
label at rest, and fills solid red when it becomes `active` or takes keyboard
focus — at which point the label has to flip to `--fui-variant-on` to stay
readable. The utility would win, and the text would disappear into the fill.

<Example file="concepts/variant-vars" />

The utilities are still the right tool in _your_ markup, where nothing is
fighting you for the same declaration — a `text-primary` heading, a `bg-light`
strip. Inside a component, the variables win because the component has to keep
control of its own states.

## Setting a default

Every FusionUI component reads the defaults system before its own props, so a
variant can be set once for a whole app or a single subtree instead of on every
tag:

```ts
createFusionUI({
  defaults: {
    FBtn: { variant: 'tonal' },
    global: { color: 'primary' },
  },
})
```

```html
<f-defaults-provider :defaults="{ FBtn: { variant: 'text' } }">
  <!-- every button in here is a text button unless it says otherwise -->
</f-defaults-provider>
```

See [Theme & Defaults](/components/providers) for the full picture.
