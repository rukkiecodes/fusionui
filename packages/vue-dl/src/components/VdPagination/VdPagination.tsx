import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { VdIcon } from '../VdIcon'

export const makeVdPaginationProps = propsFactory(
  {
    modelValue: { type: Number, default: 1 },
    length: { type: Number, default: 1 },
    totalVisible: { type: Number, default: 7 },
    color: { type: String as PropType<string>, default: 'primary' },
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdPagination'
)

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export const VdPagination = genericComponent()({
  name: 'VdPagination',
  props: makeVdPaginationProps(),
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props: any) {
    provideTheme(props)
    const page = useProxiedModel(props, 'modelValue', 1)

    const items = computed<(number | 'ellipsis')[]>(() => {
      const total = props.length
      const current = page.value
      const visible = Math.min(props.totalVisible, total)
      if (total <= visible) return range(1, total)

      const result: (number | 'ellipsis')[] = [1]
      const side = Math.floor((visible - 3) / 2)
      let start = Math.max(2, current - side)
      let end = Math.min(total - 1, current + side)
      if (current - side <= 2) end = visible - 1
      if (current + side >= total - 1) start = total - visible + 2

      if (start > 2) result.push('ellipsis')
      result.push(...range(start, end))
      if (end < total - 1) result.push('ellipsis')
      result.push(total)
      return result
    })

    function go(p: number): void {
      if (props.disabled) return
      page.value = Math.min(props.length, Math.max(1, p))
    }

    useRender(() =>
      h(
        'nav',
        {
          class: ['vd-pagination', { 'vd-pagination--disabled': props.disabled }, props.class],
          style: [{ '--vd-pagination-color': `var(--vd-theme-${props.color})` }, props.style],
          role: 'navigation',
        },
        [
          h(
            'button',
            {
              class: 'vd-pagination__btn vd-pagination__nav',
              disabled: page.value <= 1,
              'aria-label': 'Previous page',
              onClick: () => go(page.value - 1),
            },
            [h(VdIcon, { icon: '$prev', size: 'small' })]
          ),
          ...items.value.map((item, i) =>
            item === 'ellipsis'
              ? h('span', { key: `e-${i}`, class: 'vd-pagination__ellipsis' }, '…')
              : h(
                  'button',
                  {
                    key: item,
                    class: [
                      'vd-pagination__btn',
                      { 'vd-pagination__btn--active': item === page.value },
                    ],
                    'aria-current': item === page.value ? 'page' : undefined,
                    onClick: () => go(item as number),
                  },
                  String(item)
                )
          ),
          h(
            'button',
            {
              class: 'vd-pagination__btn vd-pagination__nav',
              disabled: page.value >= props.length,
              'aria-label': 'Next page',
              onClick: () => go(page.value + 1),
            },
            [h(VdIcon, { icon: '$next', size: 'small' })]
          ),
        ]
      )
    )
  },
})
