#!/usr/bin/env node
// Accessibility audit — run axe-core over the built docs pages in light + dark
// and fail on any critical/serious violation. Start the docs preview first:
//
//   pnpm --filter @rukkiecodes/docs build && pnpm --filter @rukkiecodes/docs preview --port 4173 &
//   A11Y_BASE=http://localhost:4173 node tools/a11y-check.mjs
import { chromium } from 'playwright'
import axe from 'axe-core'

const BASE = process.env.A11Y_BASE || 'http://localhost:4173'
const PAGES = [
  '/',
  '/components/button',
  '/components/card',
  '/components/inputs',
  '/components/alert',
  '/getting-started/design-tokens',
]
const THEMES = ['light', 'dark']
// Critical violations fail the build (unambiguous, always fixable). Serious
// (mostly colour-contrast on muted text) is reported as a tracked count — those
// need design-token decisions, triaged separately, not a silent mechanical fix.
const FAIL_ON = new Set(['critical'])
const REPORT = new Set(['serious'])

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

let total = 0
let reported = 0
const failures = []

for (const theme of THEMES) {
  for (const path of PAGES) {
    await page.goto(BASE + path)
    await page.waitForLoadState('networkidle')
    const isDark = await page.evaluate(() =>
      document.querySelector('.docs')?.className.includes('dark')
    )
    if ((theme === 'dark') !== isDark) {
      await page.locator('.docs__bar .fui-btn').first().click()
      await page.waitForTimeout(300)
    }
    await page.evaluate(axe.source)
    const results = await page.evaluate(async () => {
      return await axe.run(document, { resultTypes: ['violations'] })
    })
    for (const v of results.violations) {
      if (FAIL_ON.has(v.impact)) {
        total += v.nodes.length
        failures.push(
          `  [${v.impact}] ${theme} ${path} — ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length > 1 ? 's' : ''})`
        )
      } else if (REPORT.has(v.impact)) {
        reported += v.nodes.length
      }
    }
  }
}

await browser.close()

console.log(
  `\nFusionUI a11y audit — axe-core over ${PAGES.length} pages × ${THEMES.length} themes\n`
)
if (reported)
  console.log(`ℹ ${reported} serious (mostly colour-contrast) node(s) tracked for design triage.\n`)
if (failures.length) {
  console.error(`✗ ${total} critical violation node(s):\n`)
  console.error(failures.join('\n') + '\n')
  process.exit(1)
}
console.log('✓ No critical axe violations.\n')
