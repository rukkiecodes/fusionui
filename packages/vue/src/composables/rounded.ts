import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstanceName } from '../util/getCurrentInstance'

export interface RoundedProps {
  rounded?: boolean | string | number
  tile?: boolean
}

export const makeRoundedProps = propsFactory(
  {
    rounded: {
      type: [Boolean, Number, String],
      default: undefined,
    },
    tile: Boolean,
  },
  'rounded'
)

export function useRounded(props: MaybeRefOrGetter<RoundedProps>, name = getCurrentInstanceName()) {
  const roundedClasses = computed(() => {
    const { rounded, tile } = toValue(props)
    const classes: string[] = []

    if (rounded === true || rounded === '') {
      classes.push(`${name}--rounded`)
    } else if (typeof rounded === 'string' || rounded === 0) {
      for (const value of String(rounded).split(' ')) {
        classes.push(`rounded-${value}`)
      }
    } else if (tile) {
      classes.push('rounded-0')
    }

    return classes
  })

  return { roundedClasses }
}
