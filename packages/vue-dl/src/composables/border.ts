import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstanceName } from '../util/getCurrentInstance'

export interface BorderProps {
  border?: boolean | string | number
}

export const makeBorderProps = propsFactory(
  {
    border: {
      type: [Boolean, Number, String],
      default: undefined,
    },
  },
  'border'
)

export function useBorder(props: MaybeRefOrGetter<BorderProps>, name = getCurrentInstanceName()) {
  const borderClasses = computed(() => {
    const border = toValue(props).border
    const classes: string[] = []

    if (border === true || border === '') {
      classes.push(`${name}--border`)
    } else if (typeof border === 'string' || border === 0) {
      for (const value of String(border).split(' ')) {
        classes.push(`border-${value}`)
      }
    }

    return classes
  })

  return { borderClasses }
}
