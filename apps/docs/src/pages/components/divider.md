# Divider & Spacer

Two one-line layout primitives. `FDivider` draws a hairline rule between chunks
of content — it renders a real `<hr role="separator">`, so the split is announced
to assistive tech and not just painted. `FSpacer` draws nothing at all: it is a
`flex-grow: 1` box you drop into a flex row to shove the things after it to the
far end.

## Divider

Place it between sections. The rule stretches to fill its container.

<Example file="divider/default" />

## Inset

`inset` pulls the rule in from the leading edge, so it lines up with text that
sits after an icon or an avatar instead of cutting all the way across.

<Example file="divider/inset" />

## Vertical

`vertical` turns the rule on its side. It stretches to the height of its flex
parent, which makes it the natural separator inside a toolbar.

<Example file="divider/vertical" />

## Spacer

`FSpacer` eats the leftover room in a flex row. Put one after the title and the
buttons that follow it get pushed to the right; put one on each side of an
element to center it.

<Example file="divider/spacer" />

## API

<ApiTable name="FDivider" />

<ApiTable name="FSpacer" />
