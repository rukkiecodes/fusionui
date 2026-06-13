#!/usr/bin/env node
// create-fusionui — the `npm create fusionui@latest` entry. Delegates to the
// shared `init` command (the same code path as `fusionui init`).
//
//   npm create fusionui@latest [dir] [--ts] [--target web|expo] [--no-install] [-y]
import minimist from 'minimist'
import { bold, red } from 'kleur/colors'
import { runInit } from './src/init.mjs'

const argv = minimist(process.argv.slice(2), {
  boolean: ['ts', 'typescript', 'yes', 'help', 'install'],
  default: { install: undefined },
  alias: { t: 'template', h: 'help', y: 'yes' },
})

if (argv.help) {
  console.log(`
${bold('create-fusionui')} — scaffold a FusionUI app

${bold('Usage')}
  npm create fusionui@latest [dir] [options]

${bold('Options')}
  -t, --template <name>   default | typescript | expo
      --ts                shorthand for --template typescript
      --target <web|expo> pick the platform
      --no-install        skip installing dependencies
  -y, --yes               accept defaults, no prompts
  -h, --help              show this help
`)
  process.exit(0)
}

runInit(argv).catch(err => {
  console.error(red(String(err)))
  process.exit(1)
})
