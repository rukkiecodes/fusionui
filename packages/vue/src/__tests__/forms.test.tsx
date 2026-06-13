import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import {
  createFusionUI,
  FInput,
  FTextarea,
  FInputNumber,
  FCheckbox,
  FSwitch,
  FRadioGroup,
  FRadio,
  FSlider,
  FSelect,
  FUpload,
  FForm,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createFusionUI()], ...(options.global ?? {}) },
  })
}

describe('FInput', () => {
  it('two-way binds via v-model', async () => {
    const wrapper = mountWith(FInput, {
      props: { modelValue: '', 'onUpdate:modelValue': () => {} },
    })
    const input = wrapper.find('input')
    await input.setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hello'])
  })

  it('floats the label when active and shows validation errors', async () => {
    const wrapper = mountWith(FInput, {
      props: {
        modelValue: '',
        label: 'Email',
        labelPlaceholder: true,
        rules: [(v: string) => (!!v && v.includes('@')) || 'Invalid email'],
        'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue('nope')
    expect(wrapper.find('.fui-field__messages--error').text()).toBe('Invalid email')
    expect(wrapper.find('.fui-field--active').exists()).toBe(true)
  })

  it('clears the value via the clear affordance', async () => {
    const wrapper = mountWith(FInput, {
      props: { modelValue: 'text', clearable: true, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('.fui-field__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })
})

describe('FTextarea / FInputNumber', () => {
  it('FTextarea binds text', async () => {
    const wrapper = mountWith(FTextarea, {
      props: { modelValue: '', 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('textarea').setValue('multi\nline')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['multi\nline'])
  })

  it('FInputNumber increments and clamps to max', async () => {
    const wrapper = mountWith(FInputNumber, {
      props: {
        modelValue: 4,
        max: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    const buttons = wrapper.findAll('.fui-input-number__btn')
    await buttons[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(5)
    await buttons[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(5)
  })
})

describe('selection controls', () => {
  it('FCheckbox toggles boolean model', async () => {
    const wrapper = mountWith(FCheckbox, {
      props: { modelValue: false, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('FCheckbox supports array model', async () => {
    const model = ref<string[]>([])
    const wrapper = mountWith(FCheckbox, {
      props: {
        modelValue: model.value,
        value: 'a',
        'onUpdate:modelValue': (v: string[]) => {
          model.value = v
          wrapper.setProps({ modelValue: v })
        },
      },
    })
    await wrapper.find('input').trigger('change')
    expect(model.value).toEqual(['a'])
  })

  it('FSwitch toggles', async () => {
    const wrapper = mountWith(FSwitch, {
      props: { modelValue: false, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('FRadioGroup selects a radio by value', async () => {
    const wrapper = mountWith(FRadioGroup, {
      props: { modelValue: null, 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [h(FRadio, { value: 'x' }), h(FRadio, { value: 'y' })],
      },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['y'])
  })
})

describe('FSlider', () => {
  it('moves with arrow keys', async () => {
    const wrapper = mountWith(FSlider, {
      props: {
        modelValue: 50,
        step: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('.fui-slider__thumb').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toBe(55)
  })
})

describe('FSelect', () => {
  it('opens, selects an item, and reflects the title', async () => {
    const wrapper = mountWith(FSelect, {
      props: {
        modelValue: undefined,
        items: [
          { title: 'One', value: 1 },
          { title: 'Two', value: 2 },
        ],
        'onUpdate:modelValue': (v: unknown) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('.fui-field').trigger('click')
    expect(wrapper.findAll('.fui-select__option')).toHaveLength(2)
    await wrapper.findAll('.fui-select__option')[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(2)
    expect(wrapper.find('.fui-select__selection').text()).toContain('Two')
  })
})

describe('FUpload', () => {
  it('lists files added through the input', async () => {
    const wrapper = mountWith(FUpload, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (v: File[]) => wrapper.setProps({ modelValue: v }),
      },
    })
    const file = new File(['x'], 'note.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')
    expect(wrapper.find('.fui-upload__name').text()).toBe('note.txt')
  })
})

describe('FForm', () => {
  it('validates registered fields and blocks submit when invalid', async () => {
    const wrapper = mountWith(FForm, {
      slots: {
        default: () => h(FInput, { modelValue: '', rules: [(v: string) => !!v || 'Required'] }),
      },
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('.fui-field__messages--error').text()).toBe('Required')
  })
})
