import { computed } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { propsFactory } from '../util/propsFactory'

export interface ElevationProps {
  elevation?: number | string
}

export const makeElevationProps = propsFactory(
  {
    elevation: {
      type: [Number, String],
      validator(v: unknown) {
        const value = parseInt(String(v), 10)
        return !isNaN(value) && value >= 0 && value <= 24
      },
    },
  },
  'elevation'
)

export function useElevation(props: MaybeRefOrGetter<ElevationProps>) {
  const elevationClasses = computed(() => {
    const elevation = toValue(props).elevation
    if (elevation == null) return []
    return [`elevation-${elevation}`]
  })

  return { elevationClasses }
}
