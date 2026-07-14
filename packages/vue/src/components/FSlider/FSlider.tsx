import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { roundToStep, toPercent, trackPointer, valueFromClientX } from './shared'

export const makeFSliderProps = propsFactory(
  {
    modelValue: { type: [Number, String] as PropType<number | string>, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    color: { type: String as PropType<string>, default: 'primary' },
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSlider'
)

export const FSlider = genericComponent()({
  name: 'FSlider',
  props: makeFSliderProps(),
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', 0)
    const trackRef = ref<HTMLElement | null>(null)

    const scale = computed(() => ({ min: props.min, max: props.max, step: props.step }))
    const numeric = computed(() => Number(model.value) || 0)
    const percent = computed(() => toPercent(numeric.value, scale.value))

    function setFromClientX(clientX: number): void {
      const el = trackRef.value
      if (!el) return
      model.value = valueFromClientX(el, clientX, scale.value)
    }

    function onPointerdown(e: PointerEvent): void {
      if (props.disabled) return
      setFromClientX(e.clientX)
      trackPointer(setFromClientX)
    }

    function onKeydown(e: KeyboardEvent): void {
      if (props.disabled) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        model.value = roundToStep(numeric.value + props.step, scale.value)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        model.value = roundToStep(numeric.value - props.step, scale.value)
      }
    }

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-slider', { 'fui-slider--disabled': props.disabled }, props.class],
          style: [{ '--fui-slider-color': `var(--fui-theme-${props.color})` }, props.style],
        },
        [
          h('div', { class: 'fui-slider__track', ref: trackRef, onPointerdown }, [
            h('div', { class: 'fui-slider__fill', style: { width: `${percent.value}%` } }),
            h('div', {
              class: 'fui-slider__thumb',
              style: { left: `${percent.value}%` },
              tabindex: props.disabled ? -1 : 0,
              role: 'slider',
              'aria-valuemin': props.min,
              'aria-valuemax': props.max,
              'aria-valuenow': numeric.value,
              onKeydown,
            }),
          ]),
        ]
      )
    )
  },
})
