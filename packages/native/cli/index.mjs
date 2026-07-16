#!/usr/bin/env node
// FusionUI mobile CLI — copy-in components, shadcn-style. No build step, no deps:
// the registry source ships inside this package, and `add` copies a component's
// files straight into your project, where you own and edit them.
//
//   npx @rukkiecodes/native init            # config + the minimal Text/Button
//   npx @rukkiecodes/native add <name...>   # copy a component in on demand
//   npx @rukkiecodes/native list            # everything available
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const registryDir = join(here, '..', 'registry')
const registry = JSON.parse(readFileSync(join(registryDir, 'registry.json'), 'utf8'))
const cwd = process.cwd()
const CONFIG = 'component.config.json'

// -- tiny ANSI helpers (no chalk dependency) --------------------------------
const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)
const c = {
  bold: s => paint('1', s),
  dim: s => paint('2', s),
  green: s => paint('32', s),
  cyan: s => paint('36', s),
  yellow: s => paint('33', s),
  red: s => paint('31', s),
}
const die = msg => {
  console.error(c.red(msg))
  process.exit(1)
}

// -- args -------------------------------------------------------------------
const argv = process.argv.slice(2)
const flags = {}
const positionals = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--overwrite' || a === '-o') flags.overwrite = true
  else if (a === '--dir' || a === '--out') flags.dir = argv[++i]
  else positionals.push(a)
}
const [command, ...names] = positionals

// -- config -----------------------------------------------------------------
function readConfig() {
  const p = join(cwd, CONFIG)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}
function resolveOutDir() {
  if (flags.dir) return flags.dir
  const cfg = readConfig()
  if (cfg?.outDir) return cfg.outDir
  die(
    `No ${CONFIG} found. Run "${c.cyan('npx @rukkiecodes/native init')}" first, or pass ${c.cyan('--dir <path>')}.`
  )
}

// -- copy one component -----------------------------------------------------
function addOne(name, outDir, { overwrite }) {
  const comp = registry.components[name]
  if (!comp) {
    const near = Object.keys(registry.components).filter(n => n.includes(name))
    die(
      `Unknown component "${name}".` +
        (near.length
          ? ` Did you mean: ${near.join(', ')}?`
          : ` Run "npx @rukkiecodes/native list".`)
    )
  }
  const from = join(registryDir, comp.path)
  const to = join(cwd, outDir, name)

  if (!overwrite) {
    const clash = comp.files.filter(f => existsSync(join(to, f)))
    if (clash.length) {
      die(`${name} already exists at ${outDir}/${name}. Use --overwrite to replace.`)
    }
  }

  mkdirSync(to, { recursive: true })
  for (const file of comp.files) cpSync(join(from, file), join(to, file))

  console.log(c.green(`  ✓ ${name}`) + c.dim(` → ${outDir}/${name}/`))
  return comp
}

// -- dependency hint --------------------------------------------------------
function depsHint(comps) {
  const deps = new Set()
  for (const comp of comps) {
    ;(comp.dependencies ?? []).forEach(d => deps.add(d))
    ;(comp.peerDependencies ?? []).forEach(d => {
      if (d !== 'react' && d !== 'react-native') deps.add(d)
    })
  }
  if (deps.size) {
    console.log(c.dim('\nInstall the required packages:'))
    console.log(c.cyan(`  npx expo install ${[...deps].join(' ')}`))
  }
}

// -- commands ---------------------------------------------------------------
function cmdInit() {
  const outDir = flags.dir || 'components/ui'
  const p = join(cwd, CONFIG)
  if (existsSync(p) && !flags.overwrite) {
    console.log(c.yellow(`${CONFIG} already exists. Skipping (use --overwrite to reset).`))
  } else {
    writeFileSync(p, JSON.stringify({ outDir }, null, 2) + '\n')
    console.log(c.green(`✓ wrote ${CONFIG}`) + c.dim(` (outDir: ${outDir})`))
  }
  console.log(c.bold('\nAdding the starter components:'))
  const added = ['text', 'button'].map(n => addOne(n, outDir, { overwrite: flags.overwrite }))
  depsHint(added)
  console.log(c.dim('\nAdd more any time: ') + c.cyan('npx @rukkiecodes/native add <name>'))
}

function cmdAdd() {
  if (!names.length) die('Usage: npx @rukkiecodes/native add <name...>')
  const outDir = resolveOutDir()
  console.log(c.bold(`Adding to ${outDir}/`))
  const added = names.map(n => addOne(n, outDir, { overwrite: flags.overwrite }))
  depsHint(added)
}

function cmdList() {
  const byCat = {}
  for (const [name, info] of Object.entries(registry.components)) {
    ;(byCat[info.category] ??= []).push(name)
  }
  console.log(
    c.bold(`\n${registry.name} — ${Object.keys(registry.components).length} components\n`)
  )
  for (const [cat, list] of Object.entries(byCat).sort()) {
    console.log(c.cyan(`  ${cat}`))
    list
      .sort()
      .forEach(n =>
        console.log(`    ${n}` + c.dim(`  ${registry.components[n].description ?? ''}`))
      )
  }
  console.log()
}

function usage() {
  console.log(`${c.bold('FusionUI mobile')} — copy-in React Native components

  ${c.cyan('npx @rukkiecodes/native init')}            config + the minimal Text/Button
  ${c.cyan('npx @rukkiecodes/native add <name...>')}   copy component(s) into your project
  ${c.cyan('npx @rukkiecodes/native list')}            list available components

  Flags: ${c.dim('--dir <path>')} (override outDir)  ${c.dim('--overwrite')} (replace existing)
`)
}

switch (command) {
  case 'init':
    cmdInit()
    break
  case 'add':
    cmdAdd()
    break
  case 'list':
  case 'ls':
    cmdList()
    break
  default:
    usage()
}
