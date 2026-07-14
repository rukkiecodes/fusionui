import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { clamp, roundToStep, toPercent, trackPointer, valueFromClientX } from '../FSlider/shared'

type Thumb = 0 | 1

export const makeFRangeSliderProps = propsFactory(
  {
    /** The `[lower, upper]` pair. */
    modelValue: {
      type: Array as unknown as PropType<number[]>,
      default: () => [0, 100],
    },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    /** Stop the thumbs meeting — they must stay at least one step apart. */
    strict: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    disabled: Boolean,
    /** Spoken names for the two thumbs. */
    thumbLabels: {
      type: Array as unknown as PropType<string[]>,
      default: () => ['Lower bound', 'Upper bound'],
    },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FRangeSlider'
)

/**
 * A two-thumb slider selecting a `[lower, upper]` range.
 *
 * The thumbs cannot cross: each is clamped by the other (`strict` keeps a step
 * of clear air between them). Both are real `role="slider"` handles with their
 * own spoken name, so the range is announced as two distinct values rather than
 * one anonymous pair, and each is keyboard operable (arrows step, Home/End jump).
 */
export const FRangeSlider = genericComponent()({
  name: 'FRangeSlider',
  props: makeFRangeSliderProps(),
  emits: { 'update:modelValue': (_v: number[]) => true },
  setup(props: any) {
    provideTheme(props)

    const model = useProxiedModel(props, 'modelValue', [0, 100], (v: unknown) => {
      const pair = Array.isArray(v) ? v : [0, 100]
      return [Number(pair[0]) || 0, Number(pair[1]) || 0]
    })

    const trackRef = ref<HTMLElement | null>(null)
    const scale = computed(() => ({ min: props.min, max: props.max, step: props.step }))

    const lower = computed(() => model.value[0])
    const upper = computed(() => model.value[1])

    const percents = computed(() => [
      toPercent(lower.value, scale.value),
      toPercent(upper.value, scale.value),
    ])

    /** Gap the thumbs must keep between them — one step when `strict`. */
    const gap = computed(() => (props.strict ? props.step : 0))

    /** Writes one thumb, clamped so it can never pass the other. */
    function setThumb(thumb: Thumb, raw: number): void {
      const value = roundToStep(raw, scale.value)

      const next: number[] =
        thumb === 0
          ? [clamp(value, props.min, upper.value - gap.value), upper.value]
          : [lower.value, clamp(value, lower.value + gap.value, props.max)]

      model.value = next
    }

    /** The thumb nearest the pointer — so grabbing the track moves the right one. */
    function nearestThumb(value: number): Thumb {
      return Math.abs(value - lower.value) <= Math.abs(value - upper.value) ? 0 : 1
    }

    function onTrackPointerdown(e: PointerEvent): void {
      if (props.disabled) return
      const el = trackRef.value
      if (!el) return

      const value = valueFromClientX(el, e.clientX, scale.value)
      const thumb = nearestThumb(value)
      setThumb(thumb, value)

      trackPointer(clientX => {
        setThumb(thumb, valueFromClientX(el, clientX, scale.value))
      })
    }

    function onThumbPointerdown(thumb: Thumb, e: PointerEvent): void {
      if (props.disabled) return
      // Stop the track handler also picking a thumb for this same press.
      e.stopPropagation()
      const el = trackRef.value
      if (!el) return

      trackPointer(clientX => {
        setThumb(thumb, valueFromClientX(el, clientX, scale.value))
      })
    }

    function onKeydown(thumb: Thumb, e: KeyboardEvent): void {
      if (props.disabled) return
      const current = thumb === 0 ? lower.value : upper.value

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          setThumb(thumb, current + props.step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          setThumb(thumb, current - props.step)
          break
        case 'Home':
          setThumb(thumb, props.min)
          break
        case 'End':
          setThumb(thumb, props.max)
          break
        default:
          return
      }

      e.preventDefault()
    }

    function renderThumb(thumb: Thumb) {
      const value = thumb === 0 ? lower.value : upper.value
      // Each thumb's range is bounded by the other — report that, not the raw
      // min/max, so assistive tech describes the handle's true travel.
      const min = thumb === 0 ? props.min : lower.value + gap.value
      const max = thumb === 0 ? upper.value - gap.value : props.max

      return h('div', {
        class: 'fui-range-slider__thumb',
        style: { left: `${percents.value[thumb]}%` },
        tabindex: props.disabled ? -1 : 0,
        role: 'slider',
        'aria-label': props.thumbLabels[thumb],
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': props.disabled || undefined,
        onPointerdown: (e: PointerEvent) => onThumbPointerdown(thumb, e),
        onKeydown: (e: KeyboardEvent) => onKeydown(thumb, e),
      })
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-range-slider',
            { 'fui-range-slider--disabled': props.disabled },
            props.class,
          ],
          style: [{ '--fui-slider-color': `var(--fui-theme-${props.color})` }, props.style],
        },
        [
          h(
            'div',
            { class: 'fui-range-slider__track', ref: trackRef, onPointerdown: onTrackPointerdown },
            [
              h('div', {
                class: 'fui-range-slider__fill',
                style: {
                  left: `${percents.value[0]}%`,
                  width: `${percents.value[1] - percents.value[0]}%`,
                },
              }),
              renderThumb(0),
              renderThumb(1),
            ]
          ),
        ]
      )
    )
  },
})
