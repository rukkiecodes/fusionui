import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupProvide {
  modelValue: Ref<unknown>
  name: string
  color: Ref<string>
  disabled: Ref<boolean>
  select: (value: unknown) => void
}

export const FRadioGroupSymbol: InjectionKey<RadioGroupProvide> = Symbol.for('fusionui:radio-group')
