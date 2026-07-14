import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'

export const makeFSystemBarProps = propsFactory(
  {
    color: String as PropType<string>,
    height: { type: [String, Number] as PropType<string | number>, default: 24 },
    /** Pin to the top of the viewport, above the navbar. */
    window: Boolean,
    ...makeElevationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSystemBar'
)

/**
 * A thin status strip that sits above the navbar — the place for a build tag, a
 * connection state, or a "you are impersonating…" notice. Deliberately low
 * contrast and small: it is chrome, not content.
 */
export const FSystemBar = genericComponent()({
  name: 'FSystemBar',
  props: makeFSystemBarProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { elevationClasses } = useElevation(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-system-bar',
            { 'fui-system-bar--window': props.window },
            ...elevationClasses.value,
            ...colorClasses.value,
            props.class,
          ],
          style: [{ height: convertToUnit(props.height) }, colorStyles.value, props.style],
          role: 'status',
        },
        slots.default?.()
      )
    )
  },
})
