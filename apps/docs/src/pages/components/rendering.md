# Rendering Utilities

Four small components that do no drawing of their own. They exist to control
_when_ and _how_ their content renders — deferring it, sizing it, tracking hover,
or keeping it off the server entirely.

## FHover

Renderless. It hands the default slot an `isHovering` flag and a `props` object to
spread onto whatever element should be watched — so the hover state can drive any
prop, not just a CSS class.

<Example file="rendering/hover" />

`open-delay` and `close-delay` (ms) debounce the transition, which is what stops a
card flickering as the pointer crosses it.

## FLazy

Defers rendering its content until it scrolls into view, then leaves it rendered.
This is a mounting optimisation — reach for `FVirtualScroll` when rows must also
be _unmounted_ as they leave.

<Example file="rendering/lazy" />

Set `min-height` so the placeholder occupies the space its content will; otherwise
revealing it shifts the page. `options` is passed straight to the
`IntersectionObserver` — `{ rootMargin: '400px' }` starts loading well before the
content is actually visible.

Where `IntersectionObserver` does not exist, `FLazy` fails **open** and renders the
content immediately. Showing content beats hiding it forever.

## FResponsive

Holds content at a fixed `aspect-ratio`, reserving the space before it loads —
which is what keeps images and embeds from shifting the layout as they arrive. It
is the box `FImage` is built on.

<Example file="rendering/responsive" />

## FNoSsr

Renders its content only on the client, after mount. Use it for anything that
genuinely cannot exist on the server — a widget reading `localStorage`, a value
formatted in the visitor's own timezone.

<Example file="rendering/no-ssr" />

The `placeholder` slot fills the gap until then. Note that the placeholder **is**
server-rendered, so it must be stable across server and client: the first client
render has to match the server's output exactly, or Vue reports a hydration
mismatch. That is why the real content waits for `onMounted` rather than
rendering on the first client pass.

## API

<ApiTable name="FHover" />

<ApiTable name="FLazy" />

<ApiTable name="FResponsive" />

<ApiTable name="FNoSsr" />
