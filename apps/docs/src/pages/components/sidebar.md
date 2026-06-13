# Sidebar

`VdSidebar` is a clean navigation drawer with `logo`, `header`, default, and
`footer` slots. Items show a rounded active indicator, and the whole drawer can
collapse into a Discord-style icon rail.

## Default

Bind `v-model` to the active item id. Use `permanent` to render it as part of
the layout; without it the sidebar is a fixed overlay controlled with
`v-model:open` that closes on outside click.

<Example file="sidebar/default" />

## Groups

`VdSidebarGroup` nests items under a collapsible header — it opens
automatically when it contains the active item.

<Example file="sidebar/group" />

## Reduce

`reduce` collapses the drawer to a 50px icon rail; add `hover-expand` to expand
it while hovered.

<Example file="sidebar/reduce" />

## API

<ApiTable name="VdSidebar" />
