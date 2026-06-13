# Icons

FusionUI uses [Feather](https://feathericons.com)-style icons by default — 737
clean, stroke-based icons (the original Feather set plus 450 extended icons).

## Usage

```vue
<!-- tree-shakeable: import the icon you need -->
<script setup>
import { Bell } from '@fusionui/icons'
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

## Custom icons

Add your own Feather-style SVG (24×24, `stroke="currentColor"`, 2px stroke):

```bash
pnpm --filter @fusionui/icons add-icon my-logo ./my-logo.svg
```
