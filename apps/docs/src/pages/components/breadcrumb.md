# Breadcrumb

`FBreadcrumb` shows where the current page sits in the hierarchy and gives a way
back up it. Feed it an `items` array; it renders a `<nav aria-label="breadcrumb">`,
links every item that has an `href`, and marks the last one as the current page
(`aria-current="page"`), so it is never a link and never looks like one.

## Default

The simplest form is an array of strings — the trailing item is the page you are
on.

<Example file="breadcrumb/default" />

## Links

Pass objects with `title` and `href` to make the ancestors navigable. Items
without an `href` render as plain text.

<Example file="breadcrumb/links" />

## Disabled

`disabled: true` on an item greys it out and drops its link, which is handy for
a level that exists in the URL but has no page of its own.

<Example file="breadcrumb/disabled" />

## Divider

`divider` names the icon drawn between items — it defaults to the `$next`
chevron and accepts any alias or icon name.

<Example file="breadcrumb/divider" />

## Custom divider

For a character separator like `/`, fill the `#divider` slot instead — its
content is used in place of the icon.

<Example file="breadcrumb/slot-divider" />

## API

<ApiTable name="FBreadcrumb" />
