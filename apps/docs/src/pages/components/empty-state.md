# Empty state

`FEmptyState` is the placeholder you show when there is nothing to show — an
empty list, a search that found nothing, a feature the user hasn't started
using. It centers a muted icon, a title, a line of supporting text, and one
clear next step.

## Default

`title` and `text` are all you need; the icon defaults to an inbox.

<Example file="empty-state/default" />

## Icon

Swap the `icon` to match the situation — a magnifier for "no results", a
disconnected signal for "offline".

<Example file="empty-state/icon" />

## Action

The default slot sits under the text and is the place for the button that gets
the user unstuck.

<Example file="empty-state/action" />

## Rich content

The `title` and `text` slots take markup, so you can emphasize a name or a
number and still keep the layout.

<Example file="empty-state/slots" />

## API

<ApiTable name="FEmptyState" />
