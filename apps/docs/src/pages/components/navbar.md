# Navbar

`VdNavbar` is a clean top bar with `left`, default (center), and `right` slots,
and a sliding line that follows the active `VdNavbarItem`.

## Default

Bind `v-model` to the active item id — the line slides between items.

<Example file="navbar/default" />

## Behavior props

- `fixed` pins the bar to the top of the viewport.
- `shadow` adds a soft shadow; `shadow-scroll` only once the page scrolls.
- `hide-scroll` slides the bar away when scrolling down and back when scrolling up.
- `padding-scroll` gives the bar breathing room that compresses on scroll.
- `square` removes the bottom rounding; `not-line` hides the sliding line.

## API

<ApiTable name="VdNavbar" />
