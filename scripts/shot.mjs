import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:5188/components/button'
const out = process.argv[3] || '/tmp/btn.png'
const selector = process.argv[4]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
if (selector) {
  const el = await page.$(selector)
  await (el ?? page).screenshot({ path: out })
} else {
  await page.screenshot({ path: out, fullPage: true })
}
await browser.close()
console.log('shot ->', out)
