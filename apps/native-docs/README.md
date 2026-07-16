# @rukkiecodes/native-docs

The **mobile** documentation website — a standalone Vite + Vue SPA that documents
`@rukkiecodes/native` (Expo + React Native). It is deliberately separate from the
Vue web docs (`@rukkiecodes/docs`): its own nav, landing and build, deployed to its
own site at **https://rukkiecodes.github.io/fusionui-mobile/**.

## Develop

```bash
pnpm --filter @rukkiecodes/native-docs dev   # regenerates snacks, then serves
```

`predev` / `prebuild` run `scripts/gen-snacks.mjs` first, so the generated snacks
and manifest always exist before Vite starts.

## How a component page is made

Everything is data-driven from one registry — there are no per-component page files.

```
snacks/
  kit.js            # shared token layer + demo chrome (Screen/Panel/Row…), inlined into every snack
  registry.mjs      # THE source of truth: each component's category, prose, API table, variants
  parts/<C>.js      # a pure-RN mirror of @rukkiecodes/native's <C> (no imports; uses the kit)
  demos/<slug>.<id>.js  # a tiny `export default App` per variant, using the kit + mirror
  gen/              # generated self-contained snacks (git-ignored)
  manifest.json     # generated; drives the nav + the dynamic page (git-ignored)
scripts/gen-snacks.mjs  # composes [imports] + kit + part + demo → gen/*.js and manifest.json
src/pages/components/[slug].vue  # ONE dynamic page renders every component from the manifest
```

To **add a component**: write `parts/<C>.js` (its mirror), a `demos/<slug>.<id>.js`
per variant, and a registry entry listing those variants. The sidebar, the page and
the Snacks all follow — nothing else to touch. Each **variant gets its own Snack**.

Why mirrors and not a real import? Expo Snack can't bundle the source-shipped
`@rukkiecodes/native`, so each snack is a self-contained pure-RN mirror that inlines
the `@rukkiecodes/tokens` values — every number still traces to one token source.

## Deploy

Built by `.github/workflows/deploy-native-docs.yml` and published to the **separate**
`rukkiecodes/fusionui-mobile` repository's Pages. One-time owner setup:

1. Create an empty public repo `rukkiecodes/fusionui-mobile`.
2. Create a token that can write to it (fine-grained PAT scoped to that repo,
   Contents: read/write — or a classic PAT with `repo`).
3. Add it to the **fusionui** repo as an Actions secret `MOBILE_PAGES_TOKEN`.
4. After the first run, set fusionui-mobile → Settings → Pages → Source:
   Deploy from a branch → `gh-pages` / root.

The build uses `DOCS_BASE=/fusionui-mobile/` for correct asset paths under that
Pages sub-path.
