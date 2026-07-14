# Skeleton

`FSkeleton` is a loading placeholder that mimics the shape of the content it
stands in for — a shimmering set of "bones" laid out like the real thing. It
reads better than a spinner because the page does not jump when the data
arrives.

## Default

`type` picks the shape. The leaf primitives — `ossein` (a plain block, the
default), `text`, `heading`, `avatar`, `image`, `button`, `chip`, `divider` —
get their proportions from the stylesheet; `width`, `height` and the other
dimension props size the surface.

<Example file="skeleton/default" />

## Types

The interesting types are compositions of those primitives: `article`, `card`,
`card-avatar`, `list-item`, `list-item-avatar-two-line`, `paragraph`,
`sentences`, `table`, `table-row`, `actions` …

<Example file="skeleton/types" />

## Composition

Any type can be composed. A comma-separated list stacks bones in order, `@n`
repeats one (`text@3`), and an array is just a list by another name — so
`card` is really `image, heading, sentences`.

<Example file="skeleton/composition" />

## Table

`table` expands to a whole table: a heading, six columns, six divided rows and a
footer.

<Example file="skeleton/table" />

## Loading

Put the real content in the default slot: the skeleton shows while the slot is
empty and gets out of the way once content arrives. `loading` forces it to stay
on — the switch you bind to your request state. While it is visible it announces
`loading-text` to assistive tech.

<Example file="skeleton/loading" />

## Boilerplate

`boilerplate` renders a dimmer, motionless placeholder with no screen-reader
announcement — for mock-ups and prototypes, where nothing is actually loading.

<Example file="skeleton/boilerplate" />

## API

<ApiTable name="FSkeleton" />
