import { computed, inject, reactive, readonly, toRefs } from 'vue'
import type { InjectionKey } from 'vue'

export type DisplayBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface DisplayThresholds {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

export interface DisplayOptions {
  mobileBreakpoint?: DisplayBreakpoint | number
  thresholds?: Partial<DisplayThresholds>
}

export interface DisplayInstance {
  width: number
  height: number
  name: DisplayBreakpoint
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  smAndUp: boolean
  mdAndUp: boolean
  lgAndUp: boolean
  mobile: boolean
  thresholds: DisplayThresholds
  update: () => void
}

export const DisplaySymbol: InjectionKey<DisplayInstance> = Symbol.for('fusionui:display')

const defaultThresholds: DisplayThresholds = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}

function getClientWidth(ssr?: boolean): number {
  return ssr || typeof window === 'undefined' ? 0 : window.innerWidth
}

function getClientHeight(ssr?: boolean): number {
  return ssr || typeof window === 'undefined' ? 0 : window.innerHeight
}

export function createDisplay(options: DisplayOptions = {}, ssr?: boolean): DisplayInstance {
  const thresholds: DisplayThresholds = { ...defaultThresholds, ...options.thresholds }
  const mobileBreakpoint = options.mobileBreakpoint ?? 'lg'

  const state = reactive({
    width: getClientWidth(ssr),
    height: getClientHeight(ssr),
  })

  const display = reactive({
    ...toRefs(state),
    thresholds,
    name: computed<DisplayBreakpoint>(() => {
      const w = state.width
      if (w < thresholds.sm) return 'xs'
      if (w < thresholds.md) return 'sm'
      if (w < thresholds.lg) return 'md'
      if (w < thresholds.xl) return 'lg'
      if (w < thresholds.xxl) return 'xl'
      return 'xxl'
    }),
    xs: computed(() => state.width < thresholds.sm),
    sm: computed(() => state.width >= thresholds.sm && state.width < thresholds.md),
    md: computed(() => state.width >= thresholds.md && state.width < thresholds.lg),
    lg: computed(() => state.width >= thresholds.lg && state.width < thresholds.xl),
    xl: computed(() => state.width >= thresholds.xl && state.width < thresholds.xxl),
    xxl: computed(() => state.width >= thresholds.xxl),
    smAndUp: computed(() => state.width >= thresholds.sm),
    mdAndUp: computed(() => state.width >= thresholds.md),
    lgAndUp: computed(() => state.width >= thresholds.lg),
    mobile: computed(() => {
      const bp =
        typeof mobileBreakpoint === 'number' ? mobileBreakpoint : thresholds[mobileBreakpoint]
      return state.width < bp
    }),
    update,
  })

  function update(): void {
    state.width = getClientWidth(false)
    state.height = getClientHeight(false)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', update, { passive: true })
  }

  return display as unknown as DisplayInstance
}

export function useDisplay(): DisplayInstance {
  const display = inject(DisplaySymbol)
  if (!display) throw new Error('[FusionUI] Could not find display instance')
  return readonly(display) as unknown as DisplayInstance
}
