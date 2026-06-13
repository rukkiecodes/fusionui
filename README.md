# FusionUI

A non-generic, performance-obsessed design system for the Vue ecosystem —
the engineering **stability of [Vuetify](https://vuetifyjs.com)** with the
visual **polish of [Vuesax](https://vuesax.com)**, unified by a single source
of design truth and a signature GPU-accelerated visual layer.

> 🚧 **Status:** active development. Docs deploy from `main` to
> [rukkiecodes.github.io/fusionui](https://rukkiecodes.github.io/fusionui/).

## Monorepo layout

```
packages/
  vue/               # @fusionui/vue — the Vue 3 component library
  icons/             # @fusionui/icons — default Feather icon set
  api-generator/     # @fusionui/api-generator — generates component API docs
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

Commits follow [Conventional Commits](https://www.conventionalcommits.org)
(enforced by commitlint). Record user-facing changes with `pnpm changeset`.

## License

[MIT](./LICENSE)
