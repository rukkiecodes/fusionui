// `fusionui init` (and the `npm create fusionui` entry) — scaffold a new project
// preconfigured with FusionUI: a Vite + Vue web app or an Expo mobile app.
import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import prompts from 'prompts'
import { bold, cyan, dim, green, red } from 'kleur/colors'
import { copyDir, detectPm } from './util.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const templatesDir = join(here, '..', 'templates')

function templates() {
  return readdirSync(templatesDir).filter(t => statSync(join(templatesDir, t)).isDirectory())
}

export async function runInit(argv) {
  const onCancel = () => {
    console.log(red('✖ Operation cancelled'))
    process.exit(1)
  }
  const TEMPLATES = templates()
  const skipPrompts = argv.yes

  let targetDir = argv._[argv._[0] === 'init' ? 1 : 0]
  // Explicit template selection (flags win over prompts).
  let template =
    argv.template ||
    (argv.target === 'expo' ? 'expo' : undefined) ||
    (argv.ts || argv.typescript ? 'typescript' : undefined)

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
      name: 'target',
      message: 'Target',
      choices: [
        { title: 'Web — Vite + Vue 3', value: 'web' },
        { title: 'Mobile — Expo + React Native', value: 'expo' },
      ],
      initial: 0,
    })
    questions.push({
      type: (prev, values) => (values.target === 'web' ? 'select' : null),
      name: 'lang',
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
  if (!template) {
    template = answers.target === 'expo' ? 'expo' : answers.lang || 'typescript'
  }

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

  const isExpo = template === 'expo'
  const runCmd = isExpo
    ? pm === 'npm'
      ? 'npm run start'
      : `${pm} start`
    : pm === 'npm'
      ? 'npm run dev'
      : `${pm} dev`
  console.log(`
${green('✔ Done!')} Next steps:

  ${cyan(`cd ${targetDir}`)}${install ? '' : `\n  ${cyan(`${pm} install`)}`}
  ${cyan(runCmd)}

${bold('Add components')}  ${dim('fusionui add f-glass')}   ${bold('Brand it')}  ${dim('fusionui theme --primary=#195bff')}
Docs: ${cyan('https://rukkiecodes.github.io/fusionui/')}
`)
}
