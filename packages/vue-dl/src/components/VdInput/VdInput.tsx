import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { VdField } from '../VdField'

export const makeVdInputProps = propsFactory(
  {
    modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
    type: { type: String, default: 'text' },
    placeholder: String as PropType<string>,
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    clearable: Boolean,
    hint: String as PropType<string>,
    persistentHint: Boolean,
    ...makeValidationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdInput'
)

export const VdInput = genericComponent()({
  name: 'VdInput',
  props: makeVdInputProps(),
  emits: {
    'update:modelValue': (_v: string | number) => true,
    'update:focused': (_v: boolean) => true,
  },
  setup(props: any, { emit }: any) {
    const model = useProxiedModel(props, 'modelValue', '')
    const { errorMessages, validate } = useValidation(props)
    const focused = ref(false)

    const isActive = computed(() => focused.value || (model.value != null && model.value !== ''))

    function onInput(e: Event): void {
      model.value = (e.target as HTMLInputElement).value
    }
    function onFocus(): void {
      focused.value = true
      emit('update:focused', true)
    }
    function onBlur(): void {
      focused.value = false
      emit('update:focused', false)
      if (props.validateOn === 'blur') validate()
    }

    useRender(() =>
      h(
        VdField,
        {
          class: ['vd-input', props.class],
          style: props.style,
          label: props.label,
          labelPlaceholder: props.labelPlaceholder,
          color: props.color,
          prependIcon: props.prependIcon,
          appendIcon: props.appendIcon,
          clearable: props.clearable,
          hint: props.hint,
          persistentHint: props.persistentHint,
          errorMessages: errorMessages.value,
          focused: focused.value,
          active: isActive.value,
          disabled: props.disabled,
          theme: props.theme,
          'onClick:clear': () => {
            model.value = ''
          },
        },
        {
          default: () =>
            h('input', {
              class: 'vd-input__el',
              type: props.type,
              value: model.value,
              placeholder: props.labelPlaceholder ? undefined : props.placeholder,
              disabled: props.disabled,
              readonly: props.readonly,
              onInput,
              onFocus,
              onBlur,
            }),
        }
      )
    )
  },
})
