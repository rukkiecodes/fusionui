import { h, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { ClickOutside } from '../../directives/click-outside'

export const makeVdMenuProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    location: {
      type: String as PropType<'bottom' | 'top' | 'bottom-end' | 'top-end'>,
      default: 'bottom',
    },
    openOnHover: Boolean,
    closeOnContentClick: { type: Boolean, default: true },
    contentClass: [String, Array, Object] as PropType<unknown>,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'VdMenu'
)

export const VdMenu = genericComponent()({
  name: 'VdMenu',
  props: makeVdMenuProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    const isActive = useProxiedModel(props, 'modelValue', false)

    function toggle(): void {
      if (!props.disabled) isActive.value = !isActive.value
    }
    function close(): void {
      isActive.value = false
    }

    useRender(() =>
      withDirectives(
        h(
          'div',
          {
            class: ['vd-menu', props.class],
            style: props.style,
            onMouseenter: props.openOnHover
              ? () => {
                  isActive.value = true
                }
              : undefined,
            onMouseleave: props.openOnHover ? close : undefined,
          },
          [
            slots.activator?.({ props: { onClick: toggle }, isActive: isActive.value }),
            isActive.value
              ? h(
                  'div',
                  {
                    class: [
                      'vd-menu__content',
                      `vd-menu__content--${props.location}`,
                      props.contentClass,
                    ],
                    onClick: props.closeOnContentClick ? close : undefined,
                  },
                  slots.default?.({ close })
                )
              : null,
          ]
        ),
        [[ClickOutside, { handler: close }]]
      )
    )
  },
})
