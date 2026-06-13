import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FRadioGroupSymbol } from './key'

export const makeVdRadioProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: String as PropType<string>,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'FRadio'
)

export const FRadio = genericComponent()({
  name: 'FRadio',
  props: makeVdRadioProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    const group = inject(FRadioGroupSymbol, null)
    const standalone = useProxiedModel(props, 'modelValue', undefined)

    const isChecked = computed(() =>
      group ? group.modelValue.value === props.value : standalone.value === props.value
    )
    const color = computed(() => props.color ?? group?.color.value ?? 'primary')
    const isDisabled = computed(() => props.disabled || !!group?.disabled.value)

    function select(): void {
      if (isDisabled.value) return
      if (group) group.select(props.value)
      else standalone.value = props.value
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-radio',
            'fui-selection-control',
            {
              'fui-selection-control--checked': isChecked.value,
              'fui-selection-control--disabled': isDisabled.value,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': `var(--fui-theme-${color.value})` }, props.style],
        },
        [
          h('input', {
            class: 'fui-selection-control__input',
            type: 'radio',
            name: group?.name,
            checked: isChecked.value,
            disabled: isDisabled.value,
            onChange: select,
          }),
          h('span', { class: 'fui-selection-control__box fui-radio__circle' }, [
            h('span', { class: 'fui-radio__dot' }),
          ]),
          slots.default || props.label
            ? h('span', { class: 'fui-selection-control__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
