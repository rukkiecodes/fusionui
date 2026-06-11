# Batch 12 — Testing, CI/CD, Release & Publishing

**Depends on:** all prior batches · **Blocks:** nothing (cross-cutting; start early, finish last)

## Goal
Make Vue DL trustworthy and shippable: a layered test strategy, the library build
pipeline producing tree-shakeable ESM/CJS + types + per-component CSS, CI on every
PR, and a changesets-driven publish for `vue-dl`, `@vue-dl/*`, and `create-vue-dl`.

## Deliverables
1. **Build pipeline** for `packages/vue-dl`: `lib/` (modular, per-component CSS) +
   `dist/` (UMD/ESM bundles + full CSS) + `.d.ts` types + `exports` map.
2. **Test suites:** unit (Vitest), component (browser mode / testing-library),
   visual regression (Playwright), and docs e2e smoke.
3. **CI** (GitHub Actions): install → lint → typecheck → test → build → (docs build).
4. **Release:** changesets versioning + `npm publish` (public) with provenance;
   docs deploy; CLI template version sync.
5. **Quality gates:** bundle-size check, a11y checks on key components.

## Implementation notes

### Library build (port Vuetify's dual output)
- **`lib/`** — Babel/tsc transpile `src` keeping module structure; extract each
  component's SASS to `lib/components/VdBtn/VdBtn.css`; emit `_variables.sass` for
  consumer customization; emit `importMap.json` (also feeds B10).
- **`dist/`** — Rollup bundles: `vue-dl.esm.js`, `vue-dl.cjs`, `vue-dl.min.js`,
  `vue-dl.css` (+ min). Externalize `vue`.
- **Types** — `vue-tsc`/`tsgo --emitDeclarationOnly`; post-process to fix paths.
- **`package.json#exports`:**
  ```jsonc
  {
    ".":            { "types": "./lib/index.d.ts", "import": "./lib/index.js" },
    "./styles":     { "sass": "./lib/styles/main.sass", "default": "./lib/styles/main.css" },
    "./components/*": "./lib/components/*/index.js"
  }
  ```
  Ship `sideEffects` config so CSS isn't tree-shaken away but JS is shakeable.

### Testing layers
- **Unit** (Vitest, jsdom): composables (theme color resolution, icon alias,
  validation rules), utils (color parse/contrast).
- **Component** (Vitest browser mode + `@testing-library/vue`): render each `Vd*`,
  assert props→classes, v-model, events, a11y roles, ripple/overlay behavior.
- **Visual regression** (Playwright): screenshot key components in light/dark ×
  variants; diff against baselines so the Vuesax look can't silently regress.
- **Docs e2e** (Playwright): build docs, smoke-navigate, ensure examples render
  and the playground compiles.
- Coverage target ≥ 80% on composables/utils; every component has ≥1 render test.

### CI (GitHub Actions)
- `pr.yml`: matrix Node 20/22 on ubuntu + windows (this project is Windows-first);
  steps: `pnpm i --frozen-lockfile` → `lint` → `typecheck` → `test` → `build` →
  `--filter @vue-dl/docs build`. Cache pnpm store.
- Upload Playwright diffs as artifacts on failure.

### Release (changesets)
- Contributors add a changeset per change. `release.yml` on merge to `main`:
  version packages, build, `changeset publish` with `--provenance`, push tags.
- **CLI template sync:** a release step rewrites `templates/*/package.json` to the
  newly published `vue-dl` version, then publishes `create-vue-dl` (prevents the
  scaffold from pinning a stale library — the B11 risk).
- **Docs deploy:** build `apps/docs` and deploy (Netlify/Vercel/GH Pages) on release.

### Quality gates
- `size-limit` budget on `dist/vue-dl.esm.js`.
- `axe`/playwright-a11y on Button, Input, Select, Dialog, Tabs.

## Acceptance criteria
- `pnpm build` yields working `lib/` + `dist/` + types; a consumer can
  `import { VdBtn } from 'vue-dl'` and tree-shake unused components.
- CI is green on lint/typecheck/test/build for PRs on Linux + Windows.
- `changeset publish` releases all public packages; `create-vue-dl` scaffolds with
  the matching `vue-dl` version.
- Visual baselines catch an intentional shadow/color change (proven once).

## Risks
- Visual-regression flakiness across OS font rendering — pin the Playwright
  browser and run snapshots in a container/single OS for the baseline.
- Dual ESM/CJS + types `exports` correctness is fiddly — validate with
  `@arethetypeswrong/cli` and `publint` in CI.
```
```

---

## Appendix — suggested execution timeline (relative)

| Phase | Batches | Outcome |
|---|---|---|
| 1 | 01 | Repo skeleton builds |
| 2 | 02 + 03 + 04 (parallel) | Runtime, theme, icons ready; one probe renders |
| 3 | 05 (then 06, 07 parallel) | Component library grows; docs (09) can start previewing after 05 |
| 4 | 09 + 10 (parallel) + 08 | Docs with live preview + API tables + services |
| 5 | 11 | `npm create vue-dl` works |
| 6 | 12 | Tests, CI, first publish |

Batch 12 is cross-cutting: stand up minimal CI + Vitest right after Batch 02 and
expand it as components land, rather than leaving all testing to the end.
