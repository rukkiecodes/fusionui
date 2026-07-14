// `fusionui init` (and the `npm create fusionui` entry) — scaffold a new project.
//
// Two questions that matter: WHAT are you building (the target), and WHAT ELSE do
// you want wired in (the features). Everything else has a sane default and can be
// skipped with `-y`.
import { existsSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import prompts from 'prompts'
import { bold, cyan, dim, green, red, yellow } from 'kleur/colors'
import { copyDir, copyFile, detectPm } from './util.mjs'
import { TARGETS, featuresFor, targetById } from './presets.mjs'
import { createContext, demoPath, generatedFiles, writeFiles } from './scaffold.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const templatesDir = join(here, '..', 'templates')

// The pre-0.2 flags kept working: `--template typescript`, `--target expo`, `--ts`.
const LEGACY_TEMPLATES = {
  default: { target: 'vue-spa', typescript: false },
  typescript: { target: 'vue-spa', typescript: true },
  expo: { target: 'expo', typescript: true },
  web: { target: 'vue-spa', typescript: true },
}

/** Resolves the target + language from flags, so `-y` can skip every prompt. */
export function resolveFromFlags(argv) {
  const out = {}
  const legacy = LEGACY_TEMPLATES[argv.template] ?? LEGACY_TEMPLATES[argv.target]
  if (legacy) Object.assign(out, legacy)
  // An explicit target id always wins over the legacy aliases.
  if (targetById(argv.target)) out.target = argv.target
  if (targetById(argv.template)) out.target = argv.template
  if (argv.ts || argv.typescript) out.typescript = true
  if (argv.js) out.typescript = false
  return out
}

/** `--features pinia,vitest` / `--no-features` */
export function parseFeatureFlag(argv, target) {
  if (argv.features === false || argv.features === '') return []
  if (typeof argv.features !== 'string') return null // not specified
  const allowed = featuresFor(target).map(f => f.id)
  const asked = argv.features
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  const unknown = asked.filter(f => !allowed.includes(f))
  if (unknown.length) {
    console.log(
      red(`✖ Unknown feature(s) for ${target.id}: ${unknown.join(', ')}`) +
        dim(`\n  Available: ${allowed.join(', ') || '(none)'}`)
    )
    process.exit(1)
  }
  return asked
}

export async function runInit(argv) {
  const onCancel = () => {
    console.log(red('✖ Operation cancelled'))
    process.exit(1)
  }
  const skipPrompts = !!argv.yes
  const flags = resolveFromFlags(argv)

  let targetDir = argv._[argv._[0] === 'init' ? 1 : 0]
  let targetId = flags.target
  let typescript = flags.typescript

  // ---- 1. name + target + language -----------------------------------------
  const q = []
  if (!targetDir) {
    q.push({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-fusionui-app',
    })
  }
  if (!targetId && !skipPrompts) {
    q.push({
      type: 'select',
      name: 'target',
      message: 'What are you building?',
      choices: TARGETS.map(t => ({ title: t.title, description: t.hint, value: t.id })),
      initial: 0,
    })
  }
  if (typescript === undefined && !skipPrompts) {
    q.push({
      // Expo is TypeScript-only here — its template is already .tsx.
      type: (prev, values) => ((values.target ?? targetId) === 'expo' ? null : 'select'),
      name: 'lang',
      message: 'Language',
      choices: [
        { title: 'TypeScript', value: true },
        { title: 'JavaScript', value: false },
      ],
      initial: 0,
    })
  }

  const a = await prompts(q, { onCancel })
  targetDir = targetDir || a.projectName
  targetId = targetId || a.target || 'vue-spa'

  const target = targetById(targetId)
  if (!target) {
    console.log(
      red(`✖ Unknown target "${targetId}".`) +
        dim(`\n  Available: ${TARGETS.map(t => t.id).join(', ')}`)
    )
    process.exit(1)
  }
  if (target.kind === 'expo') typescript = true
  if (typescript === undefined) typescript = a.lang ?? true

  // ---- 2. features ---------------------------------------------------------
  const available = featuresFor(target)
  let features = parseFeatureFlag(argv, target)

  if (features === null) {
    if (skipPrompts) {
      features = available.filter(f => f.default).map(f => f.id)
    } else if (available.length) {
      const r = await prompts(
        {
          type: 'multiselect',
          name: 'features',
          message: 'Add anything else?',
          hint: '— space to toggle, enter to confirm',
          instructions: false,
          choices: available.map(f => ({
            title: f.title,
            description: f.hint,
            value: f.id,
            selected: !!f.default,
          })),
        },
        { onCancel }
      )
      features = r.features ?? []
    } else {
      features = []
    }
  }

  // ---- 3. destination ------------------------------------------------------
  const root = resolve(process.cwd(), targetDir)
  if (existsSync(root) && readdirSync(root).length > 0) {
    if (skipPrompts) {
      console.log(red(`✖ Directory "${targetDir}" is not empty.`))
      process.exit(1)
    }
    const { overwrite } = await prompts(
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory "${targetDir}" is not empty. Continue anyway?`,
        initial: false,
      },
      { onCancel }
    )
    if (!overwrite) onCancel()
  }

  const pm = detectPm()
  let install = argv.install
  if (install === undefined && !skipPrompts) {
    const r = await prompts(
      {
        type: 'confirm',
        name: 'install',
        message: `Install dependencies with ${pm}?`,
        initial: true,
      },
      { onCancel }
    )
    install = r.install
  }
  if (install === undefined) install = false

  // ---- 4. scaffold ---------------------------------------------------------
  const projectName = basename(root)
  const ctx = createContext({ target, features, projectName, typescript })

  console.log(
    dim(`\nScaffolding ${bold(target.title)} in ${root}`) +
      (ctx.features.length ? dim(` — ${ctx.features.join(', ')}`) : '') +
      dim(' …')
  )

  const tokens = {
    '{{projectName}}': projectName,
    '{{scriptLang}}': ctx.lang,
    '{{ext}}': ctx.ext,
  }

  copyDir(join(templatesDir, target.base), root, tokens)

  // The showcase is shared by the web targets, so it lives in _shared/ rather
  // than being duplicated into each base template.
  const demo = demoPath(ctx)
  if (demo) copyFile(join(templatesDir, '_shared', 'Demo.vue'), join(root, demo), tokens)

  writeFiles(root, generatedFiles(ctx))

  // ---- 5. install + next steps ---------------------------------------------
  if (install) {
    console.log(dim(`Installing dependencies with ${pm} …\n`))
    try {
      execSync(`${pm} install`, { cwd: root, stdio: 'inherit' })
    } catch {
      console.log(yellow('Dependency install failed — run it yourself and try again.'))
    }
  }

  const runScript = target.kind === 'expo' ? 'start' : 'dev'
  const runCmd = pm === 'npm' ? `npm run ${runScript}` : `${pm} ${runScript}`

  console.log(`
${green('✔ Done!')} Next steps:

  ${cyan(`cd ${targetDir}`)}${install ? '' : `\n  ${cyan(`${pm} install`)}`}
  ${cyan(runCmd)}

${bold('Add components')}  ${dim('fusionui add f-glass')}   ${bold('Brand it')}  ${dim('fusionui theme --primary=#195bff')}
Docs: ${cyan('https://rukkiecodes.github.io/fusionui/')}
`)
}
