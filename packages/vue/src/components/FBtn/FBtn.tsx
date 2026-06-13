import { computed, h, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { isCssColor, isLightColor, parseColor } from '../../util/colors'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeBorderProps, useBorder } from '../../composables/border'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeSizeProps, useSize } from '../../composables/size'
import { makeVariantProps } from '../../composables/variant'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { Ripple } from '../../directives/ripple'
import { useGroupItem } from '../../composables/group'
import { FIcon } from '../FIcon'
import { FBtnGroupSymbol } from '../FBtnGroup/key'

export const makeVdBtnProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'elevated' }),
    color: { type: String as PropType<string>, default: 'primary' },
    icon: [Boolean, String, Object, Function] as PropType<boolean | IconValue>,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    text: String as PropType<string>,
    block: Boolean,
    circle: Boolean,
    square: Boolean,
    /** Forces the active/pressed look (e.g. a selected toggle). */
    active: Boolean,
    loading: Boolean,
    /** Shows the upload progress sweep overlay. */
    upload: Boolean,
    disabled: Boolean,
    ripple: { type: Boolean, default: true },
    href: String as PropType<string>,
    /** Hover animation for the optional `animate` slot. */
    animationType: {
      type: String as PropType<'' | 'horizontal' | 'vertical' | 'scale' | 'rotate'>,
      default: '',
    },
    value: null as unknown as PropType<unknown>,
    ...makeSizeProps(),
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeTagProps({ tag: 'button' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBtn'
)

export const FBtn = genericComponent()({
  name: 'FBtn',
  props: makeVdBtnProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { sizeClasses } = useSize(props)
    const group = useGroupItem(props, FBtnGroupSymbol)

    // The button is fully self-colored via CSS variables (no `!important`
    // utility classes), so fill-on-active/focus states recolor text correctly.
    // `--fui-variant-color` = accent (RGB triplet), `--fui-variant-on` = contrast.
    const variantColor = computed(() => {
      const color = props.color
      if (!color) return 'var(--fui-theme-primary)'
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          const { r, g, b } = parseColor(color)
          return `${r},${g},${b}`
        }
        return undefined
      }
      return `var(--fui-theme-${color})`
    })

    const variantOn = computed(() => {
      const color = props.color
      if (!color) return 'var(--fui-theme-on-primary)'
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          return isLightColor(color) ? '0,0,0' : '255,255,255'
        }
        return '255,255,255'
      }
      return `var(--fui-theme-on-${color})`
    })

    const isDisabled = computed(() => props.disabled || props.loading)
    const isIconOnly = computed(() => !!props.icon)
    const hasAnimate = computed(() => !!props.animationType || !!slots.animate)

    function onClick(e: MouseEvent): void {
      if (isDisabled.value) return
      group?.toggle()
      emit('click', e)
    }

    useRender(() => {
      const Tag = props.href ? 'a' : props.tag
      const hasIconValue = props.icon && typeof props.icon !== 'boolean'

      // Icons size relative to the button text so they stay proportionate.
      const content = h('span', { class: 'fui-btn__content' }, [
        props.prependIcon
          ? h(FIcon, { icon: props.prependIcon, class: 'fui-btn__icon', size: '1.15em' })
          : null,
        hasIconValue
          ? h(FIcon, { icon: props.icon, size: '1.3em' })
          : slots.default
            ? slots.default()
            : props.text,
        props.appendIcon
          ? h(FIcon, { icon: props.appendIcon, class: 'fui-btn__icon', size: '1.15em' })
          : null,
      ])

      return withDirectives(
        h(
          Tag,
          {
            class: [
              'fui-btn',
              `fui-btn--variant-${props.variant}`,
              {
                'fui-btn--block': props.block,
                'fui-btn--icon': isIconOnly.value,
                'fui-btn--circle': props.circle,
                'fui-btn--square': props.square,
                'fui-btn--loading': props.loading,
                'fui-btn--upload': props.upload,
                'fui-btn--disabled': isDisabled.value,
                'fui-btn--active': props.active || group?.isSelected.value,
                'fui-btn--animate': hasAnimate.value,
                [`fui-btn--animate-${props.animationType}`]: !!props.animationType,
              },
              ...borderClasses.value,
              ...roundedClasses.value,
              ...elevationClasses.value,
              ...sizeClasses.value,
              props.class,
            ],
            style: [
              { '--fui-variant-color': variantColor.value, '--fui-variant-on': variantOn.value },
              props.style,
            ],
            type: Tag === 'button' ? 'button' : undefined,
            disabled: Tag === 'button' ? isDisabled.value : undefined,
            href: props.href,
            'aria-disabled': Tag !== 'button' && isDisabled.value ? true : undefined,
            onClick,
          },
          [
            content,
            hasAnimate.value
              ? h(
                  'span',
                  { class: ['fui-btn__animate', `fui-btn__animate--${props.animationType}`] },
                  slots.animate?.()
                )
              : null,
            props.loading ? h('span', { class: 'fui-btn__loader' }) : null,
          ]
        ),
        [[Ripple, props.ripple && !isDisabled.value]]
      )
    })
  },
})
