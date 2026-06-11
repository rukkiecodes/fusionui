import { computed, h, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeSizeProps, useSize } from '../../composables/size'
import { makeVariantProps, useVariant } from '../../composables/variant'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { Ripple } from '../../directives/ripple'
import { VdIcon } from '../VdIcon'

export const makeVdChipProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'tonal' }),
    color: { type: String as PropType<string>, default: 'primary' },
    label: Boolean,
    pill: Boolean,
    closable: Boolean,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    link: Boolean,
    text: String as PropType<string>,
    modelValue: { type: Boolean, default: true },
    ...makeSizeProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdChip'
)

export const VdChip = genericComponent()({
  name: 'VdChip',
  props: makeVdChipProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    'click:close': (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { sizeClasses } = useSize(props)

    const variantColor = computed(() =>
      props.color && !props.color.startsWith('#') ? `var(--vd-theme-${props.color})` : undefined
    )

    function onClose(e: MouseEvent): void {
      isActive.value = false
      emit('click:close', e)
    }

    useRender(() => {
      if (!isActive.value) return null
      return withDirectives(
        h(
          'span',
          {
            class: [
              'vd-chip',
              `vd-chip--variant-${props.variant}`,
              {
                'vd-chip--label': props.label,
                'vd-chip--pill': props.pill,
                'vd-chip--link': props.link,
              },
              ...variantClasses.value,
              ...colorClasses.value,
              ...sizeClasses.value,
              props.class,
            ],
            style: [{ '--vd-variant-color': variantColor.value }, colorStyles.value, props.style],
          },
          [
            props.prependIcon
              ? h(VdIcon, { icon: props.prependIcon, class: 'vd-chip__prepend' })
              : null,
            h('span', { class: 'vd-chip__content' }, slots.default ? slots.default() : props.text),
            props.closable
              ? h(VdIcon, {
                  icon: '$close',
                  class: 'vd-chip__close',
                  size: 'small',
                  onClick: onClose,
                })
              : null,
          ]
        ),
        [[Ripple, props.link]]
      )
    })
  },
})
