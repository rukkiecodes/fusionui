import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  createVueDL,
  genericComponent,
  makeVariantProps,
  Ripple,
  useRender,
  useVariant,
} from '../index'

// A throwaway component that exercises the full pipeline: createVueDL install →
// provide/inject → propsFactory → genericComponent → useVariant/useColor → useRender.
const VdProbe = genericComponent()({
  name: 'VdProbe',
  props: makeVariantProps({ variant: 'elevated' }),
  setup(props: { color?: string | null; variant?: string }) {
    const { colorClasses, colorStyles, variantClasses } = useVariant(props as never)
    useRender(() => (
      <div
        class={['vd-probe', ...variantClasses.value, ...colorClasses.value]}
        style={colorStyles.value}
      >
        probe
      </div>
    ))
  },
})

function mountProbe(props: Record<string, unknown>) {
  return mount(VdProbe as any, {
    props,
    global: { plugins: [createVueDL()] },
  })
}

describe('createVueDL + component pipeline', () => {
  it('installs and renders a component built from the runtime', () => {
    const wrapper = mountProbe({})
    expect(wrapper.classes()).toContain('vd-probe')
    expect(wrapper.classes()).toContain('vd-probe--variant-elevated')
  })

  it('resolves a named theme color to a utility class', () => {
    const wrapper = mountProbe({ color: 'primary' })
    // elevated variant → color applies to the background
    expect(wrapper.classes()).toContain('bg-primary')
    expect(wrapper.attributes('style') ?? '').not.toContain('background-color')
  })

  it('resolves a custom CSS color to an inline style', () => {
    const wrapper = mountProbe({ color: '#1f74ff' })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('background-color')
    // jsdom normalizes the hex to rgb
    expect(style).toContain('rgb(31, 116, 255)')
    expect(wrapper.classes()).not.toContain('bg-#1f74ff')
  })

  it('outlined variant applies color to text, not background', () => {
    const wrapper = mountProbe({ color: 'primary', variant: 'outlined' })
    expect(wrapper.classes()).toContain('text-primary')
    expect(wrapper.classes()).not.toContain('bg-primary')
  })
})

describe('v-ripple directive', () => {
  it('creates a ripple element on pointerdown', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    Ripple.mounted?.(el, { value: true, modifiers: {} } as never, null as never, null as never)
    el.dispatchEvent(new Event('pointerdown'))

    expect(el.querySelector('.vd-ripple__container')).not.toBeNull()
    expect(el.classList.contains('vd-ripple')).toBe(true)

    el.remove()
  })

  it('does not ripple when disabled', () => {
    const el = document.createElement('button')
    document.body.appendChild(el)

    Ripple.mounted?.(el, { value: false, modifiers: {} } as never, null as never, null as never)
    el.dispatchEvent(new Event('pointerdown'))

    expect(el.querySelector('.vd-ripple__container')).toBeNull()
    el.remove()
  })
})
