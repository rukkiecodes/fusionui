# Time Picker & Input

`FTimePicker` is a column-list time picker — one scrollable listbox per unit
(hour, minute, second, AM/PM). Unlike an analog dial this maps cleanly onto the
WAI-ARIA listbox pattern: arrow keys step a column, `PageUp`/`PageDown` jump in
fives through minutes and seconds, `Home`/`End` go to the ends, and left/right
move between columns. `FTimeInput` is a text field that opens one in a menu.

The model is always a 24-hour `HH:mm` (or `HH:mm:ss`) string, whatever the
columns happen to display.

## Default

<Example file="time-picker/default" />

## 12-hour clock

`format="ampm"` adds an AM/PM column and relabels the hours. The bound value
stays 24-hour — only the display changes.

<Example file="time-picker/ampm" />

## Seconds & scrolling

`use-seconds` adds the third column. `scrollable` lets the mouse wheel step a
column under the pointer.

<Example file="time-picker/seconds" />

## Min, max & allowed values

`min` and `max` bound the time, and `allowed-hours` / `allowed-minutes` /
`allowed-seconds` take a list or a predicate for anything more specific — a
quarter-hour grid, a lunch break, weekday shifts. Unreachable options are
disabled, and the keyboard steps straight over them.

<Example file="time-picker/constraints" />

## Time input

`FTimeInput` wears the same `FField` chrome as `FInput` — label, hint, rules,
clear button — with a clock button that opens the picker. The text stays typable
(`21:30`, `9:30 pm` both parse), so the picker is an alternative way in, not the
only one. `ArrowDown` opens it and moves focus into the columns; `Escape` closes
it and hands focus back; unparseable text snaps back to the last good value.

<Example file="time-picker/input" />

### Options

The input passes `format`, `min`, `max`, the `allowed-*` predicates, `use-seconds`
and `scrollable` through to its picker. `picker-title` names the panel, and
`location` flips the menu above the field when there is no room below.

<Example file="time-picker/input-ampm" />

## API

<ApiTable name="FTimePicker" />

<ApiTable name="FTimeInput" />
