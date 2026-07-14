# Badge

`FBadge` decorates whatever you wrap in it with a small counter or status dot —
unread mail on an inbox icon, items in a cart, a "live" marker on an avatar. It
is purely a wrapper: the badged element goes in the default slot, and the badge
floats over its top-right corner.

## Default

`content` is the text or number inside the badge. Anything in the default slot
gets badged — a button, an icon, an avatar. For richer content (an icon, a `9+`)
fill the `#badge` slot instead.

<Example file="badge/default" />

## Dot

`dot` drops the content and leaves a small dot — the right choice for "something
changed here" when the exact count doesn't matter.

<Example file="badge/dot" />

## Colors

`color` takes any theme color; badges are `danger` by default because they most
often mean "needs attention".

<Example file="badge/colors" />

## Inline

`inline` takes the badge out of the corner and lays it out next to the content
instead — useful in headings and list rows where nothing should overlap.

<Example file="badge/inline" />

## Visibility

`model-value` controls whether the badge shows at all, so you can bind it to the
count and let the badge disappear when there is nothing to report.

<Example file="badge/visibility" />

## API

<ApiTable name="FBadge" />
