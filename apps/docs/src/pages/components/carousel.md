# Carousel

`FCarousel` cycles through slides with arrows, delimiters, swipe and keyboard
support — FusionUI's take on Vuetify's `v-carousel`. Slides render through
[`FImage`](/components/image), so every image lazy-loads and fades in.

Pass images with the `items` prop, or compose slides with `FCarouselItem`.

## Default

<Example file="carousel/default" />

## Cycle

`cycle` auto-advances the carousel (every 6s by default; tune with `interval`).
It pauses while the pointer is over the carousel.

<Example file="carousel/cycle" />

## Arrows

`show-arrows` accepts `true`, `false`, or `'hover'`. `hide-delimiters` removes
the dots. Provide `prev` / `next` slots to fully customise the controls.

<Example file="carousel/arrows" />

## Progress

`progress` shows a determinate bar across the top instead of delimiters. Pass a
color string to theme it.

<Example file="carousel/progress" />

## Thumbnails & counter

`thumbnails` adds a scrollable strip and `counter` overlays a "3 / 5" badge —
handy for image galleries.

<Example file="carousel/thumbnails" />

## Custom slides

Compose slides with `FCarouselItem` (like `v-carousel-item`): give it a `src`
for an image slide, or drop arbitrary content in its default slot.

<Example file="carousel/items" />

## API

### FCarousel props

| Prop                      | Type                 | Default                          | Description                                               |
| ------------------------- | -------------------- | -------------------------------- | --------------------------------------------------------- |
| `v-model`                 | `number`             | `0`                              | The active slide index.                                   |
| `items`                   | `unknown[]`          | `[]`                             | Slides as data (alternative to `FCarouselItem` children). |
| `src-key`                 | `string`             | `'url'`                          | Key to read the image URL from when an item is an object. |
| `cycle`                   | `boolean`            | `false`                          | Auto-advance slides.                                      |
| `interval`                | `number \| string`   | `6000`                           | Auto-advance interval (ms).                               |
| `continuous`              | `boolean`            | `true`                           | Wrap around at the ends.                                  |
| `show-arrows`             | `boolean \| 'hover'` | `true`                           | Show navigation arrows always, never, or on hover.        |
| `hide-delimiters`         | `boolean`            | `false`                          | Hide the dot delimiters.                                  |
| `delimiter-icon`          | `string`             | —                                | Render an icon in each delimiter instead of a dot.        |
| `progress`                | `boolean \| string`  | `false`                          | Show a progress bar; pass a color to theme it.            |
| `height`                  | `string \| number`   | —                                | Fixed viewport height (overrides `aspect-ratio`).         |
| `aspect-ratio`            | `string \| number`   | `16 / 9`                         | Viewport ratio when `height` is unset.                    |
| `cover`                   | `boolean`            | `true`                           | Crop item images to fill each slide.                      |
| `touch`                   | `boolean`            | `true`                           | Enable swipe/drag navigation.                             |
| `thumbnails`              | `boolean`            | `false`                          | Show a thumbnail strip.                                   |
| `counter`                 | `boolean`            | `false`                          | Show a "3 / 12" counter overlay.                          |
| `prev-icon` / `next-icon` | `string`             | `chevron-left` / `chevron-right` | Arrow icons.                                              |
| `color`                   | `string`             | `primary`                        | Theme color for controls, delimiters and progress.        |

### FCarousel slots

| Slot            | Props                     | Description                             |
| --------------- | ------------------------- | --------------------------------------- |
| `default`       | —                         | `FCarouselItem` children.               |
| `item`          | `{ item, index, active }` | Custom render for `items`-based slides. |
| `prev` / `next` | `{ props: { onClick } }`  | Custom navigation controls.             |

### FCarousel events

| Event               | Payload  | Description               |
| ------------------- | -------- | ------------------------- |
| `update:modelValue` | `number` | The active index changed. |

### FCarouselItem props

| Prop       | Type      | Default | Description                                        |
| ---------- | --------- | ------- | -------------------------------------------------- |
| `src`      | `string`  | —       | Image URL — renders an `FImage` filling the slide. |
| `lazy-src` | `string`  | —       | Blur-up placeholder passed through to `FImage`.    |
| `alt`      | `string`  | `''`    | Alt text.                                          |
| `cover`    | `boolean` | `true`  | Crop to fill the slide vs. fit inside it.          |
| `eager`    | `boolean` | `false` | Load the image immediately.                        |
