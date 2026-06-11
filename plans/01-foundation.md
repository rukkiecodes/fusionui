# Batch 01 — Monorepo Foundation & Tooling

**Depends on:** nothing · **Blocks:** everything

## Goal
Stand up the pnpm monorepo, TypeScript base config, linting/formatting, the
shared build conventions, and Git hygiene so all later batches have a consistent
home. No library code yet — just the skeleton that makes the rest reproducible.

## Deliverables
1. pnpm workspace with `packages/*` and `apps/*`.
2. Root `package.json` orchestration scripts.
3. `tsconfig.base.json` + per-package `tsconfig.json` extends.
4. ESLint (flat config) + Prettier + EditorConfig.
5. Changesets for versioning; Husky + lint-staged + commitlint (conventional commits).
6. `.gitignore`, `.nvmrc` (Node ≥ 20), `README.md`, `LICENSE` (MIT).
7. Empty-but-valid package stubs so `pnpm -r build` succeeds.

## File layout
```
package.json
pnpm-workspace.yaml
tsconfig.base.json
eslint.config.mjs
.prettierrc.json
.editorconfig
.nvmrc
.gitignore
.changeset/config.json
.husky/{pre-commit,commit-msg}
commitlint.config.cjs
packages/vue-dl/package.json
packages/icons-feather/package.json
packages/api-generator/package.json
packages/create-vue-dl/package.json
apps/docs/package.json
```

## Implementation notes

### pnpm workspace
```yaml
# pnpm-workspace.yaml
packages:
  - packages/*
  - apps/*
linkWorkspacePackages: deep
```
- Use `workspace:*` to wire `apps/docs` → `vue-dl`, `vue-dl` → `@vue-dl/icons-feather`.
  This is what lets the docs hot-reload the local library (see Batch 09).

### Root scripts
```jsonc
{
  "name": "vue-dl-monorepo",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "build": "pnpm -r --filter=./packages/* build",
    "dev:docs": "pnpm --filter @vue-dl/docs dev",
    "dev:lib": "pnpm --filter vue-dl dev",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "release": "changeset publish"
  }
}
```
> Note from Vuetify: their root `dev` script (`scripts/dev.js`) runs the lib
> build in watch mode **and** the docs concurrently. We replicate this in Batch 09
> with a `pnpm dev` that runs `dev:lib` + `dev:docs` via `concurrently`.

### tsconfig.base.json
- `"target": "ES2020"`, `"module": "ESNext"`, `"moduleResolution": "Bundler"`,
  `"jsx": "preserve"`, `"jsxImportSource": "vue"`, `"strict": true`,
  `"verbatimModuleSyntax": true`. Each package extends and sets its own
  `outDir`/`rootDir`.

### Linting
- ESLint flat config with `typescript-eslint` + `eslint-plugin-vue`. Keep it
  light initially; tighten in Batch 12.

### Versioning
- `@changesets/cli`. Configure `.changeset/config.json` with `"access": "public"`
  and the `@vue-dl/*` packages + `vue-dl` + `create-vue-dl` as publishable.

### Package stubs
Each package gets a minimal `package.json` with `name`, `version: 0.0.0`,
`"type": "module"`, `exports`, and a `build`/`typecheck` script that is a no-op
placeholder until its batch fills it in.

## Acceptance criteria
- `pnpm i` resolves with no errors.
- `pnpm -r build`, `pnpm lint`, `pnpm typecheck` all pass on the empty skeleton.
- A conventional commit is enforced by commitlint; lint-staged formats staged files.
- `npx changeset` runs and can record a version bump.

## Risks
- **Windows path/symlink quirks** (this repo is on Windows): prefer
  `nodeLinker: hoisted` (as Vuetify does) if symlink issues appear; ensure scripts
  use cross-platform tools (`rimraf`, not `rm -rf`).
