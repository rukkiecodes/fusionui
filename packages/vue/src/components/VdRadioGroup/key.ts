import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupProvide {
  modelValue: Ref<unknown>
  name: string
  color: Ref<string>
  disabled: Ref<boolean>
  select: (value: unknown) => void
}

export const VdRadioGroupSymbol: InjectionKey<RadioGroupProvide> = Symbol.for('vuedl:radio-group')
