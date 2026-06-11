import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter, PropType } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstanceName } from '../util/getCurrentInstance'
import { useColor } from './color'

/**
 * Standard variants (Vuetify lineage) plus the three signature Vuesax looks:
 * `gradient`, `relief`, and `line`.
 */
export type Variant =
  | 'elevated'
  | 'flat'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'plain'
  | 'gradient'
  | 'relief'
  | 'line'

export const allowedVariants: Variant[] = [
  'elevated',
  'flat',
  'tonal',
  'outlined',
  'text',
  'plain',
  'gradient',
  'relief',
  'line',
]

export interface VariantProps {
  color?: string | null
  variant?: Variant
}

export function makeVariantProps(defaults?: { variant?: Variant }) {
  return propsFactory(
    {
      color: String as PropType<string | null>,
      variant: {
        type: String as PropType<Variant>,
        default: 'elevated',
        validator: (v: unknown) => allowedVariants.includes(v as Variant),
      },
    },
    'variant'
  )(defaults)
}

/** Variants whose color applies to the background vs. the foreground/text. */
const backgroundVariants: Variant[] = ['elevated', 'flat', 'gradient', 'relief']

export function useVariant(props: MaybeRefOrGetter<VariantProps>, name = getCurrentInstanceName()) {
  const variantClasses = computed(() => {
    const { variant } = toValue(props)
    return [`${name}--variant-${variant}`]
  })

  const { colorClasses, colorStyles } = useColor(() => {
    const { variant, color } = toValue(props)
    if (!color) return {}
    const target = variant && backgroundVariants.includes(variant) ? 'background' : 'text'
    return { [target]: color }
  })

  return { colorClasses, colorStyles, variantClasses }
}
