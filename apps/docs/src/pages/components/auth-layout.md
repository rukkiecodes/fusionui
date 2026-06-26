# Auth Layout

`FAuthLayout` is a split-screen shell for sign-in, sign-up and onboarding: your
form fills one side while a branded panel — text or a full-bleed photo — fills
the other. The panel collapses below ~860px so the form takes the full width on
mobile.

```vue
<template>
  <f-auth-layout aside-position="right" image="/auth/photo.jpg">
    <!-- Branded panel -->
    <template #aside>
      <a class="logo">QueenSkiilia</a>
      <h2>Welcome back</h2>
      <p>Skill-tested talent meets businesses that need work done.</p>
    </template>

    <!-- The form (default slot) -->
    <h3>Sign in</h3>
    <f-input label="Email address" prepend-icon="mail" />
    <f-btn color="primary" block>Send code</f-btn>
  </f-auth-layout>
</template>
```

## Aside position

`aside-position` puts the branded panel on the `left` (default) or the `right`,
with the form on the opposite side.

```vue
<f-auth-layout aside-position="right"> … </f-auth-layout>
```

## Photo panel

Pass an `image` URL and the aside becomes a full-bleed photo with an automatic
dark gradient overlay for legible white text on top.

```vue
<f-auth-layout image="/auth/collaborate.jpg">
  <template #aside> … white text reads cleanly over the photo … </template>
  …
</f-auth-layout>
```

## Inset

By default the panel runs edge-to-edge. Add `inset` to float it as a rounded,
margined "island" instead.

```vue
<f-auth-layout image="/auth/photo.jpg" inset> … </f-auth-layout>
```

## Content width

`content-width` sets the width of the form column (any CSS length). It defaults
to `420px`.

```vue
<f-auth-layout content-width="480px"> … </f-auth-layout>
```

## Slots

| Slot      | Description                                  |
| --------- | -------------------------------------------- |
| `default` | The form / auth content column.              |
| `aside`   | The branded panel — logo, headline, imagery. |

## API

<ApiTable name="FAuthLayout" />
