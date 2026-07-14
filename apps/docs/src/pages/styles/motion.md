# Motion & transitions

FusionUI has one heartbeat: **0.25s ease**. Almost every transition in the
library is that value, and the ones that aren't are deliberately faster. Motion
here is functional — it says _this responds to you_, _this is above the page_,
_this went away_ — and it is always optional, because every animation has a
reduced-motion path.

## Tokens

| Custom property             | Value            |
| --------------------------- | ---------------- |
| `--fui-transition`          | `all 0.25s ease` |
| `--fui-transition-duration` | `0.25s`          |
| `--fui-transition-timing`   | `ease`           |
| `--fui-transition-fast`     | `all 0.15s ease` |

Plus the interaction-state opacities, used for the translucent overlay a control
puts over itself while you touch it:

| Custom property         | Value  | State            |
| ----------------------- | ------ | ---------------- |
| `--fui-hover-opacity`   | `0.08` | `:hover`         |
| `--fui-focus-opacity`   | `0.12` | `:focus-visible` |
| `--fui-pressed-opacity` | `0.16` | `:active`        |

The two displacement constants — a **-3px lift** and a **3px sink** — are token
values too, but they are written into the component CSS rather than exposed as
custom properties. There is no `--fui-lift`; use `-3px` (or read the token from
`@rukkiecodes/tokens` if you are generating CSS).

## The rule: reduced motion is not optional

From the project's north star (§6, §9): _honor `prefers-reduced-motion`; always
provide a static fallback_. Every effect must have **(a)** a static fallback,
**(b)** a reduced-motion path, and **(c)** a reason it improves the component
beyond decoration. A component is not done until reduced motion passes — it is a
line in the definition of done, alongside keyboard and screen-reader support.

In practice that means the library's stylesheets end with blocks like this one:

```scss
@media (prefers-reduced-motion: reduce) {
  .fui-sheet {
    transition: none;
  }
}
```

Movement is removed; the _end state_ is kept. A card that lifts on hover still
gets its deeper shadow — you just don't watch it travel. That's the difference
between honoring the preference and deleting the affordance.

## The signature motion

**The hover-lift.** The signature move, and the one you'll recognise: the element
rises `translateY(-3px)` and swaps its resting shadow for a larger, softer one,
then returns to `translateY(0)` when pressed — it goes _down_ under your finger.
`FBtn`'s default (`elevated`) variant lifts, and casts the bigger shadow in its
own accent color, not in black:

```css
box-shadow: 0 10px 20px -10px rgb(var(--fui-variant-color));
transform: translateY(-3px);
```

**Variant motion.** Each button variant expresses the same 0.25s in a different
physical metaphor:

| Variant    | Motion                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| `elevated` | lifts -3px on hover, drops to 0 on press                                   |
| `gradient` | lifts -3px and cross-fades its gradient overlay                            |
| `floating` | rests already lifted, rises further on hover, slams flat on press          |
| `relief`   | sits on a solid colored ledge and **sinks into it** when pressed — no lift |
| `line`     | the bottom accent goes from 20% to full color as the control lifts -3px    |
| `shadow`   | neutral surface, lifts on hover, settles halfway on press                  |

**The ripple.** A soft radial circle grows from the pointer to 2.5× the element's
width and lingers while you hold, fading out on release. It's a directive, so any
element can have one:

```html
<f-btn>ripples by default</f-btn>
<f-btn :ripple="false">doesn't</f-btn>

<div v-ripple>any element</div>
<div v-ripple.center>from the middle, not the pointer</div>
```

Its color comes from `--fui-ripple-color`, an RGB triplet defaulting to
`255, 255, 255`. Components on a light fill point it at their own accent instead:

```css
--fui-ripple-color: var(--fui-variant-color);
```

One caveat worth knowing: the ripple's transition is written as an inline style
by the directive, so a `prefers-reduced-motion` media query in your stylesheet
won't cancel it. When you're honoring the preference, switch it off at the
source — `:ripple="false"` on the component, or `v-ripple="false"` on the
directive.

<Example file="styles/motion" />

## Respecting reduced motion in your own CSS

Write the motion, then take the _movement_ away — not the meaning:

```css
.card {
  transition: var(--fui-transition);
  box-shadow: var(--fui-elevation-3);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--fui-elevation-6);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
  .card:hover {
    transform: none; /* no travel… */
    box-shadow: var(--fui-elevation-6); /* …but the state still reads */
  }
}
```

The same check in script, SSR-safe (never at module load):

```ts
import { onMounted, ref } from 'vue'

const reduced = ref(false)
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
```

And for anything expensive — a canvas, a parallax, a glass surface — the rule is
stronger than "don't animate": don't _start_. The effect must have a static
fallback that renders when the preference is set, when the GPU can't keep up, or
when the runtime never loads. See
[Liquid glass](/components/liquid-glass) and [Goo](/components/goo).
