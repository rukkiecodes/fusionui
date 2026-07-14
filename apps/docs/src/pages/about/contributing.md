# Contributing

FusionUI is developed in the open at
[github.com/rukkiecodes/fusionui](https://github.com/rukkiecodes/fusionui). Bug
reports are as valuable as pull requests — a pre-1.0 library's real problem is
that it has not been run against enough real applications yet.

## The repository

It is a pnpm-workspaces monorepo. There is no build orchestrator beyond pnpm
itself: the root scripts fan out to the packages with `pnpm -r`.

```
packages/
  vue/               # @rukkiecodes/vue — the Vue 3 component library
  tokens/            # @rukkiecodes/tokens — the single source of design truth
  native/            # @rukkiecodes/native — Expo + React Native
  icons/             # @rukkiecodes/icons — the Feather-style icon set
  api-generator/     # generates the API tables in these docs
  create-fusionui/   # the `npm create fusionui` scaffolder
apps/
  docs/              # this site
```

## Setup

You need Node `>=20` (there is an `.nvmrc`) and pnpm `>=10`.

```bash
git clone https://github.com/rukkiecodes/fusionui.git
cd fusionui
pnpm install
pnpm dev            # runs the docs site
```

`pnpm dev` starts the documentation app, which is where the library is
dogfooded — the navbar and sidebar you are looking at are FusionUI components.
Editing a component in `packages/vue/src` updates the page you are viewing.

## The commands

| Command                             | What it does                                                     |
| ----------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                          | Run the docs site                                                |
| `pnpm build`                        | Build every publishable package                                  |
| `pnpm test`                         | Run every package's tests (Vitest)                               |
| `pnpm lint` / `pnpm lint:fix`       | ESLint across the workspace                                      |
| `pnpm typecheck`                    | Type-check every package                                         |
| `pnpm format` / `pnpm format:check` | Prettier                                                         |
| `pnpm size`                         | Check the gzipped bundle budgets — run it **after** `pnpm build` |
| `pnpm a11y`                         | Run axe-core over the docs in light and dark                     |
| `pnpm changeset`                    | Record a user-facing change for the next release                 |

`pnpm size` compares each shipped bundle against a gzip ceiling and fails if one
is exceeded — the budgets exist to catch regressions, not to bound a real app's
payload (consumers tree-shake). A ceiling may be raised, but never silently: a
bump needs a reason in review.

`pnpm a11y` needs the docs preview running, and it fails on `critical` violations
while reporting `serious` ones for triage:

```bash
pnpm --filter @rukkiecodes/docs build
pnpm --filter @rukkiecodes/docs preview --port 4173 &
A11Y_BASE=http://localhost:4173 pnpm a11y
```

## Working on a component

The workflow that produced the existing components, in order:

1. **Study the reference.** The design language is Vuesax's; the engineering
   stability is Vuetify's.
2. **Implement it** against the [definition of done](#definition-of-done) below.
3. **Write the docs page.** Every component gets one, under
   `apps/docs/src/pages/components/`: live examples, a playground, and the
   generated API table. An `<Example file="button/variants" />` tag embeds
   `apps/docs/src/examples/button/variants.vue`; an `<ApiTable name="FBtn" />`
   renders the generated API table for a component.
4. **Verify it visually** in both the light and the dark theme.
5. **Run the gate:** `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.

### Definition of done

A component is not finished until it is token-driven (no hard-coded hex or px —
tokens are the single source of truth, without exception), every interactive
state is styled (default, hover, focus, active, disabled, loading, error),
keyboard support and screen-reader semantics and focus management are verified,
`prefers-reduced-motion` is respected, it is SSR- and hydration-safe, it is
responsive across the breakpoints, any optional visual effect has a static
fallback, it is documented with a live example, and it has unit and accessibility
test coverage.

Two of those are enforced mechanically and worth calling out. **SSR safety** is a
test: the suite server-renders every registered component in a Node environment
with no DOM, so touching `window` or `document` at module load fails CI. **The
signature visual layer** may never be load-bearing — a component must remain
fully usable with WebGL unavailable and motion disabled.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org), with
a **lowercase subject**, and commitlint enforces it in a `commit-msg` hook. A
`pre-commit` hook runs `lint-staged`, which formats staged files with Prettier.

```
feat(vue): add the layout grid system — FContainer, FRow, FCol
fix(vue): emit every design token, and stop the utility layer eating chip color
docs: document every component and regroup the navigation
```

## Releases

Releases run on [Changesets](https://github.com/changesets/changesets). If your
change is user-facing, run `pnpm changeset`, pick the affected packages and the
bump type, and describe the change in the prose that will become the changelog
entry — write it for someone deciding whether to upgrade, not as a commit
summary. Maintainers version and publish from `main`; contributors never need to
publish anything.
