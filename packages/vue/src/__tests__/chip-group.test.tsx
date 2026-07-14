import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { createFusionUI, FChip, FChipGroup } from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

describe('FChip colouring', () => {
  // Regression: FChip applied useVariant's `colorClasses`, which the theme injects
  // as `.text-primary { color: … !important }` into the LAST cascade layer. That
  // beat `.fui-chip--selected`'s colour, so a selected chip rendered primary text
  // on a primary fill — invisible. FBtn already avoids the utilities for exactly
  // this reason; FChip now carries its colour on CSS vars the same way.
  it('carries its colour on CSS vars, not on text-*/bg-* utility classes', () => {
    const wrapper = mountWith(FChip, { props: { color: 'primary' } })
    const chip = wrapper.find('.fui-chip')

    expect(chip.classes()).not.toContain('text-primary')
    expect(chip.classes()).not.toContain('bg-primary')
    expect(chip.attributes('style')).toContain('--fui-variant-color: var(--fui-theme-primary)')
    expect(chip.attributes('style')).toContain('--fui-variant-on: var(--fui-theme-on-primary)')
  })

  it('resolves an arbitrary hex colour to a triplet with a readable contrast', () => {
    const wrapper = mountWith(FChip, { props: { color: '#000000' } })
    const style = wrapper.find('.fui-chip').attributes('style')

    expect(style).toContain('--fui-variant-color: 0,0,0')
    // Black fill → white text.
    expect(style).toContain('--fui-variant-on: 255,255,255')
  })
})

describe('FChipGroup', () => {
  it('marks the chosen chip selected and reports the value', async () => {
    const wrapper = mountWith(FChipGroup, {
      props: { modelValue: null },
      slots: {
        default: () => [
          h(FChip, { value: 'design' }, () => 'Design'),
          h(FChip, { value: 'eng' }, () => 'Engineering'),
        ],
      },
    })

    const chips = wrapper.findAll('.fui-chip')
    await chips[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['eng'])
  })

  it('selects several chips when multiple', async () => {
    const wrapper = mountWith(FChipGroup, {
      props: { modelValue: [], multiple: true },
      slots: {
        default: () => [h(FChip, { value: 'a' }, () => 'A'), h(FChip, { value: 'b' }, () => 'B')],
      },
    })

    const chips = wrapper.findAll('.fui-chip')
    await chips[0].trigger('click')
    await chips[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['a', 'b']])
  })

  it('exposes toggle-button semantics on a selectable chip', () => {
    const wrapper = mountWith(FChipGroup, {
      slots: { default: () => [h(FChip, { value: 'a' }, () => 'A')] },
    })
    const chip = wrapper.find('.fui-chip')

    expect(chip.attributes('role')).toBe('button')
    expect(chip.attributes('aria-pressed')).toBe('false')
  })
})
