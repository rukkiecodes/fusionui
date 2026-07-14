# Is FusionUI for you?

Picking a UI framework is a multi-year commitment, and a sales pitch is a bad
basis for one. So here is the honest version: what FusionUI is good at, where it
is still young, and when you should pick something else.

## What you get

|                           |                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Components**            | 133, covering the full range — data tables, pickers, autocomplete and combobox, treeview, virtual scroll, expansion panels — plus a 12-column grid and a complete utility-class system |
| **Design language**       | Soft shadows, gentle radii, ripples, lift-on-hover, Apple-ish type and whitespace. Deliberately not Material                                                                           |
| **Theming**               | Every value is a `--fui-*` custom property generated from one token source. Runtime theme swap, no re-render                                                                           |
| **Accessibility**         | A release gate, not a backlog item: keyboard, focus, screen reader, reduced motion. axe-core runs over the docs in both themes. A tracked backlog remains — see below                  |
| **SSR**                   | A hard constraint, enforced by a test that server-renders every registered component in a DOM-less Node environment. Nuxt works through a scaffolded plugin                            |
| **Mobile / React Native** | `@rukkiecodes/native` — Expo and RN components sharing the tokens and the component contracts. Currently a core set, not the full library                                              |
| **GPU visual layer**      | Liquid glass and goo, each with a static fallback and a reduced-motion path, mirrored on mobile through Skia                                                                           |
| **Bundle size**           | ~120 kB gz JS + ~45 kB gz CSS for the full barrel, tracked against budgets in CI                                                                                                       |
| **Licence**               | MIT                                                                                                                                                                                    |

## Where it's still young

FusionUI is pre-1.0. It has a small user base, and a minor version can still
break your build.

It has not been through the years of edge cases, browser quirks, accessibility
bug reports and enterprise deployments that the long-established Vue frameworks
have. When you hit a bug, the answer to "has anyone seen this before" is often
no. The ecosystem around it — third-party plugins, Stack Overflow answers, people
you can hire who already know it — is correspondingly thin.

The accessibility work is a gate, but it is not finished: there is a tracked
backlog in [`HARDENING.md`](https://github.com/rukkiecodes/fusionui/blob/main/HARDENING.md).
Tree-shaking does not currently work — `createFusionUI()` registers the whole
component set, so you pay for the full barrel whether you use it or not.

## Pick something else if…

- **You need Material Design.** FusionUI is not Material and will not become it.
- **You need maturity above all else.** If the deciding factor is the
  lowest-risk, most widely-supported choice, take the mature option. That gap is
  real and it will not close soon.
- **You need a large hiring pool** of developers who already know the framework.
- **You need a first-party Nuxt module.** FusionUI works under Nuxt through a
  plugin the CLI scaffolds for you, which is not the same thing as an official,
  long-maintained module.

## Pick FusionUI if…

**You want the web app and the phone app to be the same product.** One token
source generates CSS, SASS, TypeScript and React Native outputs. A brand re-theme
lands on both at once, and the component contracts (`variant`, `color`, `size`,
`loading`, …) are identical across them. This is the thing FusionUI does that the
alternatives do not do at all.

**You want a signature visual layer that can't break your page.** Liquid glass
and goo are the identity, not decoration bolted onto a clone — and every effect
paints a static fallback first, honours `prefers-reduced-motion`, and pauses off
screen.

**You don't want to look like a default template.** That is a matter of taste
rather than measurement, so judge it from the [components](/components/button)
rather than from this sentence.

**And you can live with pre-1.0.** The API may still shift. It is MIT licensed,
so the cost of being wrong is mostly the cost of a migration.
