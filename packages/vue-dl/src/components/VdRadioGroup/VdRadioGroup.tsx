import { computed, h, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { getUid } from '../../util/helpers'
import { VdRadioGroupSymbol } from './key'

export const makeVdRadioGroupProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    inline: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdRadioGroup'
)

export const VdRadioGroup = genericComponent()({
  name: 'VdRadioGroup',
  props: makeVdRadioGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)

    provide(VdRadioGroupSymbol, {
      modelValue: computed(() => model.value),
      name: `vd-radio-${getUid()}`,
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
          class: ['vd-radio-group', { 'vd-radio-group--inline': props.inline }, props.class],
          style: props.style,
          role: 'radiogroup',
        },
        [
          props.label ? h('span', { class: 'vd-radio-group__label' }, props.label) : null,
          h('div', { class: 'vd-radio-group__items' }, slots.default?.()),
        ]
      )
    )
  },
})
