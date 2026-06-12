import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:5188/components/button', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

// A real QUICK click (down + up immediately) — the case that was failing.
const btn = page.locator('.example__preview .vd-btn').first()
const box = await btn.boundingBox()
await page.mouse.move(box.x + 18, box.y + box.height / 2)
await page.mouse.down()
await page.mouse.up()
// Screenshot ~150ms later: the ripple should still be growing (pre-fade delay).
await page.waitForTimeout(150)
await page.locator('.example__preview').first().screenshot({ path: '/tmp/btn-ripple-quick.png' })
await browser.close()
console.log('quick-click ripple shot saved')
