#!/usr/bin/env node
// fusionui — the FusionUI CLI.
//
//   fusionui init [dir] [--ts] [--target web|expo] [--no-install] [-y]
//   fusionui add <component> [--copy]
//   fusionui theme [name] [--primary=#hex] [--secondary=#hex] … [--out f.ts] [--js]
import minimist from 'minimist'
import { bold, cyan, red } from 'kleur/colors'
import { runInit } from '../src/init.mjs'
import { runAdd } from '../src/add.mjs'
import { runTheme } from '../src/theme.mjs'

const argv = minimist(process.argv.slice(2), {
  boolean: ['ts', 'typescript', 'yes', 'help', 'install', 'copy', 'js', 'force'],
  default: { install: undefined },
  alias: { t: 'template', h: 'help', y: 'yes' },
})

const cmd = argv._[0]

function usage() {
  console.log(`
${bold('fusionui')} — the FusionUI CLI

${bold('Commands')}
  ${cyan('init')} [dir]            scaffold a new web (Vite+Vue) or Expo app
  ${cyan('add')} <component>       add a component (default: dependency; ${cyan('--copy')} vendors source)
  ${cyan('theme')} [name]          scaffold a brand theme override file

${bold('Examples')}
  npm create fusionui@latest my-app
  fusionui init my-app --ts
  fusionui add f-glass
  fusionui add f-glass --copy
  fusionui theme brand --primary=#195bff --secondary=#7d33ff
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
