// Shared CLI helpers.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function detectPm() {
  const ua = process.env.npm_config_user_agent || ''
  if (ua.startsWith('pnpm')) return 'pnpm'
  if (ua.startsWith('yarn')) return 'yarn'
  if (ua.startsWith('bun')) return 'bun'
  return 'npm'
}

/** Recursively copy a template dir, applying `{{token}}` replacements and the
 *  `_gitignore` → `.gitignore` rename. */
export function copyDir(src, dest, replacements = {}) {
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

/** Normalize a hex like `#abc` / `ABCDEF` to `#aabbcc`. */
export function normalizeHex(input) {
  let h = String(input).trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(h))
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return `#${h.toLowerCase()}`
}
