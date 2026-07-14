# Roadmap

FusionUI is pre-1.0. The foundations are all in place — tokens, the signature
visual layer, the mobile package, the CLI, the hardening gates — and the
component set is complete in breadth. What remains before a 1.0 is
mostly burn-down: an accessibility backlog, a decision about how much of the
library mobile carries, and the mileage that only real usage buys.

## Published today

| Package               | Version | What it is                                            |
| --------------------- | ------- | ----------------------------------------------------- |
| `@rukkiecodes/vue`    | 0.15.0  | The Vue 3 component library — 118 components          |
| `@rukkiecodes/tokens` | 0.2.0   | The single token source → CSS, SASS, TS, React Native |
| `@rukkiecodes/native` | 0.1.1   | Expo + React Native components and liquid glass       |
| `@rukkiecodes/icons`  | 0.1.0   | 737 tree-shakeable Feather-style icons                |
| `create-fusionui`     | 0.1.2   | The `npm create fusionui` scaffolder                  |

**Every one of these is below 1.0, and that is meaningful.** Under semver, a
pre-1.0 minor bump is allowed to break you. Pin your versions, read the
[changelog](/about/changelog) before upgrading, and expect the occasional API
change until 1.0 lands.

## Shipped

The library grew out of _Vue DL_, the framework that became `@rukkiecodes/vue`.
The FusionUI-era work sat on top of it in six
batches, all of which are done:

| Work                       | What landed                                                                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rebrand**                | The `F*` component prefix, the `.fui-` / `--fui-` namespaces, the `@rukkiecodes/*` packages                                                                                               |
| **Design tokens**          | `@rukkiecodes/tokens` — one source generating CSS, SASS, TypeScript and native outputs; the library consumes the generated outputs only                                                   |
| **Signature visual layer** | `FGlass` (SDF → Snell refraction), `FGoo` (metaball physics), and the chart engine — each with a static fallback and a reduced-motion path                                                |
| **Mobile**                 | `@rukkiecodes/native` — `FusionProvider`, a core component set, and `LiquidGlassView` on `UIGlassEffect` / Skia SKSL                                                                      |
| **CLI**                    | `fusionui init / add / theme` — scaffolds Vue SPA, PWA, static, Nuxt and Expo targets, adds components as a dependency or vendors them with `--copy`, and generates brand theme overrides |
| **Hardening**              | The SSR test, per-bundle gzip budgets in CI, the axe-core audit, a token sweep, and [`HARDENING.md`](https://github.com/rukkiecodes/fusionui/blob/main/HARDENING.md)                      |
| **Component parity**       | The full set — data tables, pickers, autocomplete/combobox, treeview, virtual scroll, expansion panels, and the rest — plus the 12-column grid and the complete utility-class system      |

## Open

### The unresolved decisions

Two entries in the north-star document's open-decisions list are still genuinely
open.

**Mobile scope at v1.** `@rukkiecodes/native` today covers a core set — button,
card, input, switch, alert, the app shell and liquid glass — with the component
contracts and tokens shared with the web. Whether 1.0 means full parity with the
web library or a documented, deliberately smaller mobile surface has not been
decided. The working assumption is web-first, with mobile as a fast-follow.

**The shader library — settled: none.** A hand-written WebGL2 runtime
(`@rukkiecodes/shaders`) shipped in 0.1.0 and was **removed in July 2026**. It was
a second rendering stack to maintain, and the liquid-glass and goo engines already
carry the visual identity without it. The package remains on npm, deprecated, for
anyone who installed it. If a genuine GLSL need reappears, this reopens.

The rest are settled: distribution is an npm dependency (with copy-in available
through `fusionui add --copy`), styling is co-located SASS plus CSS custom
properties, Nuxt is supported through a scaffolded plugin rather than a bespoke
module — the library is genuinely SSR-safe, so that is all Nuxt needs — and
releases run on Changesets and semver.

### The accessibility backlog

Accessibility is a release gate, and this is the part of it that is not green
yet:

- **`FSelect`** is a `div`-based combobox. It needs `role="combobox"` and proper
  `aria-labelledby` / `aria-label` wiring rather than the `for` / `id` pairing
  that suits a native control.
- **Colour contrast.** Muted text — medium-emphasis at around 0.6 opacity, plus
  code spans — falls under AA in places. This is a token decision to make
  deliberately, not a mechanical sweep, so it is being triaged rather than
  patched.
- **Docs demo buttons.** Icon-only buttons inside some documentation demos need
  per-demo `aria-label`s. A library gap only in the sense that the docs are the
  showcase; the naming of an icon button is properly the consumer's call.

Until that backlog is burned down, `pnpm a11y` runs as a reporting command rather
than a blocking CI gate. Everything else — lint, typecheck, unit tests, the SSR
render, the bundle budgets and the build — blocks.

### Component polish

Breadth is done; depth is continuous. The per-component workflow — study the
reference, implement, live examples plus a playground plus a generated API table,
screenshot-verify in both themes — keeps running component by component, and
that is the work that turns a parity checklist into a library that feels right.

## Toward 1.0

A 1.0 tag means the API is one you can build a product on for years, which in
practice means: the a11y backlog burned down and `pnpm a11y` moved into the
blocking gate, the mobile scope question answered and documented, and enough real
usage to have found the bugs that only real usage finds. Bug reports and
screenshots of things that look wrong are, at this stage, the single most useful
contribution — see [Contributing](/about/contributing).
