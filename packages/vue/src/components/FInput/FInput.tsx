import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import type { FieldVariant } from '../FField'
import { FField } from '../FField'
import { FIcon } from '../FIcon'

export const makeFInputProps = propsFactory(
  {
    modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
    type: { type: String, default: 'text' },
    placeholder: String as PropType<string>,
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: String as PropType<string>,
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    state: String as PropType<'success' | 'danger' | 'warning' | 'primary' | 'dark'>,
    progress: { type: [Number, String] as PropType<number | string>, default: 0 },
    square: Boolean,
    transparent: Boolean,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    clearable: Boolean,
    block: Boolean,
    loading: Boolean,
    hint: String as PropType<string>,
    persistentHint: Boolean,
    ...makeValidationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FInput'
)

export const FInput = genericComponent()({
  name: 'FInput',
  props: makeFInputProps(),
  emits: {
    'update:modelValue': (_v: string | number) => true,
    'update:focused': (_v: boolean) => true,
  },
  setup(props: any, { emit, slots }: any) {
    const model = useProxiedModel(props, 'modelValue', '')
    const { errorMessages, successMessages, validate } = useValidation(props)
    const focused = ref(false)
    const reveal = ref(false)

    const isActive = computed(() => focused.value || (model.value != null && model.value !== ''))
    const isPassword = computed(() => props.type === 'password')
    const inputType = computed(() => (isPassword.value && reveal.value ? 'text' : props.type))
    const showReveal = computed(() => isPassword.value && !props.appendIcon)

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
        FField,
        {
          class: ['fui-input', props.class],
          style: props.style,
          label: props.label,
          labelPlaceholder: props.labelPlaceholder,
          color: props.color,
          variant: props.variant,
          state: props.state,
          progress: props.progress,
          square: props.square,
          transparent: props.transparent,
          prependIcon: props.prependIcon,
          appendIcon: props.appendIcon,
          clearable: props.clearable,
          block: props.block,
          loading: props.loading,
          hint: props.hint,
          persistentHint: props.persistentHint,
          errorMessages: errorMessages.value,
          successMessages: successMessages.value,
          focused: focused.value,
          active: isActive.value,
          disabled: props.disabled,
          theme: props.theme,
          'onClick:clear': () => {
            model.value = ''
          },
        },
        {
          default: ({ id }: { id?: string }) =>
            h('input', {
              id,
              class: 'fui-input__el',
              type: inputType.value,
              value: model.value,
              placeholder: props.labelPlaceholder ? undefined : props.placeholder,
              disabled: props.disabled,
              readonly: props.readonly,
              onInput,
              onFocus,
              onBlur,
            }),
          append: showReveal.value
            ? () =>
                h(FIcon, {
                  icon: reveal.value ? 'eye-off' : 'eye',
                  class: 'fui-field__icon fui-field__reveal',
                  size: '1.15em',
                  onClick: () => {
                    reveal.value = !reveal.value
                  },
                })
            : undefined,
          // Forward Vuesax-style `message-{color}` slots to the field.
          ...Object.fromEntries(
            Object.keys(slots)
              .filter((k: string) => k.startsWith('message-'))
              .map((k: string) => [k, slots[k]])
          ),
        }
      )
    )
  },
})
