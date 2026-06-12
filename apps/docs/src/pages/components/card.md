# Card

Cards contain content and actions about a single subject. `VdCard` is built
from slots — drop in an `img`, a `title`, some `text`, and overlay
`interactions` — and pick one of five layout `type`s, each with its own hover
animation.

> The images below are placeholders; swap in your own by changing the `img` slot.

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

## Slots

| Slot           | Description                                         |
| -------------- | --------------------------------------------------- |
| `img`          | The card image (or any media).                      |
| `title`        | Heading shown above the text.                       |
| `text`         | Body copy.                                          |
| `interactions` | Buttons overlaid on the image (likes, comments, …). |
| `buttons`      | A footer row of actions below the text.             |
| `default`      | Free-form content appended inside the card.         |

## Group

Wrap several cards in `VdCardGroup` for a horizontal, swipeable carousel with
previous / next controls.

<Example file="card/group" />

## API

<ApiTable name="VdCard" />
