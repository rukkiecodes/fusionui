import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'
import { convertToUnit } from '../../util/helpers'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

const sizeMap: Record<string, string> = {
  'x-small': '24px',
  small: '32px',
  default: '40px',
  large: '56px',
  'x-large': '72px',
}

export const makeFAvatarProps = propsFactory(
  {
    color: String as PropType<string>,
    size: { type: [String, Number] as PropType<string | number>, default: 'default' },
    image: String as PropType<string>,
    icon: [String, Object, Function] as PropType<IconValue>,
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FAvatar'
)

export const FAvatar = genericComponent()({
  name: 'FAvatar',
  props: makeFAvatarProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    const dimension = computed(() => sizeMap[String(props.size)] ?? convertToUnit(props.size))

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-avatar',
            { 'fui-avatar--tile': props.tile },
            ...roundedClasses.value,
            ...colorClasses.value,
            props.class,
          ],
          style: [
            { width: dimension.value, height: dimension.value },
            colorStyles.value,
            props.style,
          ],
        },
        [
          props.image
            ? h('img', { class: 'fui-avatar__image', src: props.image, alt: '' })
            : props.icon
              ? h(FIcon, { icon: props.icon })
              : slots.default?.(),
        ]
      )
    )
  },
})
