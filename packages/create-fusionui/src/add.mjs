// `fusionui add <component>` — add a FusionUI component to an existing app.
//
//   default      : the npm-dependency model (Open Decision 1) — ensure the dep
//                  and print the import/usage snippet.
//   --copy       : the shadcn-style copy-in — vendor the component's source (and
//                  its FusionUI-internal import subtree) into src/fusionui/, so
//                  the team owns and can edit it. No @rukkiecodes/vue import remains.
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bold, cyan, green, red, dim } from 'kleur/colors'

const here = dirname(fileURLToPath(import.meta.url))

/** kebab `f-line-chart` (or `FLineChart`) → component dir name `FLineChart`. */
export function toComponentName(input) {
  const raw = String(input).trim()
  if (/^F[A-Z]/.test(raw)) return raw
  const body = raw.replace(/^f-?/i, '')
  const pascal = body
    .split(/[-_]/)
    .filter(Boolean)
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('')
  return `F${pascal}`
}

/** Find the @rukkiecodes/vue source tree (installed with `src`, or the monorepo). */
export function findVueSrc(cwd = process.cwd()) {
  const candidates = [
    join(cwd, 'node_modules', '@fusionui', 'vue', 'src'),
    // monorepo dev: walk up from this file to packages/vue/src
    join(here, '..', '..', 'vue', 'src'),
  ]
  for (const c of candidates) {
    if (existsSync(join(c, 'components', 'index.ts'))) return c
  }
  return null
}

const IMPORT_RE = /(?:from|import)\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g

function resolveModule(spec, fromFile) {
  const base = spec.startsWith('.') ? resolve(dirname(fromFile), spec) : null
  if (!base) return null // external (vue, @rukkiecodes/tokens, …) — keep as a dep
  const tries = ['.ts', '.tsx', '/index.ts', '/index.tsx', '']
  for (const ext of tries) {
    const p = base + ext
    if (existsSync(p) && statSync(p).isFile()) return p
  }
  return null
}

/**
 * Walk the relative-import closure of a component. Returns the set of absolute
 * file paths to vendor. (Relative specifiers resolve from each file, so the
 * srcRoot only matters for the entry path the caller supplies.)
 */
export function collectGraph(entryFile) {
  const seen = new Set()
  const stack = [entryFile]
  while (stack.length) {
    const file = stack.pop()
    if (seen.has(file)) continue
    seen.add(file)
    const code = readFileSync(file, 'utf8')
    for (const m of code.matchAll(IMPORT_RE)) {
      const spec = m[1] ?? m[2]
      if (!spec || !spec.startsWith('.')) continue
      const resolved = resolveModule(spec, file)
      if (resolved && !seen.has(resolved)) stack.push(resolved)
    }
  }
  return seen
}

/** Vendor the graph into <destRoot>/fusionui, mirroring the src layout. */
export function copyIn(component, srcRoot, destRoot, version = '0.0.0') {
  const entry = join(srcRoot, 'components', component, 'index.ts')
  if (!existsSync(entry)) throw new Error(`unknown component: ${component}`)
  const files = collectGraph(entry)
  // Co-located SCSS travels with its component (not part of the TS graph).
  const scss = join(srcRoot, 'components', component, `${component}.scss`)
  const written = []
  for (const file of files) {
    const rel = relative(srcRoot, file)
    const out = join(destRoot, 'fusionui', rel)
    mkdirSync(dirname(out), { recursive: true })
    const header = `// Vendored from @rukkiecodes/vue@${version} by \`fusionui add --copy\`.\n// You own this copy — edit freely; re-run to refresh.\n`
    writeFileSync(out, header + readFileSync(file, 'utf8'))
    written.push(rel)
  }
  if (existsSync(scss)) {
    const out = join(destRoot, 'fusionui', 'components', component, `${component}.scss`)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, readFileSync(scss, 'utf8'))
    written.push(relative(srcRoot, scss))
  }
  return written
}

function ensureDep(pkgPath, name, version) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.dependencies ??= {}
  if (!pkg.dependencies[name]) {
    pkg.dependencies[name] = version
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    return true
  }
  return false
}

export async function runAdd(argv) {
  const input = argv._[1]
  if (!input) {
    console.log(red('✖ Usage: fusionui add <component> [--copy]'))
    process.exit(1)
  }
  const component = toComponentName(input)
  const cwd = process.cwd()

  if (argv.copy) {
    const srcRoot = findVueSrc(cwd)
    if (!srcRoot) {
      console.log(red('✖ Could not find @rukkiecodes/vue sources. Install @rukkiecodes/vue first.'))
      process.exit(1)
    }
    let written
    try {
      written = copyIn(component, srcRoot, join(cwd, 'src'))
    } catch (e) {
      console.log(red(`✖ ${String(e.message || e)}`))
      process.exit(1)
    }
    console.log(`
${green('✔')} Copied ${bold(component)} into ${cyan('src/fusionui/')} (${written.length} files, you own it).
  ${dim(`import { ${component} } from './fusionui/components/${component}'`)}

  Base styles come from ${cyan('@rukkiecodes/tokens/css')} (or @rukkiecodes/vue/styles).
  No ${cyan('@rukkiecodes/vue')} import remains — the component is vendored.
`)
    return
  }

  // Dependency model (default).
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    const added = ensureDep(pkgPath, '@rukkiecodes/vue', 'latest')
    console.log(
      added
        ? `${green('✔')} Added ${cyan('@rukkiecodes/vue')} to package.json — run your install, then:`
        : `${green('✔')} ${cyan('@rukkiecodes/vue')} already a dependency. Use:`
    )
  } else {
    console.log(`${green('✔')} Install ${cyan('@rukkiecodes/vue')}, then:`)
  }
  const tag = component.replace(/([A-Z])/g, (m, c, i) => (i ? '-' : '') + c.toLowerCase())
  console.log(`
  ${dim(`import { ${component} } from '@rukkiecodes/vue'`)}
  ${dim(`<${tag} />`)}

  Tip: ${cyan('fusionui add ' + input + ' --copy')} vendors the source instead (you own it).
`)
}
