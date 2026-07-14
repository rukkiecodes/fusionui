import { describe, expect, it } from 'vitest'
import * as lib from '../index'

// The docs tell people to `import { useGooey } from '@rukkiecodes/vue'`. For a
// long time that did not resolve: the composable existed but was never re-exported
// from `composables/index.ts`, so the published package had no such name and the
// documented snippet simply failed. Nothing caught it, because nothing asserted
// that the public surface matches what we tell people to import.
const PUBLIC_COMPOSABLES = [
  // Theming + app-level
  'useTheme',
  'useDisplay',
  'useDefaults',
  'useLayout',
  // Forms
  'useForm',
  'useValidation',
  'useProxiedModel',
  // Styling primitives — what you build your own component on
  'useVariant',
  'useSize',
  'useDensity',
  'useRounded',
  'useElevation',
  'useBorder',
  'useColor',
  'useTextColor',
  'useDimension',
  // Selection groups
  'useGroup',
  'useGroupItem',
  // The signature layer
  'useGooey',
  'useLiquidGlass',
  'useChartDimensions',
]

const PUBLIC_ENTRYPOINTS = ['createFusionUI', 'components', 'directives']

describe('public API', () => {
  it.each(PUBLIC_COMPOSABLES)('exports %s', name => {
    expect(typeof (lib as Record<string, unknown>)[name]).toBe('function')
  })

  it.each(PUBLIC_ENTRYPOINTS)('exports %s', name => {
    expect((lib as Record<string, unknown>)[name]).toBeDefined()
  })

  it('exports the three directives under the names the docs use', () => {
    const directives = lib.directives as Record<string, unknown>
    expect(Object.keys(directives).sort()).toEqual(['click-outside', 'intersect', 'ripple'])
  })
})
