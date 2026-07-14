# Slide Group

`FSlideGroup` is a scrollable, selectable strip — filter chips, a category rail,
an avatar row. It overflows sideways instead of wrapping, and grows arrows only
when there is something out of view. Each `FSlideGroupItem` is a real button, so
it focuses, takes the arrow keys and reports its selected state to assistive
tech.

## Default

The group owns the selection model. `mandatory` keeps one item selected at all
times — the first is picked on mount and the last one cannot be turned off.

<Example file="slide-group/default" />

## Multiple

`multiple` turns the model into an array, and `max` caps how many items can be
selected at once.

<Example file="slide-group/multiple" />

## Center active

`center-active` keeps the selected item centered in the viewport as the
selection moves. `show-arrows="always"` pins the arrows even when nothing
overflows; `show-arrows="false"` removes them (the strip still scrolls, and the
arrow keys still work).

<Example file="slide-group/center-active" />

## Icons

`icon` prepends an icon to an item's `text`.

<Example file="slide-group/icons" />

## Custom items

The item's default slot receives `{ isSelected, toggle }` — render whatever the
strip is actually made of.

<Example file="slide-group/custom" />

## Keyboard and motion

Arrow keys move focus along the strip (`←`/`→`, or `↑`/`↓` when
`direction="vertical"`), and `Home`/`End` jump to the ends; a focused item is
scrolled into view. Scrolling is smooth unless the OS asks for reduced motion,
in which case it jumps instantly.

## API

<ApiTable name="FSlideGroup" />

<ApiTable name="FSlideGroupItem" />
