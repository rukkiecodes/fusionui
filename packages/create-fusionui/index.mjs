#!/usr/bin/env node
// create-fusionui — the `npm create fusionui@latest` entry. Delegates to the
// shared `init` command (the same code path as `fusionui init`).
//
//   npm create fusionui@latest [dir] [--target <id>] [--features a,b] [-y]
import minimist from 'minimist'
import { bold, cyan, dim, red } from 'kleur/colors'
import { runInit } from './src/init.mjs'
import { FEATURES, TARGETS, featuresFor } from './src/presets.mjs'

const argv = minimist(process.argv.slice(2), {
  boolean: ['ts', 'typescript', 'yes', 'help', 'install', 'js'],
  // `features` is a list, never a boolean — `--no-features` still yields false.
  string: ['target', 'template', 'features'],
  default: { install: undefined },
  alias: { t: 'template', h: 'help', y: 'yes' },
})

if (argv.help) {
  const targets = TARGETS.map(
    t => `  ${cyan(t.id.padEnd(12))} ${t.title.padEnd(16)} ${dim(t.hint)}`
  ).join('\n')
  const features = FEATURES.map(f => {
    const on = TARGETS.filter(t => featuresFor(t).some(x => x.id === f.id)).map(t => t.id)
    return `  ${cyan(f.id.padEnd(12))} ${f.title.padEnd(16)} ${dim(on.join(', '))}`
  }).join('\n')

  console.log(`
${bold('create-fusionui')} — scaffold a FusionUI app

${bold('Usage')}
  npm create fusionui@latest [dir] [options]

${bold('Options')}
      --target <id>       what to build (prompted if omitted)
      --features a,b      comma-separated; ${cyan('--no-features')} for none
      --ts / --js         language (default: TypeScript)
      --no-install        skip installing dependencies
  -y, --yes               accept defaults, no prompts
  -h, --help              show this help

${bold('Targets')}
${targets}

${bold('Features')}                       ${dim('(available on)')}
${features}
`)
  process.exit(0)
}

runInit(argv).catch(err => {
  console.error(red(String(err)))
  process.exit(1)
})
