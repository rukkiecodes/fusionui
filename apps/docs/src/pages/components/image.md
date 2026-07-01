# Image

`FImage` renders a responsive image with lazy loading, a blur-up placeholder,
aspect-ratio control, cropping, gradients and content overlays — FusionUI's take
on Vuetify's `v-img`.

## Default

Set `src` and an optional tiny `lazy-src`: the low-res placeholder shows blurred
while the full image decodes, then the real image fades in.

<Example file="image/default" />

## Cover

By default the image fits inside its box (`contain`). Add `cover` to fill and
crop it instead.

<Example file="image/cover" />

## Aspect ratio

`aspect-ratio` reserves the box before the image loads, preventing layout shift.
Without it (and without a `height`), `FImage` adopts the image's own ratio once
it knows the natural dimensions.

<Example file="image/aspect" />

## Gradient & overlay

`gradient` paints a CSS gradient over the image (great for legible captions); the
default slot lays arbitrary content on top.

<Example file="image/gradient" />

## Placeholder & error slots

Use `#placeholder` for custom loading content and `#error` for a broken-image
fallback. `FImage` also emits `load` and `error`.

```vue
<f-image src="/broken.jpg" aspect-ratio="16/9">
  <template #placeholder>
    <f-progress-circular indeterminate />
  </template>
  <template #error>
    <span>Couldn’t load image</span>
  </template>
</f-image>
```

## API

### Props

| Prop               | Type                          | Default  | Description                                                                       |
| ------------------ | ----------------------------- | -------- | --------------------------------------------------------------------------------- |
| `src`              | `string`                      | —        | The image URL.                                                                    |
| `lazy-src`         | `string`                      | —        | Low-res image shown (blurred) while `src` loads.                                  |
| `alt`              | `string`                      | `''`     | Alt text.                                                                         |
| `cover`            | `boolean`                     | `false`  | Fill and crop the box instead of fitting inside it.                               |
| `aspect-ratio`     | `string \| number`            | —        | Box ratio (e.g. `16/9`); falls back to the image's own ratio.                     |
| `height` / `width` | `string \| number`            | —        | Explicit dimensions (also `max-height`, `max-width`, `min-height`, `min-width`).  |
| `position`         | `string`                      | `center` | `object-position` for the image.                                                  |
| `gradient`         | `string`                      | —        | CSS gradient painted over the image (e.g. `to top, rgba(0,0,0,.6), transparent`). |
| `eager`            | `boolean`                     | `false`  | Load immediately instead of lazily.                                               |
| `rounded`          | `boolean \| string \| number` | `false`  | `true` (md radius) or a CSS length.                                               |

### Slots

| Slot          | Description                       |
| ------------- | --------------------------------- |
| `default`     | Content laid over the image.      |
| `placeholder` | Shown while the image is loading. |
| `error`       | Shown if the image fails to load. |

### Events

| Event   | Payload | Description                            |
| ------- | ------- | -------------------------------------- |
| `load`  | `src`   | Fired when the image finishes loading. |
| `error` | `src`   | Fired when the image fails to load.    |
