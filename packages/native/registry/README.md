# FusionUI mobile — component registry

FusionUI on mobile is **copy-in**, not an installed component library. You start a
project with the bare minimum — **Text** and **Button** — and pull in anything else
one command at a time. The component's source is written into _your_ project, so
you own it and can edit it freely.

```bash
npx @rukkiecodes/native init          # writes component.config.json + copies Text + Button in
npx @rukkiecodes/native add <name>    # copies any other component on demand
npx @rukkiecodes/native list          # shows everything available
```

The CLI (`packages/native/cli`) ships with the package and copies from this
directory — no network, no build step. `--dir <path>` overrides the configured
`outDir`; `--overwrite` replaces existing files.

This directory is the **source of truth** the CLI copies from:

```
registry/
  registry.json          # the index: name → category, files, deps
  components/
    text/                # add text
      index.tsx types.ts const.ts helpers.ts
    button/              # add button
      index.tsx types.ts
```

## Per-component dependencies

Each component declares the packages your project needs (see `registry.json`):

| Component | Dependencies           | Peer                                               |
| --------- | ---------------------- | -------------------------------------------------- |
| `text`    | —                      | `react`, `react-native`                            |
| `button`  | `expo-linear-gradient` | `react`, `react-native`, `react-native-reanimated` |

```bash
npx expo install expo-linear-gradient react-native-reanimated
```

## What you get

- **Text** — a typography primitive: `size` or heading `level` (`Text.H1`–`Text.H6`),
  `weight`, colour variants, alignment, truncation, `loading` skeleton, `prefix`/`suffix`,
  and press support.
- **Button** — a press-spring button with a loading crossfade and an optional
  `gradientColors` fill.

## Attribution & licence

These components are adapted from **[reacticx](https://github.com/rit3zh/reacticx)**
(MIT © rit3zh), rebranded for FusionUI. The copied source keeps that attribution in
its header. FusionUI is MIT-licensed.
