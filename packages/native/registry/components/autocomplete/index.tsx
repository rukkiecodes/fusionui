/**
 * Autocomplete — FusionUI mobile autocomplete, mirroring the web FAutocomplete:
 * a select whose menu filters as you type. The value is always one of `items` —
 * text that never matched an option is reverted when the field is left.
 * Built on the same field shell as the Input and Select: variants
 * (default · underlined · shadow), state tints, prepend + chevron icon cards
 * that lift on open, floating & pinned labels, single or multiple (collapsible
 * chips), clearable, loading, and hint / error / success messages.
 * Copy-in source: you own this file after `fusionui add autocomplete`.
 */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  type TextStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { PALETTE, STATE_COLORS, rgba } from './const'
import type { AutocompleteProps } from './types'

const AnimatedText = Animated.createAnimatedComponent(Text)

interface NormalizedItem {
  title?: string
  value?: unknown
  header?: string
  raw?: unknown
}

const AutocompleteComponent: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  items,
  itemTitle = 'title',
  itemValue = 'value',
  onSearchChange,
  noFilter = false,
  customFilter,
  autoSelectFirst = false,
  noDataText = 'No matching results',
  variant = 'default',
  state,
  color,
  label,
  labelPlaceholder = false,
  placeholder = 'Search…',
  multiple = false,
  collapseChips = false,
  clearable = false,
  loading = false,
  square = false,
  disabled = false,
  readonly = false,
  prependIcon,
  hint,
  persistentHint = false,
  errorMessage,
  successMessage,
  style,
  menuMaxHeight = 240,
}) => {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [search, setSearch] = useState('')
  // `dirty` gates filtering: until the user types, the menu shows every option
  // even though the field already holds the selected item's title.
  const [dirty, setDirty] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<TextInput>(null)
  // Pressing an option blurs the field first. If blur closed the menu straight
  // away the row would unmount before its press landed, so the close+revert is
  // deferred by a frame or two and cancelled when a selection comes in.
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validationState = errorMessage ? 'danger' : successMessage ? 'success' : undefined
  const activeState = validationState ?? state
  const tinted = !!activeState
  const accent = activeState ? STATE_COLORS[activeState] : (color ?? PALETTE.primary)
  const colored = !!(activeState || color)
  const inactive = disabled || readonly

  const normalized = useMemo<NormalizedItem[]>(
    () =>
      items.map(item => {
        if (item != null && typeof item === 'object' && 'header' in item) {
          return { header: String((item as Record<string, unknown>).header) }
        }
        return item != null && typeof item === 'object'
          ? {
              title: String((item as Record<string, unknown>)[itemTitle]),
              value: (item as Record<string, unknown>)[itemValue],
              raw: item,
            }
          : { title: String(item), value: item, raw: item }
      }),
    [items, itemTitle, itemValue]
  )

  const query = dirty ? search.trim() : ''

  const visibleItems = useMemo<NormalizedItem[]>(() => {
    const matched =
      noFilter || !query
        ? normalized
        : normalized.filter(it => {
            if (it.header !== undefined) return true
            const title = it.title ?? ''
            if (customFilter) return !!customFilter(title, query, it.raw)
            return title.toLowerCase().includes(query.toLowerCase())
          })
    // Drop group headers that end up with no visible item beneath them.
    return matched.filter((it, i) => {
      if (it.header === undefined) return true
      for (let j = i + 1; j < matched.length; j++) {
        if (matched[j].header !== undefined) break
        return true
      }
      return false
    })
  }, [normalized, noFilter, query, customFilter])

  const options = useMemo(() => visibleItems.filter(it => it.header === undefined), [visibleItems])

  const selectedValues = useMemo<unknown[]>(
    () =>
      multiple ? (Array.isArray(value) ? value : []) : value != null && value !== '' ? [value] : [],
    [multiple, value]
  )
  const hasSelection = selectedValues.length > 0
  const collapsed = multiple && collapseChips && selectedValues.length > 2
  const chipValues = collapsed ? selectedValues.slice(0, 2) : selectedValues

  const titleFor = useCallback(
    (v: unknown): string =>
      normalized.find(o => o.header === undefined && o.value === v)?.title ?? String(v),
    [normalized]
  )
  const isSelected = (opt: NormalizedItem) => selectedValues.includes(opt.value)

  const clearBlurTimer = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
  }

  /** The field's text is always derived from the model unless the user is typing. */
  const syncSearch = useCallback(() => {
    setSearch(multiple ? '' : hasSelection ? titleFor(value) : '')
    setDirty(false)
  }, [multiple, hasSelection, titleFor, value])

  // The deferred blur below fires from an older closure, so it reads the revert
  // through a ref to pick up the freshest model.
  const syncRef = useRef(syncSearch)
  useEffect(() => {
    syncRef.current = syncSearch
  })

  // Reflect an externally-changed model while the user isn't typing.
  useEffect(() => {
    if (!focused) syncSearch()
  }, [value, focused, syncSearch])

  useEffect(() => () => clearBlurTimer(), [])

  // Keep the highlight in range, and honour `autoSelectFirst`.
  useEffect(() => {
    if (!open) {
      setActiveIndex(-1)
      return
    }
    if (autoSelectFirst && dirty && options.length) {
      setActiveIndex(0)
      return
    }
    setActiveIndex(i => (i >= options.length ? options.length - 1 : i))
  }, [open, autoSelectFirst, dirty, options.length])

  const isActive = focused || hasSelection || !!search
  const floating = labelPlaceholder && !!label
  const pinned = !!label && !floating
  const hasPrepend = !!prependIcon
  const showClear = clearable && hasSelection && !loading && !inactive

  const openSV = useSharedValue(0)
  const labelSV = useSharedValue(isActive ? 1 : 0)
  useEffect(() => {
    openSV.value = withTiming(open ? 1 : 0, { duration: 200 })
  }, [open])
  useEffect(() => {
    labelSV.value = withTiming(isActive ? 1 : 0, { duration: 180 })
  }, [isActive])

  const cardBg = tinted ? rgba(accent, 0.12) : PALETTE.fill

  const controlAnim = useAnimatedStyle(() => {
    let backgroundColor: string
    if (tinted) {
      backgroundColor = interpolateColor(
        openSV.value,
        [0, 1],
        [rgba(accent, 0.12), rgba(accent, 0.16)]
      )
    } else if (variant === 'default') {
      backgroundColor = interpolateColor(openSV.value, [0, 1], [PALETTE.fill, PALETTE.fillFocus])
    } else if (variant === 'shadow') {
      backgroundColor = PALETTE.surface
    } else {
      backgroundColor = 'transparent'
    }
    return {
      backgroundColor,
      transform:
        variant === 'shadow' ? [{ translateY: interpolate(openSV.value, [0, 1], [0, 2]) }] : [],
      shadowOpacity: variant === 'shadow' ? interpolate(openSV.value, [0, 1], [0.12, 0.42]) : 0,
    }
  })

  const prependAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(openSV.value, [0, 1], [0, -8]) },
      { translateY: interpolate(openSV.value, [0, 1], [0, -9]) },
    ],
    shadowOpacity: interpolate(openSV.value, [0, 1], [0, 0.28]),
  }))
  const chevronCardAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(openSV.value, [0, 1], [0, 8]) },
      { translateY: interpolate(openSV.value, [0, 1], [0, -9]) },
    ],
    shadowOpacity: interpolate(openSV.value, [0, 1], [0, 0.28]),
  }))
  const chevronAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(openSV.value, [0, 1], [0, 180])}deg` }],
  }))
  const underlineAnim = useAnimatedStyle(() => ({
    width: `${interpolate(openSV.value, [0, 1], [0, 100])}%`,
  }))

  const labelFloatColor = colored && focused ? accent : PALETTE.labelActive
  const labelAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(labelSV.value, [0, 1], [0, -26]) }],
    fontSize: interpolate(labelSV.value, [0, 1], [14, 11]),
    color: interpolateColor(labelSV.value, [0, 1], [PALETTE.placeholder, labelFloatColor]),
  }))

  const controlStatic = useMemo<TextStyle>(() => {
    const base: any = { borderRadius: square ? 0 : 12, borderWidth: 2, borderColor: 'transparent' }
    if (variant === 'underlined') {
      base.borderRadius = 0
      base.paddingHorizontal = 0
    }
    if (variant === 'shadow') {
      base.shadowColor = open ? accent : '#0b1220'
      base.shadowOffset = { width: 0, height: open ? 8 : 4 }
      base.shadowRadius = open ? 18 : 12
      base.elevation = open ? 6 : 3
    }
    if (variant === 'default' && colored && open) base.borderBottomColor = accent
    return base
  }, [variant, square, colored, open, accent])

  const selectItem = (opt: NormalizedItem) => {
    clearBlurTimer()
    if (multiple) {
      const next = [...selectedValues]
      const i = next.indexOf(opt.value)
      if (i > -1) next.splice(i, 1)
      else next.push(opt.value)
      onChange?.(next)
      setSearch('')
      setDirty(false)
      // Keep the menu up so more can be picked.
      inputRef.current?.focus()
    } else {
      onChange?.(opt.value)
      setSearch(opt.title ?? '')
      setDirty(false)
      setFocused(false)
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const onFocus = () => {
    clearBlurTimer()
    setFocused(true)
    if (!inactive) setOpen(true)
  }

  const onBlur = () => {
    clearBlurTimer()
    blurTimer.current = setTimeout(() => {
      setFocused(false)
      setOpen(false)
      // Text that never became a value is reverted: an autocomplete's value is
      // always one of its items.
      syncRef.current()
    }, 120)
  }

  const onChangeText = (text: string) => {
    setSearch(text)
    setDirty(true)
    setActiveIndex(-1)
    if (!inactive) setOpen(true)
    onSearchChange?.(text)
  }

  const clear = () => {
    onChange?.(multiple ? [] : undefined)
    setSearch('')
    setDirty(false)
  }

  const message = errorMessage ?? successMessage ?? hint
  const showMessage = !!errorMessage || !!successMessage || (!!hint && (persistentHint || focused))
  const messageColor = errorMessage
    ? STATE_COLORS.danger
    : successMessage
      ? STATE_COLORS.success
      : PALETTE.hint
  const textColor = tinted ? accent : PALETTE.text

  return (
    <View
      style={[
        styles.root,
        (floating || pinned) && styles.rootLabelled,
        disabled && styles.disabled,
        // The menu overlays whatever follows it.
        open && styles.rootOpen,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.control,
          variant === 'underlined' && styles.controlUnderlined,
          controlStatic,
          controlAnim,
        ]}
      >
        {hasPrepend && (
          <Animated.View
            style={[styles.card, styles.prepend, { backgroundColor: cardBg }, prependAnim]}
          >
            {prependIcon}
          </Animated.View>
        )}

        <View
          style={[
            styles.selectionWrap,
            { paddingLeft: hasPrepend ? 34 : 0, paddingRight: showClear ? 62 : 36 },
          ]}
        >
          {(floating || pinned) && (
            <AnimatedText
              style={[
                styles.label,
                { left: hasPrepend ? 34 : 2 },
                pinned ? styles.labelPinned : labelAnim,
              ]}
              numberOfLines={1}
              pointerEvents="none"
            >
              {label}
            </AnimatedText>
          )}

          <View style={styles.inputRow}>
            {multiple &&
              chipValues.map(v => (
                <View
                  key={String(v)}
                  style={[styles.chip, { backgroundColor: rgba(accent, 0.14) }]}
                >
                  <Text style={[styles.chipText, { color: accent }]} numberOfLines={1}>
                    {titleFor(v)}
                  </Text>
                  <Pressable
                    onPress={() => selectItem({ value: v })}
                    hitSlop={6}
                    disabled={inactive}
                  >
                    <Ionicons name="close" size={13} color={accent} />
                  </Pressable>
                </View>
              ))}
            {collapsed && (
              <View style={[styles.chip, { backgroundColor: rgba(accent, 0.14) }]}>
                <Text style={[styles.chipText, { color: accent }]}>
                  +{selectedValues.length - 2}
                </Text>
              </View>
            )}
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: textColor }]}
              value={search}
              onChangeText={onChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
              editable={!inactive}
              placeholder={floating && !isActive ? '' : placeholder}
              placeholderTextColor={tinted ? rgba(accent, 0.6) : PALETTE.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              accessibilityRole="search"
              accessibilityLabel={label}
            />
          </View>
        </View>

        <View style={styles.after}>
          {loading && <ActivityIndicator size="small" color={accent} />}
          {showClear && (
            <Pressable onPress={clear} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={PALETTE.placeholder} />
            </Pressable>
          )}
          <Pressable
            onPress={() => (open ? inputRef.current?.blur() : inputRef.current?.focus())}
            disabled={inactive}
          >
            <Animated.View
              style={[styles.card, styles.appendCard, { backgroundColor: cardBg }, chevronCardAnim]}
            >
              <Animated.View style={chevronAnim}>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colored && open ? accent : PALETTE.placeholder}
                />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>

        {variant === 'underlined' && (
          <View style={styles.lineTrack}>
            <Animated.View
              style={[styles.lineAccent, { backgroundColor: accent }, underlineAnim]}
            />
          </View>
        )}
      </Animated.View>

      {showMessage && (
        <Text style={[styles.message, { color: messageColor }]} numberOfLines={2}>
          {message}
        </Text>
      )}

      {open && (
        <View style={[styles.menu, { maxHeight: menuMaxHeight }]}>
          {loading ? (
            <Text style={styles.empty}>Loading…</Text>
          ) : !options.length ? (
            <Text style={styles.empty}>{noDataText}</Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="always" bounces={false}>
              {visibleItems.map((opt, i) => {
                if (opt.header !== undefined) {
                  return (
                    <Text key={`h${i}`} style={styles.groupTitle}>
                      {opt.header}
                    </Text>
                  )
                }
                const highlighted = autoSelectFirst && options.indexOf(opt) === activeIndex
                return (
                  <Pressable
                    key={String(opt.value)}
                    onPress={() => selectItem(opt)}
                    style={({ pressed }) => [
                      styles.option,
                      highlighted && { backgroundColor: rgba(accent, 0.06) },
                      isSelected(opt) && { backgroundColor: rgba(accent, 0.1) },
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected(opt) && { color: accent, fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {opt.title}
                    </Text>
                    {isSelected(opt) && <Ionicons name="checkmark" size={17} color={accent} />}
                  </Pressable>
                )
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  )
}

export const Autocomplete = memo(AutocompleteComponent)
export default Autocomplete

const styles = StyleSheet.create({
  root: { width: '100%' },
  rootLabelled: { paddingTop: 18 },
  rootOpen: { zIndex: 10, elevation: 10 },
  disabled: { opacity: 0.5 },

  control: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  controlUnderlined: { minHeight: 38 },

  selectionWrap: { flex: 1, justifyContent: 'center', minHeight: 24 },
  inputRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 5 },
  input: { flex: 1, minWidth: 60, fontSize: 15, padding: 0 },

  label: { position: 'absolute', top: 10, fontSize: 14, color: PALETTE.placeholder },
  labelPinned: { top: -16, left: 2, fontSize: 11, color: PALETTE.labelActive },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 9,
    paddingRight: 6,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: 150,
  },
  chipText: { fontSize: 12, fontWeight: '500' },

  card: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 10,
  },
  prepend: {
    position: 'absolute',
    left: 4,
    top: '50%',
    marginTop: -15,
    shadowOffset: { width: -6, height: 8 },
  },
  appendCard: { shadowOffset: { width: 6, height: 8 } },
  after: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  lineTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: PALETTE.line,
    alignItems: 'center',
  },
  lineAccent: { height: 2 },

  message: { marginTop: 5, paddingHorizontal: 6, fontSize: 12 },

  // Anchored under the control rather than portalled, so the field keeps focus
  // and the keyboard stays up while the list filters.
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  empty: { paddingVertical: 18, textAlign: 'center', color: PALETTE.placeholder, fontSize: 14 },
  groupTitle: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: PALETTE.placeholder,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  optionPressed: { backgroundColor: 'rgba(11,18,32,0.05)' },
  optionText: { fontSize: 15, color: PALETTE.text, flexShrink: 1 },
})
