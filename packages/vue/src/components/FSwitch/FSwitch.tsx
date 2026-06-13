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
  'FSwitch'
)

export const FSwitch = genericComponent()({
  name: 'FSwitch',
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
            'fui-switch',
            {
              'fui-switch--checked': isChecked.value,
              'fui-switch--disabled': props.disabled,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': `var(--fui-theme-${props.color})` }, props.style],
        },
        [
          h('input', {
            class: 'fui-switch__input',
            type: 'checkbox',
            role: 'switch',
            checked: isChecked.value,
            disabled: props.disabled,
            onChange: toggle,
          }),
          h('span', { class: 'fui-switch__track' }, [h('span', { class: 'fui-switch__thumb' })]),
          slots.default || props.label
            ? h('span', { class: 'fui-switch__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
