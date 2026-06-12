// Smoke test: scaffold both templates into a temp dir and assert the result.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const cli = join(here, '..', 'index.mjs')
const tmp = mkdtempSync(join(tmpdir(), 'vue-dl-create-'))

function assert(cond, msg) {
  if (!cond) {
    console.error(`✖ FAIL: ${msg}`)
    rmSync(tmp, { recursive: true, force: true })
    process.exit(1)
  }
}

try {
  // TypeScript template
  const tsApp = join(tmp, 'ts-app')
  execFileSync('node', [cli, tsApp, '--ts', '-y', '--no-install'], { stdio: 'inherit' })
  assert(existsSync(join(tsApp, 'package.json')), 'ts: package.json exists')
  assert(existsSync(join(tsApp, 'src/main.ts')), 'ts: src/main.ts exists')
  assert(existsSync(join(tsApp, 'src/App.vue')), 'ts: src/App.vue exists')
  assert(existsSync(join(tsApp, '.gitignore')), 'ts: _gitignore -> .gitignore')
  const tsPkg = readFileSync(join(tsApp, 'package.json'), 'utf8')
  assert(tsPkg.includes('"name": "ts-app"'), 'ts: project name token replaced')
  assert(!tsPkg.includes('{{projectName}}'), 'ts: no leftover tokens')
  assert(tsPkg.includes('vue-tsc'), 'ts: includes typescript tooling')

  // JavaScript template
  const jsApp = join(tmp, 'js-app')
  execFileSync('node', [cli, jsApp, '--template', 'default', '-y', '--no-install'], {
    stdio: 'inherit',
  })
  assert(existsSync(join(jsApp, 'src/main.js')), 'js: src/main.js exists')
  assert(!existsSync(join(jsApp, 'src/main.ts')), 'js: no TS entry')

  console.log('✔ create-vue-dl smoke test passed')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
