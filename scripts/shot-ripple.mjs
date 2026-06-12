import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:5188/components/button', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

// Press-and-hold the "Elevated" button to capture the growing ripple.
const btn = page.locator('.example__preview .vd-btn').first()
const box = await btn.boundingBox()
await page.mouse.move(box.x + 20, box.y + box.height / 2)
await page.mouse.down()
await page.waitForTimeout(280) // mid-grow
await page.locator('.example__preview').first().screenshot({ path: '/tmp/btn-ripple.png' })
await page.mouse.up()
await browser.close()
console.log('ripple shot saved')
