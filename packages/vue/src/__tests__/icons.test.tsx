import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Bell, featherAliases } from '@fusionui/icons'
import { createFusionUI, FIcon, createIcons } from '../index'

function mountIcon(props: Record<string, unknown>) {
  return mount(FIcon as any, {
    props,
    global: { plugins: [createFusionUI()] },
  })
}

describe('createIcons', () => {
  it('defaults to the feather set and ships semantic aliases', () => {
    const icons = createIcons()
    expect(icons.defaultSet).toBe('feather')
    expect(icons.aliases.close).toBe(featherAliases.close)
    expect(icons.aliases.success).toBeDefined()
  })

  it('merges consumer aliases over the defaults', () => {
    const custom = () => null
    const icons = createIcons({ aliases: { close: custom } })
    expect(icons.aliases.close).toBe(custom)
  })
})

describe('FIcon', () => {
  it('renders a Feather component icon as an svg', () => {
    const wrapper = mountIcon({ icon: Bell })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    // Feather bell = two paths
    expect(wrapper.findAll('path').length).toBe(2)
    expect(svg.classes()).toContain('fui-feather-bell')
  })

  it('resolves a $ alias to the mapped feather icon', () => {
    const wrapper = mountIcon({ icon: '$close' })
    // close → X icon = two lines
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('line').length).toBe(2)
  })

  it('applies size as a font-size and supports tokens', () => {
    const px = mountIcon({ icon: Bell, size: 'large' })
    expect(px.attributes('style') ?? '').toContain('font-size: 36px')

    const num = mountIcon({ icon: Bell, size: 40 })
    expect(num.attributes('style') ?? '').toContain('font-size: 40px')
  })

  it('applies a theme color as a text utility class', () => {
    const wrapper = mountIcon({ icon: Bell, color: 'primary' })
    expect(wrapper.classes()).toContain('text-primary')
  })

  it('adds spacing + spin modifier classes', () => {
    const wrapper = mountIcon({ icon: Bell, start: true, spin: true })
    expect(wrapper.classes()).toContain('fui-icon--start')
    expect(wrapper.classes()).toContain('fui-icon--spin')
  })

  it('renders a raw SVG path string via the svg set', () => {
    const wrapper = mountIcon({ icon: ['M2 2L22 22'] })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBe('M2 2L22 22')
  })
})
