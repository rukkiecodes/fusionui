# Navbar

`FNavbar` is a clean top bar with `left`, default (center), and `right` slots,
and a sliding line that follows the active `FNavbarItem`. Bind `v-model` to the
active item id.

## Default

The logo goes in `#left`, the links in the default slot, and actions in `#right`.
The line slides to whichever item is active.

<Example file="navbar/default" />

## Color

Fill the bar with a theme color (`primary`, `success`, `danger`, `warning`,
`dark`) or any CSS color via `color`. Add `text-white` to keep the labels
readable on a saturated background.

<Example file="navbar/colors" />

## Group

Reveal a dropdown from an item with `FNavbarGroup`, and put `FNavbarItem`s inside
it. An item with `header` is a non-interactive section title; an `active` item
shows a dot. The sliding line stays under the group.

<Example file="navbar/group" />

## Hide on scroll

`hide-scroll` slides the bar away as you scroll down and brings it back when you
scroll up. Point `target-scroll` at a scroll container, or leave it for the
window.

<Example file="navbar/hide-scroll" />

## Padding scroll

`padding-scroll` gives the bar breathing room at the top of the page that
compresses once you start scrolling — a small, pleasant touch.

<Example file="navbar/padding-scroll" />

## Square

`square` removes the bottom corner radius for a bar that sits flush against the
page.

<Example file="navbar/square" />

## Not line

`not-line` eliminates the sliding active line entirely.

<Example file="navbar/not-line" />

## Behavior props

- `fixed` pins the bar to the top of the viewport.
- `shadow` adds a soft shadow; `shadow-scroll` only once the page scrolls.
- `hide-scroll` slides the bar away when scrolling down and back when scrolling up.
- `padding-scroll` gives the bar breathing room that compresses on scroll.
- `square` removes the bottom rounding; `not-line` hides the sliding line.
- `color` + `text-white` recolor the bar and its text.

## API

<ApiTable name="FNavbar" />
