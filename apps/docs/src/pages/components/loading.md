# Loading

`useLoading()` is an imperative overlay service — open a loader, get a handle,
close it when the work is done. It can cover the whole screen or scope to a
single element, and it ships eleven spinner animations.

```ts
import { useLoading } from '@rukkiecodes/vue'

const loading = useLoading()
const handle = loading.open({ type: 'points', text: 'Loading…' })
// later…
handle.close()
```

## Default

Pass an element as `target` to scope the loader to it; omit `target` for a
full-screen overlay. The handle's `close()` dismisses it.

<Example file="loading/default" />

## Types

Set `type` to change the animation. All eleven render inside one 48px box,
driven entirely by the spinner's color.

<Example file="loading/types" />

## Color

`color` takes a theme color (`primary`, `success`, `danger`, `warning`…) or any
CSS color.

<Example file="loading/color" />

## Background

`background` recolors the overlay (a theme color or any CSS color); pair it with
a light `color` for contrast.

<Example file="loading/background" />

## Text

Add a `text` label under the spinner.

<Example file="loading/text" />

## Percent

Pass `percent` to show a value inside the spinner — update it live through the
handle: `handle.update({ percent: '60%' })`.

<Example file="loading/percent" />

## Progress

Pass `progress` (0–100) for a determinate bar across the top of the overlay,
updated the same way.

<Example file="loading/progress" />

## Options

| Option       | Type                  | Default     | Description                                              |
| ------------ | --------------------- | ----------- | -------------------------------------------------------- |
| `target`     | `HTMLElement\|string` | —           | Scope to an element (or selector); omit for full-screen. |
| `type`       | `LoadingType`         | `'default'` | Spinner animation (see Types).                           |
| `color`      | `string`              | `'primary'` | Theme color name or any CSS color.                       |
| `background` | `string`              | —           | Overlay color (theme name or CSS color).                 |
| `text`       | `string`              | —           | Label under the spinner.                                 |
| `percent`    | `number\|string`      | —           | Value shown inside the spinner.                          |
| `progress`   | `number`              | —           | Determinate top bar, 0–100.                              |
| `scale`      | `number`              | `1`         | Spinner size multiplier (1 = 48px).                      |
| `opacity`    | `number`              | —           | Overlay opacity, 0–1.                                    |

`open(options)` returns `{ id, close(), update(patch) }`. `useLoading()` also
exposes `close(id)` and `closeAll()`.

## Progress components

When you want a spinner or bar **in the layout** rather than over it, reach for
`FProgressCircular` and `FProgressLinear` directly. Both take a 0–100
`model-value` for a determinate reading, or `indeterminate` while the duration is
unknown. `FProgressLinear` also accepts a `height` and a `striped` fill.

<Example file="loading/progress-components" />

## API

<ApiTable name="FProgressCircular" />

<ApiTable name="FProgressLinear" />
