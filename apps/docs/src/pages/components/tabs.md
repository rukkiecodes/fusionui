# Tabs

Tabs split one screen into sibling views that share a context — a settings page,
a project dashboard, an entity detail view. `FTabs` is the strip itself, `FTab`
is one item in it, and an animated indicator slides between the active tabs.
Pair it with `FTabsWindow` + `FTabPanel` when the tabs also have to swap the
content underneath.

## Default

Drop `FTab`s inside `FTabs`. Each tab's `text` doubles as its value, and the
first one is selected automatically.

<Example file="tabs/default" />

## Panels

Bind the same model to `FTabs` and `FTabsWindow`, give every `FTab` an explicit
`value`, and match it with an `FTabPanel`. Only the active panel is rendered.

<Example file="tabs/panels" />

## Icons

`icon` puts a glyph in front of the label.

<Example file="tabs/icons" />

## Color

`color` recolors the active tab and the indicator; it takes any theme color.

<Example file="tabs/colors" />

## Alignment

`align` (`start`, `center`, `end`) positions the strip inside its container.

<Example file="tabs/align" />

## Grow

`grow` stretches every tab so they split the full width evenly.

<Example file="tabs/grow" />

## Disabled

A `disabled` tab is dimmed and can't be selected.

<Example file="tabs/disabled" />

## API

<ApiTable name="FTabs" />

<ApiTable name="FTab" />

<ApiTable name="FTabsWindow" />

<ApiTable name="FTabPanel" />
