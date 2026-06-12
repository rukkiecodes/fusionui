import { chromium } from 'playwright'

const url = process.argv[2]
const out = process.argv[3]
const selector = process.argv[4] // card to hover

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
const el = await page.$(selector)
await el.scrollIntoViewIfNeeded()
await el.hover()
await page.waitForTimeout(600)
await el.screenshot({ path: out })
await browser.close()
console.log('hover shot ->', out)
