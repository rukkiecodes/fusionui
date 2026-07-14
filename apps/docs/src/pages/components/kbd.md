# Keyboard & Code

Two small typographic components for talking about software. `FKbd` renders a
keyboard key cap — one key, or a whole shortcut from a single `keys` string.
`FCode` renders an inline snippet in the mono token font; put it inside a `<pre>`
and it becomes a code block.

## Key caps

`<f-kbd>` renders whatever it is given: default-slot content, or the `text`
prop.

<Example file="kbd/default" />

## Shortcuts

`keys` takes a shortcut in the usual `ctrl+k` notation (or an array of key
names) and renders one cap per key. Names like `cmd`, `ctrl`, `shift`, `esc`,
`up` are normalised to their friendly labels; anything else passes through as
written.

<Example file="kbd/shortcuts" />

### Separator

`separator` changes what is drawn between the caps. The `keys` string is always
split on `+` regardless — the separator is purely what the reader sees.

<Example file="kbd/separator" />

## Sizes

`size` takes `x-small` … `x-large`.

<Example file="kbd/sizes" />

## Colors

`color` tints the caps with a theme color or any CSS color. `border`, `rounded`
and `elevation` are available too.

<Example file="kbd/colors" />

## Inline code

`FCode` is a `<code>` element on a soft tinted fill, sized in `em` so it always
sits comfortably inside the paragraph that hosts it. Pass the snippet as the
default slot or through `text`.

<Example file="kbd/code" />

### Colors and sizes

`color` recolors the fill and the text together; `size` takes `x-small` …
`x-large`, and `rounded` softens the corners.

<Example file="kbd/code-colors" />

### Code block

Inside a `<pre>`, the snippet becomes the block itself — full width, scrollable,
and it keeps your whitespace.

<Example file="kbd/code-block" />

## API

<ApiTable name="FKbd" />

<ApiTable name="FCode" />
