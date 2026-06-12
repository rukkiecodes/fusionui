# Alert

`VdAlert` surfaces contextual messages — with a title, an icon, collapsible
content, a progress bar, pagination, and seven looks.

## Usage

Pick a variant and configure the alert live — the code updates as you go.

<AlertPlayground />

## Default

The default alert is a soft tint of the color with a left accent bar.

<Example file="alert/default" />

## Color

Set the accent with the `color` prop — a theme color (`primary`, `success`,
`danger`, `warning`, `dark`) or any HEX / RGB value.

<Example file="alert/colors" />

## Variants

Seven variants — set with the `variant` prop.

### Default

<Example file="alert/variant-default" />

### Solid

<Example file="alert/variant-solid" />

### Border

<Example file="alert/variant-border" />

### Shadow

<Example file="alert/variant-shadow" />

### Gradient

<Example file="alert/variant-gradient" />

### Flat

<Example file="alert/variant-flat" />

### Relief

<Example file="alert/variant-relief" />

## Closable

Add `closable` for a dismiss button, and bind `v-model` to control visibility.

<Example file="alert/closable" />

## Collapsible content

Bind `v-model:hidden-content` to make the title toggle the content open and
closed.

<Example file="alert/collapsible" />

## Icon & type

The `type` prop (`success`, `info`, `warning`, `error`) sets a color and a
leading icon; or pass any icon name to `icon`.

<Example file="alert/icons" />

## Footer

Use the `footer` slot for actions.

<Example file="alert/footer" />

## Progress

Bind a 0–100 `progress` value for a bar along the bottom — great for
auto-dismiss.

<Example file="alert/progress" />

## Pagination

Provide `page-1`, `page-2`, … slots and bind `v-model:page` for paginated
content with previous / next controls.

<Example file="alert/pagination" />

## API

<ApiTable name="VdAlert" />
