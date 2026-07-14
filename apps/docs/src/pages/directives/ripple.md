# v-ripple

`v-ripple` is the Vuesax ink ripple: a soft radial circle that grows from the
point you pressed to about 2.5× the element's width, lingers while the pointer
is down, and fades on release. Every FusionUI control that can be pressed
already uses it internally — this directive is for the surfaces you build
yourself: a list row, a tile, a custom card.

`createFusionUI()` registers it as **`ripple`**, so it is available as
`v-ripple` everywhere with no import.

> **Why `v-` and not `f-`?** The `v-` is Vue's, not another library's. Every Vue
> directive is written `v-<name>` — that is the same `v-` as in `v-if`, `v-for`
> and `v-model`, and it is the only form the template compiler recognises. Write
> `f-ripple` and Vue treats it as a plain HTML attribute: it renders inertly into
> the DOM and the directive never runs. FusionUI's own prefix shows up where it
> can — components are `F*` (`<f-btn>`), CSS classes are `fui-*`, tokens are
> `--fui-*` — but a directive has to start with `v-`.

## Usage

<Example file="directives/ripple-default" />

## Value

The binding value enables or disables the ripple. It is enabled when the value
is `undefined` (the bare directive) or truthy, and disabled when it is falsy —
so the value is how you switch it off, statically or reactively:

```html
<div v-ripple>always ripples</div>
<div v-ripple="false">never ripples</div>
<div v-ripple="!row.disabled">ripples unless the row is disabled</div>
```

Unlike the other two directives, `v-ripple` implements an `updated` hook, so
changing the value at runtime takes effect immediately.

The components that ripple expose the same switch as a prop — `<f-btn :ripple="false">`
— rather than making you reach for the directive.

## Modifier

`.center` starts the circle from the middle of the element instead of the
pointer position. Use it when the element is small enough that the origin does
not read as intentional, or when it is triggered by the keyboard.

```html
<div v-ripple.center>…</div>
```

## Colour

The ink colour is the `--fui-ripple-color` custom property, and its value is a
raw `r, g, b` triplet (the CSS wraps it in `rgba()` to fade it). It defaults to
white, which is right on a solid fill and invisible on a pale one — which is why
the light variants (`tonal`, `outlined`, `text`, `plain`, `line`, `shadow`)
point it at their own accent instead:

```css
.my-tile {
  /* a theme token — already a triplet */
  --fui-ripple-color: var(--fui-theme-danger);
}

.my-other-tile {
  /* or a literal triplet */
  --fui-ripple-color: 236, 72, 153;
}
```

## What it does to the element

On mount the directive adds the `fui-ripple` class (which clips the ripple with
`overflow: hidden`) and a `pointerdown` listener. On each press it inserts a
container span as the element's first child and animates the circle inside it;
the span is removed when the ripple finishes. If the element's computed
`position` is `static`, the directive sets `position: relative` for the duration
of the ripple and restores it afterwards — the ripple has to be positioned
against something.

Two consequences worth knowing: the element must be able to clip its children
(the class handles that), and if you rely on `:first-child` in your own CSS it
will match the ripple container mid-press.

## Reduced motion

The ripple is pure decoration, so it does not run at all when the reader has
asked for reduced motion: the directive checks
`prefers-reduced-motion: reduce` on every press and returns before it creates
anything. There is nothing to configure, and no static fallback is needed —
the element simply doesn't ripple.

The check has to live in the directive rather than in the stylesheet. The
effect's transition is written as an inline style at press time, and no media
query can out-specify an inline style, so a
`@media (prefers-reduced-motion: reduce)` rule against `.fui-ripple__effect`
would be silently ignored.

## SSR

The directive only implements `mounted`, `updated` and `unmounted`, and it has
no `getSSRProps`, so it contributes nothing to the server-rendered HTML and
touches no browser API during rendering. The class and the listener are attached
after hydration, which also means the markup the server sends and the markup the
client expects are identical.
