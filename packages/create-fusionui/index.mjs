#!/usr/bin/env node
// create-fusionui — scaffold a Vite + Vue 3 project preconfigured with FusionUI.
//
//   npm create fusionui@latest [dir] [--ts] [--template <name>] [--no-install] [-y]

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import prompts from 'prompts'
import minimist from 'minimist'
import { bold, cyan, dim, green, red } from 'kleur/colors'

const here = dirname(fileURLToPath(import.meta.url))
const templatesDir = join(here, 'templates')
const TEMPLATES = readdirSync(templatesDir).filter(t =>
  statSync(join(templatesDir, t)).isDirectory()
)

const argv = minimist(process.argv.slice(2), {
  boolean: ['ts', 'typescript', 'yes', 'help', 'install'],
  default: { install: undefined },
  alias: { t: 'template', h: 'help', y: 'yes' },
})

if (argv.help) {
  console.log(`
${bold('create-fusionui')} — scaffold a Vue 3 + FusionUI app

${bold('Usage')}
  npm create fusionui@latest [dir] [options]

${bold('Options')}
  -t, --template <name>   ${TEMPLATES.join(' | ')}
      --ts                shorthand for --template typescript
      --no-install        skip installing dependencies
  -y, --yes               accept defaults, no prompts
  -h, --help              show this help
`)
  process.exit(0)
}

function detectPm() {
  const ua = process.env.npm_config_user_agent || ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('bun')) return 'bun'
  return 'npm'
}

function copyDir(src, dest, replacements) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const from = join(src, entry)
    const to = join(dest, entry === '_gitignore' ? '.gitignore' : entry)
    if (statSync(from).isDirectory()) {
      copyDir(from, to, replacements)
    } else {
      let content = readFileSync(from, 'utf8')
      for (const [token, value] of Object.entries(replacements)) {
        content = content.split(token).join(value)
      }
      writeFileSync(to, content)
    }
  }
}

async function run() {
  const onCancel = () => {
    console.log(red('✖ Operation cancelled'))
    process.exit(1)
  }

  let targetDir = argv._[0]
  let template = argv.template || (argv.ts || argv.typescript ? 'typescript' : undefined)
  const skipPrompts = argv.yes

  const questions = []
  if (!targetDir) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-fusionui-app',
    })
  }
  if (!template && !skipPrompts) {
    questions.push({
      type: 'select',
      name: 'template',
      message: 'Language',
      choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'default' },
      ],
      initial: 0,
    })
  }

  const answers = await prompts(questions, { onCancel })
  targetDir = targetDir || answers.projectName
  template = template || answers.template || 'typescript'

  if (!TEMPLATES.includes(template)) {
    console.log(red(`✖ Unknown template "${template}". Available: ${TEMPLATES.join(', ')}`))
    process.exit(1)
  }

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

  console.log(dim(`\nScaffolding ${template} project in ${root} …`))
  copyDir(join(templatesDir, template), root, { '{{projectName}}': basename(root) })

  if (install) {
    console.log(dim(`Installing dependencies with ${pm} …\n`))
    try {
      execSync(`${pm} install`, { cwd: root, stdio: 'inherit' })
    } catch {
      console.log(red('Dependency install failed — run it manually.'))
    }
  }

  const runCmd = pm === 'npm' ? 'npm run dev' : `${pm} dev`
  console.log(`
${green('✔ Done!')} Next steps:

  ${cyan(`cd ${targetDir}`)}${install ? '' : `\n  ${cyan(`${pm} install`)}`}
  ${cyan(runCmd)}

Docs: ${cyan('https://github.com/fusionui/fusionui')}
`)
}

run().catch(err => {
  console.error(red(String(err)))
  process.exit(1)
})
