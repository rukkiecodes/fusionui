import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

type AutocompleteVariant = 'default' | 'underlined' | 'shadow'
type AutocompleteState = 'success' | 'danger' | 'warning' | 'primary' | 'dark'

/** A plain value, an object with title/value, or a non-selectable group header. */
type AutocompleteItem =
  | string
  | number
  | ({ header: string } & Record<string, unknown>)
  | Record<string, unknown>

/** Return true to keep the option. Mirrors the web `customFilter`. */
type AutocompleteFilter = (title: string, query: string, raw: unknown) => boolean

interface AutocompleteProps {
  value?: unknown
  onChange?: (value: unknown) => void
  items: AutocompleteItem[]
  /** Object key for the option label. Default 'title'. */
  itemTitle?: string
  /** Object key for the option value. Default 'value'. */
  itemValue?: string

  /** The typed query, as it changes — what a server-side filter listens to. */
  onSearchChange?: (query: string) => void
  /** Skip local filtering; `items` is already filtered (server-side search). */
  noFilter?: boolean
  /** Replace the default case-insensitive "title contains query" test. */
  customFilter?: AutocompleteFilter
  /** Highlight the first match as soon as the user types. */
  autoSelectFirst?: boolean
  /** Shown when the query matches nothing. Default 'No matching results'. */
  noDataText?: string

  variant?: AutocompleteVariant
  state?: AutocompleteState
  color?: string

  label?: string
  labelPlaceholder?: boolean
  placeholder?: string

  /** Select many values (rendered as chips). */
  multiple?: boolean
  /** Collapse a multiple selection to two chips + a "+N" counter. */
  collapseChips?: boolean
  clearable?: boolean
  loading?: boolean
  square?: boolean
  disabled?: boolean
  /** Show the value but refuse edits — the menu never opens. */
  readonly?: boolean

  prependIcon?: ReactNode
  hint?: string
  persistentHint?: boolean
  errorMessage?: string
  successMessage?: string

  style?: StyleProp<ViewStyle>
  /** Max height of the suggestion menu. Default 240. */
  menuMaxHeight?: number
}

export type {
  AutocompleteProps,
  AutocompleteVariant,
  AutocompleteState,
  AutocompleteItem,
  AutocompleteFilter,
}
