# Batch 10 — API Generator

**Depends on:** 02, 05 · **Parallel with:** 09

## Goal
Automatically produce machine-readable API metadata (props, events, slots,
exposed methods, SASS variables) for every component, so the docs (B09) render
accurate, always-in-sync API tables. Port of Vuetify's `packages/api-generator`.

## Deliverables
1. `@vue-dl/api-generator` package that introspects component types → JSON.
2. Per-component `dist/api/VdBtn.json` etc. with `{ props, events, slots, exposed,
   sass }`.
3. A manifest (`importMap.json`-style) of all components + their source package.
4. Integration: docs `build/api-plugin.ts` virtual module serves the JSON to
   `<ApiTable>`.
5. Optional human-authored descriptions overlay (so prop docs can add prose).

## File layout
```
packages/api-generator/
├── src/
│   ├── index.ts        # orchestrator (worker pool)
│   ├── worker.ts       # per-component introspection
│   ├── types.ts        # ts-morph type → JSON schema
│   └── descriptions/   # optional markdown/json descriptions per component
├── templates/          # temp .d.ts staging
└── dist/api/*.json
```

## Implementation notes

### Approach (port Vuetify)
1. Build `vue-dl` first so `.d.ts` types exist.
2. Generate a component manifest during the library build: an AST/registry walk
   emits `importMap.json` listing every exported `Vd*` component (Vuetify emits
   this in its rollup `buildEnd`). Reuse that.
3. For each component, use **ts-morph** to read the generated `.d.ts`:
   - Props interface → `{ name, type, default, required, description }`.
   - Emits interface → events + payload types.
   - Slots type → slot names + slot-prop types.
   - Exposed (template-ref) type → public methods/props.
4. Parse `_variables.scss` files for SASS tokens → `sass` section.
5. Parallelize with a worker pool (**piscina**) — fast across 30+ components.
6. Merge in optional `descriptions/<Component>.json` prose.
7. Emit one JSON per component + an index.

### Descriptions overlay
- Keep generated *shapes* separate from authored *prose*. A `descriptions/`
  folder maps `VdBtn.variant` → markdown; the generator merges them. Lets writers
  enrich docs without touching component source.

### Docs integration (with B09)
- `apps/docs/build/api-plugin.ts` exposes `virtual:api/VdBtn` → the JSON.
- `<ApiTable name="VdBtn" section="props" />` renders sortable, searchable tables
  with type, default, description; deep-link anchors per row.

### Scripts
- `pnpm --filter @vue-dl/api-generator build` regenerates all JSON.
- Wire into root build so docs always ship current API data; add a CI check that
  fails if generated JSON is stale vs. committed (optional).

## Acceptance criteria
- Running the generator produces valid JSON for every `Vd*` component.
- A new prop added to a component appears in its API table after regen, no manual edits.
- Slots/events/exposed methods are captured with types.
- SASS variables from `_variables.scss` surface in the table.

## Risks
- ts-morph type resolution for complex generic props can be noisy; normalize
  common types (e.g. `IconValue`, `Color`) via a type-alias map (Vuetify does this).
- Keep generation deterministic for clean diffs and reliable CI staleness checks.
