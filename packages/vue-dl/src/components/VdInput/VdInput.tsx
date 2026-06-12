import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import type { FieldVariant } from '../VdField'
import { VdField } from '../VdField'
import { VdIcon } from '../VdIcon'

export const makeVdInputProps = propsFactory(
  {
    modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
    type: { type: String, default: 'text' },
    placeholder: String as PropType<string>,
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    state: String as PropType<'success' | 'danger' | 'warning' | 'primary'>,
    progress: { type: [Number, String] as PropType<number | string>, default: 0 },
    square: Boolean,
    transparent: Boolean,
    iconCard: Boolean,
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
        VdField,
        {
          class: ['vd-input', props.class],
          style: props.style,
          label: props.label,
          labelPlaceholder: props.labelPlaceholder,
          color: props.color,
          variant: props.variant,
          state: props.state,
          progress: props.progress,
          square: props.square,
          transparent: props.transparent,
          iconCard: props.iconCard,
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
          default: () =>
            h('input', {
              class: 'vd-input__el',
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
                h(VdIcon, {
                  icon: reveal.value ? 'eye-off' : 'eye',
                  class: 'vd-field__icon vd-field__reveal',
                  size: '1.15em',
                  onClick: () => {
                    reveal.value = !reveal.value
                  },
                })
            : undefined,
        }
      )
    )
  },
})
