#!/usr/bin/env node
// fusionui — the FusionUI CLI.
//
//   fusionui init [dir] [--target <id>] [--features a,b] [--ts|--js] [--no-install] [-y]
//   fusionui add <component> [--copy]
//   fusionui theme [name] [--primary=#hex] [--secondary=#hex] … [--out f.ts] [--js]
import minimist from 'minimist'
import { bold, cyan, dim, red } from 'kleur/colors'
import { runInit } from '../src/init.mjs'
import { runAdd } from '../src/add.mjs'
import { runTheme } from '../src/theme.mjs'
import { FEATURES, TARGETS, featuresFor } from '../src/presets.mjs'

const argv = minimist(process.argv.slice(2), {
  boolean: ['ts', 'typescript', 'yes', 'help', 'install', 'copy', 'js', 'force'],
  // `features` is a list, never a boolean — `--no-features` still yields false.
  string: ['target', 'template', 'features'],
  default: { install: undefined },
  alias: { t: 'template', h: 'help', y: 'yes' },
})

const cmd = argv._[0]

function usage() {
  const targets = TARGETS.map(
    t => `  ${cyan(t.id.padEnd(12))} ${t.title.padEnd(16)} ${dim(t.hint)}`
  ).join('\n')

  // Show which features each target actually accepts — they differ by kind.
  const features = FEATURES.map(f => {
    const on = TARGETS.filter(t => featuresFor(t).some(x => x.id === f.id)).map(t => t.id)
    return `  ${cyan(f.id.padEnd(12))} ${f.title.padEnd(16)} ${dim(on.join(', '))}`
  }).join('\n')

  console.log(`
${bold('fusionui')} — the FusionUI CLI

${bold('Commands')}
  ${cyan('init')} [dir]            scaffold a new project
  ${cyan('add')} <component>       add a component (default: dependency; ${cyan('--copy')} vendors source)
  ${cyan('theme')} [name]          scaffold a brand theme override file

${bold('init options')}
      --target <id>       what to build (prompted if omitted)
      --features a,b      comma-separated; ${cyan('--no-features')} for none
      --ts / --js         language (default: TypeScript)
      --no-install        skip installing dependencies
  -y, --yes               accept defaults, no prompts

${bold('Targets')}
${targets}

${bold('Features')}                       ${dim('(available on)')}
${features}

${bold('Examples')}
  npm create fusionui@latest my-app
  fusionui init my-app --target nuxt --features pinia,eslint
  fusionui init site --target vue-pwa -y
  fusionui add f-glass --copy
  fusionui theme brand --primary=#195bff
`)
}

async function main() {
  if (argv.help && !cmd) return usage()
  switch (cmd) {
    case 'init':
      return runInit(argv)
    case 'add':
      return runAdd(argv)
    case 'theme':
      return runTheme(argv)
    case undefined:
      return usage()
    default:
      console.log(red(`✖ Unknown command "${cmd}"`))
      usage()
      process.exit(1)
  }
}

main().catch(err => {
  console.error(red(String(err)))
  process.exit(1)
})
