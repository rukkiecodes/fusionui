import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { FIcon } from '../FIcon'

export interface TableHeader {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}

export const makeVdTableProps = propsFactory(
  {
    headers: { type: Array as PropType<TableHeader[]>, default: () => [] },
    items: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    hover: { type: Boolean, default: true },
    striped: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTable'
)

export const FTable = genericComponent()({
  name: 'FTable',
  props: makeVdTableProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const sortKey = ref<string | null>(null)
    const sortDesc = ref(false)

    const sortedItems = computed(() => {
      if (!sortKey.value) return props.items
      const key = sortKey.value
      return [...props.items].sort((a, b) => {
        const av = a[key]
        const bv = b[key]
        if (av === bv) return 0
        const result = (av as number) > (bv as number) ? 1 : -1
        return sortDesc.value ? -result : result
      })
    })

    function toggleSort(header: TableHeader): void {
      if (!header.sortable) return
      if (sortKey.value === header.key) {
        if (sortDesc.value) {
          sortKey.value = null
          sortDesc.value = false
        } else {
          sortDesc.value = true
        }
      } else {
        sortKey.value = header.key
        sortDesc.value = false
      }
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-table',
            { 'fui-table--hover': props.hover, 'fui-table--striped': props.striped },
            props.class,
          ],
          style: props.style,
        },
        [
          h('table', { class: 'fui-table__table' }, [
            h('thead', [
              h(
                'tr',
                props.headers.map((header: TableHeader) =>
                  h(
                    'th',
                    {
                      key: header.key,
                      class: [
                        'fui-table__th',
                        `fui-table__cell--${header.align ?? 'start'}`,
                        { 'fui-table__th--sortable': header.sortable },
                      ],
                      onClick: () => toggleSort(header),
                    },
                    [
                      header.title,
                      header.sortable && sortKey.value === header.key
                        ? h(FIcon, {
                            icon: sortDesc.value ? '$collapse' : '$expand',
                            size: 'x-small',
                            class: 'fui-table__sort-icon',
                          })
                        : null,
                    ]
                  )
                )
              ),
            ]),
            h(
              'tbody',
              sortedItems.value.length
                ? sortedItems.value.map((item: Record<string, unknown>, rowIndex: number) =>
                    h(
                      'tr',
                      { key: rowIndex, class: 'fui-table__row' },
                      props.headers.map((header: TableHeader) =>
                        h(
                          'td',
                          {
                            key: header.key,
                            class: ['fui-table__td', `fui-table__cell--${header.align ?? 'start'}`],
                          },
                          slots[`item.${header.key}`]
                            ? slots[`item.${header.key}`]({ item, value: item[header.key] })
                            : String(item[header.key] ?? '')
                        )
                      )
                    )
                  )
                : h('tr', [
                    h(
                      'td',
                      { class: 'fui-table__empty', colspan: props.headers.length },
                      slots.empty ? slots.empty() : 'No data available'
                    ),
                  ])
            ),
          ]),
        ]
      )
    )
  },
})
