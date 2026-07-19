import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle, TextStyle } from 'react-native'

type CheckboxSize = 'sm' | 'md' | 'lg'

interface CheckboxProps {
  /**
   * The model. A boolean for a standalone box, or an array when several boxes
   * share one model — then each box contributes its own `itemValue`.
   *
   * Parity note: the web FCheckbox calls this `modelValue` and the per-box
   * identity `value`. Native uses `value` for the model (matching Input and
   * Select) and `itemValue` for the identity.
   */
  value?: boolean | unknown[]
  /** This box's identity inside an array model. */
  itemValue?: unknown
  onChange?: (next: boolean | unknown[]) => void

  label?: string
  /** Custom content shown in the box when checked, instead of the check mark. */
  icon?: ReactNode
  /** Accent for the filled box. Default '#195bff'. */
  color?: string
  size?: CheckboxSize

  /** Render the dash instead of the tick — a partially-selected group. */
  indeterminate?: boolean
  /** Strike the label through when checked (e.g. a to-do item). */
  lineThrough?: boolean
  loading?: boolean
  disabled?: boolean

  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
}

export type { CheckboxProps, CheckboxSize }
