# Contributing to FusionUI

Thanks for helping — bug reports are as valuable as pull requests for a pre-1.0
library that needs mileage against real applications.

`main` is protected: every change lands through a pull request that a maintainer
reviews and merges. Nobody pushes to `main` directly.

## Quick start

```bash
git clone https://github.com/<you>/fusionui.git   # your fork
cd fusionui
pnpm install
pnpm dev            # runs the docs site, where the library is dogfooded
```

Node `>=20` and pnpm `>=10` are required (there is an `.nvmrc`).

## Opening a pull request

1. Branch from `main` with a descriptive name (`feat/…`, `fix/…`).
2. Make your change. A component is not done until it is token-driven (no
   hard-coded hex/px), accessible (keyboard, screen reader, `prefers-reduced-motion`),
   SSR-safe, and documented with a live example. The full
   [definition of done][guide] spells this out.
3. Run the gate locally:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm size
   ```
4. Commit with [Conventional Commits](https://www.conventionalcommits.org) and a
   lowercase subject (commitlint enforces it). Record user-facing changes with
   `pnpm changeset`.
5. Push and open a PR against `main`. CI must pass on Linux and Windows across
   Node 20 and 22, and review conversations must be resolved, before it can merge.

A maintainer merges approved PRs and publishes releases from `main` — you never
need to publish anything.

The complete guide (monorepo layout, commands, how to add a component, releases)
lives at **[rukkiecodes.github.io/fusionui/about/contributing][guide]**.

[guide]: https://rukkiecodes.github.io/fusionui/about/contributing
