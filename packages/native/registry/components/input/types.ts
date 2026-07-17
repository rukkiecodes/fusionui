import type { ReactNode } from 'react'
import type {
  StyleProp,
  TextStyle,
  ViewStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native'

type InputVariant = 'default' | 'underlined' | 'shadow'
type InputState = 'success' | 'danger' | 'warning' | 'primary' | 'dark'

interface InputProps {
  value?: string
  onChangeText?: (value: string) => void

  /** Visual treatment: `default` (filled), `underlined`, or `shadow`. */
  variant?: InputVariant
  /** Tints the whole field with a state colour. */
  state?: InputState
  /** Custom accent colour (hex) for the focus border / underline / icons. */
  color?: string

  /** Pinned label sitting above the field. */
  label?: string
  /** Make the label a floating placeholder (rests inside, floats up on focus/value). */
  labelPlaceholder?: boolean
  placeholder?: string

  /** Icon that lifts out on the left when focused. */
  prependIcon?: ReactNode
  /** Icon that lifts out on the right when focused. */
  appendIcon?: ReactNode
  /** Show a clear (✕) button while the field has a value. */
  clearable?: boolean
  loading?: boolean
  /** Password field — masks input and shows a reveal toggle. */
  secureTextEntry?: boolean

  /** Helper text below the field. */
  hint?: string
  /** Keep the hint visible even when unfocused. */
  persistentHint?: boolean
  errorMessage?: string
  successMessage?: string

  /** Strength / progress bar (0–100); colour shifts with the value. */
  progress?: number

  square?: boolean
  transparent?: boolean
  disabled?: boolean

  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  returnKeyType?: ReturnKeyTypeOptions
  maxLength?: number
  onSubmitEditing?: () => void
  onFocus?: () => void
  onBlur?: () => void

  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  testID?: string
}

export type { InputProps, InputVariant, InputState }
