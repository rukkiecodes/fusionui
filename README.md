# FusionUI

A non-generic, performance-obsessed design system for the Vue ecosystem —
**soft, modern and deliberately not Material**, built on a single source of
design truth and a signature GPU-accelerated visual layer, with the same design
language on the web and on mobile.

> 🚧 **Status:** active development. Docs deploy from `main` to
> [rukkiecodes.github.io/fusionui](https://rukkiecodes.github.io/fusionui/).

## Monorepo layout

```
packages/
  vue/               # @rukkiecodes/vue — the Vue 3 component library
  icons/             # @rukkiecodes/icons — the 2,270-icon set
  api-generator/     # @rukkiecodes/api-generator — generates component API docs
  create-fusionui/   # `npm create fusionui` scaffolding CLI
apps/
  docs/              # documentation website (live component preview)
```

## Prerequisites

- Node `>=20` (see [`.nvmrc`](./.nvmrc))
- [pnpm](https://pnpm.io) `>=10`

## Getting started

```bash
pnpm install          # install all workspace dependencies
pnpm build            # build every publishable package
pnpm dev              # run the library in watch mode + docs site together
pnpm lint             # lint the workspace
pnpm typecheck        # type-check every package
pnpm test             # run all package tests
```

## Contributing

Contributions are welcome — bug reports as much as pull requests. `main` is a
protected branch: nobody pushes to it directly, and every change lands through a
pull request that a maintainer reviews and merges.

### The workflow

1. **Fork** the repository (collaborators can branch from `main` instead).
2. **Create a branch** with a descriptive name — `feat/date-range-picker`,
   `fix/menu-focus-trap`.
3. **Make your change.** The full [contributing guide][guide] covers the monorepo
   layout, how to add a component, and the definition of done (token-driven,
   accessible, SSR-safe — these are gated, not aspirational).
4. **Run the gate locally** before pushing:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm size
   ```
5. **Commit** with [Conventional Commits][cc] and a lowercase subject (commitlint
   enforces it). Record any user-facing change with `pnpm changeset`.
6. **Open a pull request** against `main`. CI runs lint, typecheck, tests, the
   build, the bundle-size budgets and the docs build — on Linux and Windows,
   across Node 20 and 22. All four must pass, and review conversations must be
   resolved, before the PR can be merged.
7. A maintainer reviews and merges. Publishing to npm happens from `main` and is
   done by maintainers — contributors never need to publish anything.

New here? Start with an issue labelled **good first issue**, and see the full
[contributing guide][guide] for everything else.

[guide]: https://rukkiecodes.github.io/fusionui/about/contributing
[cc]: https://www.conventionalcommits.org

## License

[MIT](./LICENSE)
