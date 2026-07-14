# Comparison

FusionUI's two reference points are [Vuetify](https://vuetifyjs.com) — the most
mature component framework in the Vue ecosystem — and
[Vuesax](https://vuesax.com), whose visual language is the one FusionUI is
modelled on. It is worth being blunt about how it stacks up against both, because
picking a UI framework is a multi-year commitment and a sales pitch is a bad
basis for one.

|                             | FusionUI                                                                                                                                                | Vuetify                                                                                                | Vuesax                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Component count**         | 118 as of `@rukkiecodes/vue` 0.15.0                                                                                                                     | A comparably large set, refined over far longer                                                        | A much smaller set                                                                         |
| **Design language**         | Vuesax-derived: soft shadows, gentle radii, ripples, lift-on-hover, Apple-ish type and whitespace                                                       | Material Design                                                                                        | Its own soft, playful aesthetic — the original                                             |
| **Theming (CSS variables)** | Every value is a `--fui-*` custom property generated from one token source; runtime theme swap with no re-render                                        | CSS custom properties plus SASS variables; mature and well-documented                                  | Colour variables; workable, but not a full token system                                    |
| **Accessibility**           | A release gate: keyboard, focus, screen reader, reduced motion. axe-core runs over the docs in both themes. A tracked backlog remains (see below)       | Taken seriously and covers far more ground in practice, with years of real-world bug reports behind it | Limited                                                                                    |
| **SSR**                     | A hard constraint, enforced by a test that server-renders every registered component in a DOM-less Node environment. Nuxt works via a scaffolded plugin | Full SSR support with an official, well-maintained Nuxt module                                         | No first-class SSR story                                                                   |
| **Mobile / React Native**   | `@rukkiecodes/native` — Expo + RN components sharing the tokens and the component contracts. Currently a core set, not the full library                 | None                                                                                                   | None                                                                                       |
| **GPU visual layer**        | Liquid glass, goo and a lazy WebGL2 shader catalog, each with a static fallback and a reduced-motion path; mirrored on mobile through Skia              | None                                                                                                   | None                                                                                       |
| **Bundle size**             | Full barrel ~119 kB gz JS + ~44 kB gz CSS, tracked against budgets in CI; ~0.9 kB gz per component, tree-shaken                                         | Depends heavily on your build; well-optimised and long-tuned                                           | Small library, correspondingly small                                                       |
| **Maturity**                | Pre-1.0. Young, small user base, minors can break                                                                                                       | Years in production across thousands of apps, a large community and ecosystem                          | Established look, but verify the project's current release activity before depending on it |

## Where Vuetify wins, plainly

Vuetify is more mature and more battle-tested than FusionUI, and that gap will
not close soon. It has been through years of edge cases, browser quirks,
accessibility bug reports and enterprise deployments that FusionUI simply has not
seen yet. Its documentation is deeper, its ecosystem larger, its Nuxt story
first-party, and its answer to "has anyone hit this bug before" is usually yes.

If your priority is the lowest-risk, most widely-supported choice — or you want a
Material-Design product and a large hiring pool of people who already know the
framework — use Vuetify. FusionUI takes many of its engineering ideas
(composable-driven components, a `props` factory, CSS-variable theming, an
in-house grid and utility-class layer) precisely because they are good ones.

## Where Vuesax fits

Vuesax defined the look FusionUI is chasing, and it did it first. If you want
that aesthetic and your project's needs are modest, it may still be the simplest
path. What FusionUI adds is the engineering underneath it: SSR safety, a token
system, accessibility gates, bundle budgets, a much larger component set, and a
mobile implementation. Check Vuesax's current release activity and Vue 3 support
before you build on it — that is a question about the project's present state,
and its repository is the only honest source for it.

## Where FusionUI's edges actually are

Three things, and no more than three.

**The cross-platform token model.** One token source generates CSS, SASS,
TypeScript and React Native outputs. A brand re-theme lands on the web app and
the Expo app at once, and the component contracts (`variant`, `color`, `size`,
`loading`, …) are the same on both. Neither Vuetify nor Vuesax offers a React
Native counterpart at all.

**The signature visual layer.** Liquid glass, goo and shaders are not decoration
bolted onto a Material clone — they are the identity, and they are engineered
with fallbacks so they can never break a page. Nothing comparable ships in either
of the other two.

**The looks.** A FusionUI app does not read as a default template. That is a
matter of taste rather than measurement, so judge it from the
[components](/components/button) rather than from this sentence.

## Choosing

Choose **Vuetify** if maturity, ecosystem depth and Material Design are what you
need. Choose **FusionUI** if you want the Vuesax aesthetic with modern
engineering underneath, you value the token-driven web + React Native story, and
you can live with a pre-1.0 library whose API may still shift. Both are MIT
licensed, so the cost of being wrong is mostly the cost of a migration.
