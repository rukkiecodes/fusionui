import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

type SelectVariant = 'default' | 'underlined' | 'shadow'
type SelectState = 'success' | 'danger' | 'warning' | 'primary' | 'dark'

/** A plain value, an object with title/value, or a non-selectable group header. */
type SelectItem =
  | string
  | number
  | ({ header: string } & Record<string, unknown>)
  | Record<string, unknown>

interface SelectProps {
  value?: unknown
  onChange?: (value: unknown) => void
  items: SelectItem[]
  /** Object key for the option label. Default 'title'. */
  itemTitle?: string
  /** Object key for the option value. Default 'value'. */
  itemValue?: string

  variant?: SelectVariant
  state?: SelectState
  color?: string

  label?: string
  labelPlaceholder?: boolean
  placeholder?: string

  /** Select many values (rendered as chips). */
  multiple?: boolean
  /** Collapse a multiple select to two chips + a "+N" counter. */
  collapseChips?: boolean
  /** Add a search box that filters the options. */
  filter?: boolean
  clearable?: boolean
  loading?: boolean
  square?: boolean
  disabled?: boolean

  prependIcon?: ReactNode
  hint?: string
  persistentHint?: boolean
  errorMessage?: string
  successMessage?: string

  style?: StyleProp<ViewStyle>
  /** Max height of the dropdown menu. Default 280. */
  menuMaxHeight?: number
}

export type { SelectProps, SelectVariant, SelectState, SelectItem }
