// @vitest-environment node
//
// SSR / hydration safety: the whole library must import cleanly under Node with
// NO DOM, and a component must server-render to a string. This is the hard rule
// "nothing touches window/document at module load" turned into a CI gate — if
// any module reaches for the DOM on import, this file throws at the top.
import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as FusionUI from '../index'
import { components } from '../components'
import { createFusionUI } from '../index'

describe('SSR safety', () => {
  it('imports the entry under Node without a DOM', () => {
    expect(typeof FusionUI.createFusionUI).toBe('function')
    expect(typeof document).toBe('undefined') // proves we are in the Node env
  })

  it('server-renders a button to HTML (no window/document access)', async () => {
    const app = createSSRApp({ render: () => h(FusionUI.FBtn, { color: 'primary' }, () => 'Go') })
    app.use(createFusionUI())
    const html = await renderToString(app)
    expect(html).toContain('fui-btn')
    expect(html).toContain('Go')
  })

  it('every registered component mounts under SSR without throwing', async () => {
    const failures: string[] = []
    for (const [name, comp] of Object.entries(components)) {
      try {
        const app = createSSRApp({ render: () => h(comp as never) })
        app.use(createFusionUI())
        await renderToString(app)
      } catch (e) {
        failures.push(`${name}: ${(e as Error).message}`)
      }
    }
    expect(failures).toEqual([])
  })
})
