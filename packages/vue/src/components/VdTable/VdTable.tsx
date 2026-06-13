import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { VdIcon } from '../VdIcon'

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
  'VdTable'
)

export const VdTable = genericComponent()({
  name: 'VdTable',
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
            'vd-table',
            { 'vd-table--hover': props.hover, 'vd-table--striped': props.striped },
            props.class,
          ],
          style: props.style,
        },
        [
          h('table', { class: 'vd-table__table' }, [
            h('thead', [
              h(
                'tr',
                props.headers.map((header: TableHeader) =>
                  h(
                    'th',
                    {
                      key: header.key,
                      class: [
                        'vd-table__th',
                        `vd-table__cell--${header.align ?? 'start'}`,
                        { 'vd-table__th--sortable': header.sortable },
                      ],
                      onClick: () => toggleSort(header),
                    },
                    [
                      header.title,
                      header.sortable && sortKey.value === header.key
                        ? h(VdIcon, {
                            icon: sortDesc.value ? '$collapse' : '$expand',
                            size: 'x-small',
                            class: 'vd-table__sort-icon',
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
                      { key: rowIndex, class: 'vd-table__row' },
                      props.headers.map((header: TableHeader) =>
                        h(
                          'td',
                          {
                            key: header.key,
                            class: ['vd-table__td', `vd-table__cell--${header.align ?? 'start'}`],
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
                      { class: 'vd-table__empty', colspan: props.headers.length },
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
