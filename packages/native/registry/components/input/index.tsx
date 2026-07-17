/**
 * Input — FusionUI mobile text field, mirroring the web FInput / FField:
 *   variants (default · underlined · shadow), state tints, prepend/append icon
 *   cards that lift out on focus, floating & pinned labels, clearable, loading,
 *   password reveal, a strength/progress bar, and hint / error / success messages.
 * Copy-in source: you own this file after `fusionui add input`.
 */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
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
import type { InputProps } from './types'

const AnimatedText = Animated.createAnimatedComponent(Text)

const InputComponent: React.FC<InputProps> = ({
  value = '',
  onChangeText,
  variant = 'default',
  state,
  color,
  label,
  labelPlaceholder = false,
  placeholder,
  prependIcon,
  appendIcon,
  clearable = false,
  loading = false,
  secureTextEntry = false,
  hint,
  persistentHint = false,
  errorMessage,
  successMessage,
  progress = 0,
  square = false,
  transparent = false,
  disabled = false,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  returnKeyType,
  maxLength,
  onSubmitEditing,
  onFocus,
  onBlur,
  style,
  inputStyle,
  testID,
}) => {
  const [focused, setFocused] = useState(false)
  const [reveal, setReveal] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const validationState = errorMessage ? 'danger' : successMessage ? 'success' : undefined
  const activeState = validationState ?? state
  const tinted = !!activeState
  const accent = activeState ? STATE_COLORS[activeState] : (color ?? PALETTE.primary)
  const colored = !!(activeState || color)
  const hasValue = value.length > 0
  const active = focused || hasValue

  const floating = labelPlaceholder && !!label
  const pinned = !!label && !floating
  const hasPrepend = !!prependIcon
  const showReveal = secureTextEntry && !appendIcon
  const showClear = clearable && active && !loading
  const hasAfter = !!(appendIcon || loading || showClear || showReveal)

  const focusSV = useSharedValue(0)
  const labelSV = useSharedValue(active ? 1 : 0)
  useEffect(() => {
    focusSV.value = withTiming(focused ? 1 : 0, { duration: 200 })
  }, [focused])
  useEffect(() => {
    labelSV.value = withTiming(active ? 1 : 0, { duration: 180 })
  }, [active])

  const cardBg = tinted ? rgba(accent, 0.12) : PALETTE.fill

  const controlAnim = useAnimatedStyle(() => {
    let backgroundColor: string
    if (tinted) {
      backgroundColor = interpolateColor(
        focusSV.value,
        [0, 1],
        [rgba(accent, 0.12), rgba(accent, 0.16)]
      )
    } else if (variant === 'default') {
      backgroundColor = interpolateColor(focusSV.value, [0, 1], [PALETTE.fill, PALETTE.fillFocus])
    } else if (variant === 'shadow') {
      backgroundColor = PALETTE.surface
    } else {
      backgroundColor = 'transparent'
    }
    return {
      backgroundColor,
      transform:
        variant === 'shadow' ? [{ translateY: interpolate(focusSV.value, [0, 1], [0, 2]) }] : [],
      shadowOpacity: variant === 'shadow' ? interpolate(focusSV.value, [0, 1], [0.12, 0.42]) : 0,
    }
  })

  const prependAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(focusSV.value, [0, 1], [0, -8]) },
      { translateY: interpolate(focusSV.value, [0, 1], [0, -9]) },
    ],
    shadowOpacity: interpolate(focusSV.value, [0, 1], [0, 0.28]),
  }))
  const appendAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(focusSV.value, [0, 1], [0, 8]) },
      { translateY: interpolate(focusSV.value, [0, 1], [0, -9]) },
    ],
    shadowOpacity: interpolate(focusSV.value, [0, 1], [0, 0.28]),
  }))

  const underlineAnim = useAnimatedStyle(() => ({
    width: `${interpolate(focusSV.value, [0, 1], [0, 100])}%`,
  }))

  const labelFloatColor = colored && focused ? accent : PALETTE.labelActive
  const labelAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(labelSV.value, [0, 1], [0, -26]) }],
    fontSize: interpolate(labelSV.value, [0, 1], [14, 11]),
    color: interpolateColor(labelSV.value, [0, 1], [PALETTE.placeholder, labelFloatColor]),
  }))

  const controlStatic = useMemo<TextStyle>(() => {
    const base: any = {
      borderRadius: square ? 0 : 12,
      borderWidth: 2,
      borderColor: 'transparent',
    }
    if (variant === 'underlined') {
      base.borderRadius = 0
      base.paddingHorizontal = 0
    }
    if (variant === 'shadow') {
      base.shadowColor = focused ? accent : '#0b1220'
      base.shadowOffset = { width: 0, height: focused ? 8 : 4 }
      base.shadowRadius = focused ? 18 : 12
      base.elevation = focused ? 6 : 3
    }
    if (transparent) base.backgroundColor = 'transparent'
    // Default variant: coloured fields get a coloured bottom border on focus.
    if (variant === 'default' && colored && focused) base.borderBottomColor = accent
    return base
  }, [variant, square, transparent, colored, focused, accent])

  const inputColor = tinted ? accent : PALETTE.text
  const placeholderColor = tinted ? rgba(accent, 0.6) : PALETTE.placeholder

  const progressVal = Math.max(0, Math.min(100, progress))
  const progressColor =
    progressVal < 34
      ? STATE_COLORS.danger
      : progressVal < 67
        ? STATE_COLORS.warning
        : STATE_COLORS.success

  const message = errorMessage ?? successMessage ?? hint
  const showMessage = !!errorMessage || !!successMessage || (!!hint && (persistentHint || focused))
  const messageColor = errorMessage
    ? STATE_COLORS.danger
    : successMessage
      ? STATE_COLORS.success
      : PALETTE.hint

  return (
    <View
      style={[
        styles.root,
        (floating || pinned) && styles.rootLabelled,
        disabled && styles.disabled,
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
            styles.inputWrap,
            { paddingLeft: hasPrepend ? 34 : 0, paddingRight: hasAfter ? 36 : 0 },
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
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: inputColor }, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={floating ? undefined : placeholder}
            placeholderTextColor={placeholderColor}
            editable={!disabled}
            secureTextEntry={secureTextEntry && !reveal}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            returnKeyType={returnKeyType}
            maxLength={maxLength}
            onSubmitEditing={onSubmitEditing}
            onFocus={() => {
              setFocused(true)
              onFocus?.()
            }}
            onBlur={() => {
              setFocused(false)
              onBlur?.()
            }}
            testID={testID}
          />
        </View>

        {hasAfter && (
          <View style={styles.after}>
            {loading && <ActivityIndicator size="small" color={accent} />}
            {showClear && (
              <Pressable onPress={() => onChangeText?.('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={PALETTE.placeholder} />
              </Pressable>
            )}
            {showReveal && (
              <Pressable onPress={() => setReveal(r => !r)} hitSlop={8}>
                <Ionicons
                  name={reveal ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={PALETTE.placeholder}
                />
              </Pressable>
            )}
            {appendIcon && (
              <Animated.View
                style={[styles.card, styles.appendCard, { backgroundColor: cardBg }, appendAnim]}
              >
                {appendIcon}
              </Animated.View>
            )}
          </View>
        )}

        {variant === 'underlined' && (
          <View style={styles.lineTrack}>
            <Animated.View
              style={[styles.lineAccent, { backgroundColor: accent }, underlineAnim]}
            />
          </View>
        )}
      </Animated.View>

      {progressVal > 0 && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressVal}%`, backgroundColor: progressColor },
            ]}
          />
        </View>
      )}

      {showMessage && (
        <Text style={[styles.message, { color: messageColor }]} numberOfLines={2}>
          {message}
        </Text>
      )}
    </View>
  )
}

export const Input = memo(InputComponent)
export default Input

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

  inputWrap: { flex: 1, justifyContent: 'center' },
  input: {
    paddingVertical: 8,
    fontSize: 15,
    padding: 0,
  },

  label: {
    position: 'absolute',
    top: 10,
    fontSize: 14,
    color: PALETTE.placeholder,
  },
  labelPinned: {
    top: -16,
    left: 2,
    fontSize: 11,
    color: PALETTE.labelActive,
  },

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

  progressTrack: {
    height: 3,
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(43,52,64,0.1)',
    overflow: 'hidden',
  },
  progressBar: { height: 3, borderRadius: 3 },

  message: {
    marginTop: 5,
    paddingHorizontal: 6,
    fontSize: 12,
  },
})
