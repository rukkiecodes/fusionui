/**
 * FList — a simple container for FListItems, optionally divided by hairlines.
 */

import { Children, Fragment } from 'react'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { FDivider } from './FDivider'

export interface FListProps {
  /** Draw a hairline between items. */
  divided?: boolean
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FList({ divided = false, children, style }: FListProps) {
  const items = Children.toArray(children)
  return (
    <View style={style}>
      {items.map((child, i) => (
        <Fragment key={i}>
          {child}
          {divided && i < items.length - 1 ? <FDivider inset={16} /> : null}
        </Fragment>
      ))}
    </View>
  )
}
