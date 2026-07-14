# Labs

Labs is the signature GPU layer: the parts of FusionUI that do real graphics work
— refraction, metaball physics, WebGL2 shaders — plus the chart engine they share
a mindset with. They ship, they are tested, and they are used in the components
you can see on this site. What sets them apart is that their APIs are the least
settled in the library, and that what they can do at runtime depends on the
browser in front of them.

That is why they get their own section instead of being filed quietly under
Components. Buried in the sidebar, a `depth` prop or an effect name reads like
any other prop, with the same implied promise of stability. Here it doesn't:

> **The Labs API may change between minor versions.** The component contracts —
> `FGlass`, `FGoo`, `FLineChart`, `FShaderSurface`, `v-shader` — are the parts
> we intend to keep steady. The knobs underneath (the optics parameters, the
> physics parameters, the effect catalogue, the chart engine's exports) are still
> being tuned against real use, and a rename or a re-scaling of a value is
> possible in a minor release. Everything else in FusionUI follows semver in the
> way you'd expect.

Nothing here is a prototype or a preview build. It is production code with a
narrower stability promise, and we would rather say so.

## The rule that never bends

An effect that only works on a good machine, in the right browser, for a user who
doesn't mind motion, is not a feature — it's a liability. Every effect in Labs
degrades, and the degraded state is a designed state, not a broken one.

| Layer                                                 | Live path                                                                            | What you get instead                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Liquid glass](/components/liquid-glass) `FGlass`     | SVG displacement map inside `backdrop-filter` — real rim refraction (Chromium today) | Elsewhere: `blur` + `saturate` with the rim highlight and bevel still painted — the frosted look, never a broken filter             |
| [Goo](/components/goo) `FGoo`                         | Metaball field traced by marching squares, blobs moved by real surface tension       | Under `prefers-reduced-motion` the field settles once to a resting frame and renders statically — the shape, without the motion     |
| [Shaders](/components/shaders) `@rukkiecodes/shaders` | A WebGL2 fragment shader, on-screen, FPS-capped                                      | A static CSS fallback per effect (gradient, turbulence texture, radial glow) that _is_ the look — the runtime is never even fetched |

The gates are capability **and** preference. `shouldRunShader()` demands a DOM, a
working WebGL2 context, and no `prefers-reduced-motion` before anything renders
live; fail any one and the surface keeps its fallback. `FGlass` probes for SVG
filters in `backdrop-filter` and only claims refraction where it truly applies —
and under `prefers-reduced-transparency` it drops to an opaque panel outright.
Reduced motion doesn't strip the glass (a static lens isn't motion) but it does
drop the press-squish transition, so nothing moves.

## Never in the critical path

The shader runtime is a **dynamic `import()`**. `FShaderSurface` and `v-shader`
render their static fallback immediately, watch the element with an
`IntersectionObserver`, and only load the WebGL2 module when the surface is
actually on-screen and the capability checks have passed. A page that never
scrolls to a shader never downloads one; a browser that can't run them never
downloads one either. This documentation site is fully usable with that chunk
blocked.

The same instinct runs through the rest of the layer. `FGoo` auto-sleeps once its
kinetic energy settles and wakes on interaction, so an idle gooey background costs
close to nothing. `FGlass` regenerates its displacement map only on resize or an
option change — while you drag or scroll, the browser resamples the backdrop
through the map that already exists, with zero per-frame JavaScript.

## The chart engine

[`FLineChart`](/components/chart) sits here for a different reason. There is no
GPU work and nothing to degrade — it renders deterministic SVG geometry — but it
is the visible tip of a charting **engine** (scales, ticks, curves, shapes,
stats) that emits renderer-agnostic path commands so the same geometry can draw
through SVG on the web and Skia on native. That engine's surface is still
growing, and `FLineChart` is explicitly a _reference_ component: the worked
example you copy when you build your own chart. Treat both as Labs.

## Where to go next

- [Liquid Glass](/components/liquid-glass) — the optics, the props, and the
  browser truth table.
- [Goo](/components/goo) — metaball physics, the two render modes, and the
  soft-body droplet.
- [Shaders](/components/shaders) — the effect catalogue and the discipline each
  effect has to earn its place.
- [Chart](/components/chart) — the engine, and the pattern for building your own.
- [Native (mobile)](/getting-started/native) — how the same maths reaches
  React Native.

Use this layer deliberately. It is opt-in everywhere, never default-on, and it
buys you the most when a surface floats over content and depth reads as quality.
Overused, it stops being a signature.
