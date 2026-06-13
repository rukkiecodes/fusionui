import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getCurrentInstance } from '../util/getCurrentInstance'
import { getUid } from '../util/helpers'
import { useForm } from './form'

export type ValidationResult = string | boolean
export type ValidationRule = ValidationResult | ((value: unknown) => ValidationResult)

export const makeValidationProps = propsFactory(
  {
    rules: {
      type: Array as PropType<ValidationRule[]>,
      default: () => [],
    },
    error: Boolean,
    errorMessages: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    successMessages: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    validateOn: {
      type: String as PropType<'input' | 'blur' | 'submit'>,
      default: 'input',
    },
    disabled: Boolean,
    readonly: Boolean,
  },
  'validation'
)

function wrap(value: string | string[]): string[] {
  return Array.isArray(value) ? value : value ? [value] : []
}

/**
 * Shared validation engine for form controls: runs `rules` against the current
 * model value, exposes `errorMessages`/`isValid`, and registers the field with
 * the surrounding `FForm` (if any).
 */
export function useValidation(props: {
  rules: ValidationRule[]
  error: boolean
  errorMessages: string | string[]
  successMessages: string | string[]
  validateOn: 'input' | 'blur' | 'submit'
  modelValue?: unknown
}) {
  const form = useForm()
  const vm = getCurrentInstance('useValidation')
  const id = getUid()
  const internalErrors = ref<string[]>([])
  const isPristine = ref(true)

  const errorMessages = computed(() => [...wrap(props.errorMessages), ...internalErrors.value])
  const successMessages = computed(() => wrap(props.successMessages))

  const isValid = computed<boolean | null>(() => {
    if (props.error || errorMessages.value.length) return false
    if (!props.rules.length) return true
    return isPristine.value ? null : internalErrors.value.length === 0
  })

  function validate(): boolean {
    const errors: string[] = []
    const value = (vm.props as { modelValue?: unknown }).modelValue
    for (const rule of props.rules) {
      const result = typeof rule === 'function' ? rule(value) : rule
      if (result === true) continue
      errors.push(typeof result === 'string' ? result : '')
    }
    internalErrors.value = errors
    isPristine.value = false
    return errors.length === 0
  }

  function resetValidation(): void {
    isPristine.value = true
    internalErrors.value = []
  }

  function reset(): void {
    resetValidation()
  }

  if (props.validateOn === 'input') {
    watch(
      () => (vm.props as { modelValue?: unknown }).modelValue,
      () => {
        if (props.rules.length) validate()
      }
    )
  }

  if (form) {
    form.register({ id, validate, reset, resetValidation, isValid })
    onBeforeUnmount(() => form.unregister(id))
  }

  return {
    errorMessages,
    successMessages,
    isValid,
    isPristine,
    validate,
    reset,
    resetValidation,
  }
}
