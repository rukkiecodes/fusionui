import { Transition, computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeBorderProps, useBorder } from '../../composables/border'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { surfaceColorTriplet, surfaceOnTriplet } from '../FSheet/FSheet'
import { FAvatar } from '../FAvatar'
import { FIcon } from '../FIcon'

export type BannerLines = 'one' | 'two' | 'three'

export const makeFBannerProps = propsFactory(
  {
    // Accent color — tints the prepended avatar/icon and the actions. A theme
    // name (primary, success…) or any CSS color.
    color: String as PropType<string>,
    // Fills the whole banner instead of only accenting it.
    bgColor: String as PropType<string>,
    // A leading icon, drawn in an avatar tile.
    icon: [String, Object, Function] as PropType<IconValue>,
    // A leading image (an avatar photo / product shot); wins over `icon`.
    avatar: String as PropType<string>,
    // Convenience for the message body (the `text` slot wins).
    text: String as PropType<string>,
    // Clamp the message to one, two or three lines.
    lines: String as PropType<BannerLines>,
    // Stick to the top of the nearest scroll container.
    sticky: Boolean,
    // Force the stacked (mobile) layout — actions below the text.
    stacked: Boolean,
    // Show a close button that dismisses the banner.
    closable: Boolean,
    modelValue: { type: Boolean, default: true },
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeDimensionProps(),
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBanner'
)

/**
 * A page-level message: full width, a leading icon or avatar, a line of copy and
 * a row of actions. Where `FAlert` speaks about one thing on the page, a banner
 * speaks about the page itself — cookie notices, plan upgrades, outages.
 */
export const FBanner = genericComponent()({
  name: 'FBanner',
  props: makeFBannerProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    'click:close': (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { dimensionStyles } = useDimension(props)

    const colorStyles = computed(() => {
      const styles: Record<string, string> = {}
      const accent = surfaceColorTriplet(props.color)
      if (accent) styles['--fui-banner-color'] = accent
      const bg = surfaceColorTriplet(props.bgColor)
      if (bg) {
        styles['--fui-banner-bg'] = bg
        styles['--fui-banner-on'] = surfaceOnTriplet(props.bgColor) as string
      }
      return Object.keys(styles).length ? styles : null
    })

    function onClose(e: MouseEvent): void {
      isActive.value = false
      emit('click:close', e)
    }

    useRender(() => {
      const hasMedia = !!(props.avatar || props.icon)
      const hasPrepend = !!(slots.prepend || hasMedia)
      const hasText = !!(slots.text || props.text)

      const banner = h(
        props.tag,
        {
          class: [
            'fui-banner',
            {
              'fui-banner--sticky': props.sticky,
              'fui-banner--stacked': props.stacked,
              'fui-banner--accent': !!props.color,
              'fui-banner--filled': !!props.bgColor,
              'fui-banner--closable': props.closable,
              [`fui-banner--${props.lines}-line`]: !!props.lines,
            },
            ...borderClasses.value,
            ...roundedClasses.value,
            ...elevationClasses.value,
            props.class,
          ],
          style: [colorStyles.value, dimensionStyles.value, props.style],
          role: 'banner',
        },
        [
          hasPrepend
            ? h('div', { class: 'fui-banner__prepend' }, [
                slots.prepend
                  ? slots.prepend()
                  : h(FAvatar, {
                      class: 'fui-banner__avatar',
                      color: props.color ?? 'primary',
                      image: props.avatar,
                      icon: props.avatar ? undefined : props.icon,
                      size: 'small',
                    }),
              ])
            : null,

          h('div', { class: 'fui-banner__content' }, [
            hasText
              ? h('div', { class: 'fui-banner__text' }, slots.text ? slots.text() : props.text)
              : null,
            slots.default?.(),
          ]),

          slots.actions ? h('div', { class: 'fui-banner__actions' }, slots.actions()) : null,

          props.closable
            ? h(
                'button',
                {
                  class: 'fui-banner__close',
                  type: 'button',
                  'aria-label': 'Dismiss',
                  onClick: onClose,
                },
                [h(FIcon, { icon: '$close', size: 'small' })]
              )
            : null,
        ]
      )

      return h(
        Transition,
        { name: 'fui-banner' },
        { default: () => (isActive.value ? banner : null) }
      )
    })
  },
})

export const makeFBannerTextProps = propsFactory(
  {
    ...makeTagProps({ tag: 'div' }),
    ...makeComponentProps(),
  },
  'FBannerText'
)

/** The banner's message. Use it when you build the banner from the default slot. */
export const FBannerText = genericComponent()({
  name: 'FBannerText',
  props: makeFBannerTextProps(),
  setup(props: any, { slots }: any) {
    useRender(() =>
      h(
        props.tag,
        { class: ['fui-banner__text', props.class], style: props.style },
        slots.default?.()
      )
    )
  },
})

export const makeFBannerActionsProps = propsFactory(
  {
    ...makeTagProps({ tag: 'div' }),
    ...makeComponentProps(),
  },
  'FBannerActions'
)

/** The banner's action row. The `actions` slot wraps its content in one already. */
export const FBannerActions = genericComponent()({
  name: 'FBannerActions',
  props: makeFBannerActionsProps(),
  setup(props: any, { slots }: any) {
    useRender(() =>
      h(
        props.tag,
        { class: ['fui-banner__actions', props.class], style: props.style },
        slots.default?.()
      )
    )
  },
})
