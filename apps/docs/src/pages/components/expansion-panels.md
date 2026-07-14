# Expansion Panels

`FExpansionPanels` is the accordion: a stack of `FExpansionPanel`s that share one
selection model. Each panel is a header button that toggles a region of content
— collapsed content stays in the DOM so it can animate, but it is made `inert`,
which keeps it out of the tab order and the accessibility tree. For a single,
standalone disclosure, reach for [`FCollapse`](/components/collapse) instead.

## Default

`title` and `text` cover the common case. One panel is open at a time.

<Example file="expansion-panels/default" />

## Multiple

`multiple` lets any number of panels be open at once — the model becomes an
array. Give each panel a `value` to control it by name instead of by index.

<Example file="expansion-panels/multiple" />

## Mandatory

`mandatory` keeps at least one panel open: the first opens on mount, and the
last open panel refuses to close.

<Example file="expansion-panels/mandatory" />

## Variants

`variant` changes how the stack reads: `default` (a bordered card), `accordion`
(flush, no gaps), `inset` (the open panel steps in) and `popout` (the open panel
steps out).

<Example file="expansion-panels/variants" />

## Slots

The `title` and default slots take over from the `title` and `text` props when
you need more than a string. `expand-icon` swaps the chevron.

<Example file="expansion-panels/slots" />

## Readonly and disabled

`readonly` renders the state but ignores clicks; `disabled` dims and blocks. Both
work on the group or on a single panel.

<Example file="expansion-panels/disabled" />

## Keyboard

Headers are real buttons, wired to the WAI-ARIA accordion pattern: `↑`/`↓` move
focus between headers, `Home`/`End` jump to the first/last, and `Enter`/`Space`
toggle.

## API

<ApiTable name="FExpansionPanels" />

<ApiTable name="FExpansionPanel" />
