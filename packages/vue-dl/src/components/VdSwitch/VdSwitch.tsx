import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'

export const makeVdSwitchProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdSwitch'
)

export const VdSwitch = genericComponent()({
  name: 'VdSwitch',
  props: makeVdSwitchProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', false)
    const isChecked = computed(() => !!model.value)

    function toggle(): void {
      if (props.disabled) return
      model.value = !model.value
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'vd-switch',
            {
              'vd-switch--checked': isChecked.value,
              'vd-switch--disabled': props.disabled,
            },
            props.class,
          ],
          style: [{ '--vd-control-color': `var(--vd-theme-${props.color})` }, props.style],
        },
        [
          h('input', {
            class: 'vd-switch__input',
            type: 'checkbox',
            role: 'switch',
            checked: isChecked.value,
            disabled: props.disabled,
            onChange: toggle,
          }),
          h('span', { class: 'vd-switch__track' }, [h('span', { class: 'vd-switch__thumb' })]),
          slots.default || props.label
            ? h('span', { class: 'vd-switch__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
