# v-intersect

`v-intersect` wires an element to an `IntersectionObserver` and calls your
handler whenever its visibility changes. Reveal-on-scroll, lazy media, "load
more" sentinels, tracking which section the reader is actually looking at — all
of it is this directive plus a boolean.

`createFusionUI()` registers it as **`intersect`**, so it is available as
`v-intersect` with no import.

## Usage

<Example file="directives/intersect-default" />

## Value

Either a handler, or an object with a handler and the observer's options:

```ts
type IntersectValue =
  | IntersectHandler
  | { handler: IntersectHandler; options?: IntersectionObserverInit }
```

`options` is passed straight to the `IntersectionObserver` constructor —
`root`, `rootMargin` and `threshold`, nothing added and nothing renamed.

```html
<div v-intersect="onIntersect">…</div>
<div v-intersect="{ handler: onIntersect, options: { rootMargin: '200px', threshold: 0.5 } }">
  …
</div>
```

## The callback

The handler is called with three arguments:

```ts
(isIntersecting: boolean, entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
```

`isIntersecting` is the convenience: it is `true` when **any** entry in the
batch is intersecting, which is the answer you want 90% of the time. When you
need more — the exact `intersectionRatio`, the bounding rects, the timestamp —
read it off `entries[0]`, which is the raw observer payload. The `observer`
itself is handed over so you can `unobserve` or `disconnect` on your own terms.

Note that the callback fires on the observer's **first** run too, not only on a
change: an element that is already on screen when it mounts reports
`isIntersecting: true` immediately.

## once

The `.once` modifier disconnects the observer the first time the element
intersects. A reveal animation should not re-run when the reader scrolls back
up, and a "seen" event should be sent once:

```html
<article v-intersect.once="reveal" class="fade-in">…</article>
```

Without `.once`, the handler keeps firing on every crossing, in both directions.

## When IntersectionObserver is missing

The directive checks for `IntersectionObserver` and, if it isn't there, does
nothing at all — no observer, no callback, ever. That is the right default for
an _enhancement_ (a fade-in that never fades in still shows its content), and
the wrong one if you hide content until it intersects. If your handler is what
makes something visible, make the visible state the default and let the observer
_confirm_ it rather than grant it.

## SSR

`mounted` / `unmounted` only, and no `getSSRProps` — nothing is contributed to
the server-rendered HTML and no browser API is touched during rendering. The
observer is created after hydration.

The binding is also read exactly once, on mount: there is no `updated` hook, so
changing `options` afterwards does not rebuild the observer. This matters for
`root`, which is usually a template ref — during the first render that ref is
still `null`, so an inline `:options="{ root: container }"` observes the viewport
instead. Render the observed element behind a flag you flip in `onMounted`, so
that its `mounted` hook sees a populated ref.

## See also

For the two most common cases you don't need the directive at all: `FLazy` defers
mounting a subtree until it scrolls into view, and `FInfiniteScroll` loads the
next page from a sentinel. Both manage their own observers.
