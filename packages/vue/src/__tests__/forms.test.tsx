import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import {
  createVueDL,
  VdInput,
  VdTextarea,
  VdInputNumber,
  VdCheckbox,
  VdSwitch,
  VdRadioGroup,
  VdRadio,
  VdSlider,
  VdSelect,
  VdUpload,
  VdForm,
} from '../index'

function mountWith(component: any, options: Record<string, any> = {}): any {
  return mount(component, {
    ...options,
    global: { plugins: [createVueDL()], ...(options.global ?? {}) },
  })
}

describe('VdInput', () => {
  it('two-way binds via v-model', async () => {
    const wrapper = mountWith(VdInput, {
      props: { modelValue: '', 'onUpdate:modelValue': () => {} },
    })
    const input = wrapper.find('input')
    await input.setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hello'])
  })

  it('floats the label when active and shows validation errors', async () => {
    const wrapper = mountWith(VdInput, {
      props: {
        modelValue: '',
        label: 'Email',
        labelPlaceholder: true,
        rules: [(v: string) => (!!v && v.includes('@')) || 'Invalid email'],
        'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue('nope')
    expect(wrapper.find('.vd-field__messages--error').text()).toBe('Invalid email')
    expect(wrapper.find('.vd-field--active').exists()).toBe(true)
  })

  it('clears the value via the clear affordance', async () => {
    const wrapper = mountWith(VdInput, {
      props: { modelValue: 'text', clearable: true, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('.vd-field__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })
})

describe('VdTextarea / VdInputNumber', () => {
  it('VdTextarea binds text', async () => {
    const wrapper = mountWith(VdTextarea, {
      props: { modelValue: '', 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('textarea').setValue('multi\nline')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['multi\nline'])
  })

  it('VdInputNumber increments and clamps to max', async () => {
    const wrapper = mountWith(VdInputNumber, {
      props: {
        modelValue: 4,
        max: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    const buttons = wrapper.findAll('.vd-input-number__btn')
    await buttons[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(5)
    await buttons[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(5)
  })
})

describe('selection controls', () => {
  it('VdCheckbox toggles boolean model', async () => {
    const wrapper = mountWith(VdCheckbox, {
      props: { modelValue: false, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('VdCheckbox supports array model', async () => {
    const model = ref<string[]>([])
    const wrapper = mountWith(VdCheckbox, {
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

  it('VdSwitch toggles', async () => {
    const wrapper = mountWith(VdSwitch, {
      props: { modelValue: false, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('VdRadioGroup selects a radio by value', async () => {
    const wrapper = mountWith(VdRadioGroup, {
      props: { modelValue: null, 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [h(VdRadio, { value: 'x' }), h(VdRadio, { value: 'y' })],
      },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['y'])
  })
})

describe('VdSlider', () => {
  it('moves with arrow keys', async () => {
    const wrapper = mountWith(VdSlider, {
      props: {
        modelValue: 50,
        step: 5,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('.vd-slider__thumb').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toBe(55)
  })
})

describe('VdSelect', () => {
  it('opens, selects an item, and reflects the title', async () => {
    const wrapper = mountWith(VdSelect, {
      props: {
        modelValue: undefined,
        items: [
          { title: 'One', value: 1 },
          { title: 'Two', value: 2 },
        ],
        'onUpdate:modelValue': (v: unknown) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('.vd-field').trigger('click')
    expect(wrapper.findAll('.vd-select__option')).toHaveLength(2)
    await wrapper.findAll('.vd-select__option')[1].trigger('click')
    expect(wrapper.props('modelValue')).toBe(2)
    expect(wrapper.find('.vd-select__selection').text()).toContain('Two')
  })
})

describe('VdUpload', () => {
  it('lists files added through the input', async () => {
    const wrapper = mountWith(VdUpload, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (v: File[]) => wrapper.setProps({ modelValue: v }),
      },
    })
    const file = new File(['x'], 'note.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')
    expect(wrapper.find('.vd-upload__name').text()).toBe('note.txt')
  })
})

describe('VdForm', () => {
  it('validates registered fields and blocks submit when invalid', async () => {
    const wrapper = mountWith(VdForm, {
      slots: {
        default: () => h(VdInput, { modelValue: '', rules: [(v: string) => !!v || 'Required'] }),
      },
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('.vd-field__messages--error').text()).toBe('Required')
  })
})
