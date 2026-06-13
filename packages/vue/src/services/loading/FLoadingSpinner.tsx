import { defineComponent, h } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import type { LoadingType } from './useLoading'

// How many <i> children each spinner type animates (matches the SCSS).
const CHILD_COUNT: Record<string, number> = {
  default: 1,
  points: 3,
  scale: 5,
  square: 1,
  'square-rotate': 1,
  gradient: 1,
  rectangle: 2,
  circles: 8,
  border: 1,
  waves: 2,
  corners: 4,
}

/** Resolve a theme name to its CSS color; pass CSS colors through unchanged. */
function resolveColor(color?: string): string | undefined {
  if (!color) return undefined
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) return color
  return `rgb(var(--fui-theme-${color}))`
}

function formatPercent(p: string | number): string {
  if (typeof p === 'number') return `${p}%`
  return /%\s*$/.test(p) ? p : `${p}%`
}

/**
 * The animated spinner used by the loading overlay. Renders a fixed box whose
 * `color` (set inline) drives every painted part via `currentColor`; each type's
 * SCSS animates the box, its `> i` children, and its pseudo-elements.
 */
export const FLoadingSpinner = defineComponent({
  name: 'FLoadingSpinner',
  props: {
    type: { type: String as PropType<LoadingType>, default: 'default' },
    color: { type: String, default: undefined },
    percent: { type: [String, Number] as PropType<string | number>, default: undefined },
    scale: { type: Number, default: undefined },
  },
  setup(props) {
    return () => {
      const count = CHILD_COUNT[props.type] ?? CHILD_COUNT.default
      const style: CSSProperties = { color: resolveColor(props.color) }
      if (props.scale)
        (style as Record<string, string>)['--fui-loading-size'] = `${48 * props.scale}px`
      return h(
        'div',
        { class: ['fui-loading__spinner', `fui-loading__spinner--${props.type}`], style },
        [
          ...Array.from({ length: count }, (_, i) => h('i', { key: i })),
          props.percent != null && props.percent !== ''
            ? h('span', { class: 'fui-loading__percent' }, formatPercent(props.percent))
            : null,
        ]
      )
    }
  },
})
