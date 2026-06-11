import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { convertToUnit } from '../../util/helpers'
import { VdOverlay } from '../VdOverlay'
import { VdBtn } from '../VdBtn'

export const makeVdPopupProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    title: String as PropType<string>,
    width: { type: [String, Number] as PropType<string | number>, default: 440 },
    persistent: Boolean,
    closable: { type: Boolean, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdPopup'
)

export const VdPopup = genericComponent()({
  name: 'VdPopup',
  props: makeVdPopupProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', false)

    useRender(() =>
      h(
        VdOverlay,
        {
          modelValue: isActive.value,
          'onUpdate:modelValue': (v: boolean) => {
            isActive.value = v
          },
          persistent: props.persistent,
        },
        {
          activator: slots.activator,
          default: ({ close }: { close: () => void }) =>
            h(
              'div',
              {
                class: ['vd-popup', props.class],
                style: [{ width: convertToUnit(props.width) }, props.style],
              },
              [
                props.title || props.closable || slots.title
                  ? h('div', { class: 'vd-popup__header' }, [
                      h(
                        'div',
                        { class: 'vd-popup__title' },
                        slots.title ? slots.title() : props.title
                      ),
                      props.closable
                        ? h(VdBtn, {
                            icon: '$close',
                            variant: 'text',
                            size: 'small',
                            onClick: close,
                          })
                        : null,
                    ])
                  : null,
                h('div', { class: 'vd-popup__body' }, slots.default?.({ close })),
                slots.actions
                  ? h('div', { class: 'vd-popup__actions' }, slots.actions({ close }))
                  : null,
              ]
            ),
        }
      )
    )
  },
})
