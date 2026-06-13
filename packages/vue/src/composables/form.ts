import { computed, inject, provide, shallowRef } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { propsFactory } from '../util/propsFactory'

export interface FormField {
  id: number
  validate: () => boolean
  reset: () => void
  resetValidation: () => void
  isValid: Ref<boolean | null>
}

export interface FormProvide {
  register: (field: FormField) => void
  unregister: (id: number) => void
  isValid: ComputedRef<boolean | null>
  validate: () => boolean
  reset: () => void
  resetValidation: () => void
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
}

export const FormSymbol: InjectionKey<FormProvide> = Symbol.for('fusionui:form')

export const makeFormProps = propsFactory(
  {
    disabled: Boolean,
    readonly: Boolean,
  },
  'form'
)

export function createForm(props: { disabled?: boolean; readonly?: boolean }): FormProvide {
  // shallowRef + reassignment keeps each field's `isValid` Ref intact (a deep
  // reactive would unwrap it) while still reacting to register/unregister.
  const fields = shallowRef<FormField[]>([])

  function register(field: FormField): void {
    fields.value = [...fields.value, field]
  }
  function unregister(id: number): void {
    fields.value = fields.value.filter(f => f.id !== id)
  }
  function validate(): boolean {
    return fields.value.map(f => f.validate()).every(Boolean)
  }
  function reset(): void {
    fields.value.forEach(f => f.reset())
  }
  function resetValidation(): void {
    fields.value.forEach(f => f.resetValidation())
  }

  const isValid = computed<boolean | null>(() => {
    const results = fields.value.map(f => f.isValid.value)
    if (results.some(r => r === false)) return false
    if (results.some(r => r === null)) return null
    return true
  })

  const provided: FormProvide = {
    register,
    unregister,
    isValid,
    validate,
    reset,
    resetValidation,
    disabled: computed(() => !!props.disabled),
    readonly: computed(() => !!props.readonly),
  }

  provide(FormSymbol, provided)
  return provided
}

export function useForm(): FormProvide | null {
  return inject(FormSymbol, null)
}
