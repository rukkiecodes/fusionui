# @vue-dl/icons-feather

The default [Feather](https://feathericons.com)-style icon set for **Vue DL** —
737 tree-shakeable icon components (the original Feather set plus 450 extended
icons) plus an opt-in string-name set and the semantic aliases used by Vue DL
components.

## Usage

### Tree-shakeable (recommended)

Import only the icons you use:

```vue
<script setup>
import { Bell, Search } from '@vue-dl/icons-feather'
</script>

<template>
  <vd-icon :icon="Bell" />
  <vd-icon :icon="Search" color="primary" size="large" />
</template>
```

### By string name (convenience, opt-in)

Register the full set to use string names like `<vd-icon icon="bell" />`. This
pulls all 737 icons, so prefer the tree-shakeable form for app bundles:

```ts
import { createVueDL } from 'vue-dl'
import { featherSet, featherAliases } from '@vue-dl/icons-feather'

createVueDL({
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})
```

### Semantic aliases

`featherAliases` (e.g. `$close`, `$success`, `$prev`, `$dropdown`) ship as Vue
DL's default aliases, so component internals work out of the box. Use them with
the `$` prefix: `<vd-icon icon="$success" />`.

## Adding custom icons

Drop a 24×24 stroke SVG (matching Feather conventions: `stroke="currentColor"`,
`fill="none"`, 2px stroke, round caps/joins) and regenerate:

```bash
pnpm --filter @vue-dl/icons-feather add-icon my-logo ./my-logo.svg
```

Then import it as the PascalCase export: `import { MyLogo } from '@vue-dl/icons-feather'`.

## Regenerating

Icon modules under `src/icons/` are generated from `svg/` and should not be
edited by hand:

```bash
pnpm --filter @vue-dl/icons-feather generate
```
