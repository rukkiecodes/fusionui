import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

/**
 * Visual treatment of the button:
 * - `solid` (default) — flat filled button.
 * - `relief` — filled button sitting on a darker colour ledge; press sinks it
 *   down onto the ledge.
 * - `shadow` — surface lifted by a soft drop shadow.
 * - `floating` — filled button resting on a soft coloured glow shadow.
 * - `link` — no fill; renders like a text link (pair with `href` to open a URL).
 */
type ButtonVariant = 'solid' | 'relief' | 'shadow' | 'floating' | 'link'

/** Size scale — drives padding, font size, icon size and default corner radius. */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps {
  children?: ReactNode
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  /** Stretch to fill the available width. */
  readonly block?: boolean
  /** Square 1:1 button for a single icon (see `leftIcon`). */
  readonly iconOnly?: boolean
  /** Icon rendered before the label. */
  readonly leftIcon?: ReactNode
  /** Icon rendered after the label. */
  readonly rightIcon?: ReactNode
  /** Fully rounded (pill / circle) corners. */
  readonly circle?: boolean
  /** No corner radius. */
  readonly square?: boolean

  readonly isLoading?: boolean
  /** Animated progress sweep overlay (Vuesax-style upload). */
  readonly upload?: boolean

  readonly onPress?: () => void
  /** When set, the press opens this URL (link button). */
  readonly href?: string

  readonly width?: number
  readonly height?: number
  readonly backgroundColor?: string
  readonly gradientColors?: string[]
  /** `relief` only — the ledge colour. Defaults to a darker shade of the fill. */
  readonly reliefColor?: string
  /** `relief` only — how far the button sits above the ledge (px). Default 4. */
  readonly reliefDepth?: number

  readonly loadingTextBackgroundColor?: string
  readonly loadingText?: string
  readonly loadingTextColor?: string
  readonly loadingTextSize?: number
  readonly showLoadingIndicator?: boolean
  readonly renderLoadingIndicator?: () => ReactNode

  readonly borderRadius?: number
  readonly style?: StyleProp<ViewStyle>
  readonly loadingTextStyle?: StyleProp<TextStyle>
  readonly withPressAnimation?: boolean
  readonly animationDuration?: number
  readonly disabled?: boolean
  readonly accessibilityLabel?: string
}

interface ButtonGroupProps {
  children: ReactNode
  /** Thin dividers between the buttons. */
  readonly divided?: boolean
  /** Outer corner radius of the group. Default 12. */
  readonly borderRadius?: number
  /** Lay the buttons out in a column instead of a row. */
  readonly vertical?: boolean
  readonly dividerColor?: string
  readonly style?: StyleProp<ViewStyle>
}

export type { ButtonProps, ButtonGroupProps, ButtonVariant, ButtonSize }
