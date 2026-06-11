import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { VdIcon } from '../VdIcon'

export const makeVdCollapseProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    title: String as PropType<string>,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdCollapse'
)

export const VdCollapse = genericComponent()({
  name: 'VdCollapse',
  props: makeVdCollapseProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isOpen = useProxiedModel(props, 'modelValue', false)

    function toggle(): void {
      if (!props.disabled) isOpen.value = !isOpen.value
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'vd-collapse',
            { 'vd-collapse--open': isOpen.value, 'vd-collapse--disabled': props.disabled },
            props.class,
          ],
          style: props.style,
        },
        [
          h(
            'button',
            {
              class: 'vd-collapse__header',
              'aria-expanded': isOpen.value,
              disabled: props.disabled,
              onClick: toggle,
            },
            [
              h('span', { class: 'vd-collapse__title' }, slots.title ? slots.title() : props.title),
              h(VdIcon, { icon: '$dropdown', class: 'vd-collapse__chevron' }),
            ]
          ),
          h('div', { class: 'vd-collapse__wrapper' }, [
            h('div', { class: 'vd-collapse__content' }, slots.default?.()),
          ]),
        ]
      )
    )
  },
})
