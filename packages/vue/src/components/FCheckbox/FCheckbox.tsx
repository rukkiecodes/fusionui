import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'

export const makeFCheckboxProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: false },
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    indeterminate: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCheckbox'
)

export const FCheckbox = genericComponent()({
  name: 'FCheckbox',
  props: makeFCheckboxProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', false)

    const isChecked = computed(() =>
      Array.isArray(model.value) ? model.value.includes(props.value) : !!model.value
    )

    function toggle(): void {
      if (props.disabled) return
      if (Array.isArray(model.value)) {
        const next = [...model.value]
        const index = next.indexOf(props.value)
        if (index > -1) next.splice(index, 1)
        else next.push(props.value)
        model.value = next
      } else {
        model.value = !model.value
      }
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-checkbox',
            'fui-selection-control',
            {
              'fui-selection-control--checked': isChecked.value,
              'fui-selection-control--indeterminate': props.indeterminate,
              'fui-selection-control--disabled': props.disabled,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': `var(--fui-theme-${props.color})` }, props.style],
        },
        [
          h('input', {
            class: 'fui-selection-control__input',
            type: 'checkbox',
            checked: isChecked.value,
            disabled: props.disabled,
            onChange: toggle,
          }),
          h('span', { class: 'fui-selection-control__box fui-checkbox__box' }, [
            h('svg', { viewBox: '0 0 24 24', class: 'fui-checkbox__mark' }, [
              props.indeterminate
                ? h('path', { d: 'M6 12h12' })
                : h('path', { d: 'M5 12l5 5L20 7' }),
            ]),
          ]),
          slots.default || props.label
            ? h('span', { class: 'fui-selection-control__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
