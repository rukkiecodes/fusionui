import { Teleport, Transition, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { convertToUnit } from '../../util/helpers'

export const makeVdSidebarProps = propsFactory(
  {
    modelValue: { type: Boolean, default: true },
    location: { type: String as PropType<'left' | 'right'>, default: 'left' },
    width: { type: [String, Number] as PropType<string | number>, default: 256 },
    permanent: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdSidebar'
)

export const VdSidebar = genericComponent()({
  name: 'VdSidebar',
  props: makeVdSidebarProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)

    useRender(() => {
      const drawer = h(
        'aside',
        {
          class: [
            'vd-sidebar',
            `vd-sidebar--${props.location}`,
            {
              'vd-sidebar--permanent': props.permanent,
              'vd-sidebar--open': isActive.value,
            },
            props.class,
          ],
          style: [{ width: convertToUnit(props.width) }, props.style],
        },
        slots.default?.()
      )

      if (props.permanent) return drawer

      return h(Teleport, { to: 'body' }, [
        h(
          Transition,
          { name: 'vd-fade' },
          {
            default: () =>
              isActive.value
                ? h('div', {
                    class: 'vd-sidebar__scrim',
                    onClick: () => {
                      isActive.value = false
                    },
                  })
                : null,
          }
        ),
        h(
          Transition,
          { name: `vd-sidebar-${props.location}` },
          { default: () => (isActive.value ? drawer : null) }
        ),
      ])
    })
  },
})
