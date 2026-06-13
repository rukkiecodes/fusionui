/**
 * useChartDimensions — web adapter (Vue 3).
 *
 * Charts need a measured plot rect: the container size minus margins, where
 * the axes live. This composable observes the element and gives you reactive
 * width/height and the inner plotting rect. You build scales against
 * `innerWidth`/`innerHeight` and translate the plot group by the margins.
 *
 * The rest of the engine (scales, curves, shapes) is framework-free, so this
 * is the only Vue-specific piece you need for a custom chart component.
 */

import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import type { Ref } from 'vue'
import type { Margins, PlotRect } from '../engine/chart'

export const DEFAULT_MARGINS: Margins = { top: 16, right: 16, bottom: 28, left: 40 }

export function useChartDimensions(
  container: Ref<HTMLElement | null>,
  margins: Partial<Margins> = {}
): { dims: PlotRect } {
  const margin: Margins = { ...DEFAULT_MARGINS, ...margins }
  const dims = reactive<PlotRect>({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    margin,
  })

  function measure() {
    const el = container.value
    if (!el) return
    const r = el.getBoundingClientRect()
    dims.width = r.width
    dims.height = r.height
    dims.innerWidth = Math.max(0, r.width - margin.left - margin.right)
    dims.innerHeight = Math.max(0, r.height - margin.top - margin.bottom)
  }

  let ro: ResizeObserver | null = null
  onMounted(() => {
    measure()
    ro = new ResizeObserver(measure)
    if (container.value) ro.observe(container.value)
  })
  watch(container, el => {
    ro?.disconnect()
    if (el && ro) ro.observe(el)
    measure()
  })
  onBeforeUnmount(() => ro?.disconnect())

  return { dims }
}
