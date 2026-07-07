# Grid

A 12-column flexbox layout system for building responsive pages. It works the
way Vuetify's grid does — a **container** centers your content, a **row** holds
the columns and owns the gutter, and each **column** declares how many of the 12
tracks it spans, per breakpoint.

Three components: `FContainer`, `FRow`, and `FCol` (kebab `<f-container>`,
`<f-row>`, `<f-col>`).

## Playground

Add and resize columns, change the gutter density, and tweak alignment — the
markup updates live.

<GridPlayground />

## Basics

Columns inside a row share the available width equally when you don't give them
a span. The row supplies the gutter between them.

<Example file="grid/basic" />

## Column spans

Set `cols` to a number from 1–12. Twelve is a full row, so `6 + 6`, `4 + 4 + 4`
and `3 × 4` each fill one line. A row wraps once its columns exceed 12 tracks.

<Example file="grid/spans" />

## Responsive columns

`cols` is the base (applies at every width). Add `sm`, `md`, `lg`, `xl`, `xxl`
to override the span from that breakpoint up. Below stacks full-width on phones,
goes to halves at `md`, and thirds at `lg`.

<Example file="grid/responsive" />

The breakpoints match `useDisplay()`: `sm` 600 · `md` 960 · `lg` 1280 ·
`xl` 1920 · `xxl` 2560 (px, min-width). You can also write `cols="4/6"` to span
4 of a custom 6-track total.

## Auto & fill

`cols="auto"` sizes a column to its content; a column with no span fills the
remaining space.

<Example file="grid/auto" />

## Offsets

`offset` pushes a column to the right by that many tracks — handy for centering
or indenting content.

<Example file="grid/offset" />

## Order

`order` reassigns the visual position without touching source order. Use a
number, or the `first` / `last` shorthands.

<Example file="grid/order" />

## Gutters & density

The gutter comes from the row's `density` — `default` (24px), `comfortable`
(16px), or `compact` (8px). `no-gutters` removes it entirely, and `gap` overrides
it with any length (or `[x, y]` for independent axes).

<Example file="grid/gutters" />

## Alignment

`align` positions columns on the cross axis (`start`, `center`, `end`,
`baseline`, `stretch`); `justify` distributes them along the main axis
(`start`, `center`, `end`, `space-between`, `space-around`, `space-evenly`).
Both accept per-breakpoint variants like `align-md` and `justify-lg`.

<Example file="grid/alignment" />

## Container

`FContainer` centers your content and caps its width per breakpoint. Add `fluid`
to span the full viewport width instead.

<Example file="grid/container" />

## FContainer API

<ApiTable name="FContainer" />

## FRow API

<ApiTable name="FRow" />

## FCol API

<ApiTable name="FCol" />
