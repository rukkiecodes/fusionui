# @rukkiecodes/icons

The default icon set for **FusionUI** — **2,270 tree-shakeable icon components**
plus an opt-in string-name set and the semantic aliases used by FusionUI
components.

Icons whose names exist in [Lucide](https://lucide.dev) are Lucide's drawings
(ISC-licensed; many derived in turn from [Feather](https://feathericons.com),
MIT); the rest are original FusionUI icons. All share one visual language —
24×24, 2px stroke, round caps, `currentColor`. See [`NOTICE`](./NOTICE) for the
upstream licences.

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
pulls all 2,270 icons, so prefer the tree-shakeable form for app bundles:

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
