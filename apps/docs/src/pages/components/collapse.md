# Collapse

`FCollapse` hides a block of content behind a header that toggles it open. The
height animates without any JavaScript measuring, so it stays smooth however
much content is inside. Use it for FAQs, for advanced settings you'd rather not
show up front, and anywhere a page is long enough that folding it up helps.

## Default

Give it a `title` and put the content in the default slot. `v-model` is optional
— without it the collapse manages its own open state.

<Example file="collapse/default" />

## Stacked

Several collapses in a column give you an FAQ: each one opens and closes
independently.

<Example file="collapse/faq" />

## Accordion

For the classic accordion — only one section open at a time — control the
collapses from a single value and toggle it as they open.

<Example file="collapse/accordion" />

## Title slot

The `title` slot replaces the plain `title` string, so the header can carry an
icon, a chip, or a count.

<Example file="collapse/title-slot" />

## Disabled

A `disabled` collapse is dimmed and can't be toggled.

<Example file="collapse/disabled" />

## API

<ApiTable name="FCollapse" />
