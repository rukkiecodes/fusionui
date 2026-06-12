# Vue DL — Master Build Plan (Overview)

> **Vue Design Library (Vue DL)** — a Vue 3 component framework with the
> engineering stability of **Vuetify** and the visual polish of **Vuesax**.
> Ships a component library, a Feather-based icon system, a live documentation
> site, and a project-scaffolding CLI (`npm create vue-dl`).

---

## 1. Product goals

1. **Stability like Vuetify** — Vue 3 + TypeScript, composable-driven
   architecture, CSS-variable theming, tree-shakeable build, typed props,
   automated API docs, monorepo discipline.
2. **Looks like Vuesax** — soft shadows, gentle elevations, lift-on-hover,
   ripples, gradient/relief/line button variants, animated inputs, the named
   color system (`primary/success/danger/warning/dark/light` + custom hex/rgb).
3. **Scaffold like Vuetify** — `npm create vue-dl@latest` (also pnpm / yarn /
   bun) creates a ready-to-run Vite + Vue 3 + Vue DL project.
4. **Docs built alongside the framework** — running the docs dev server
   hot-reloads the local library so every component is previewable while it is
   being built. Live examples + API tables + an interactive playground.
5. **Feather icons** — the 287 Feather SVGs ship as the default icon set, with a
   documented pipeline for authoring additional custom icons.

---

## 1b. Design language

The visual language follows **Vuesax v4** (vuesax-next) blended with **Apple**
cues (SF/Inter font, generous whitespace, subtle borders, soft large radii). The
authoritative token catalog lives in [`design-language.md`](./design-language.md)
and supersedes the original token values in `03-theme-design-tokens.md`. All
components and the docs site adhere to it.

## 2. Naming & conventions (used across all batches)

| Thing | Decision |
|---|---|
| Brand | Vue DL (Vue Design Library) |
| Core npm package | `vue-dl` |
| npm scope for sub-packages | `@vue-dl/*` |
| Component prefix | `Vd` → `VdBtn`, `VdCard`, `VdIcon` (kebab `<vd-btn>`) |
| Plugin factory | `createVueDL(options)` |
| Composable services | `useNotify()`, `useDialog()`, `useLoading()` |
| CSS variable prefix | `--vd-` (e.g. `--vd-theme-primary`, `--vd-shadow-key`) |
| SASS settings namespace | `vd-*` |
| Icon usage | `<vd-icon icon="bell" />` (Feather set is default) |
| Scaffolding CLI | `create-vue-dl` → `npm create vue-dl@latest` |
| Icon package | `@vue-dl/icons-feather` |
| API generator | `@vue-dl/api-generator` |
| Docs app | `apps/docs` |

---

## 3. Tech stack (chosen, with rationale)

- **Language:** TypeScript, components authored in **TSX** (Vuetify pattern —
  type-safe slots/props, render functions, no template compile step in the lib).
- **Styling:** **SASS (`.sass`/`.scss`)** co-located per component + a global
  CSS-variable theme layer using CSS `@layer`. We adopt Vuetify's structure but
  port **Vuesax's design tokens** (shadows, radii, transitions) into it.
  Rationale: SASS gives Vuetify-grade build tooling; we drop Stylus (Vuesax's
  Vue 2 choice) but keep its *visual values*.
- **Build:** **Vite (library mode) + Rollup** for `dist` bundles, **Babel/tsc**
  for the modular `lib/` output, plus per-component CSS extraction. Types via
  `vue-tsc`/`tsgo`.
- **Monorepo:** **pnpm workspaces** + **changesets** (simpler than lerna-lite
  for a new project) for versioning/release.
- **Docs:** **Vite + Vue 3 + vite-plugin-pages + unplugin-vue-markdown** with a
  markdown-it pipeline, live `<Example>` components, and an API-table system fed
  by the api-generator. (Vuetify's exact approach, modernized.)
- **CLI:** Node ESM, **prompts** + **giget/template-copy**, multi-PM support.
- **Testing:** **Vitest** (unit + component via @testing-library/vue / browser
  mode) and **Playwright** (docs/e2e + visual).

---

## 4. Repository layout (target)

```
vue-dl/                          # repo root (this folder)
├── package.json                 # workspace root scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .changeset/
├── packages/
│   ├── vue-dl/                  # the component library (core) — Batches 2–8
│   │   └── src/
│   │       ├── framework.ts     # createVueDL()
│   │       ├── components/      # VdBtn, VdCard, ...
│   │       ├── composables/     # theme, icons, defaults, display, variant...
│   │       ├── directives/      # v-ripple, v-click-outside...
│   │       ├── services/        # notify / dialog / loading
│   │       ├── styles/          # settings, tools, theme layer
│   │       └── util/            # propsFactory, defineComponent...
│   ├── icons-feather/           # @vue-dl/icons-feather — Batch 4
│   ├── api-generator/           # @vue-dl/api-generator — Batch 10
│   └── create-vue-dl/           # scaffolding CLI — Batch 11
├── apps/
│   ├── docs/                    # documentation website — Batch 9
│   └── playground/              # internal dev sandbox (optional)
├── templates/                   # starter templates consumed by the CLI
│   ├── default/
│   └── typescript/
└── plans/                       # these plan documents
```

---

## 5. Batch breakdown & dependency order

| Batch | Title | Depends on | Parallelizable with |
|---|---|---|---|
| 01 | Monorepo foundation & tooling | — | — |
| 02 | Core framework runtime & component utilities | 01 | 03, 04 |
| 03 | Theme system & design tokens (Vuesax DNA) | 01 | 02, 04 |
| 04 | Icon system + Feather icon package | 01, 02 | 03 |
| 05 | Components A — foundation (Btn, Card, Icon, Avatar, Chip, Alert, Progress, Divider) | 02, 03, 04 | 06, 07 |
| 06 | Components B — forms (Input, Select, Checkbox, Radio, Switch, Slider, Textarea, Upload) | 02, 03, 04 | 05, 07 |
| 07 | Components C — nav/layout/data (Navbar, Sidebar, Tabs, Table, Pagination, List, Breadcrumb, Dropdown, Collapse, Popup, Tooltip) | 02, 03, 04 | 05, 06 |
| 08 | Programmatic services (notify, dialog, loading) | 02, 03, 05 | 09 |
| 09 | Documentation website + live preview | 02, 05 (any components) | 08, 10 |
| 10 | API generator | 02, 05 | 09 |
| 11 | Scaffolding CLI (`create-vue-dl`) | 01, 02 | 09 |
| 12 | Testing, CI/CD, release & publishing | all | — |

**Critical path:** 01 → 02/03/04 → 05/06/07 → 09. Docs (09) can start as soon as
Batch 05 produces the first component, satisfying the "preview while building"
requirement.

---

## 6. Definition of done (project-level)

- `pnpm i && pnpm build` builds every package clean.
- `pnpm dev:docs` serves docs with HMR against the local library.
- `npm create vue-dl@latest my-app` produces a running app.
- ≥ 30 components ported with Vuesax styling and full theme support.
- Feather set + custom-icon pipeline documented and working.
- Each component: typed props, API table auto-generated, ≥1 live example, unit test.
- CI runs lint + typecheck + test + build on every PR; changesets drive releases.

---

## 7. How to use these plans

Each `NN-*.md` file is a self-contained batch with: **Goal**, **Deliverables**,
**File layout**, **Implementation notes** (with concrete patterns ported from the
analyzed Vuetify/Vuesax source), **Acceptance criteria**, and **Risks**. Execute
in the dependency order above; batches marked parallelizable can be split across
contributors.

See `01-foundation.md` to begin.
