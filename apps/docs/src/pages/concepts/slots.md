# Slots & Composition

FusionUI components are shells, not black boxes. Every region a component owns —
a card's image, a table cell, the thing that opens a menu — is a slot, and the
component's job is to put your content in the right wrapper with the right
classes, states and accessibility wiring around it.

Three patterns cover almost everything: **named slots** for regions, **scoped
slots** for regions that need the component's state, and **sub-components** for
the times a slot cannot reach far enough.

## Named slots and sub-components

`FCard` is the clearest example. It has a slot per region — `#img`, `#title`,
`#text`, `#buttons`, plus `#interactions`, `#header`, `#avatar`, `#actions` and
`#front` / `#back` for the card types that use them — and each one is wrapped in
the element the layout needs (`.fui-card__img`, `.fui-card__title`, …). Simple
cards can skip the slots entirely and pass the `image`, `title` and `text`
props; when both are present, the slot wins.

The same three regions also exist as components — `FCardTitle`, `FCardText`,
`FCardButtons` — which render the identical wrappers from inside the default
slot. Use them when the content is assembled by a child component that has no
access to the card's own slots.

<Example file="concepts/slots-card" />

## Scoped slots

A scoped slot is a slot the component passes data into. `FForm` hands its
default slot the form's live state, so the submit button can guard on it:

```html
<f-form v-slot="{ isValid, validate, reset, resetValidation }">
  <f-btn type="submit" :disabled="isValid === false">Save</f-btn>
</f-form>
```

`FDataTable` takes this furthest: it generates a scoped slot **per column**.
`item.<key>` replaces a cell, `header.<key>` replaces a column heading, and the
key is whatever you put in `headers`.

- `item.<key>` receives `{ item, value, index, internalItem, columns }` — the
  raw row, the resolved cell value, and the row's position.
- `header.<key>` receives `{ column, isSorted, sortOrder, toggleSort }`, so a
  custom heading keeps its sorting behaviour instead of losing it.

<Example file="concepts/slots-table" />

Beyond the per-column slots, the table exposes `expanded-row`, `group-header`,
`no-data`, `loading`, `top`, `bottom` and `footer.prepend` — enough to replace
every part of it without forking it.

## Activator slots

Overlays need to know what opened them. `FMenu` renders its `#activator` in
place and teleports the content to `<body>`, so the menu escapes any ancestor's
`overflow` or stacking context:

```html
<f-menu>
  <template #activator="{ props, isActive }">
    <f-btn v-bind="props">Open</f-btn>
  </template>
  <template #default="{ close }">…</template>
</f-menu>
```

`props` carries the click handler — `v-bind` it onto whatever you want to be the
trigger — and `isActive` lets the trigger reflect the open state. The default
slot gets `close`, for menu items that should dismiss the menu themselves.

`FTooltip` also has an `#activator` slot, but its payload is only `{ active }`:
the tooltip listens on its own root element, so there is nothing for you to
bind. Its content comes from the `text` prop or the `#tooltip` slot. (Its
default slot works as an activator too, so `<f-tooltip text="…"><f-btn/></f-tooltip>`
is the short form.)

`FDialog` has **no** activator slot. It is driven entirely by `v-model`, because
the thing that opens a dialog is rarely the thing next to it — a row action, a
keyboard shortcut, a failed request. Its regions are `#header`, the default slot
and `#footer`.

<Example file="concepts/slots-activator" />
