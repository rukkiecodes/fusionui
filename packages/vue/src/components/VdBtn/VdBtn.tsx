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
import { VdIcon } from '../VdIcon'
import { VdBtnGroupSymbol } from '../VdBtnGroup/key'

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
  'VdBtn'
)

export const VdBtn = genericComponent()({
  name: 'VdBtn',
  props: makeVdBtnProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { sizeClasses } = useSize(props)
    const group = useGroupItem(props, VdBtnGroupSymbol)

    // The button is fully self-colored via CSS variables (no `!important`
    // utility classes), so fill-on-active/focus states recolor text correctly.
    // `--vd-variant-color` = accent (RGB triplet), `--vd-variant-on` = contrast.
    const variantColor = computed(() => {
      const color = props.color
      if (!color) return 'var(--vd-theme-primary)'
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          const { r, g, b } = parseColor(color)
          return `${r},${g},${b}`
        }
        return undefined
      }
      return `var(--vd-theme-${color})`
    })

    const variantOn = computed(() => {
      const color = props.color
      if (!color) return 'var(--vd-theme-on-primary)'
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          return isLightColor(color) ? '0,0,0' : '255,255,255'
        }
        return '255,255,255'
      }
      return `var(--vd-theme-on-${color})`
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
      const content = h('span', { class: 'vd-btn__content' }, [
        props.prependIcon
          ? h(VdIcon, { icon: props.prependIcon, class: 'vd-btn__icon', size: '1.15em' })
          : null,
        hasIconValue
          ? h(VdIcon, { icon: props.icon, size: '1.3em' })
          : slots.default
            ? slots.default()
            : props.text,
        props.appendIcon
          ? h(VdIcon, { icon: props.appendIcon, class: 'vd-btn__icon', size: '1.15em' })
          : null,
      ])

      return withDirectives(
        h(
          Tag,
          {
            class: [
              'vd-btn',
              `vd-btn--variant-${props.variant}`,
              {
                'vd-btn--block': props.block,
                'vd-btn--icon': isIconOnly.value,
                'vd-btn--circle': props.circle,
                'vd-btn--square': props.square,
                'vd-btn--loading': props.loading,
                'vd-btn--upload': props.upload,
                'vd-btn--disabled': isDisabled.value,
                'vd-btn--active': props.active || group?.isSelected.value,
                'vd-btn--animate': hasAnimate.value,
                [`vd-btn--animate-${props.animationType}`]: !!props.animationType,
              },
              ...borderClasses.value,
              ...roundedClasses.value,
              ...elevationClasses.value,
              ...sizeClasses.value,
              props.class,
            ],
            style: [
              { '--vd-variant-color': variantColor.value, '--vd-variant-on': variantOn.value },
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
                  { class: ['vd-btn__animate', `vd-btn__animate--${props.animationType}`] },
                  slots.animate?.()
                )
              : null,
            props.loading ? h('span', { class: 'vd-btn__loader' }) : null,
          ]
        ),
        [[Ripple, props.ripple && !isDisabled.value]]
      )
    })
  },
})
