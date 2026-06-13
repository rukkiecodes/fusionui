import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FField } from '../FField'

export const makeVdTextareaProps = propsFactory(
  {
    modelValue: { type: String, default: '' },
    label: String as PropType<string>,
    placeholder: String as PropType<string>,
    color: String as PropType<string>,
    rows: { type: [Number, String], default: 4 },
    hint: String as PropType<string>,
    persistentHint: Boolean,
    ...makeValidationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTextarea'
)

export const FTextarea = genericComponent()({
  name: 'FTextarea',
  props: makeVdTextareaProps(),
  emits: { 'update:modelValue': (_v: string) => true },
  setup(props: any) {
    const model = useProxiedModel(props, 'modelValue', '')
    const { errorMessages, validate } = useValidation(props)
    const focused = ref(false)
    const isActive = computed(() => focused.value || !!model.value)

    useRender(() =>
      h(
        FField,
        {
          class: ['fui-textarea', props.class],
          style: props.style,
          label: props.label,
          color: props.color,
          hint: props.hint,
          persistentHint: props.persistentHint,
          errorMessages: errorMessages.value,
          focused: focused.value,
          active: isActive.value,
          disabled: props.disabled,
          theme: props.theme,
        },
        {
          default: () =>
            h('textarea', {
              class: 'fui-textarea__el',
              rows: props.rows,
              value: model.value,
              placeholder: props.placeholder,
              disabled: props.disabled,
              readonly: props.readonly,
              onInput: (e: Event) => {
                model.value = (e.target as HTMLTextAreaElement).value
              },
              onFocus: () => {
                focused.value = true
              },
              onBlur: () => {
                focused.value = false
                if (props.validateOn === 'blur') validate()
              },
            }),
        }
      )
    )
  },
})
