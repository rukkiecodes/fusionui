# Batch 09 — Documentation Website + Live Preview

**Depends on:** 02 + at least one component batch (05) · **Parallel with:** 08, 10

> This batch directly satisfies the requirement: *"the design library and the
> documentation website built at the same time … I should be able to preview it
> in the documentation while the framework is built."* Because `apps/docs` depends
> on `vue-dl` via `workspace:*`, running the docs dev server hot-reloads the local
> library — every component is previewable the moment it exists.

## Goal
Build the documentation site (Vite + Vue 3 + markdown) with file-based routing,
live component examples with source toggles, an interactive playground, and
API-tables fed by the api-generator (B10). Modeled on Vuetify's `packages/docs`.

## Deliverables
1. `apps/docs` Vite app with `vite-plugin-pages` routing and
   `unplugin-vue-markdown` (`.md` → Vue).
2. markdown-it pipeline (syntax highlight, anchors, custom `:::` containers, tabs).
3. `<Example>` component: renders a live `.vue` example + tabbed source + copy +
   "open in playground" + theme/density toggles.
4. Examples loader (virtual module that imports `src/examples/**/*.vue` raw + compiled).
5. `<ApiTable>` components consuming generated JSON (B10).
6. Playground page (live editor → live preview) using the local library.
7. App shell: navbar, sidebar nav (auto from pages), theme switch, search.
8. Root `pnpm dev` runs lib-watch + docs concurrently.

## File layout
```
apps/docs/
├── vite.config.ts
├── build/{examples-plugin.ts, api-plugin.ts, markdown.ts}
├── src/
│   ├── pages/                      # file-routed .md/.vue
│   │   ├── index.md
│   │   ├── getting-started/{installation.md, usage.md}
│   │   ├── components/{button.md, card.md, ...}
│   │   ├── styles/{colors.md, theme.md, icons.md}
│   │   └── api/[name].md           # dynamic API page
│   ├── examples/                   # live .vue examples (filled by B05–B08)
│   │   └── button/{variants.vue, loading.vue, ...}
│   ├── components/
│   │   ├── Example.vue
│   │   ├── Markup.vue              # code block w/ highlight + copy
│   │   ├── Playground.vue
│   │   └── api/ApiTable.vue
│   ├── layouts/{default.vue}
│   └── plugins/vue-dl.ts           # app.use(createVueDL())
```

## Implementation notes

### Tooling (port Vuetify docs stack, modernized)
- `vite-plugin-pages` (file routing), `vite-plugin-vue-layouts`,
  `unplugin-vue-markdown`, `unplugin-vue-components` + `unplugin-auto-import`.
- `markdown-it` plugins: prism/shiki highlight, anchor, attrs, container (for
  `::: info|tip|warning|error` → `VdAlert`), and a tabs container.

### Live examples (the core feature)
- An example is a plain `.vue` in `src/examples/<component>/<name>.vue`.
- `build/examples-plugin.ts` exposes a virtual module mapping example id →
  `{ component: () => import(...), source: '<raw source string>' }` (import the
  file both compiled and via `?raw`).
- `<Example file="button/variants" />` in markdown renders the live component in a
  framed surface + a collapsible `<Markup>` source view with copy + an "Edit in
  Playground" link that seeds the playground with the source.
- Add theme + density toggles around the example frame so reviewers can see
  light/dark and Vuesax states instantly.

### Markdown component pages
Each `components/<x>.md` page = intro + usage `<Example>`s + props/events/slots
`<ApiTable name="VdBtn" />`. Frontmatter provides nav title/description/keywords
(Vuetify pattern) for the sidebar + meta tags.

### Playground
- Monaco or CodeMirror editor + live compile of a single SFC against the local
  `vue-dl`. Start minimal (template-only eval) and grow. Persist to URL hash for
  shareable reproductions.

### HMR against local library (the "build & preview together" guarantee)
- `vue-dl: "workspace:*"` dependency + Vite `optimizeDeps.exclude: ['vue-dl']` in
  dev so edits to `packages/vue-dl/src` reflect live.
- Root script: `"dev": "concurrently \"pnpm dev:lib\" \"pnpm dev:docs\""` where
  `dev:lib` runs the library in watch/no-emit and `dev:docs` runs Vite. (Mirrors
  Vuetify's `scripts/dev.js`.)

## Acceptance criteria
- `pnpm dev` → editing a component's TSX/SASS updates the docs preview without
  manual rebuild.
- A component page shows live examples, toggleable source, and API tables.
- Sidebar nav auto-builds from pages; theme switch toggles light/dark globally.
- Playground compiles and renders a user-edited snippet.
- `pnpm --filter @vue-dl/docs build` produces a deployable static site.

## Risks
- Playground SFC compilation in-browser is non-trivial; ship a basic version
  first (examples + source toggle) and iterate on the editor.
- Keep example components free of cross-imports so the virtual loader stays simple.
