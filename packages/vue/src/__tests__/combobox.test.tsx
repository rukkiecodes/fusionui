import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createFusionUI, FAutocomplete, FCombobox } from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    attachTo: document.body,
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

const fruits = ['Apple', 'Apricot', 'Banana', 'Cherry']

async function type(wrapper: any, value: string): Promise<void> {
  const input = wrapper.find('input')
  ;(input.element as HTMLInputElement).value = value
  await input.trigger('input')
  await nextTick()
}

describe('FAutocomplete', () => {
  // Regression: `emit` was never threaded into useCombobox, so the watcher that
  // fires `update:search` fired into `undefined` and the event never left the
  // component — a server-side filter had nothing to listen to.
  it('emits update:search as the query is typed', async () => {
    const wrapper = mountWith(FAutocomplete, { props: { items: fruits } })

    await type(wrapper, 'ap')

    expect(wrapper.emitted('update:search')).toBeTruthy()
    expect(wrapper.emitted('update:search')!.at(-1)).toEqual(['ap'])

    wrapper.unmount()
  })

  it('filters its items by the query', async () => {
    const wrapper = mountWith(FAutocomplete, { props: { items: fruits } })

    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'ap')

    const options = document.body.querySelectorAll('[role="option"]')
    const titles = [...options].map(o => o.textContent?.trim())

    // "Apple" and "Apricot" match; "Banana" and "Cherry" do not.
    expect(titles).toContain('Apple')
    expect(titles).toContain('Apricot')
    expect(titles).not.toContain('Banana')

    wrapper.unmount()
  })

  it('exposes the WAI-ARIA combobox contract on the input', () => {
    const wrapper = mountWith(FAutocomplete, { props: { items: fruits } })
    const input = wrapper.find('input')

    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(input.attributes('aria-autocomplete')).toBe('list')

    wrapper.unmount()
  })
})

describe('FCombobox', () => {
  it('emits update:search as the query is typed', async () => {
    const wrapper = mountWith(FCombobox, { props: { items: fruits } })

    await type(wrapper, 'kiwi')

    expect(wrapper.emitted('update:search')!.at(-1)).toEqual(['kiwi'])

    wrapper.unmount()
  })

  it('commits a value that is not in items (the whole point of a combobox)', async () => {
    const wrapper = mountWith(FCombobox, { props: { items: fruits } })

    await wrapper.find('input').trigger('focus')
    await type(wrapper, 'Kiwi')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['Kiwi'])

    wrapper.unmount()
  })
})
