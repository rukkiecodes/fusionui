import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'

export const makeVdSliderProps = propsFactory(
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
  'VdSlider'
)

export const VdSlider = genericComponent()({
  name: 'VdSlider',
  props: makeVdSliderProps(),
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', 0)
    const trackRef = ref<HTMLElement | null>(null)

    const numeric = computed(() => Number(model.value) || 0)
    const percent = computed(() => {
      const range = props.max - props.min || 1
      return Math.min(100, Math.max(0, ((numeric.value - props.min) / range) * 100))
    })

    function roundToStep(value: number): number {
      const stepped = Math.round((value - props.min) / props.step) * props.step + props.min
      return Math.min(props.max, Math.max(props.min, Number(stepped.toFixed(6))))
    }

    function setFromClientX(clientX: number): void {
      const el = trackRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      model.value = roundToStep(props.min + ratio * (props.max - props.min))
    }

    function onPointerdown(e: PointerEvent): void {
      if (props.disabled) return
      setFromClientX(e.clientX)
      const move = (ev: PointerEvent) => setFromClientX(ev.clientX)
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    }

    function onKeydown(e: KeyboardEvent): void {
      if (props.disabled) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        model.value = roundToStep(numeric.value + props.step)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        model.value = roundToStep(numeric.value - props.step)
      }
    }

    useRender(() =>
      h(
        'div',
        {
          class: ['vd-slider', { 'vd-slider--disabled': props.disabled }, props.class],
          style: [{ '--vd-slider-color': `var(--vd-theme-${props.color})` }, props.style],
        },
        [
          h('div', { class: 'vd-slider__track', ref: trackRef, onPointerdown }, [
            h('div', { class: 'vd-slider__fill', style: { width: `${percent.value}%` } }),
            h('div', {
              class: 'vd-slider__thumb',
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
