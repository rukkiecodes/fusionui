# Date Picker & Input

`FDatePicker` is the calendar panel; `FDateInput` is a text field that opens one
in a menu. The panel implements the WAI-ARIA date-picker grid pattern — a single
tabbable cell with roving focus, arrow keys that cross month boundaries,
`PageUp`/`PageDown` for months (add `Shift` for years), `Home`/`End` for the week
— and a polite live region announces the period as it changes.

The model is a `Date` (or an array of them with `multiple` / `range`), but any
`Date`, ISO string or timestamp can be bound to it.

## Default

<Example file="date-picker/default" />

## Multiple

`multiple` collects an array of dates — clicking a selected day removes it again.

<Example file="date-picker/multiple" />

## Range

`range` collects a `[start, end]` pair: the first click sets the start, the
second the end, and the days in between preview as you hover or arrow across
them. `show-adjacent-months` fills the leading and trailing blanks with the
neighbouring months' days.

<Example file="date-picker/range" />

## Min, max & allowed dates

`min` and `max` bound the selectable period — the month arrows and the month/year
lists respect them too. `allowed-dates` narrows it further, either as a list of
dates or as a predicate run against every day. Disallowed days stay focusable so
the keyboard can move across them, exactly as the ARIA pattern requires.

<Example file="date-picker/constraints" />

## Views

The header buttons switch between the day grid, the month list and the year list.
`view` (bindable with `v-model:view`) drives that from the outside — start on
`year` when you are asking for a date of birth. `month` and `year` are separately
bindable when you need to control the displayed period itself.

<Example file="date-picker/views" />

## Week numbers & locale

`show-week` prefixes each row with its ISO-8601 week number, `first-day-of-week`
moves the start of the week (`0` = Sunday, `1` = Monday), and `locale` picks the
language of the month and weekday names. `header-format` takes a token pattern —
`YYYY`, `MMMM`, `MMM`, `DD`, `D`, `dddd`, `ddd`, and friends.

<Example file="date-picker/week" />

## Date input

`FDateInput` wears the same `FField` chrome as `FInput` and `FSelect` — label,
hint, rules, clear button — and opens the picker in a menu. A single date stays
typeable (`format` doubles as the placeholder); `ArrowDown` opens the picker and
moves focus into the day grid, `Escape` closes it and hands focus back, and text
that doesn't parse snaps back to the last good value.

<Example file="date-picker/input" />

### Multiple & range

The input takes the same `multiple`, `range`, `min`, `max` and `allowed-dates`
props and passes them through to its picker. `format` is a token pattern or a
function, and the menu stays open until a range is complete.

<Example file="date-picker/input-range" />

## API

<ApiTable name="FDatePicker" />

<ApiTable name="FDateInput" />
