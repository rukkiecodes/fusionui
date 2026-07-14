import { computed, h } from 'vue'
import type { ComputedRef, PropType, VNode, VNodeChild } from 'vue'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit, getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { FIcon } from '../FIcon'
import { FCheckbox } from '../FCheckbox'
import { FSelect } from '../FSelect'
import { FPagination } from '../FPagination'
import { FProgressLinear } from '../FProgress'
import { makeDataTableExpandProps } from './composables/expand'
import { makeDataTableGroupProps } from './composables/group'
import { makeDataTableHeaderProps } from './composables/headers'
import { makeDataTableItemsProps } from './composables/items'
import { makeDataTablePaginateProps } from './composables/pagination'
import { makeDataTableSelectProps } from './composables/select'
import { makeDataTableSortProps } from './composables/sort'
import type { ExpandProvide } from './composables/expand'
import type { GroupProvide } from './composables/group'
import type { ItemsPerPageOption, PaginationProvide } from './composables/pagination'
import type { SelectionProvide } from './composables/select'
import type { SortProvide } from './composables/sort'
import type { DataTableGroup, DataTableItem, DataTableRow, InternalDataTableHeader } from './types'

// Everything FDataTable and FDataTableServer have in common: the props that
// describe the table, and the render function that draws it. The two components
// differ only in where the rows come from — this module is the single source of
// the markup, so the server table can never drift from the client one.

export const makeFDataTableSharedProps = propsFactory(
  {
    loading: Boolean,
    loadingText: { type: String, default: 'Loading items…' },
    noDataText: { type: String, default: 'No data available' },
    hideDefaultHeader: Boolean,
    // Tint the header progress bar, the selection checkboxes and the pagination.
    color: { type: String as PropType<string>, default: 'primary' },
    hover: { type: Boolean, default: true },
    striped: Boolean,
    // Pin the header while the body scrolls (needs `height`).
    fixedHeader: Boolean,
    height: { type: [String, Number] as PropType<string | number>, default: undefined },
    width: { type: [String, Number] as PropType<string | number>, default: undefined },
    ...makeDataTableHeaderProps(),
    ...makeDataTableItemsProps(),
    ...makeDataTableSortProps(),
    ...makeDataTableSelectProps(),
    ...makeDataTableExpandProps(),
    ...makeDataTableGroupProps(),
    ...makeDataTablePaginateProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FDataTable'
)

export interface DataTableRenderState {
  columns: ComputedRef<InternalDataTableHeader[]>
  /** The flat list the body renders: group headers + item rows, already paged. */
  rows: ComputedRef<DataTableRow[]>
  /** The item rows on the current page (what a page-scoped select-all covers). */
  pageItems: ComputedRef<DataTableItem[]>
  /** Total number of items behind the table — the "of 42" in the footer. */
  itemsLength: ComputedRef<number>
  sort: SortProvide
  pagination: PaginationProvide
  selection: SelectionProvide
  expansion: ExpandProvide
  grouping: GroupProvide
}

function cellAlignClass(column: InternalDataTableHeader): string {
  return `fui-data-table__cell--${column.align}`
}

function cellStyle(column: InternalDataTableHeader): Record<string, string | undefined> {
  return {
    width: convertToUnit(column.width),
    minWidth: convertToUnit(column.minWidth ?? column.width),
    insetInlineStart: column.fixed ? convertToUnit(column.fixedOffset) : undefined,
  }
}

function displayValue(value: unknown): string {
  return value == null ? '' : String(value)
}

/** Builds the render function shared by both data tables. */
export function useDataTableRender(
  props: any,
  slots: Record<string, ((...args: any[]) => VNodeChild) | undefined>,
  state: DataTableRenderState
): () => VNodeChild {
  const {
    columns,
    rows,
    pageItems,
    itemsLength,
    sort,
    pagination,
    selection,
    expansion,
    grouping,
  } = state

  // Stable per-instance id so `aria-controls` on an expand toggle can point at
  // the detail row it reveals. Generated in setup → identical on server + client.
  const uid = getUid()

  const columnCount = computed(
    () => columns.value.length + (props.showSelect ? 1 : 0) + (props.showExpand ? 1 : 0)
  )

  const itemsPerPageOptions = computed(() =>
    (props.itemsPerPageOptions as ItemsPerPageOption[]).map(option =>
      typeof option === 'number'
        ? { value: option, title: option === -1 ? 'All' : String(option) }
        : option
    )
  )

  /** "1–10 of 42" — built from `pageText` so it can be localized. */
  const rangeText = computed(() => {
    const total = itemsLength.value
    const first = total ? pagination.startIndex.value + 1 : 0
    const last = pagination.stopIndex.value
    return String(props.pageText)
      .replace('{0}', String(first))
      .replace('{1}', String(last))
      .replace('{2}', String(total))
  })

  /** The accessible name of a row: its first column's value. */
  function rowLabel(item: DataTableItem): string {
    const first = columns.value[0]
    const value = first ? item.columns[first.key] : undefined
    return displayValue(value) || `${item.index + 1}`
  }

  function slotProps(): Record<string, unknown> {
    return {
      page: pagination.page.value,
      itemsPerPage: pagination.itemsPerPage.value,
      itemsLength: itemsLength.value,
      pageCount: pagination.pageCount.value,
      sortBy: sort.sortBy.value,
      columns: columns.value,
      items: pageItems.value.map(item => item.raw),
      internalItems: pageItems.value,
      toggleSort: sort.toggleSort,
      setPage: pagination.setPage,
      setItemsPerPage: pagination.setItemsPerPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      isSelected: selection.isSelected,
      toggleSelect: selection.toggleSelect,
      selectAll: selection.selectAll,
      someSelected: selection.someSelected.value,
      allSelected: selection.allSelected.value,
      isExpanded: expansion.isExpanded,
      toggleExpand: expansion.toggleExpand,
      isGroupOpen: grouping.isGroupOpen,
      toggleGroup: grouping.toggleGroup,
    }
  }

  function renderSelectAll(): VNode {
    const mixed = selection.someSelected.value && !selection.allSelected.value

    // FCheckbox paints the mixed state, but only the native input can carry it
    // for assistive tech — set the DOM property when the vnode lands. Vnode
    // hooks never run on the server, so this stays SSR-safe.
    function syncIndeterminate(vnode: VNode): void {
      const input = (vnode.el as HTMLElement | null)?.querySelector?.('input')
      if (input) (input as HTMLInputElement).indeterminate = mixed
    }

    return h(
      FCheckbox,
      {
        class: 'fui-data-table__checkbox',
        color: props.color,
        modelValue: selection.allSelected.value,
        indeterminate: mixed,
        'onUpdate:modelValue': (value: unknown) => selection.selectAll(!!value),
        onVnodeMounted: syncIndeterminate,
        onVnodeUpdated: syncIndeterminate,
      },
      { default: () => h('span', { class: 'fui-data-table__sr-only' }, 'Select all') }
    )
  }

  function renderHeaderCell(column: InternalDataTableHeader): VNode {
    const order = sort.sortOrder(column.key)
    const sortable = column.sortable && !props.disableSort
    const index = sort.sortIndex(column.key)

    const content =
      slots[`header.${column.key}`]?.({
        column,
        isSorted: sort.isSorted(column.key),
        sortOrder: order,
        toggleSort: () => sort.toggleSort(column),
      }) ?? column.title

    return h(
      'th',
      {
        key: column.key,
        scope: 'col',
        class: [
          'fui-data-table__th',
          cellAlignClass(column),
          {
            'fui-data-table__th--sortable': sortable,
            'fui-data-table__th--sorted': !!order,
            'fui-data-table__cell--fixed': column.fixed,
            'fui-data-table__cell--last-fixed': column.lastFixed,
          },
        ],
        style: cellStyle(column),
        'aria-sort': sortable
          ? order === 'asc'
            ? 'ascending'
            : order === 'desc'
              ? 'descending'
              : 'none'
          : undefined,
      },
      [
        sortable
          ? h(
              'button',
              {
                type: 'button',
                class: 'fui-data-table__sort-btn',
                onClick: () => sort.toggleSort(column),
              },
              [
                h('span', { class: 'fui-data-table__th-title' }, content),
                h(FIcon, {
                  // Ascending points up, descending points down.
                  icon: order === 'desc' ? '$expand' : '$collapse',
                  size: 'x-small',
                  class: 'fui-data-table__sort-icon',
                }),
                // With multi-sort the badge shows this column's place in `sortBy`.
                props.multiSort && index > -1 && sort.sortBy.value.length > 1
                  ? h('span', { class: 'fui-data-table__sort-badge' }, String(index + 1))
                  : null,
              ]
            )
          : h('span', { class: 'fui-data-table__th-title' }, content),
      ]
    )
  }

  function renderHead(): VNode {
    return h('thead', { class: 'fui-data-table__thead' }, [
      h('tr', { class: 'fui-data-table__thead-row' }, [
        props.showSelect
          ? h(
              'th',
              {
                scope: 'col',
                class: 'fui-data-table__th fui-data-table__th--action',
              },
              [
                selection.showSelectAll.value
                  ? renderSelectAll()
                  : h('span', { class: 'fui-data-table__sr-only' }, 'Select'),
              ]
            )
          : null,
        ...columns.value.map(renderHeaderCell),
        props.showExpand
          ? h('th', { scope: 'col', class: 'fui-data-table__th fui-data-table__th--action' }, [
              h('span', { class: 'fui-data-table__sr-only' }, 'Expand'),
            ])
          : null,
      ]),
      // A hairline progress bar under the header row while items load.
      props.loading
        ? h('tr', { class: 'fui-data-table__progress-row' }, [
            h('td', { colspan: columnCount.value, class: 'fui-data-table__progress-cell' }, [
              h(FProgressLinear, {
                indeterminate: true,
                color: props.color,
                height: 3,
                class: 'fui-data-table__progress',
              }),
            ]),
          ])
        : null,
    ])
  }

  function renderSelectCell(item: DataTableItem): VNode {
    return h('td', { class: 'fui-data-table__td fui-data-table__td--action' }, [
      h(
        FCheckbox,
        {
          class: 'fui-data-table__checkbox',
          color: props.color,
          disabled: !item.selectable,
          modelValue: selection.isSelected(item),
          'onUpdate:modelValue': () => selection.toggleSelect(item),
          // Never let a row-level click handler (expand-on-click) fire too.
          onClick: (event: MouseEvent) => event.stopPropagation(),
        },
        {
          default: () =>
            h('span', { class: 'fui-data-table__sr-only' }, `Select row: ${rowLabel(item)}`),
        }
      ),
    ])
  }

  function renderExpandCell(item: DataTableItem): VNode {
    const expanded = expansion.isExpanded(item)
    return h('td', { class: 'fui-data-table__td fui-data-table__td--action' }, [
      h(
        'button',
        {
          type: 'button',
          class: ['fui-data-table__expand-btn', { 'fui-data-table__expand-btn--open': expanded }],
          'aria-expanded': expanded,
          'aria-controls': expanded ? `fui-data-table-${uid}-expanded-${item.index}` : undefined,
          'aria-label': `${expanded ? 'Collapse' : 'Expand'} row: ${rowLabel(item)}`,
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            expansion.toggleExpand(item)
          },
        },
        [h(FIcon, { icon: '$expand', size: 'x-small' })]
      ),
    ])
  }

  function renderItemRow(item: DataTableItem): VNode[] {
    const expanded = props.showExpand && expansion.isExpanded(item)

    const row = h(
      'tr',
      {
        key: `item-${String(item.value)}`,
        class: [
          'fui-data-table__row',
          {
            'fui-data-table__row--selected': props.showSelect && selection.isSelected(item),
            'fui-data-table__row--expanded': expanded,
            'fui-data-table__row--clickable': props.expandOnClick && props.showExpand,
          },
        ],
        onClick:
          props.expandOnClick && props.showExpand ? () => expansion.toggleExpand(item) : undefined,
      },
      [
        props.showSelect ? renderSelectCell(item) : null,
        ...columns.value.map(column => {
          const value = item.columns[column.key]
          const slot = slots[`item.${column.key}`]
          return h(
            'td',
            {
              key: column.key,
              class: [
                'fui-data-table__td',
                cellAlignClass(column),
                {
                  'fui-data-table__cell--fixed': column.fixed,
                  'fui-data-table__cell--last-fixed': column.lastFixed,
                },
              ],
              style: cellStyle(column),
            },
            [
              slot
                ? slot({
                    item: item.raw,
                    value,
                    index: item.index,
                    internalItem: item,
                    columns: columns.value,
                  })
                : displayValue(value),
            ]
          )
        }),
        props.showExpand ? renderExpandCell(item) : null,
      ]
    )

    if (!expanded || !slots['expanded-row']) return [row]

    return [
      row,
      h(
        'tr',
        {
          key: `expanded-${String(item.value)}`,
          id: `fui-data-table-${uid}-expanded-${item.index}`,
          class: 'fui-data-table__expanded-row',
        },
        [
          h('td', { colspan: columnCount.value, class: 'fui-data-table__expanded-cell' }, [
            h('div', { class: 'fui-data-table__expanded-content' }, [
              slots['expanded-row']({
                item: item.raw,
                internalItem: item,
                columns: columns.value,
              }),
            ]),
          ]),
        ]
      ),
    ]
  }

  function renderGroupRow(group: DataTableGroup): VNode {
    const open = grouping.isGroupOpen(group)
    const title = columns.value.find(column => column.key === group.key)?.title ?? group.key

    return h('tr', { key: `group-${group.id}`, class: 'fui-data-table__group-row' }, [
      h(
        'td',
        {
          colspan: columnCount.value,
          class: 'fui-data-table__group-cell',
          style: { paddingInlineStart: convertToUnit(16 + group.depth * 20) },
        },
        slots['group-header']
          ? [
              slots['group-header']({
                item: group,
                isOpen: open,
                toggleGroup: () => grouping.toggleGroup(group),
                columns: columns.value,
              }),
            ]
          : [
              h(
                'button',
                {
                  type: 'button',
                  class: 'fui-data-table__group-toggle',
                  'aria-expanded': open,
                  onClick: () => grouping.toggleGroup(group),
                },
                [
                  h(FIcon, {
                    icon: '$expand',
                    size: 'x-small',
                    class: [
                      'fui-data-table__group-icon',
                      { 'fui-data-table__group-icon--open': open },
                    ],
                  }),
                  h('span', { class: 'fui-data-table__group-title' }, [
                    h('span', { class: 'fui-data-table__group-key' }, `${title}: `),
                    displayValue(group.value),
                  ]),
                  h('span', { class: 'fui-data-table__group-count' }, String(group.items.length)),
                ]
              ),
            ]
      ),
    ])
  }

  function renderBody(): VNode {
    if (props.loading && !rows.value.length) {
      return h('tbody', { class: 'fui-data-table__tbody' }, [
        h('tr', { class: 'fui-data-table__message-row' }, [
          h(
            'td',
            { colspan: columnCount.value, class: 'fui-data-table__message' },
            slots.loading ? slots.loading() : props.loadingText
          ),
        ]),
      ])
    }

    if (!rows.value.length) {
      return h('tbody', { class: 'fui-data-table__tbody' }, [
        h('tr', { class: 'fui-data-table__message-row' }, [
          h(
            'td',
            { colspan: columnCount.value, class: 'fui-data-table__message' },
            slots['no-data'] ? slots['no-data']() : props.noDataText
          ),
        ]),
      ])
    }

    return h(
      'tbody',
      { class: 'fui-data-table__tbody' },
      rows.value.flatMap(row => (row.type === 'group' ? [renderGroupRow(row)] : renderItemRow(row)))
    )
  }

  function renderFooter(): VNode {
    return h('div', { class: 'fui-data-table__footer' }, [
      slots['footer.prepend']?.(),
      h('div', { class: 'fui-data-table__per-page' }, [
        h('span', { class: 'fui-data-table__per-page-label' }, props.itemsPerPageText),
        h(FSelect, {
          class: 'fui-data-table__per-page-select',
          items: itemsPerPageOptions.value,
          color: props.color,
          modelValue: pagination.itemsPerPage.value,
          'onUpdate:modelValue': (value: unknown) => pagination.setItemsPerPage(Number(value)),
          'aria-label': props.itemsPerPageText,
        }),
      ]),
      h('div', { class: 'fui-data-table__range' }, rangeText.value),
      h(FPagination, {
        class: 'fui-data-table__pagination',
        modelValue: pagination.page.value,
        'onUpdate:modelValue': (value: number) => pagination.setPage(value),
        length: pagination.pageCount.value,
        totalVisible: 5,
        color: props.color,
      }),
    ])
  }

  return () =>
    h(
      'div',
      {
        class: [
          'fui-data-table',
          {
            'fui-data-table--hover': props.hover,
            'fui-data-table--striped': props.striped,
            'fui-data-table--loading': props.loading,
            'fui-data-table--fixed-header': props.fixedHeader,
          },
          props.class,
        ],
        style: [{ width: convertToUnit(props.width) }, props.style],
      },
      [
        slots.top ? h('div', { class: 'fui-data-table__top' }, [slots.top(slotProps())]) : null,
        h(
          'div',
          {
            class: 'fui-data-table__wrapper',
            style: { maxHeight: convertToUnit(props.height) },
          },
          [
            h('table', { class: 'fui-data-table__table' }, [
              props.hideDefaultHeader ? null : renderHead(),
              renderBody(),
            ]),
          ]
        ),
        slots.bottom
          ? h('div', { class: 'fui-data-table__bottom' }, [slots.bottom(slotProps())])
          : props.hideDefaultFooter
            ? null
            : renderFooter(),
      ]
    )
}
