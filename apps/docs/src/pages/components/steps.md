# Steps

`FSteps` lays out a numbered sequence of cards — the "how it works" band on a
marketing page, an onboarding checklist, a shipping timeline. Pass an `items`
array and it builds a responsive grid that reflows from three columns to one,
numbering each card for you.

## Default

Each item takes a `title` and some `text`. The `01`, `02`, `03` in the corner is
generated automatically from the item's position.

<Example file="steps/default" />

## Icons

Add an `icon` to an item and it gets a tinted tile above the title.

<Example file="steps/icons" />

## Custom numbering

`n` overrides the generated number with anything you like — a day, a phase, a
short label.

<Example file="steps/numbering" />

## Custom content

Skip `items` and use the default slot to bring your own cards. You keep the
responsive grid and lay out the insides however you want.

<Example file="steps/custom" />

## API

<ApiTable name="FSteps" />
