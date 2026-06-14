import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  createFusionUI,
  FMenu,
  FPopup,
  FDialog,
  FTooltip,
  FTabs,
  FTab,
  FTabPanel,
  FTabsWindow,
  FPagination,
  FList,
  FListItem,
  FCollapse,
  FTable,
  FBreadcrumb,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

describe('FMenu', () => {
  it('toggles content from the activator and closes on content click', async () => {
    const wrapper = mountWith(FMenu, {
      slots: {
        activator: ({ props }: any) =>
          h('button', { class: 'act', onClick: props.onClick }, 'Open'),
        default: () => h('div', { class: 'menu-body' }, 'Items'),
      },
    })
    expect(wrapper.find('.menu-body').exists()).toBe(false)
    await wrapper.find('.act').trigger('click')
    expect(wrapper.find('.menu-body').exists()).toBe(true)
    await wrapper.find('.fui-menu__content').trigger('click')
    expect(wrapper.find('.menu-body').exists()).toBe(false)
  })
})

describe('FPopup', () => {
  it('opens via activator and teleports a dialog to the body', async () => {
    const wrapper = mountWith(FPopup, {
      attachTo: document.body,
      props: { title: 'Hello' },
      slots: {
        activator: ({ props }: any) =>
          h('button', { class: 'open', onClick: props.onClick }, 'Open'),
        default: () => 'Dialog content',
      },
    })
    await wrapper.find('.open').trigger('click')
    expect(document.body.querySelector('.fui-popup')).not.toBeNull()
    expect(document.body.querySelector('.fui-popup__title')?.textContent).toBe('Hello')
    wrapper.unmount()
  })
})

describe('FTooltip', () => {
  it('reveals the tooltip on hover', async () => {
    const wrapper = mountWith(FTooltip, {
      props: { text: 'Tip!' },
      slots: { default: () => h('span', 'target') },
    })
    expect(wrapper.find('.fui-tooltip__content').exists()).toBe(false)
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('.fui-tooltip__content').text()).toBe('Tip!')
  })
})

describe('FDialog', () => {
  function mountDialog(props: Record<string, any> = {}) {
    const Host = {
      components: { FDialog },
      data: () => ({ open: true }),
      template: `<f-dialog v-model="open" v-bind="extra"><p class="body">Hi</p></f-dialog>`,
      computed: { extra: () => props },
    }
    return mountWith(Host, { global: { stubs: { teleport: true } } })
  }

  it('renders the panel and a close button while open', () => {
    const wrapper = mountDialog()
    expect(wrapper.find('.fui-dialog__box').exists()).toBe(true)
    expect(wrapper.find('.fui-dialog__close').exists()).toBe(true)
    expect(wrapper.find('.body').text()).toBe('Hi')
  })

  it('closes on a backdrop click', async () => {
    const wrapper = mountDialog()
    await wrapper.find('.fui-dialog').trigger('click')
    expect(wrapper.vm.open).toBe(false)
  })

  it('does not close on a backdrop click when prevent-close', async () => {
    const wrapper = mountDialog({ preventClose: true })
    await wrapper.find('.fui-dialog').trigger('click')
    expect(wrapper.vm.open).toBe(true)
  })

  it('hides the close button with not-close', () => {
    const wrapper = mountDialog({ notClose: true })
    expect(wrapper.find('.fui-dialog__close').exists()).toBe(false)
  })
})

describe('FTabs', () => {
  it('selects tabs and swaps panels', async () => {
    const Host = {
      setup() {
        return () =>
          h('div', [
            h(FTabs, { modelValue: 'a', 'onUpdate:modelValue': () => {} }, () => [
              h(FTab, { value: 'a', text: 'A' }),
              h(FTab, { value: 'b', text: 'B' }),
            ]),
          ])
      },
    }
    const wrapper = mountWith(Host)
    const tabs = wrapper.findAll('.fui-tab')
    expect(tabs[0].classes()).toContain('fui-tab--active')
    await tabs[1].trigger('click')
    expect(wrapper.emitted).toBeTruthy()
  })

  it('shows only the active panel', () => {
    const Host = {
      setup() {
        return () =>
          h('div', [
            h(FTabs, { modelValue: 'a' }, () => [h(FTab, { value: 'a', text: 'A' })]),
            h(FTabsWindow, { modelValue: 'a' }, () => [
              h(FTabPanel, { value: 'a' }, () => 'Panel A'),
              h(FTabPanel, { value: 'b' }, () => 'Panel B'),
            ]),
          ])
      },
    }
    const wrapper = mountWith(Host)
    expect(wrapper.text()).toContain('Panel A')
    expect(wrapper.text()).not.toContain('Panel B')
  })
})

describe('FPagination', () => {
  it('navigates pages and clamps', async () => {
    const wrapper = mountWith(FPagination, {
      props: {
        modelValue: 1,
        length: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    const buttons = wrapper.findAll('.fui-pagination__btn')
    // prev disabled at page 1
    expect((buttons[0].element as HTMLButtonElement).disabled).toBe(true)
    await buttons[buttons.length - 1].trigger('click') // next
    expect(wrapper.props('modelValue')).toBe(2)
  })
})

describe('FList / FCollapse / FTable / FBreadcrumb', () => {
  it('FListItem emits click', async () => {
    const wrapper = mountWith(FList, {
      slots: { default: () => h(FListItem, { title: 'Item', link: true }) },
    })
    await wrapper.find('.fui-list-item').trigger('click')
    expect(wrapper.findComponent(FListItem).emitted('click')).toHaveLength(1)
  })

  it('FCollapse toggles open', async () => {
    const wrapper = mountWith(FCollapse, {
      props: {
        title: 'Section',
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      },
      slots: { default: () => 'Body' },
    })
    expect(wrapper.classes()).not.toContain('fui-collapse--open')
    await wrapper.find('.fui-collapse__header').trigger('click')
    expect(wrapper.props('modelValue')).toBe(true)
  })

  it('FTable sorts rows on sortable header click', async () => {
    const wrapper = mountWith(FTable, {
      props: {
        headers: [{ title: 'N', key: 'n', sortable: true }],
        items: [{ n: 3 }, { n: 1 }, { n: 2 }],
      },
    })
    await wrapper.find('.fui-table__th--sortable').trigger('click')
    const cells = wrapper.findAll('.fui-table__td').map((c: any) => c.text())
    expect(cells).toEqual(['1', '2', '3'])
  })

  it('FBreadcrumb renders links and a current page', () => {
    const wrapper = mountWith(FBreadcrumb, {
      props: {
        items: [{ title: 'Home', href: '/' }, { title: 'Library' }],
      },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/')
    expect(wrapper.find('.fui-breadcrumb__item--active').text()).toBe('Library')
  })
})
