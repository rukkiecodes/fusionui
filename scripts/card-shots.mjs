import { chromium } from 'playwright'

const url = 'http://localhost:5174/components/card'
const shots = [
  ['.vd-card-content--type-3', '/tmp/w-t3.png', false],
  ['.vd-card-content--type-4', '/tmp/w-t4.png', false],
  ['.vd-card-content--type-5', '/tmp/w-t5.png', false],
  ['.vd-card-content--type-5', '/tmp/w-t5h.png', true],
  ['.vd-card-content--type-2', '/tmp/w-t2.png', false],
]

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1100, height: 1000 },
  deviceScaleFactor: 2,
})
await page.goto(url, { waitUntil: 'load' })
await page.waitForTimeout(1500)

for (const [selector, out, hover] of shots) {
  const el = await page.$(selector)
  if (!el) {
    console.log('MISS', selector)
    continue
  }
  await el.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await page.waitForTimeout(300)
  if (hover) {
    await el.hover()
    await page.waitForTimeout(600)
  }
  await el.screenshot({ path: out })
  console.log('OK', out)
}
await browser.close()
