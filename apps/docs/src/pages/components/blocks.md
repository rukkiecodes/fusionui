# Page Blocks

Most design systems stop at the widget and leave you to hand-roll the marketing
site. FusionUI's page blocks are the layer above: the hero, the section, the
feature grid, the closing call to action — the pieces a landing page or an app
shell is actually made of. They are plain, themed, token-driven surfaces with no
opinions about routing or content, so you compose them the same way you compose
a card.

Everything below is one page's worth of a real product site, built out of these
eleven components.

## FHero

`FHero` is the landing hero: a responsive two-column grid with a contained
radial glow behind it. Copy goes in the default slot, an illustration (or a
stack of stats) in `#visual`. Turn the glow off with `:glow="false"`.

<Example file="blocks/hero" />

## FCta

`FCta` is the closer — a centered title and lede on a tinted panel, with your
buttons in the default slot. The default `gradient` variant tints the band in
the primary color; `flat` gives you a plain surface panel for a secondary ask.

<Example file="blocks/cta" />

## FFeature

`FFeature` is an icon-led card: an icon badge, a title and supporting copy. It's
the atom of feature grids, "how it works" steps and value props. Add `hover` to
make it lift, which reads as clickable.

<Example file="blocks/feature" />

## FSection

`FSection` is the backbone — a centered, max-width container with an optional
`eyebrow` + `title` header above whatever you slot in. `center` centers the
header and content; `width` caps the content column (`1120px` by default).
Replace the whole header with the `#header` slot when a title isn't enough.

<Example file="blocks/section" />

## FEyebrow

`FEyebrow` is the small tinted pill that sits above a heading — "Now in beta",
"Changelog", "All systems operational". `dot` adds a leading status dot and
`color` takes a theme color or any CSS color.

<Example file="blocks/eyebrow" />

## FPageHeader

`FPageHeader` is the app-side counterpart: an optional back link, a title and
subtitle, and an `#actions` slot on the right. It's router-agnostic — setting
`back-label` renders the link and clicking it emits `back`, which you wire to
`router.back()` yourself.

<Example file="blocks/page-header" />

## FStat

`FStat` is a labelled statistic — a big value over a caption, with an optional
leading icon. `color` accents the value. Use them in a trust strip, a dashboard
summary or, as in the hero above, beside the pitch.

<Example file="blocks/stat" />

## FValueCard

`FValueCard` is a value-proposition panel: a small uppercase `tag`, a `title`,
then free-form slotted content — copy, a checklist, an action. Give one card of
a pair `accent` to tint it in the primary color and make it the hero of a
"for X / for Y" section.

<Example file="blocks/value-card" />

## FStatusPill

`FStatusPill` is a compact tinted state label — deployed, pending, rolled back.
The semantic `color` drives both the tint and the text, and `dot` adds a leading
indicator.

<Example file="blocks/status-pill" />

## FOptionCard

`FOptionCard` is a large "choose one" card: icon, title, supporting text and a
check indicator. It renders a real `<button>` with `aria-pressed`, but the
parent owns the selection — bind `selected` and handle `@select`.

<Example file="blocks/option-card" />

## FCheckList

`FCheckList` is a list with a leading icon per row, for benefit and feature
lists. Pass a string array to `items` for the common case, change the `icon` and
`color` to re-purpose it, or drive the default slot for fully custom rows.

<Example file="blocks/check-list" />

## API

<ApiTable name="FHero" />

<ApiTable name="FCta" />

<ApiTable name="FFeature" />

<ApiTable name="FSection" />

<ApiTable name="FEyebrow" />

<ApiTable name="FPageHeader" />

<ApiTable name="FStat" />

<ApiTable name="FValueCard" />

<ApiTable name="FStatusPill" />

<ApiTable name="FOptionCard" />

<ApiTable name="FCheckList" />
