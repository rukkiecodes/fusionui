import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FIcon } from '../FIcon'

export const makeVdCollapseProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    title: String as PropType<string>,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCollapse'
)

export const FCollapse = genericComponent()({
  name: 'FCollapse',
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
            'fui-collapse',
            { 'fui-collapse--open': isOpen.value, 'fui-collapse--disabled': props.disabled },
            props.class,
          ],
          style: props.style,
        },
        [
          h(
            'button',
            {
              class: 'fui-collapse__header',
              'aria-expanded': isOpen.value,
              disabled: props.disabled,
              onClick: toggle,
            },
            [
              h(
                'span',
                { class: 'fui-collapse__title' },
                slots.title ? slots.title() : props.title
              ),
              h(FIcon, { icon: '$dropdown', class: 'fui-collapse__chevron' }),
            ]
          ),
          h('div', { class: 'fui-collapse__wrapper' }, [
            h('div', { class: 'fui-collapse__content' }, slots.default?.()),
          ]),
        ]
      )
    )
  },
})
