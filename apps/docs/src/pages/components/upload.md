# Upload

`FUpload` is a drop zone that also opens the file picker when clicked. It keeps
the chosen files in its `v-model` as a plain array of `File` objects and lists
them underneath, each with a button to drop it again. Sending the files
somewhere is left to you — the component collects them, your code uploads them.

## Default

Bind an array to `v-model`. Picking a file replaces whatever was there before,
since a single-file zone can only hold one.

<Example file="upload/default" />

## Multiple

`multiple` lets the picker take several files at once, and every new selection
is appended to the list rather than replacing it.

<Example file="upload/multiple" />

## Accept

`accept` is the native filter — the same comma-separated list of MIME types or
extensions you'd give an `<input type="file">`. Spell out the rule in `text` so
people know before they drop.

<Example file="upload/accept" />

## Color

`color` tints the border, the icon and the highlight that appears while a file
is being dragged over the zone.

<Example file="upload/colors" />

## Disabled

`disabled` greys the zone out and ignores both clicks and drops.

<Example file="upload/disabled" />

## API

<ApiTable name="FUpload" />
