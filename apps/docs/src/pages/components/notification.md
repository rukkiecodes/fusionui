# Notification

`useNotify()` is an imperative notification service — push a toast, get a
handle, and it dismisses itself (or stays until closed). Cards reveal with a
clip-path circle animation and stack in any of six screen positions.

```ts
import { useNotify } from '@rukkiecodes/vue'

const { notify } = useNotify()
const handle = notify({ title: 'Saved', text: 'Your changes were saved.', color: 'success' })
// later…
handle.dismiss()
```

## Default

Call `notify(options)` with a `title` and/or `text`. It auto-dismisses after
`duration` (default 4000ms) and returns `{ id, dismiss() }`.

<Example file="notification/default" />

## Colors

`color` takes a theme color (`primary`, `success`, `danger`, `warning`,
`secondary`). The shorthand helpers `notify.success` / `notify.error` /
`notify.warning` / `notify.info` set the color and a matching icon.

<Example file="notification/colors" />

## Position

`position` places the stack in one of six spots. The reveal animation's origin
adapts to each side.

<Example file="notification/position" />

## Border

`border` draws a coloured edge accent; the side it sits on follows the position
(right for the corners, top/bottom for the centered stacks).

<Example file="notification/border" />

## Flat

`flat` swaps the filled color for a subtle tinted surface with coloured text.

<Example file="notification/flat" />

## Icon

`icon` shows an icon on the left of the card.

<Example file="notification/icon" />

## Progress

`progress: true` adds a bar that counts down the remaining `duration`.

<Example file="notification/progress" />

## Loading

`loading: true` renders a compact spinner instead of content — useful while an
async task runs. Pair it with `duration: 0` and dismiss it via the handle.

<Example file="notification/loading" />

## Sticky

Set `duration: 0` to keep the notification open until it's dismissed (by the
close button or `handle.dismiss()`).

<Example file="notification/sticky" />

## Options

| Option       | Type             | Default          | Description                                                      |
| ------------ | ---------------- | ---------------- | ---------------------------------------------------------------- |
| `title`      | `string`         | —                | Bold heading.                                                    |
| `text`       | `string`         | —                | Body text.                                                       |
| `color`      | `string`         | —                | Filled theme color (`primary`, `success`, `danger`, `warning`…). |
| `border`     | `string`         | —                | Coloured edge accent (theme color).                              |
| `icon`       | `IconValue`      | —                | Icon shown on the left.                                          |
| `position`   | `NotifyPosition` | `'bottom-right'` | One of the six corners/centers.                                  |
| `duration`   | `number`         | `4000`           | Auto-dismiss in ms. `0` keeps it open.                           |
| `closable`   | `boolean`        | `true`           | Show the close button.                                           |
| `progress`   | `boolean`        | `false`          | Countdown bar (needs `duration > 0`).                            |
| `flat`       | `boolean`        | `false`          | Subtle tinted style.                                             |
| `square`     | `boolean`        | `false`          | Square corners.                                                  |
| `loading`    | `boolean`        | `false`          | Compact spinner instead of content.                              |
| `width`      | `string`         | —                | `'auto'` shrinks to content, `'100%'` spans the viewport.        |
| `notPadding` | `boolean`        | `false`          | Remove inner padding (for custom content).                       |
| `clickClose` | `boolean`        | `false`          | Dismiss when the body is clicked.                                |
| `onClick`    | `() => void`     | —                | Click handler for the card.                                      |

`notify(options)` returns `{ id, dismiss() }`. `useNotify()` also exposes
`dismiss(id)` and `clear()`. The host is mounted automatically by
`createFusionUI()`.
