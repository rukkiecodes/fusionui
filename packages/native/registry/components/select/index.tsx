/**
 * Select — FusionUI mobile select, mirroring the web FSelect (which is built on
 * the same field shell as the Input): variants (default · underlined · shadow),
 * state tints, prepend + dropdown icon cards that lift on open, floating & pinned
 * labels, single or multiple (chips, collapsible), a filter search box, group
 * headers, clearable, loading, and hint / error / success messages.
 * Copy-in source: you own this file after `fusionui add select`.
 */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Modal,
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
import type { SelectProps } from './types'

const AnimatedText = Animated.createAnimatedComponent(Text)

interface NormalizedItem {
  title?: string
  value?: unknown
  header?: string
}

const SelectComponent: React.FC<SelectProps> = ({
  value,
  onChange,
  items,
  itemTitle = 'title',
  itemValue = 'value',
  variant = 'default',
  state,
  color,
  label,
  labelPlaceholder = false,
  placeholder = 'Select…',
  multiple = false,
  collapseChips = false,
  filter = false,
  clearable = false,
  loading = false,
  square = false,
  disabled = false,
  prependIcon,
  hint,
  persistentHint = false,
  errorMessage,
  successMessage,
  style,
  menuMaxHeight = 280,
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number }>()
  const triggerRef = useRef<View>(null)

  const validationState = errorMessage ? 'danger' : successMessage ? 'success' : undefined
  const activeState = validationState ?? state
  const tinted = !!activeState
  const accent = activeState ? STATE_COLORS[activeState] : (color ?? PALETTE.primary)
  const colored = !!(activeState || color)

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
            }
          : { title: String(item), value: item }
      }),
    [items, itemTitle, itemValue]
  )

  const visibleItems = useMemo<NormalizedItem[]>(() => {
    const q = filter ? query.trim().toLowerCase() : ''
    const matched = normalized.filter(
      it => it.header !== undefined || !q || (it.title ?? '').toLowerCase().includes(q)
    )
    // Drop group headers that end up with no visible item beneath them.
    return matched.filter((it, i) => {
      if (it.header === undefined) return true
      for (let j = i + 1; j < matched.length; j++) {
        if (matched[j].header !== undefined) break
        return true
      }
      return false
    })
  }, [normalized, filter, query])

  const selectedValues = useMemo<unknown[]>(
    () => (multiple ? (Array.isArray(value) ? value : []) : value != null ? [value] : []),
    [multiple, value]
  )
  const isActive = selectedValues.length > 0
  const collapsed = multiple && collapseChips && selectedValues.length > 2
  const chipValues = collapsed ? selectedValues.slice(0, 2) : selectedValues

  const titleFor = (v: unknown): string => normalized.find(o => o.value === v)?.title ?? String(v)
  const isSelected = (opt: NormalizedItem) => selectedValues.includes(opt.value)

  const hasOptions = visibleItems.some(it => it.header === undefined)
  const active = isActive || open

  const floating = labelPlaceholder && !!label
  const pinned = !!label && !floating
  const hasPrepend = !!prependIcon
  const showClear = clearable && isActive && !loading

  const openSV = useSharedValue(0)
  const labelSV = useSharedValue(active ? 1 : 0)
  useEffect(() => {
    openSV.value = withTiming(open ? 1 : 0, { duration: 200 })
  }, [open])
  useEffect(() => {
    labelSV.value = withTiming(active ? 1 : 0, { duration: 180 })
  }, [active])

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

  const labelFloatColor = colored && open ? accent : PALETTE.labelActive
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
    if (multiple) {
      const next = [...selectedValues]
      const i = next.indexOf(opt.value)
      if (i > -1) next.splice(i, 1)
      else next.push(opt.value)
      onChange?.(next)
    } else {
      onChange?.(opt.value)
      close()
    }
  }
  const close = () => {
    setOpen(false)
    setQuery('')
  }
  const openMenu = () => {
    if (disabled) return
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setOpen(true)
    })
  }

  const progressColor = accent
  const message = errorMessage ?? successMessage ?? hint
  const showMessage = !!errorMessage || !!successMessage || (!!hint && (persistentHint || open))
  const messageColor = errorMessage
    ? STATE_COLORS.danger
    : successMessage
      ? STATE_COLORS.success
      : PALETTE.hint
  const selectionColor = tinted ? accent : PALETTE.text

  return (
    <View
      style={[
        styles.root,
        (floating || pinned) && styles.rootLabelled,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Pressable onPress={openMenu} disabled={disabled}>
        <Animated.View
          ref={triggerRef as never}
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

            {!isActive ? (
              <Text
                style={[
                  styles.placeholder,
                  { color: tinted ? rgba(accent, 0.6) : PALETTE.placeholder },
                ]}
                numberOfLines={1}
              >
                {floating ? '' : placeholder}
              </Text>
            ) : multiple ? (
              <View style={styles.chips}>
                {chipValues.map(v => (
                  <View
                    key={String(v)}
                    style={[styles.chip, { backgroundColor: rgba(accent, 0.14) }]}
                  >
                    <Text style={[styles.chipText, { color: accent }]} numberOfLines={1}>
                      {titleFor(v)}
                    </Text>
                    <Pressable onPress={() => selectItem({ value: v })} hitSlop={6}>
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
              </View>
            ) : (
              <Text style={[styles.selection, { color: selectionColor }]} numberOfLines={1}>
                {titleFor(value)}
              </Text>
            )}
          </View>

          <View style={styles.after}>
            {loading && <ActivityIndicator size="small" color={accent} />}
            {showClear && (
              <Pressable onPress={() => onChange?.(multiple ? [] : undefined)} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={PALETTE.placeholder} />
              </Pressable>
            )}
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
          </View>

          {variant === 'underlined' && (
            <View style={styles.lineTrack}>
              <Animated.View
                style={[styles.lineAccent, { backgroundColor: accent }, underlineAnim]}
              />
            </View>
          )}
        </Animated.View>
      </Pressable>

      {showMessage && (
        <Text style={[styles.message, { color: messageColor }]} numberOfLines={2}>
          {message}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close} />
        {anchor && (
          <View
            style={[
              styles.menu,
              {
                top: anchor.y + anchor.height + 4,
                left: anchor.x,
                width: anchor.width,
                maxHeight: menuMaxHeight,
              },
            ]}
          >
            {filter && (
              <View style={styles.search}>
                <Ionicons name="search" size={15} color={PALETTE.placeholder} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search…"
                  placeholderTextColor={PALETTE.placeholder}
                  autoFocus
                />
              </View>
            )}
            {loading ? (
              <Text style={styles.empty}>Loading…</Text>
            ) : !hasOptions ? (
              <Text style={styles.empty}>No options</Text>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
                {visibleItems.map((opt, i) =>
                  opt.header !== undefined ? (
                    <Text key={`h${i}`} style={styles.groupTitle}>
                      {opt.header}
                    </Text>
                  ) : (
                    <Pressable
                      key={String(opt.value)}
                      onPress={() => selectItem(opt)}
                      style={({ pressed }) => [
                        styles.option,
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
                      {isSelected(opt) && (
                        <Ionicons name="checkmark" size={17} color={progressColor} />
                      )}
                    </Pressable>
                  )
                )}
              </ScrollView>
            )}
          </View>
        )}
      </Modal>
    </View>
  )
}

export const Select = memo(SelectComponent)
export default Select

const styles = StyleSheet.create({
  root: { width: '100%' },
  rootLabelled: { paddingTop: 18 },
  disabled: { opacity: 0.5 },

  control: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  controlUnderlined: { minHeight: 38 },

  selectionWrap: { flex: 1, justifyContent: 'center', minHeight: 24 },
  placeholder: { fontSize: 15 },
  selection: { fontSize: 15 },

  label: { position: 'absolute', top: 10, fontSize: 14, color: PALETTE.placeholder },
  labelPinned: { top: -16, left: 2, fontSize: 11, color: PALETTE.labelActive },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingVertical: 4 },
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

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.06)' },
  menu: {
    position: 'absolute',
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(11,18,32,0.1)',
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: PALETTE.text, padding: 0 },
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
