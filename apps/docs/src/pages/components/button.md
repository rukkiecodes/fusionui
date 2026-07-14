# Button

Buttons are a fundamental part of any project. With FusionUI you add a great
button with a single line of code — every button ships with all of its states
(`active`, `focus`, `hover`, `disabled`) so implementation stays simple.

## Usage

Pick a variant and configure the button live — the code updates as you go.

<ButtonPlayground />

## Default

The default button is a solid fill that lifts with a soft colored shadow on
hover and when `active`.

<Example file="button/default" />

## Color

Change the color with the `color` prop. It accepts a theme color
(`primary`, `success`, `danger`, `warning`, `dark`) or any HEX / RGB value.

<Example file="button/colors" />

## Variants overview

Ten variants cover every style at a glance.

<Example file="button/variants" />

## Flat

The `tonal` variant tints the background with the color and fills solid on focus.

<Example file="button/flat" />

## Outlined

The `outlined` variant draws a 2px border that fills on focus.

<Example file="button/outlined" />

## Gradient

The `gradient` variant blends the color into a hue-shifted tone, fading to the
solid color on hover.

<Example file="button/gradient" />

## Relief

The `relief` variant sits raised on a darker color ledge and presses down when
clicked.

<Example file="button/relief" />

## Text

The `text` variant is borderless; a soft tint scales in on hover.

<Example file="button/text" />

## Shadow

The `shadow` variant rests on a neutral surface and lifts with a soft shadow.

<Example file="button/shadow" />

## Floating

The `floating` variant rests elevated with a colored shadow and lifts further on
hover — perfect for icon actions.

<Example file="button/floating" />

## Sizes

Five sizes from `x-small` to `x-large`; padding and radius scale together.

<Example file="button/sizes" />

## Block

The `block` prop stretches the button to the full width of its container.

<Example file="button/block" />

## Icons

Use `prepend-icon` / `append-icon`, or `icon` for a compact icon-only button.

<Example file="button/icon" />

## Circle & Square

`circle` makes an icon button perfectly round; `square` removes the radius.

<Example file="button/circle-square" />

## Loading & Upload

`loading` shows the dual-ring loader; `upload` shows a progress sweep. Both
block interaction.

<Example file="button/loading" />

## Animate on hover

Provide an `animate` slot and an `animation-type`
(`horizontal`, `vertical`, `scale`, `rotate`) to swap content on hover.

<Example file="button/animate" />

## Button group

Group buttons into a single connected control with `FBtnGroup` — `v-model`
tracks the selected value.

<Example file="button/group" />

## Link

Set `href` to render the button as an anchor.

<Example file="button/link" />

## API

<ApiTable name="FBtn" />

<ApiTable name="FBtnGroup" />
