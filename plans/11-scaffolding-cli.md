# Batch 11 — Scaffolding CLI (`create-vue-dl`)

**Depends on:** 01, 02 (a publishable `vue-dl`) · **Parallel with:** 09

> Satisfies: *"using vuetify, developers can directly create a new vue project
> with the design library all set up … I need Vue DL to be able to create vue
> projects the same way."* Goal: `npm create vue-dl@latest` (and pnpm/yarn/bun
> equivalents) scaffolds a runnable Vite + Vue 3 + Vue DL app.

## Goal
Build the `create-vue-dl` package (the `npm create vue-dl` entry) plus the starter
templates it copies. Mirror Vuetify's `create-vuetify` UX: prompt, copy template,
install deps, print next steps.

## Deliverables
1. `packages/create-vue-dl` — a bin package with an interactive prompt flow.
2. `templates/` starters: `default` (JS) and `typescript`, each a complete
   Vite + Vue 3 app preconfigured with Vue DL + Feather icons.
3. Multi-PM support: detect and use npm / pnpm / yarn / bun; respect the invoking
   `create` command.
4. Post-scaffold: optional `git init`, dependency install, success message with
   run instructions.

## File layout
```
packages/create-vue-dl/
├── package.json            # "bin": { "create-vue-dl": "./index.mjs" }, type module
├── index.mjs               # CLI entry (prompts + orchestration)
├── src/{prompts.ts, copy.ts, pm.ts, render.ts}
templates/
├── default/                # JS Vite+Vue3+VueDL app
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/{main.js, App.vue, plugins/vue-dl.js}
└── typescript/             # TS variant
```

## Implementation notes

### Entry & naming
- `package.json` name `create-vue-dl`, `bin` `create-vue-dl`. npm maps
  `npm create vue-dl` → `create-vue-dl`. Publish so `@latest` resolves.
- ESM CLI. Use lightweight deps: `prompts` (or `@clack/prompts` for nicer UX),
  `kolorist`/`picocolors`, `minimist`.

### Prompt flow (mirror create-vuetify)
1. Project name / target dir (validate, handle existing dir: overwrite/merge/cancel).
2. TypeScript? → picks `typescript` vs `default` template.
3. Add Vue Router? Pinia? ESLint? (toggle template fragments).
4. Package manager (auto-detect from `npm_config_user_agent`; allow override).
5. Install dependencies now? (y/N).

### Template rendering
- Copy chosen template dir to target. Use a `render`/`giget`-style copy with
  filename transforms (`_gitignore` → `.gitignore`). Replace tokens
  (`{{projectName}}`) in `package.json`/`index.html`.
- Conditionally include router/pinia/eslint fragments based on answers
  (Vuetify uses a preset/feature-merge approach — start simpler with whole-file
  fragments, refine later).

### Template contents (`plugins/vue-dl.(js|ts)`)
```js
import { createVueDL } from 'vue-dl'
import 'vue-dl/styles'
export default createVueDL({
  theme: { defaultTheme: 'light' },
  // icons default to @vue-dl/icons-feather
})
```
`main.(js|ts)` does `app.use(vueDL)`; `App.vue` shows a few VdBtn/VdCard/VdInput so
the new project visibly works out of the box.

### Package manager handling
- `pm.ts`: detect from `process.env.npm_config_user_agent`; map to install command
  (`pnpm install` / `npm install` / `yarn` / `bun install`) and run with the
  template's pinned `vue-dl` version.

### Post-scaffold output
Print: `cd <dir>`, install (if skipped), `<pm> run dev`, and a docs link.

## Acceptance criteria
- `npm create vue-dl@latest my-app` (and pnpm/yarn/bun) creates `my-app` that runs
  with `dev` and renders Vue DL components with Feather icons.
- TS and JS templates both build and lint clean.
- Re-running into an existing dir is handled safely (prompt to overwrite/merge).
- Selecting router/pinia/eslint wires them correctly.

## Risks
- Keeping template `vue-dl` versions in sync at release — automate via the release
  pipeline (B12) to bump template deps to the just-published version.
- Cross-platform (Windows) path handling in copy logic — use `node:path` and test
  on Windows.
