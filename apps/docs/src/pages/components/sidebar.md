# Sidebar

`FSidebar` is a clean navigation drawer with `logo`, `header`, default, and
`footer` slots. Items take an `icon` slot and show a rounded active indicator;
the whole drawer can collapse into an icon rail, recolor, or dock either side.
Bind `v-model` to the active item id.

## Default

Use `permanent` to render it as part of the layout; without it the sidebar is a
fixed overlay controlled with `v-model:open` that closes on outside click.

<Example file="sidebar/default" />

## Groups

`FSidebarGroup` nests items under a collapsible header (give the header an
`FSidebarItem` with no `id`, so clicking it toggles without changing the active
item). It opens automatically when it contains the active item.

<Example file="sidebar/group" />

## Reduce

`reduce` collapses the drawer to a 50px icon rail — give every item an `icon`
slot. Hover an item to reveal its label.

<Example file="sidebar/reduce" />

## Hover expand

Add `hover-expand` to a reduced drawer and it expands while the mouse is over
it, collapsing back on leave.

<Example file="sidebar/hover-expand" />

## Color

Fill the drawer with a theme color (or any CSS color) via `color`, and add
`text-white` to keep the labels readable.

<Example file="sidebar/colors" />

## Open

Without `permanent`, the drawer is hidden by default and shown via
`v-model:open` — pair it with a menu button. It closes on outside click.

<Example file="sidebar/open" />

## Position right

`right` docks the drawer (and its slide-in animation) on the right edge.

<Example file="sidebar/right" />

## API

<ApiTable name="FSidebar" />
