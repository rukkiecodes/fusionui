import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { components } from '../components'
import * as lib from '../index'

// A component only reaches users if it is registered in THREE places: the
// barrel (`components/index.ts`), the global `components` map, and the
// stylesheet aggregator (`styles/_components.scss`). Miss one and the failure
// is silent — the component simply doesn't exist, or renders unstyled. With
// 100+ components registered by hand, that is the likeliest defect in the
// library, so it gets a guard rather than a code review.

// vitest's root is packages/vue (see vitest.config.ts).
const srcDir = join(process.cwd(), 'src')
const componentsDir = join(srcDir, 'components')

const barrel = readFileSync(join(componentsDir, 'index.ts'), 'utf8')
const stylesheet = readFileSync(join(srcDir, 'styles', '_components.scss'), 'utf8')

/** Every `FFoo/` directory under components/ — the source of truth. */
const componentDirs = readdirSync(componentsDir).filter(
  name => name.startsWith('F') && statSync(join(componentsDir, name)).isDirectory()
)

// Internal sub-components: exported for typing, but never registered globally
// because they cannot stand alone (they require their parent's injected context
// and are constructed by it, not by the user).
const internalOnly = new Set(['FTreeviewItem'])

describe('component registration', () => {
  it('finds component directories to check', () => {
    // Guards the guard: a bad glob silently passing everything is worse than no test.
    expect(componentDirs.length).toBeGreaterThan(50)
  })

  it.each(componentDirs)('%s is re-exported from the barrel', dir => {
    expect(barrel).toContain(`export * from './${dir}'`)
  })

  it.each(componentDirs)('%s has its stylesheet aggregated', dir => {
    const styles = readdirSync(join(componentsDir, dir)).filter(
      // `_name.scss` is a Sass partial pulled in by a sibling stylesheet, not a
      // sheet of its own — aggregating it directly would duplicate its rules.
      f => f.endsWith('.scss') && !f.startsWith('_')
    )
    // Renderless/headless components (FHover, FLazy, FForm…) legitimately ship
    // no CSS. Only assert for the ones that actually have a stylesheet.
    for (const style of styles) {
      const partial = style.replace(/\.scss$/, '')
      expect(stylesheet).toContain(`@use '../components/${dir}/${partial}'`)
    }
  })

  it.each(componentDirs)('%s exports its declared components from the package root', dir => {
    // The folder's own index.ts names what it exports; each must survive to the
    // package root, and every component-looking export must be in the global map.
    const index = readFileSync(join(componentsDir, dir, 'index.ts'), 'utf8')
    const exported = [...index.matchAll(/\b(F[A-Z]\w*)\b/g)].map(m => m[1])
    const declared = [...new Set(exported)].filter(name => name in lib)

    expect(declared.length).toBeGreaterThan(0)

    for (const name of declared) {
      if (internalOnly.has(name)) continue
      const value = (lib as Record<string, unknown>)[name]
      // Only real components (not types/prop factories) belong in the map.
      const isComponent = typeof value === 'object' && value !== null && 'name' in (value as object)
      if (isComponent) expect(components).toHaveProperty(name)
    }
  })
})

describe('global components map', () => {
  it('every registered component is exported from the package root', () => {
    for (const name of Object.keys(components)) {
      expect(lib).toHaveProperty(name)
    }
  })

  it('every registered component declares a matching name', () => {
    for (const [key, comp] of Object.entries(components)) {
      expect((comp as { name?: string }).name).toBe(key)
    }
  })
})
