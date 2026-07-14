import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFThemeProviderProps = propsFactory(
  {
    /** Paints the scope's `background` / `on-background` so it reads as a surface. */
    withBackground: Boolean,
    ...makeThemeProps(),
    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FThemeProvider'
)

export const FThemeProvider = genericComponent()({
  name: 'FThemeProvider',
  props: makeFThemeProviderProps(),
  setup(props: any, { slots }: any) {
    // `provideTheme` resolves `props.theme` against the app theme instance and
    // hands back the `fui-theme--*` class. FusionUI scopes themes through CSS
    // custom properties, so that class on a real element is what re-declares
    // `--fui-theme-*` for everything underneath — hence the wrapper is always
    // rendered (a classless fragment could not scope anything).
    const { themeClasses } = provideTheme(props)

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'fui-theme-provider',
            { 'fui-theme-provider--with-background': props.withBackground },
            themeClasses.value,
            props.class,
          ],
          style: props.style,
        },
        slots.default?.()
      )
    )
  },
})
