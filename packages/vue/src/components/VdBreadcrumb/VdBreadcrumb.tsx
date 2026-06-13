import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { VdIcon } from '../VdIcon'

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
  'VdBreadcrumb'
)

export const VdBreadcrumb = genericComponent()({
  name: 'VdBreadcrumb',
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
                'vd-breadcrumb__item',
                {
                  'vd-breadcrumb__item--active': isLast,
                  'vd-breadcrumb__item--disabled': item.disabled,
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
            h('span', { key: `div-${index}`, class: 'vd-breadcrumb__divider' }, [
              slots.divider ? slots.divider() : h(VdIcon, { icon: props.divider, size: 'small' }),
            ])
          )
        }
      })
      return h(
        'nav',
        { class: ['vd-breadcrumb', props.class], style: props.style, 'aria-label': 'breadcrumb' },
        children
      )
    })
  },
})
