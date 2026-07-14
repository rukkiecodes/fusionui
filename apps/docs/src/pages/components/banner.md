# Banner

`FBanner` is a page-level message: full width, a leading icon or avatar, a line
of copy and a row of actions. Where an alert speaks about one thing on the page,
a banner speaks about the page itself — cookie notices, plan upgrades, outages,
offline state.

## Default

Give it an `icon` and some `text`, and fill the `actions` slot with the buttons
that answer it.

<Example file="banner/default" />

## Colors

`color` accents the banner — it washes the background, tints the leading avatar
and colors the actions. `bg-color` fills it solidly instead, flipping the text
to the contrasting color.

<Example file="banner/colors" />

## Avatar

`avatar` takes an image URL and uses it instead of an icon — the right choice
when the message comes from a person.

<Example file="banner/avatar" />

## Composed

`FBannerText` and `FBannerActions` let you build the body yourself from the
default slot instead of passing `text` and filling the `actions` slot.

<Example file="banner/composed" />

## Lines

`lines` clamps the message to `one`, `two` or `three` lines.

<Example file="banner/lines" />

## Closable

`closable` adds a dismiss button. The banner's visibility is `v-model`-bound, so
you can bring it back; `click:close` fires alongside.

<Example file="banner/closable" />

## Stacked

The banner is a single row from the `sm` breakpoint up. `stacked` forces the
mobile layout — actions below the copy — at every width.

<Example file="banner/stacked" />

## Sticky

`sticky` pins the banner to the top of its nearest scroll container.

<Example file="banner/sticky" />

## API

<ApiTable name="FBanner" />

<ApiTable name="FBannerText" />

<ApiTable name="FBannerActions" />
