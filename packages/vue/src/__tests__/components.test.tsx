import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  createFusionUI,
  FBtn,
  FBtnGroup,
  FCard,
  FAlert,
  FChip,
  FAvatar,
  FAvatarGroup,
  FBadge,
  FProgressCircular,
  FProgressLinear,
  FDivider,
  FSpacer,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}) {
  return mount(component, {
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

describe('FBtn', () => {
  it('renders the default elevated/primary button with content', () => {
    const wrapper = mountWith(FBtn, { slots: { default: () => 'Click' } })
    expect(wrapper.classes()).toContain('fui-btn')
    expect(wrapper.classes()).toContain('fui-btn--variant-elevated')
    // self-colored via CSS variable (no !important utility class)
    expect(wrapper.attributes('style') ?? '').toContain('--fui-variant-color')
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
      const wrapper = mountWith(FBtn, { props: { variant } })
      expect(wrapper.classes()).toContain(`fui-btn--variant-${variant}`)
    }
  })

  it('emits click and not when disabled', async () => {
    const wrapper = mountWith(FBtn, { props: { disabled: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    const disabled = mountWith(FBtn, { props: { disabled: true } })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
    expect(disabled.classes()).toContain('fui-btn--disabled')
  })

  it('shows a loader overlay when loading', () => {
    const wrapper = mountWith(FBtn, { props: { loading: true } })
    expect(wrapper.classes()).toContain('fui-btn--loading')
    expect(wrapper.find('.fui-btn__loader').exists()).toBe(true)
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('supports the new floating and shadow variants', () => {
    expect(mountWith(FBtn, { props: { variant: 'floating' } }).classes()).toContain(
      'fui-btn--variant-floating'
    )
    expect(mountWith(FBtn, { props: { variant: 'shadow' } }).classes()).toContain(
      'fui-btn--variant-shadow'
    )
  })

  it('renders an animate slot for hover transitions', () => {
    const wrapper = mountWith(FBtn, {
      props: { animationType: 'horizontal' },
      slots: { default: () => 'Hover', animate: () => 'Go' },
    })
    expect(wrapper.classes()).toContain('fui-btn--animate')
    expect(wrapper.find('.fui-btn__animate').text()).toBe('Go')
  })

  it('renders an icon-only button', () => {
    const wrapper = mountWith(FBtn, { props: { icon: '$success' } })
    expect(wrapper.classes()).toContain('fui-btn--icon')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders as an anchor when href is set', () => {
    const wrapper = mountWith(FBtn, { props: { href: 'https://example.com' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })
})

describe('FBtnGroup', () => {
  it('selects an item and emits the model', async () => {
    const wrapper = mountWith(FBtnGroup, {
      props: { 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [h(FBtn, { value: 'a' }, () => 'A'), h(FBtn, { value: 'b' }, () => 'B')],
      },
    })
    const buttons = wrapper.findAllComponents(FBtn)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })
})

describe('FCard', () => {
  it('renders title/text from props', () => {
    const wrapper = mountWith(FCard, {
      props: { title: 'Title', text: 'Body' },
    })
    expect(wrapper.find('.fui-card__title').text()).toBe('Title')
    expect(wrapper.find('.fui-card__text').text()).toContain('Body')
  })

  it('renders an image and the type modifier', () => {
    const wrapper = mountWith(FCard, { props: { type: '4', image: '/x.png' } })
    expect(wrapper.classes()).toContain('fui-card-content--type-4')
    expect(wrapper.find('.fui-card__img img').attributes('src')).toBe('/x.png')
  })
})

describe('FAlert', () => {
  it('maps type to a color var and a leading icon', () => {
    const wrapper = mountWith(FAlert, { props: { type: 'success', text: 'Done' } })
    expect(wrapper.find('.fui-alert').attributes('style')).toContain('--fui-theme-success')
    expect(wrapper.find('.fui-alert__icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Done')
  })

  it('closes when the close icon is clicked', async () => {
    const wrapper = mountWith(FAlert, { props: { closable: true, text: 'x' } })
    expect(wrapper.find('.fui-alert').exists()).toBe(true)
    await wrapper.find('.fui-alert__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.find('.fui-alert').exists()).toBe(false)
  })
})

describe('FChip', () => {
  it('renders content and a close affordance', async () => {
    const wrapper = mountWith(FChip, {
      props: { closable: true },
      slots: { default: () => 'Tag' },
    })
    expect(wrapper.text()).toContain('Tag')
    await wrapper.find('.fui-chip__close').trigger('click')
    expect(wrapper.emitted('click:close')).toHaveLength(1)
    expect(wrapper.find('.fui-chip').exists()).toBe(false)
  })
})

describe('FAvatar / FBadge / FProgress / FDivider / FSpacer', () => {
  it('FAvatar renders an image', () => {
    const wrapper = mountWith(FAvatar, { props: { image: '/a.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('/a.png')
  })

  it('FAvatarGroup shows the +N overflow on first render', () => {
    const wrapper = mountWith(FAvatarGroup, {
      props: { max: 2 },
      slots: { default: () => [h(FAvatar), h(FAvatar), h(FAvatar), h(FAvatar)] },
    })
    // 4 avatars, max 2 → one "+2" overlay present synchronously (no nextTick).
    const latest = wrapper.find('.fui-avatar__latest')
    expect(latest.exists()).toBe(true)
    expect(latest.text()).toBe('+2')
    expect(wrapper.findAll('.fui-avatar-content--hidden').length).toBe(2)
  })

  it('FBadge renders content over its slot', () => {
    const wrapper = mountWith(FBadge, {
      props: { content: 5 },
      slots: { default: () => h('button', 'inbox') },
    })
    expect(wrapper.find('.fui-badge__badge').text()).toBe('5')
    expect(wrapper.text()).toContain('inbox')
  })

  it('FProgressLinear reflects the value as a width', () => {
    const wrapper = mountWith(FProgressLinear, { props: { modelValue: 40 } })
    expect(wrapper.find('.fui-progress-linear__bar').attributes('style')).toContain('width: 40%')
  })

  it('FProgressCircular sets a progressbar role', () => {
    const wrapper = mountWith(FProgressCircular, { props: { modelValue: 50 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.find('circle.fui-progress-circular__overlay').exists()).toBe(true)
  })

  it('FDivider is a separator; FSpacer grows', () => {
    expect(mountWith(FDivider).attributes('role')).toBe('separator')
    expect(mountWith(FSpacer).classes()).toContain('fui-spacer')
  })
})
