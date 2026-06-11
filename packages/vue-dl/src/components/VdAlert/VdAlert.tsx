import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeVariantProps, useVariant } from '../../composables/variant'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'

type AlertType = 'success' | 'info' | 'warning' | 'error'

const typeColor: Record<AlertType, string> = {
  success: 'success',
  info: 'primary',
  warning: 'warning',
  error: 'danger',
}

const typeIcon: Record<AlertType, string> = {
  success: '$success',
  info: '$info',
  warning: '$warning',
  error: '$error',
}

export const makeVdAlertProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'tonal' }),
    type: String as PropType<AlertType>,
    color: String as PropType<string>,
    title: String as PropType<string>,
    text: String as PropType<string>,
    icon: {
      type: [Boolean, String, Object, Function] as PropType<boolean | IconValue>,
      default: undefined,
    },
    closable: Boolean,
    border: Boolean,
    modelValue: { type: Boolean, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdAlert'
)

export const VdAlert = genericComponent()({
  name: 'VdAlert',
  props: makeVdAlertProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)

    const color = computed(
      () => props.color ?? (props.type ? typeColor[props.type as AlertType] : undefined)
    )
    const icon = computed(() => {
      if (props.icon === false) return undefined
      if (props.icon != null && props.icon !== true) return props.icon
      return props.type ? typeIcon[props.type as AlertType] : undefined
    })

    const { colorClasses, colorStyles, variantClasses } = useVariant(() => ({
      variant: props.variant,
      color: color.value,
    }))

    useRender(() => {
      if (!isActive.value) return null
      return h(
        'div',
        {
          class: [
            'vd-alert',
            `vd-alert--variant-${props.variant}`,
            { 'vd-alert--border': props.border },
            ...variantClasses.value,
            ...colorClasses.value,
            props.class,
          ],
          style: [colorStyles.value, props.style],
          role: 'alert',
        },
        [
          icon.value ? h(VdIcon, { icon: icon.value, class: 'vd-alert__icon' }) : null,
          h('div', { class: 'vd-alert__content' }, [
            props.title ? h('div', { class: 'vd-alert__title' }, props.title) : null,
            slots.default ? slots.default() : props.text,
          ]),
          props.closable
            ? h(VdIcon, {
                icon: '$close',
                class: 'vd-alert__close',
                onClick: () => {
                  isActive.value = false
                },
              })
            : null,
        ]
      )
    })
  },
})
