# Vue DL — Vue Design Library

A Vue 3 component framework with the engineering **stability of [Vuetify](https://vuetifyjs.com)**
and the visual **polish of [Vuesax](https://vuesax.com)** — powered by Feather icons.

> 🚧 **Status:** early development. Foundation scaffolding is in place (Batch 01).
> See [`plans/`](./plans) for the full build roadmap.

## Monorepo layout

```
packages/
  vue-dl/            # the component library (core)
  icons-feather/     # @vue-dl/icons-feather — default Feather icon set
  api-generator/     # @vue-dl/api-generator — generates component API docs
  create-vue-dl/     # `npm create vue-dl` scaffolding CLI
apps/
  docs/              # documentation website (live component preview)
templates/           # starter templates used by the CLI
plans/               # batched build plans
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

Commits follow [Conventional Commits](https://www.conventionalcommits.org)
(enforced by commitlint). Record user-facing changes with `pnpm changeset`.

## License

[MIT](./LICENSE)
