# Icons

FusionUI ships **2,270** clean, stroke-based icons — one visual language (24×24,
2px stroke, round caps, `currentColor`) that renders through `<f-icon>` and
tree-shakes down to just the icons you actually use.

## Browse the icons

Search by name **or meaning** — typing `bin` or `delete` finds `trash` — and
page through the full set. Click any icon to copy its `<f-icon>` snippet.

<IconGallery />

## Usage

```vue
<!-- tree-shakeable: import the icon you need -->
<script setup>
import { Bell } from '@rukkiecodes/icons'
</script>

<template>
  <f-icon :icon="Bell" />
</template>
```

Or, with the full set registered (see Installation), by name:

```vue
<f-icon icon="bell" />
<f-icon icon="search" color="primary" size="large" />
```

## Semantic aliases

Components reference icons through `$` aliases, which you can use too:

```vue
<f-icon icon="$success" color="success" />
<f-icon icon="$warning" />
<f-icon icon="$close" />
```

## Add your own

Drop a stroke-based SVG (24×24, `stroke="currentColor"`, 2px stroke) into the set:

```bash
pnpm --filter @rukkiecodes/icons add-icon my-logo ./my-logo.svg
```

It's then available everywhere by name — `<f-icon icon="my-logo" />` — and as a
tree-shakeable `MyLogo` export.
