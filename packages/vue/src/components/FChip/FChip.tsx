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
import { FIcon } from '../FIcon'

export const makeFChipProps = propsFactory(
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
  'FChip'
)

export const FChip = genericComponent()({
  name: 'FChip',
  props: makeFChipProps(),
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
      props.color && !props.color.startsWith('#') ? `var(--fui-theme-${props.color})` : undefined
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
              'fui-chip',
              `fui-chip--variant-${props.variant}`,
              {
                'fui-chip--label': props.label,
                'fui-chip--pill': props.pill,
                'fui-chip--link': props.link,
              },
              ...variantClasses.value,
              ...colorClasses.value,
              ...sizeClasses.value,
              props.class,
            ],
            style: [{ '--fui-variant-color': variantColor.value }, colorStyles.value, props.style],
          },
          [
            props.prependIcon
              ? h(FIcon, { icon: props.prependIcon, class: 'fui-chip__prepend' })
              : null,
            h('span', { class: 'fui-chip__content' }, slots.default ? slots.default() : props.text),
            props.closable
              ? h(FIcon, {
                  icon: '$close',
                  class: 'fui-chip__close',
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
