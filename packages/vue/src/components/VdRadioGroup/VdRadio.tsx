import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { VdRadioGroupSymbol } from './key'

export const makeVdRadioProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: String as PropType<string>,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'VdRadio'
)

export const VdRadio = genericComponent()({
  name: 'VdRadio',
  props: makeVdRadioProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    const group = inject(VdRadioGroupSymbol, null)
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
            'vd-radio',
            'vd-selection-control',
            {
              'vd-selection-control--checked': isChecked.value,
              'vd-selection-control--disabled': isDisabled.value,
            },
            props.class,
          ],
          style: [{ '--vd-control-color': `var(--vd-theme-${color.value})` }, props.style],
        },
        [
          h('input', {
            class: 'vd-selection-control__input',
            type: 'radio',
            name: group?.name,
            checked: isChecked.value,
            disabled: isDisabled.value,
            onChange: select,
          }),
          h('span', { class: 'vd-selection-control__box vd-radio__circle' }, [
            h('span', { class: 'vd-radio__dot' }),
          ]),
          slots.default || props.label
            ? h('span', { class: 'vd-selection-control__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
