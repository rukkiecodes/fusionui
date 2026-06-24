import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFAuthLayoutProps = propsFactory(
  {
    /** Which side the brand/aside panel sits on (collapses away on mobile). */
    asidePosition: { type: String as PropType<'left' | 'right'>, default: 'left' },
    /** Max width of the centered content column. */
    contentWidth: { type: String as PropType<string>, default: '420px' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FAuthLayout'
)

/**
 * A full-height split layout for auth / onboarding: a branded `#aside` panel
 * beside a centered content column (the default slot). On narrow screens the
 * aside collapses and only the content shows.
 */
export const FAuthLayout = genericComponent()({
  name: 'FAuthLayout',
  props: makeFAuthLayoutProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-auth-layout', `fui-auth-layout--aside-${props.asidePosition}`, props.class],
          style: [{ '--fui-auth-content-width': props.contentWidth }, props.style],
        },
        [
          slots.aside ? h('aside', { class: 'fui-auth-layout__aside' }, slots.aside()) : null,
          h('main', { class: 'fui-auth-layout__main' }, [
            h(
              'div',
              { class: 'fui-auth-layout__content' },
              slots.default ? slots.default() : undefined
            ),
          ]),
        ]
      )
    )
  },
})
