# Selection Groups

`FItemGroup` is the headless selection group every other FusionUI group is a
specialisation of. It owns nothing visual: children opt in through `FItem` and
decide for themselves what "selected" looks like. `FBtnToggle` and `FChipGroup`
are the two ready-made specialisations — the same model, wearing buttons or
chips.

Every group shares the same props: `multiple` (an array model), `mandatory`
(never empty — `"force"` also picks one before the user does), `max` (a cap on
how many can be selected) and `selected-class` (the class selected children
wear).

## Item group

`FItem` is renderless: it hands its default slot `{ isSelected, selectedClass,
toggle, select, value, disabled }` and renders whatever comes back. Bind
`selectedClass` to your own markup and the group's selection ring follows.

<Example file="item-group/default" />

### Multiple and max

<Example file="item-group/multiple" />

## Button toggle

`FBtnToggle` is a row of `FBtn`s that behaves as one control. The buttons stay
ordinary buttons — they only need a `value`; the toggle's `variant` and `color`
reach them through the defaults system, and `aria-pressed` is set for you.

<Example file="item-group/btn-toggle" />

`multiple` allows any number pressed at once, `divided` draws a rule between the
buttons, and `rounded` shapes the whole row.

<Example file="item-group/btn-toggle-multiple" />

## Chip group

`FChipGroup` is the chip equivalent — a scrolling rail of selectable `FChip`s.
`filter` slides a check icon into each chip as it is selected.

<Example file="item-group/chip-group" />

`column` wraps the chips onto multiple lines instead of scrolling on one.

<Example file="item-group/chip-group-column" />

## API

<ApiTable name="FItemGroup" />

<ApiTable name="FItem" />

<ApiTable name="FBtnToggle" />

<ApiTable name="FChipGroup" />
