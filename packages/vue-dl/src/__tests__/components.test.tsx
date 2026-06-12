import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  createVueDL,
  VdBtn,
  VdBtnGroup,
  VdCard,
  VdAlert,
  VdChip,
  VdAvatar,
  VdBadge,
  VdProgressCircular,
  VdProgressLinear,
  VdDivider,
  VdSpacer,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}) {
  return mount(component, {
    ...options,
    global: { plugins: [createVueDL()], ...(options.global ?? {}) },
  })
}

describe('VdBtn', () => {
  it('renders the default elevated/primary button with content', () => {
    const wrapper = mountWith(VdBtn, { slots: { default: () => 'Click' } })
    expect(wrapper.classes()).toContain('vd-btn')
    expect(wrapper.classes()).toContain('vd-btn--variant-elevated')
    // self-colored via CSS variable (no !important utility class)
    expect(wrapper.attributes('style') ?? '').toContain('--vd-variant-color')
    expect(wrapper.text()).toBe('Click')
  })

  it('supports every variant', () => {
    for (const variant of [
      'elevated',
      'flat',
      'tonal',
      'outlined',
      'text',
      'plain',
      'gradient',
      'relief',
      'line',
    ]) {
      const wrapper = mountWith(VdBtn, { props: { variant } })
      expect(wrapper.classes()).toContain(`vd-btn--variant-${variant}`)
    }
  })

  it('emits click and not when disabled', async () => {
    const wrapper = mountWith(VdBtn, { props: { disabled: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    const disabled = mountWith(VdBtn, { props: { disabled: true } })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
    expect(disabled.classes()).toContain('vd-btn--disabled')
  })

  it('shows a loader overlay when loading', () => {
    const wrapper = mountWith(VdBtn, { props: { loading: true } })
    expect(wrapper.classes()).toContain('vd-btn--loading')
    expect(wrapper.find('.vd-btn__loader').exists()).toBe(true)
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('supports the new floating and shadow variants', () => {
    expect(mountWith(VdBtn, { props: { variant: 'floating' } }).classes()).toContain(
      'vd-btn--variant-floating'
    )
    expect(mountWith(VdBtn, { props: { variant: 'shadow' } }).classes()).toContain(
      'vd-btn--variant-shadow'
    )
  })

  it('renders an animate slot for hover transitions', () => {
    const wrapper = mountWith(VdBtn, {
      props: { animationType: 'horizontal' },
      slots: { default: () => 'Hover', animate: () => 'Go' },
    })
    expect(wrapper.classes()).toContain('vd-btn--animate')
    expect(wrapper.find('.vd-btn__animate').text()).toBe('Go')
  })

  it('renders an icon-only button', () => {
    const wrapper = mountWith(VdBtn, { props: { icon: '$success' } })
    expect(wrapper.classes()).toContain('vd-btn--icon')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders as an anchor when href is set', () => {
    const wrapper = mountWith(VdBtn, { props: { href: 'https://example.com' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })
})

describe('VdBtnGroup', () => {
  it('selects an item and emits the model', async () => {
    const wrapper = mountWith(VdBtnGroup, {
      props: { 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [h(VdBtn, { value: 'a' }, () => 'A'), h(VdBtn, { value: 'b' }, () => 'B')],
      },
    })
    const buttons = wrapper.findAllComponents(VdBtn)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })
})

describe('VdCard', () => {
  it('renders title/subtitle/text from props', () => {
    const wrapper = mountWith(VdCard, {
      props: { title: 'Title', subtitle: 'Sub', text: 'Body' },
    })
    expect(wrapper.find('.vd-card__title').text()).toBe('Title')
    expect(wrapper.find('.vd-card__subtitle').text()).toBe('Sub')
    expect(wrapper.find('.vd-card__text').text()).toBe('Body')
  })

  it('adds the hover modifier', () => {
    const wrapper = mountWith(VdCard, { props: { hover: true } })
    expect(wrapper.classes()).toContain('vd-card--hover')
  })
})

describe('VdAlert', () => {
  it('maps type to color and a leading icon', () => {
    const wrapper = mountWith(VdAlert, { props: { type: 'success', text: 'Done' } })
    expect(wrapper.classes()).toContain('text-success')
    expect(wrapper.find('.vd-alert__icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('closes when the close icon is clicked', async () => {
    const wrapper = mountWith(VdAlert, { props: { closable: true, text: 'x' } })
    expect(wrapper.find('.vd-alert').exists()).toBe(true)
    await wrapper.find('.vd-alert__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.find('.vd-alert').exists()).toBe(false)
  })
})

describe('VdChip', () => {
  it('renders content and a close affordance', async () => {
    const wrapper = mountWith(VdChip, {
      props: { closable: true },
      slots: { default: () => 'Tag' },
    })
    expect(wrapper.text()).toContain('Tag')
    await wrapper.find('.vd-chip__close').trigger('click')
    expect(wrapper.emitted('click:close')).toHaveLength(1)
    expect(wrapper.find('.vd-chip').exists()).toBe(false)
  })
})

describe('VdAvatar / VdBadge / VdProgress / VdDivider / VdSpacer', () => {
  it('VdAvatar renders an image', () => {
    const wrapper = mountWith(VdAvatar, { props: { image: '/a.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('/a.png')
  })

  it('VdBadge renders content over its slot', () => {
    const wrapper = mountWith(VdBadge, {
      props: { content: 5 },
      slots: { default: () => h('button', 'inbox') },
    })
    expect(wrapper.find('.vd-badge__badge').text()).toBe('5')
    expect(wrapper.text()).toContain('inbox')
  })

  it('VdProgressLinear reflects the value as a width', () => {
    const wrapper = mountWith(VdProgressLinear, { props: { modelValue: 40 } })
    expect(wrapper.find('.vd-progress-linear__bar').attributes('style')).toContain('width: 40%')
  })

  it('VdProgressCircular sets a progressbar role', () => {
    const wrapper = mountWith(VdProgressCircular, { props: { modelValue: 50 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.find('circle.vd-progress-circular__overlay').exists()).toBe(true)
  })

  it('VdDivider is a separator; VdSpacer grows', () => {
    expect(mountWith(VdDivider).attributes('role')).toBe('separator')
    expect(mountWith(VdSpacer).classes()).toContain('vd-spacer')
  })
})
