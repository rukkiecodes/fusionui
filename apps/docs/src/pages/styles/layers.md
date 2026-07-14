# Cascade layers

Everything FusionUI ships is inside a CSS cascade layer. That one decision is
what makes the library overridable: your own CSS is _unlayered_, and unlayered
CSS beats layered CSS regardless of specificity. You rarely need `!important`,
and you never need a specificity war.

## The layer order

Declared in the stylesheet, and re-declared by the theme's runtime stylesheet so
the order holds even before the SCSS is parsed:

```css
@layer fui-tokens, fui-theme, fui-base, fui-components, fui-utilities;
```

Later layers win over earlier ones (for normal declarations — the important
caveat is below).

| Layer            | Contains                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `fui-tokens`     | the `:root` custom properties — radii, spacing, motion, type, elevation ramp, z-index                                       |
| `fui-theme`      | injected at runtime: `--fui-theme-*` triplets, `--fui-border-color`, `--fui-surface-2/3`, the emphasis opacities, per theme |
| `fui-base`       | the `box-sizing` reset and `.fui-application` (font, tracking, page background and foreground)                              |
| `fui-components` | every component stylesheet, plus `.fui-icon` and the ripple's chrome                                                        |
| `fui-utilities`  | the generated helpers — spacing, flex, sizing, borders, text, position, elevation… — and the runtime color utilities        |

Component SCSS opts in through a mixin (`@include tools.layer('components')`), so
there is no way to accidentally ship an unlayered component rule.

## Consequence 1 — your CSS wins, and specificity stops mattering

A plain, single-class rule in your app stylesheet beats a component's most
specific internal selector, because layer order is checked _before_ specificity:

```css
/* your app.css — unlayered. No !important. No `body .fui-btn.fui-btn`. */
.fui-btn {
  border-radius: 4px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

That is the intended override mechanism. If you find yourself reaching for
`!important` to restyle a FusionUI component, something else is wrong — usually
you are fighting a utility class (see below) or an inline custom property.

<Example file="styles/override" />

## Consequence 2 — utilities are `!important`, and that reverses everything

Every generated utility class carries `!important` on every declaration —
`pa-4` should mean 16px of padding wherever it lands, and `text-danger` should
mean red even on a component that colors its own label. They all live in
`fui-utilities`, the last layer.

For **important** declarations the CSS cascade reverses layer order, and
unlayered styles become the _weakest_, not the strongest. Concretely:

- A utility beats every component rule. That's the point.
- A utility also beats your unlayered rule — **even if yours is `!important`**.
  An important declaration in a layer outranks an important declaration outside
  every layer.

So you cannot out-CSS a utility class. Don't try. The fixes, in order of
preference:

1. **Don't apply the utility.** If `text-danger` is in the way, remove the class
   (or stop passing `color="danger"` — color props resolve to those classes).
2. **Change what the utility resolves to** by overriding the token it reads:
   `--fui-theme-danger` is fair game, and redefining it is an unlayered normal
   declaration that beats the `fui-theme` layer.
3. Only then, as a last resort, an inline `style` with `!important` — which wins
   because element-attached styles are sorted before layers.

This is also _why_ color-aware components never wear their own color utilities:
`FBtn` sets `--fui-variant-color` / `--fui-variant-on` and derives every state
from them, so it can still recolor its label on `:focus-visible`. See
[Colors](/styles/colors).

## Consequence 3 — inline custom properties are still inline

`FBtn` writes `--fui-variant-color` onto the element as an inline style, so a
stylesheet rule that sets `--fui-variant-color` **on the button itself** loses to
it. But the inline value is a _reference_, not a color:

```css
--fui-variant-color: var(--fui-theme-primary);
```

It resolves against wherever the button sits. Redefine the theme variable on any
ancestor and the button — fill, hover shadow, ripple, focus state — follows:

```css
.brand-section {
  --fui-theme-primary: 236, 72, 153; /* an RGB triplet, not a color */
}
```

That's the override that scales: one variable, every descendant, no per-component
CSS. (Remember the triplet convention — [Colors](/styles/colors).)

## If you author in layers yourself

Layers are ordered by first appearance, so as long as `@rukkiecodes/vue/styles`
is imported before your CSS, any layer you introduce is appended after
`fui-utilities` and wins over the component layer. Make it explicit rather than
relying on import order:

```css
/* your app.css */
@layer fui-tokens, fui-theme, fui-base, fui-components, fui-utilities, app;

@layer app {
  .fui-btn {
    border-radius: 4px;
  }
}
```

Your `app` layer now sits last, so its normal declarations beat every FusionUI
component rule. (It still cannot beat a utility's `!important` — nothing can.)

## Debugging

When a rule "doesn't apply", check the layer before you check the specificity.
Chrome and Firefox DevTools both group the Styles pane by `@layer` and show which
layer a winning declaration came from — an override that looks strong enough but
sits in an earlier layer is the usual culprit.
