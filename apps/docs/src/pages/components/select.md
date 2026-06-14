# Select

`FSelect` is a Vuesax-style dropdown built on the same field as the inputs. Pass
an `items` array (strings or `{ title, value }` objects); bind `v-model` to the
value, or to an array for multiple selection.

## Default

<Example file="select/default" />

## Multiple

`multiple` collects values into an array as chips. Add `collapse-chips` to keep
the field tidy past two selections.

<Example file="select/multiple" />

## Color

`color` takes a theme color (`primary`, `success`…) or any CSS color.

<Example file="select/colors" />

## Filter

`filter` adds a search box that filters the options as you type.

<Example file="select/filter" />

## Groups

Insert `{ header: 'Title' }` entries into `items` to group the options — headers
hide automatically when a filter removes everything under them.

<Example file="select/group" />

## Label placeholder

`label-placeholder` starts the label as the placeholder and floats it up once a
value is chosen.

<Example file="select/label" />

## State

`state` tints the field (`success` / `danger` / `warning`); pair it with a `hint`
for a message.

<Example file="select/state" />

## Loading

`loading` shows a spinner in the field and a loading row in the menu.

<Example file="select/loading" />

## API

<ApiTable name="FSelect" />
