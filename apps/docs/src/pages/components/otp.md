# OTP Input

`FOtp` is a one-time-code field — a row of single-character boxes that
auto-advance as you type, step back on backspace, and accept a pasted code into
all boxes at once. Bind `v-model` to the string; `@complete` fires when every
box is filled.

```vue
<f-otp v-model="code" :length="6" @complete="verify" />
```

## Default

Type a digit and focus jumps to the next box; paste a code to fill them all.

<Example file="otp/default" />

## Mask

`mask` hides the characters (password dots) — for a sensitive PIN.

<Example file="otp/mask" />

## Separator

`separator` draws a character between the boxes.

<Example file="otp/separator" />

## Sizes

`size` is `small`, `default`, or `large`.

<Example file="otp/sizes" />

## State

`state` tints the boxes `success` / `danger` / `warning` — e.g. after validating
the code.

<Example file="otp/state" />

## Loading

`loading` shows a spinner and blocks input while the code is checked.

<Example file="otp/loading" />

## API

| Prop         | Type               | Default     | Description                            |
| ------------ | ------------------ | ----------- | -------------------------------------- |
| `modelValue` | `string`           | `''`        | The entered code (`v-model`).          |
| `length`     | `number`           | `6`         | Number of boxes.                       |
| `type`       | `'number'\|'text'` | `'number'`  | `number` accepts digits only.          |
| `mask`       | `boolean`          | `false`     | Hide the characters.                   |
| `color`      | `string`           | `'primary'` | Theme color or any CSS color.          |
| `state`      | `string`           | —           | `success` / `danger` / `warning` tint. |
| `size`       | `string`           | `'default'` | `small` / `default` / `large`.         |
| `square`     | `boolean`          | `false`     | Less-rounded corners.                  |
| `separator`  | `string`           | —           | Character drawn between boxes.         |
| `disabled`   | `boolean`          | `false`     | —                                      |
| `loading`    | `boolean`          | `false`     | Spinner + blocked input.               |
| `autofocus`  | `boolean`          | `false`     | Focus the first box on mount.          |

Emits `update:modelValue` and `complete` (with the full code).

### Full reference

Generated from the component source — includes the shared `class` / `style` and
theme props the table above leaves out.

<ApiTable name="FOtp" />
