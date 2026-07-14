# List

`FList` is a surface that stacks `FListItem` rows: settings screens, inboxes,
menus, sidebar navigation. Each item is a three-column row — a prepend slot, the
title/subtitle block, an append slot — so rows line up no matter what you hang
off either end.

## Default

Give each item a `title` and, optionally, a `subtitle`.

<Example file="list/default" />

## Icons

`prepend-icon` and `append-icon` fill the leading and trailing columns with an
icon.

<Example file="list/icons" />

## Active & disabled

`active` highlights a row in its `color` (default `primary`) — that is how you
show the current page in a nav list. `disabled` fades a row and stops it
responding to clicks.

<Example file="list/states" />

## Navigation

`nav` marks the list as a navigation surface. Pair it with `link` items — they
take the pointer cursor and a hover wash — and listen to `click` to move the
selection.

<Example file="list/nav" />

## Slots

The `#prepend` and `#append` slots take arbitrary content: an avatar on the
left, a switch or a badge on the right. The default slot replaces the whole
title/subtitle block when you need custom markup.

<Example file="list/slots" />

## API

<ApiTable name="FList" />

<ApiTable name="FListItem" />
