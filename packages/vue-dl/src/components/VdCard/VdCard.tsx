import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeVariantProps, useVariant } from '../../composables/variant'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeVdCardProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'elevated' }),
    color: String as PropType<string>,
    image: String as PropType<string>,
    title: String as PropType<string>,
    subtitle: String as PropType<string>,
    text: String as PropType<string>,
    hover: Boolean,
    link: Boolean,
    ...makeRoundedProps({ rounded: 'md' }),
    ...makeElevationProps(),
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdCard'
)

export const VdCard = genericComponent()({
  name: 'VdCard',
  props: makeVdCardProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { colorClasses, colorStyles } = useVariant(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'vd-card',
            `vd-card--variant-${props.variant}`,
            {
              'vd-card--hover': props.hover,
              'vd-card--link': props.link,
            },
            ...colorClasses.value,
            ...roundedClasses.value,
            ...elevationClasses.value,
            props.class,
          ],
          style: [colorStyles.value, props.style],
        },
        [
          props.image
            ? h('div', { class: 'vd-card__media' }, [h('img', { src: props.image, alt: '' })])
            : slots.media?.(),
          props.title ? h('div', { class: 'vd-card__title' }, props.title) : null,
          props.subtitle ? h('div', { class: 'vd-card__subtitle' }, props.subtitle) : null,
          props.text ? h('div', { class: 'vd-card__text' }, props.text) : null,
          slots.default?.(),
        ]
      )
    )
  },
})

function makeSection(name: string, klass: string) {
  return genericComponent()({
    name,
    props: { ...makeComponentProps(), ...makeTagProps({ tag: 'div' }) },
    setup(props: any, { slots }: any) {
      useRender(() =>
        h(props.tag, { class: [klass, props.class], style: props.style }, slots.default?.())
      )
    },
  })
}

export const VdCardTitle = makeSection('VdCardTitle', 'vd-card__title')
export const VdCardSubtitle = makeSection('VdCardSubtitle', 'vd-card__subtitle')
export const VdCardText = makeSection('VdCardText', 'vd-card__text')
export const VdCardActions = makeSection('VdCardActions', 'vd-card__actions')
