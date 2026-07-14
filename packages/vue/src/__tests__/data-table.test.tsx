import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createFusionUI, FDataTable } from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

const headers = [
  { key: 'name', title: 'Name' },
  { key: 'role', title: 'Role' },
]

const items = [
  { id: 1, name: 'Lana Steiner', role: 'Staff engineer' },
  { id: 2, name: 'Demi Wilkinson', role: 'Product designer' },
  { id: 3, name: 'Candice Wu', role: 'Engineering manager' },
]

describe('FDataTable', () => {
  it('renders a row per item', () => {
    const wrapper = mountWith(FDataTable, { props: { headers, items } })
    expect(wrapper.findAll('.fui-data-table__row')).toHaveLength(3)
  })

  // Regression: `click:row` was declared in emits but never emitted — the row's
  // onClick only toggled expansion, and only when `expand-on-click` was set.
  it('emits click:row with the raw item', async () => {
    const wrapper = mountWith(FDataTable, { props: { headers, items } })

    await wrapper.findAll('.fui-data-table__row')[1].trigger('click')

    const emitted = wrapper.emitted('click:row')
    expect(emitted).toBeTruthy()
    // (event, { item }) — the item is the caller's original object, not a wrapper.
    expect(emitted![0][1]).toEqual({ item: items[1] })
  })

  it('sorts on a header click, and marks the column with aria-sort', async () => {
    const wrapper = mountWith(FDataTable, { props: { headers, items } })

    await wrapper.findAll('.fui-data-table__sort-btn')[0].trigger('click')

    const cells = wrapper.findAll('.fui-data-table__row .fui-data-table__td')
    expect(cells[0].text()).toBe('Candice Wu')
    expect(wrapper.findAll('th')[0].attributes('aria-sort')).toBe('ascending')
  })

  it('pages the rows', () => {
    const wrapper = mountWith(FDataTable, {
      props: { headers, items, itemsPerPage: 2 },
    })
    expect(wrapper.findAll('.fui-data-table__row')).toHaveLength(2)
    expect(wrapper.find('.fui-data-table__range').text()).toBe('1–2 of 3')
  })

  it('filters by search', () => {
    const wrapper = mountWith(FDataTable, {
      props: { headers, items, search: 'candice' },
    })
    expect(wrapper.findAll('.fui-data-table__row')).toHaveLength(1)
  })

  it('selects rows and reports the selection', async () => {
    const wrapper = mountWith(FDataTable, {
      props: { headers, items, showSelect: true },
    })

    // The first checkbox is the header's select-all.
    const boxes = wrapper.findAll('.fui-data-table__checkbox input')
    await boxes[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([[1]])
  })

  it('shows the empty state when there is nothing to show', () => {
    const wrapper = mountWith(FDataTable, {
      props: { headers, items: [], noDataText: 'Nothing here' },
    })
    expect(wrapper.find('.fui-data-table__message').text()).toBe('Nothing here')
  })
})
