# Card

Cards contain content and actions about a single subject. `VdCard` is built
from slots — drop in an `img`, a `title`, some `text`, and overlay
`interactions` — and pick one of five layout `type`s, each with its own hover
animation.

> The images below are placeholders; swap in your own by changing the `img` slot.

## Usage

Pick a type and configure the card live — the code updates as you go.

<CardPlayground />

## Default

The default card (`type="1"`) settles down and zooms its image gently on hover.

<Example file="card/default" />

## Type 2

The image fills the card and a gradient caption slides up into view on hover.

<Example file="card/type2" />

## Type 3

A horizontal layout that scales up on hover — great for list rows.

<Example file="card/type3" />

## Type 4

A full-bleed image with a frosted-glass caption pinned to the bottom; the card
lifts on hover.

<Example file="card/type4" />

## Type 5

The caption sits as a floating panel that pops up over the image, while the
interactions rise and the image corners morph.

<Example file="card/type5" />

## Type 6

The image parallaxes inside its frame as the page scrolls — scroll up and down
to watch it drift.

<Example file="card/type6" />

## Type 8 — dodges the cursor

Move your cursor toward the card and it kinetically dodges out of the way.

<Example file="card/type8" />

## Type 9 — follows the cursor

Hover around the card and it leans and tilts toward your cursor.

<Example file="card/type9" />

## Type 10 — X feed

A post layout (avatar, handle, media, reply / repost / like / views) using the
`avatar`, `header`, and `actions` slots.

<Example file="card/type10" />

## Type 11 — Facebook feed

Full-bleed media with a divided Like / Comment / Share bar.

<Example file="card/type11" />

## Type 12 — Instagram

Header, square media, the action row, then the caption.

<Example file="card/type12" />

## Slots

| Slot           | Description                                           |
| -------------- | ----------------------------------------------------- |
| `img`          | The card image (or any media).                        |
| `title`        | Heading shown above the text.                         |
| `text`         | Body copy.                                            |
| `interactions` | Buttons overlaid on the image (likes, comments, …).   |
| `avatar`       | Avatar in the header (social types 10–12).            |
| `header`       | Name / handle / meta beside the avatar (types 10–12). |
| `actions`      | Footer action row (social types 10–12).               |
| `buttons`      | A footer row of actions below the text.               |
| `default`      | Free-form content appended inside the card.           |

## Group

Wrap several cards in `VdCardGroup` for a horizontal, swipeable carousel with
previous / next controls.

<Example file="card/group" />

## API

<ApiTable name="VdCard" />
