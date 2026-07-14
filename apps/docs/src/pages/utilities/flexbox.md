# Flex utilities

A set of global helper classes for building flexbox layouts without writing CSS.
Put `d-flex` on a container, then reach for
`justify-*`, `align-*`, `flex-*`, `order-*`, and `ga-*` to arrange its children.

Every helper has responsive variants: insert a breakpoint infix
(`sm`, `md`, `lg`, `xl`, `xxl`) to apply it from that width up — e.g.
`d-flex flex-column flex-md-row`. Breakpoints are the same as the
[grid](/components/grid) and `useDisplay()`: `sm` 600 · `md` 960 · `lg` 1280 ·
`xl` 1920 · `xxl` 2560.

## Playground

Toggle the container properties — the class list and preview update together.

<FlexPlayground />

## Enable flex

`d-flex` (or `d-inline-flex`) makes an element a flex container.

<Example file="flex/enable" />

## Direction

`flex-row` (default), `flex-column`, and their `-reverse` variants set the main
axis.

<Example file="flex/direction" />

## Justify content

`justify-*` distributes items along the main axis.

<Example file="flex/justify" />

## Align items

`align-*` positions items on the cross axis. `align-stretch` (default) makes
them fill the container height.

<Example file="flex/align" />

## Wrap

`flex-wrap` lets items flow onto new lines instead of shrinking; `flex-nowrap`
forces a single line.

<Example file="flex/wrap" />

## Grow, shrink & fill

`flex-grow-1` lets an item absorb free space; `flex-fill` makes every item share
the width equally. `flex-shrink-0` stops an item from shrinking.

<Example file="flex/grow" />

## Order

`order-first`, `order-0` … `order-12`, and `order-last` reassign the visual
order without touching the markup.

<Example file="flex/order" />

## Gap

`ga-*` sets the gap on both axes; `gr-*` and `gc-*` set row and column gaps
independently. Values come from the spacing scale
(`0`, `1`=4px … `5`=24px, `6`=32px, `7`=48px, `auto`).

<Example file="flex/gap" />

## Responsive

Combine a base class with breakpoint variants to change layout by width. This
stacks as a column on phones and becomes a row from `md` up — resize the window
to see it flip.

<Example file="flex/responsive" />

## Class reference

All classes take an optional breakpoint infix (`-sm`/`-md`/`-lg`/`-xl`/`-xxl`)
between the prefix and the value.

| Group           | Classes                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Display         | `d-none` · `d-inline` · `d-inline-block` · `d-block` · `d-table` · `d-flex` · `d-inline-flex`                                  |
| Flex            | `flex-fill` · `flex-1-1` · `flex-1-0` · `flex-0-1` · `flex-0-0` (+ `-100` / `-0` basis variants)                               |
| Direction       | `flex-row` · `flex-column` · `flex-row-reverse` · `flex-column-reverse`                                                        |
| Wrap            | `flex-wrap` · `flex-nowrap` · `flex-wrap-reverse`                                                                              |
| Grow / shrink   | `flex-grow-0` · `flex-grow-1` · `flex-shrink-0` · `flex-shrink-1`                                                              |
| Justify content | `justify-start` · `justify-center` · `justify-end` · `justify-space-between` · `justify-space-around` · `justify-space-evenly` |
| Align items     | `align-start` · `align-center` · `align-end` · `align-baseline` · `align-stretch`                                              |
| Align content   | `align-content-start` · `…-center` · `…-end` · `…-space-between` · `…-space-around` · `…-space-evenly` · `…-stretch`           |
| Align self      | `align-self-auto` · `…-start` · `…-center` · `…-end` · `…-baseline` · `…-stretch`                                              |
| Order           | `order-first` · `order-0` … `order-12` · `order-last`                                                                          |
| Gap             | `ga-0` … `ga-7` · `ga-auto` · `gr-*` (row) · `gc-*` (column)                                                                   |
