# The FusionUI skill

These docs are built to be read by coding agents, not just people. The **FusionUI
skill** is a single markdown file that teaches an agent the things it would
otherwise get wrong: that components are `F*` and globally registered, that
`--fui-theme-primary` is an RGB triplet rather than a colour, that the theme's
utility classes are `!important` in the last cascade layer, and that a component
is not done until it is keyboard-accessible and SSR-safe.

Installing it is really just putting that file where your agent already looks.

## Pick your agent

<SkillInstall />

The skill is regenerated with the docs on every release, so re-run the command to
pick up new components. It is about 80 lines — small enough that it costs you
almost nothing to keep loaded.

## What the skill actually contains

- **Install and setup** — the real `main.ts`, and the scaffolder for a new project.
- **Conventions** — the `F*` / `fui-*` / `--fui-*` naming, and the rules that are
  easy to violate by accident.
- **The traps.** Colour tokens are RGB triplets: `color: var(--fui-theme-primary)`
  is invalid and silently drops the whole declaration; you want
  `rgb(var(--fui-theme-primary))`. Spacing is `var(--fui-space-4)`, never a raw
  pixel value. These are the mistakes agents make first.
- **Every component name**, so it never invents one.
- **Working patterns** — a dialog, a form, a data table, the notification service.

## The rest of the machine-readable surface

Every page of these docs is available as raw **Markdown** and **JSON** — append
`.md` or `.json` to any URL, or use the buttons at the top of each page:

```bash
https://rukkiecodes.github.io/fusionui/components/dialog.md
https://rukkiecodes.github.io/fusionui/components/dialog.json
```

| Endpoint                                                                              | What it is                                                        |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`llms.txt`](https://rukkiecodes.github.io/fusionui/llms.txt)                         | An index of every page, for agents that crawl                     |
| [`llms-full.txt`](https://rukkiecodes.github.io/fusionui/llms-full.txt)               | The entire documentation as one file                              |
| [`ai/fusionui-skill.md`](https://rukkiecodes.github.io/fusionui/ai/fusionui-skill.md) | The skill installed above                                         |
| [`ai/manifest.json`](https://rukkiecodes.github.io/fusionui/ai/manifest.json)         | Machine-readable index: every page with its markdown and JSON URL |

If your agent can fetch a URL, you do not strictly need to install anything —
point it at the skill and it can read the rest itself. The install just means it
already knows the rules before it writes the first line.
