# @fusionui/api-generator

Generates the component API reference consumed by the docs `<ApiTable>`.

Rather than parsing `.d.ts` files, it loads the **library source** through Vite
SSR and introspects each component's runtime `make*Props` factory (composable
spreads already merged) plus its `emits`. Output goes to
`apps/docs/src/api/<Component>.json`.

```bash
pnpm --filter @fusionui/api-generator generate
```

## Description overlays

Generated JSON carries shapes (types/defaults). Add hand-authored prose in
`descriptions/<Component>.json` and it's merged on regeneration:

```json
{
  "props": { "variant": "Visual style — elevated, flat, …" },
  "events": { "click": "Emitted on click." }
}
```
