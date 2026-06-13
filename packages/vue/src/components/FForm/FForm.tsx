import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeFormProps, createForm } from '../../composables/form'

export const makeFFormProps = propsFactory(
  {
    ...makeFormProps(),
    ...makeComponentProps(),
  },
  'FForm'
)

export const FForm = genericComponent()({
  name: 'FForm',
  props: makeFFormProps(),
  emits: {
    submit: (_e: Event) => true,
    'update:modelValue': (_v: boolean | null) => true,
  },
  setup(props: any, { slots, emit }: any) {
    const form = createForm(props)

    function onSubmit(e: Event): void {
      e.preventDefault()
      const valid = form.validate()
      if (valid) emit('submit', e)
    }

    useRender(() =>
      h(
        'form',
        {
          class: ['fui-form', props.class],
          style: props.style,
          novalidate: true,
          onSubmit,
        },
        slots.default?.({
          isValid: form.isValid.value,
          validate: form.validate,
          reset: form.reset,
          resetValidation: form.resetValidation,
        })
      )
    )
  },
})
