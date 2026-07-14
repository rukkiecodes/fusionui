# Timeline

`FTimeline` draws a connecting line and threads `FTimelineItem`s along it — a
delivery tracker, a commit history, an audit trail. Each item is a dot on the
line, a body, and an optional "opposite" block on the other side.

## Default

Items alternate around the line by default, and the timeline's `dot-color`
(`primary`) is inherited by every dot.

<Example file="timeline/default" />

## Sides

`side` pins every item to one side — `end` (after the line) or `start` (before
it). An individual item can override the timeline with its own `side`.

<Example file="timeline/sides" />

## Density

`density` (`default`, `comfortable`, `compact`) tightens the spacing. A
non-default density has no room to alternate, so items stack to one side unless
you say otherwise.

<Example file="timeline/density" />

## Dots

`dot-color`, `icon` and `icon-color` are set on the timeline as defaults and
overridden per item. `size` takes `x-small` … `x-large` or a number of pixels;
`hide-dot` drops the dot entirely and lets the line run straight through.
`line-color` and `line-thickness` style the line itself.

<Example file="timeline/dots" />

## Fill dot

Dots are drawn as a ring on the surface. `fill-dot` fills them with their color
instead — pair it with a light `icon-color`.

<Example file="timeline/fill-dot" />

## Truncate line

`truncate-line` clips the line before the first dot (`start`), after the last
one (`end`), or `both`.

<Example file="timeline/truncate" />

## Opposite

The `opposite` slot renders on the far side of the line — timestamps, versions,
anything that pairs with the body. `hide-opposite` suppresses it (a `compact`
timeline has no opposite track, so it never renders one).

<Example file="timeline/opposite" />

## Horizontal

`direction="horizontal"` runs the timeline across the page instead of down it;
the `opposite` slot moves above the line.

<Example file="timeline/horizontal" />

## API

<ApiTable name="FTimeline" />

<ApiTable name="FTimelineItem" />
