# @rukkiecodes/icons

The default [Feather](https://feathericons.com)-style icon set for **FusionUI** —
737 tree-shakeable icon components (the original Feather set plus 450 extended
icons) plus an opt-in string-name set and the semantic aliases used by FusionUI
components.

## Usage

### Tree-shakeable (recommended)

Import only the icons you use:

```vue
<script setup>
import { Bell, Search } from '@rukkiecodes/icons'
</script>

<template>
  <f-icon :icon="Bell" />
  <f-icon :icon="Search" color="primary" size="large" />
</template>
```

### By string name (convenience, opt-in)

Register the full set to use string names like `<f-icon icon="bell" />`. This
pulls all 737 icons, so prefer the tree-shakeable form for app bundles:

```ts
import { createFusionUI } from '@rukkiecodes/vue'
import { featherSet, featherAliases } from '@rukkiecodes/icons'

createFusionUI({
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
the `$` prefix: `<f-icon icon="$success" />`.

## Adding custom icons

Drop a 24×24 stroke SVG (matching Feather conventions: `stroke="currentColor"`,
`fill="none"`, 2px stroke, round caps/joins) and regenerate:

```bash
pnpm --filter @rukkiecodes/icons add-icon my-logo ./my-logo.svg
```

Then import it as the PascalCase export: `import { MyLogo } from '@rukkiecodes/icons'`.

## Regenerating

Icon modules under `src/icons/` are generated from `svg/` and should not be
edited by hand:

```bash
pnpm --filter @rukkiecodes/icons generate
```
