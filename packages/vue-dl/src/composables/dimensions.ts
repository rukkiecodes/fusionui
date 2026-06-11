import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { convertToUnit } from '../util/helpers'

type DimensionValue = string | number

export interface DimensionProps {
  height?: DimensionValue
  maxHeight?: DimensionValue
  maxWidth?: DimensionValue
  minHeight?: DimensionValue
  minWidth?: DimensionValue
  width?: DimensionValue
}

export const makeDimensionProps = propsFactory(
  {
    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String],
  },
  'dimension'
)

export function useDimension(props: DimensionProps) {
  const dimensionStyles = computed<CSSProperties>(() => ({
    height: convertToUnit(props.height),
    maxHeight: convertToUnit(props.maxHeight),
    maxWidth: convertToUnit(props.maxWidth),
    minHeight: convertToUnit(props.minHeight),
    minWidth: convertToUnit(props.minWidth),
    width: convertToUnit(props.width),
  }))

  return { dimensionStyles }
}
