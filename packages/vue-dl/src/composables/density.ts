import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter, PropType } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstanceName } from '../util/getCurrentInstance'

export type Density = 'default' | 'comfortable' | 'compact'

export interface DensityProps {
  density?: Density
}

export const makeDensityProps = propsFactory(
  {
    density: {
      type: String as PropType<Density>,
      default: 'default',
      validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
    },
  },
  'density'
)

export function useDensity(props: MaybeRefOrGetter<DensityProps>, name = getCurrentInstanceName()) {
  const densityClasses = computed(() => {
    return [`${name}--density-${toValue(props).density}`]
  })

  return { densityClasses }
}
