# Icons

Vue DL uses [Feather](https://feathericons.com)-style icons by default — 737
clean, stroke-based icons (the original Feather set plus 450 extended icons).

## Usage

```vue
<!-- tree-shakeable: import the icon you need -->
<script setup>
import { Bell } from '@vue-dl/icons-feather'
</script>

<template>
  <vd-icon :icon="Bell" />
</template>
```

Or, with the full set registered (see Installation), by name:

```vue
<vd-icon icon="bell" />
<vd-icon icon="search" color="primary" size="large" />
```

## Semantic aliases

Components reference icons through `$` aliases, which you can use too:

```vue
<vd-icon icon="$success" color="success" />
<vd-icon icon="$warning" />
<vd-icon icon="$close" />
```

## Custom icons

Add your own Feather-style SVG (24×24, `stroke="currentColor"`, 2px stroke):

```bash
pnpm --filter @vue-dl/icons-feather add-icon my-logo ./my-logo.svg
```
