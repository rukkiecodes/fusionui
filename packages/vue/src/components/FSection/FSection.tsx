import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFSectionProps = propsFactory(
  {
    eyebrow: String as PropType<string>,
    title: String as PropType<string>,
    /** Center the header and content. */
    center: Boolean,
    /** Max content width. */
    width: { type: String as PropType<string>, default: '1120px' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSection'
)

/**
 * A page section: a centered, max-width container with an optional eyebrow +
 * title header above slotted content. The backbone of marketing/landing pages.
 */
export const FSection = genericComponent()({
  name: 'FSection',
  props: makeFSectionProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() => {
      const hasHead = props.eyebrow || props.title || slots.eyebrow || slots.title || slots.header
      return h(
        'section',
        {
          class: ['fui-section', { 'fui-section--center': props.center }, props.class],
          style: [{ '--fui-section-width': props.width }, props.style],
        },
        [
          hasHead
            ? h(
                'header',
                { class: 'fui-section__head' },
                slots.header
                  ? slots.header()
                  : [
                      props.eyebrow || slots.eyebrow
                        ? h(
                            'span',
                            { class: 'fui-section__eyebrow' },
                            slots.eyebrow ? slots.eyebrow() : props.eyebrow
                          )
                        : null,
                      props.title || slots.title
                        ? h(
                            'h2',
                            { class: 'fui-section__title' },
                            slots.title ? slots.title() : props.title
                          )
                        : null,
                    ]
              )
            : null,
          h('div', { class: 'fui-section__body' }, slots.default ? slots.default() : undefined),
        ]
      )
    })
  },
})
