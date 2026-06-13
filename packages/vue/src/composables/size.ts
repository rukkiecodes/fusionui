import { computed, toValue } from 'vue'
import type { CSSProperties, MaybeRefOrGetter, PropType } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstanceName } from '../util/getCurrentInstance'
import { convertToUnit } from '../util/helpers'

const predefinedSizes = ['x-small', 'small', 'default', 'medium', 'large', 'x-large']

export interface SizeProps {
  size?: string | number
}

export const makeSizeProps = propsFactory(
  {
    size: {
      type: [String, Number] as PropType<string | number>,
      default: 'default',
    },
  },
  'size'
)

/**
 * Token sizes (`x-small`…`x-large`) become BEM modifier classes; numeric/px
 * values become inline width/height styles.
 */
export function useSize(props: MaybeRefOrGetter<SizeProps>, name = getCurrentInstanceName()) {
  const sizeClasses = computed(() => {
    const size = toValue(props).size
    if (size != null && predefinedSizes.includes(String(size))) {
      return [`${name}--size-${size}`]
    }
    return []
  })

  const sizeStyles = computed<CSSProperties>(() => {
    const size = toValue(props).size
    if (size != null && !predefinedSizes.includes(String(size))) {
      const unit = convertToUnit(size)
      return { width: unit, height: unit }
    }
    return {}
  })

  return { sizeClasses, sizeStyles }
}
