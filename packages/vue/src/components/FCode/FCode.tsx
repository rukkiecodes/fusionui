import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeSizeProps, useSize } from '../../composables/size'
import { surfaceColorTriplet } from '../FSheet/FSheet'

export const makeFCodeProps = propsFactory(
  {
    // Tint the snippet with a theme color (primary, success…) or any CSS color.
    color: String as PropType<string>,
    // Convenience for the snippet body (the default slot wins).
    text: String as PropType<string>,
    ...makeSizeProps(),
    ...makeRoundedProps(),
    ...makeTagProps({ tag: 'code' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCode'
)

/**
 * An inline code snippet — a `<code>` element in the mono token font, on a soft
 * tinted fill. For a whole block, wrap it in `<pre>`.
 */
export const FCode = genericComponent()({
  name: 'FCode',
  props: makeFCodeProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    const { sizeClasses } = useSize(props)

    const colorStyles = computed(() => {
      const color = surfaceColorTriplet(props.color)
      return color ? { '--fui-code-color': color } : null
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: ['fui-code', ...sizeClasses.value, ...roundedClasses.value, props.class],
          style: [colorStyles.value, props.style],
        },
        slots.default ? slots.default() : props.text
      )
    )
  },
})
