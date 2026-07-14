# Parallax

`FParallax` is a banner whose image drifts against the page as you scroll.

## Default

`src` is the image, `height` reserves the space, and `scale` controls how far the
image travels against the scroll — `0` is static, `1` tracks it exactly. Small
values read best; the default of `0.3` is a gentle drift.

<Example file="parallax/default" />

## With content

Anything in the default slot sits above the image.

<Example file="parallax/content" />

## Degrading gracefully

The parallax is decoration, so it is the first thing to go. Under
`prefers-reduced-motion: reduce` — and on any browser without
`IntersectionObserver` — the image simply renders static and centred, with no
scroll listener attached at all.

The scroll handler only runs while the banner is actually on screen, and writes
on an animation frame, so it never lands in the scroll critical path.

Give the image a meaningful `alt` if it carries information. A purely decorative
banner should be left with the default empty `alt`, which hides it from assistive
technology rather than announcing a nameless image.

## API

<ApiTable name="FParallax" />
