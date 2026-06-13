import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { VdBtn } from '../VdBtn'

export const makeVdInputNumberProps = propsFactory(
  {
    modelValue: { type: [Number, String] as PropType<number | string>, default: 0 },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    step: { type: Number, default: 1 },
    color: String as PropType<string>,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdInputNumber'
)

export const VdInputNumber = genericComponent()({
  name: 'VdInputNumber',
  props: makeVdInputNumberProps(),
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', 0)
    const numeric = computed(() => Number(model.value) || 0)

    function clamp(v: number): number {
      return Math.min(props.max, Math.max(props.min, v))
    }
    function step(direction: number): void {
      if (props.disabled) return
      model.value = clamp(numeric.value + direction * props.step)
    }

    useRender(() =>
      h(
        'div',
        {
          class: ['vd-input-number', { 'vd-input-number--disabled': props.disabled }, props.class],
          style: props.style,
        },
        [
          h(VdBtn, {
            class: 'vd-input-number__btn',
            icon: '$decrement',
            variant: 'tonal',
            color: props.color,
            size: 'small',
            disabled: props.disabled || numeric.value <= props.min,
            onClick: () => step(-1),
          }),
          h('input', {
            class: 'vd-input-number__el',
            type: 'number',
            value: numeric.value,
            disabled: props.disabled,
            onInput: (e: Event) => {
              model.value = clamp(Number((e.target as HTMLInputElement).value) || 0)
            },
          }),
          h(VdBtn, {
            class: 'vd-input-number__btn',
            icon: '$increment',
            variant: 'tonal',
            color: props.color,
            size: 'small',
            disabled: props.disabled || numeric.value >= props.max,
            onClick: () => step(1),
          }),
        ]
      )
    )
  },
})
