import { computed, h, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { getUid } from '../../util/helpers'
import { FRadioGroupSymbol } from './key'

export const makeFRadioGroupProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    inline: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FRadioGroup'
)

export const FRadioGroup = genericComponent()({
  name: 'FRadioGroup',
  props: makeFRadioGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)

    provide(FRadioGroupSymbol, {
      modelValue: computed(() => model.value),
      name: `fui-radio-${getUid()}`,
      color: toRef(() => props.color),
      disabled: toRef(() => props.disabled),
      select: (value: unknown) => {
        model.value = value
      },
    })

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-radio-group', { 'fui-radio-group--inline': props.inline }, props.class],
          style: props.style,
          role: 'radiogroup',
        },
        [
          props.label ? h('span', { class: 'fui-radio-group__label' }, props.label) : null,
          h('div', { class: 'fui-radio-group__items' }, slots.default?.()),
        ]
      )
    )
  },
})
