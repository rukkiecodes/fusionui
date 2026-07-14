# Avatar

`FAvatar` is a soft rounded-square tile that holds a photo,
an icon or initials, with an optional status badge, a "story" ring, a loading
state and a typing indicator. Stack several with `FAvatarGroup`.

## Default

Pass an `image`, an `icon`, a `text` (initials), or any default-slot content.
Long `text` is reduced to one letter per word.

<Example file="avatar/default" />

## Colors

`color` fills the tile with a theme color (`primary`, `success`…) or any CSS
color, with white text.

<Example file="avatar/colors" />

## Sizes

`size` takes a named size (`x-small` … `x-large`) or a pixel number.

<Example file="avatar/sizes" />

## Shape

Avatars are a rounded square by default. `circle` makes them round; `square`
gives hard corners.

<Example file="avatar/shapes" />

## Badge

`badge` adds a status dot — recolor it with `badge-color`, move it with
`badge-position` (`top-right`, `top-left`, `bottom-left`, `bottom-right`), or
fill the `#badge` slot with a count.

<Example file="avatar/badge" />

## Story ring

`history` draws a colored ring (it follows `color`); `history-gradient` uses an
Instagram-style gradient.

<Example file="avatar/history" />

## Loading

`loading` overlays a spinner — useful while an upload is in flight.

<Example file="avatar/loading" />

## Typing

`writing` shows animated typing dots in the badge ("is typing").

<Example file="avatar/writing" />

## Group

Wrap avatars in `FAvatarGroup` to overlap them; hovering nudges each aside to
reveal the one behind.

<Example file="avatar/group" />

### Max

`max` caps how many show; the rest collapse into a `+N` indicator.

<Example file="avatar/group-max" />

### Float

`float` lays them out side by side with spacing instead of overlapping.

<Example file="avatar/group-float" />

## API

<ApiTable name="FAvatar" />

<ApiTable name="FAvatarGroup" />
