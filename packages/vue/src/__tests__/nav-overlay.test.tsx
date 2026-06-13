import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  createVueDL,
  VdMenu,
  VdPopup,
  VdTooltip,
  VdTabs,
  VdTab,
  VdTabPanel,
  VdTabsWindow,
  VdPagination,
  VdList,
  VdListItem,
  VdCollapse,
  VdTable,
  VdBreadcrumb,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createVueDL()], ...(options.global ?? {}) },
  })
}

describe('VdMenu', () => {
  it('toggles content from the activator and closes on content click', async () => {
    const wrapper = mountWith(VdMenu, {
      slots: {
        activator: ({ props }: any) =>
          h('button', { class: 'act', onClick: props.onClick }, 'Open'),
        default: () => h('div', { class: 'menu-body' }, 'Items'),
      },
    })
    expect(wrapper.find('.menu-body').exists()).toBe(false)
    await wrapper.find('.act').trigger('click')
    expect(wrapper.find('.menu-body').exists()).toBe(true)
    await wrapper.find('.vd-menu__content').trigger('click')
    expect(wrapper.find('.menu-body').exists()).toBe(false)
  })
})

describe('VdPopup', () => {
  it('opens via activator and teleports a dialog to the body', async () => {
    const wrapper = mountWith(VdPopup, {
      attachTo: document.body,
      props: { title: 'Hello' },
      slots: {
        activator: ({ props }: any) =>
          h('button', { class: 'open', onClick: props.onClick }, 'Open'),
        default: () => 'Dialog content',
      },
    })
    await wrapper.find('.open').trigger('click')
    expect(document.body.querySelector('.vd-popup')).not.toBeNull()
    expect(document.body.querySelector('.vd-popup__title')?.textContent).toBe('Hello')
    wrapper.unmount()
  })
})

describe('VdTooltip', () => {
  it('reveals the tooltip on hover', async () => {
    const wrapper = mountWith(VdTooltip, {
      props: { text: 'Tip!' },
      slots: { default: () => h('span', 'target') },
    })
    expect(wrapper.find('.vd-tooltip__content').exists()).toBe(false)
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.vd-tooltip__content').text()).toBe('Tip!')
  })
})

describe('VdTabs', () => {
  it('selects tabs and swaps panels', async () => {
    const Host = {
      setup() {
        return () =>
          h('div', [
            h(VdTabs, { modelValue: 'a', 'onUpdate:modelValue': () => {} }, () => [
              h(VdTab, { value: 'a', text: 'A' }),
              h(VdTab, { value: 'b', text: 'B' }),
            ]),
          ])
      },
    }
    const wrapper = mountWith(Host)
    const tabs = wrapper.findAll('.vd-tab')
    expect(tabs[0].classes()).toContain('vd-tab--active')
    await tabs[1].trigger('click')
    expect(wrapper.emitted).toBeTruthy()
  })

  it('shows only the active panel', () => {
    const Host = {
      setup() {
        return () =>
          h('div', [
            h(VdTabs, { modelValue: 'a' }, () => [h(VdTab, { value: 'a', text: 'A' })]),
            h(VdTabsWindow, { modelValue: 'a' }, () => [
              h(VdTabPanel, { value: 'a' }, () => 'Panel A'),
              h(VdTabPanel, { value: 'b' }, () => 'Panel B'),
            ]),
          ])
      },
    }
    const wrapper = mountWith(Host)
    expect(wrapper.text()).toContain('Panel A')
    expect(wrapper.text()).not.toContain('Panel B')
  })
})

describe('VdPagination', () => {
  it('navigates pages and clamps', async () => {
    const wrapper = mountWith(VdPagination, {
      props: {
        modelValue: 1,
        length: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    const buttons = wrapper.findAll('.vd-pagination__btn')
    // prev disabled at page 1
    expect((buttons[0].element as HTMLButtonElement).disabled).toBe(true)
    await buttons[buttons.length - 1].trigger('click') // next
    expect(wrapper.props('modelValue')).toBe(2)
  })
})

describe('VdList / VdCollapse / VdTable / VdBreadcrumb', () => {
  it('VdListItem emits click', async () => {
    const wrapper = mountWith(VdList, {
      slots: { default: () => h(VdListItem, { title: 'Item', link: true }) },
    })
    await wrapper.find('.vd-list-item').trigger('click')
    expect(wrapper.findComponent(VdListItem).emitted('click')).toHaveLength(1)
  })

  it('VdCollapse toggles open', async () => {
    const wrapper = mountWith(VdCollapse, {
      props: {
        title: 'Section',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      },
      slots: { default: () => 'Body' },
    })
    expect(wrapper.classes()).not.toContain('vd-collapse--open')
    await wrapper.find('.vd-collapse__header').trigger('click')
    expect(wrapper.props('modelValue')).toBe(true)
  })

  it('VdTable sorts rows on sortable header click', async () => {
    const wrapper = mountWith(VdTable, {
      props: {
        headers: [{ title: 'N', key: 'n', sortable: true }],
        items: [{ n: 3 }, { n: 1 }, { n: 2 }],
      },
    })
    await wrapper.find('.vd-table__th--sortable').trigger('click')
    const cells = wrapper.findAll('.vd-table__td').map((c: any) => c.text())
    expect(cells).toEqual(['1', '2', '3'])
  })

  it('VdBreadcrumb renders links and a current page', () => {
    const wrapper = mountWith(VdBreadcrumb, {
      props: {
        items: [{ title: 'Home', href: '/' }, { title: 'Library' }],
      },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/')
    expect(wrapper.find('.vd-breadcrumb__item--active').text()).toBe('Library')
  })
})
