# Calendar

`FCalendar` shows events across a month, a week or a single day. Reach for
`FDatePicker` when you need to _pick_ a date; reach for `FCalendar` when you need
to _show what is on_ one.

## Default

`v-model` is the focused date — the period on screen. `events` is a plain array;
each entry needs a `start`, and may carry a `title`, an `end`, a `color` and an
`all-day` flag.

<Example file="calendar/default" />

## View modes

`view-mode` switches between `month`, `week` and `day`. It is bindable, so the
calendar can drive its own view — clicking "+2 more" in a crowded month cell
focuses that day and switches to the day view, where nothing is truncated.

<Example file="calendar/views" />

## Event colors

`color` on an event tints it. Any CSS colour works, as does a theme colour
triplet.

<Example file="calendar/colors" />

## Handling clicks

`click:date` fires with the `Date` that was activated; `click:event` fires with
the original event object you passed in — untouched — plus the native event.

<Example file="calendar/clicks" />

## Custom event rendering

The `event` slot replaces the default chip entirely.

<Example file="calendar/slot" />

## Accessibility

The grid is a real `role="grid"`: weekday headers are `columnheader`s, days are
`gridcell`s, and each day holds one focusable button whose accessible name is the
full spoken date ("Tuesday, July 14, 2026") rather than a bare number. Today
carries `aria-current="date"`.

A roving tabindex keeps the calendar to a single Tab stop, and the arrow keys move
by day (<kbd>←</kbd>/<kbd>→</kbd>) and by week (<kbd>↑</kbd>/<kbd>↓</kbd>). The
period title is an `aria-live` region, so paging to another month announces where
you have landed instead of silently changing the grid underneath you.

Events are buttons, not decorated divs, so they can be reached and activated from
the keyboard too.

## API

<ApiTable name="FCalendar" />
