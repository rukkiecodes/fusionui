import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { FIcon } from '../FIcon'

export interface BreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}

export const makeVdBreadcrumbProps = propsFactory(
  {
    items: { type: Array as PropType<(BreadcrumbItem | string)[]>, default: () => [] },
    divider: { type: String, default: '$next' },
    ...makeComponentProps(),
  },
  'FBreadcrumb'
)

export const FBreadcrumb = genericComponent()({
  name: 'FBreadcrumb',
  props: makeVdBreadcrumbProps(),
  setup(props: any, { slots }: any) {
    useRender(() => {
      const items = props.items.map((i: BreadcrumbItem | string) =>
        typeof i === 'string' ? { title: i } : i
      )
      const children: any[] = []
      items.forEach((item: BreadcrumbItem, index: number) => {
        const isLast = index === items.length - 1
        children.push(
          h(
            item.href && !item.disabled ? 'a' : 'span',
            {
              key: `item-${index}`,
              class: [
                'fui-breadcrumb__item',
                {
                  'fui-breadcrumb__item--active': isLast,
                  'fui-breadcrumb__item--disabled': item.disabled,
                },
              ],
              href: item.href && !item.disabled ? item.href : undefined,
              'aria-current': isLast ? 'page' : undefined,
            },
            item.title
          )
        )
        if (!isLast) {
          children.push(
            h('span', { key: `div-${index}`, class: 'fui-breadcrumb__divider' }, [
              slots.divider ? slots.divider() : h(FIcon, { icon: props.divider, size: 'small' }),
            ])
          )
        }
      })
      return h(
        'nav',
        { class: ['fui-breadcrumb', props.class], style: props.style, 'aria-label': 'breadcrumb' },
        children
      )
    })
  },
})
