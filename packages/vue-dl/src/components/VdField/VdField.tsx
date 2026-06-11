import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'

export const makeVdFieldProps = propsFactory(
  {
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    clearable: Boolean,
    hint: String as PropType<string>,
    persistentHint: Boolean,
    errorMessages: { type: Array as PropType<string[]>, default: () => [] },
    successMessages: { type: Array as PropType<string[]>, default: () => [] },
    focused: Boolean,
    active: Boolean,
    disabled: Boolean,
    loading: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdField'
)

export const VdField = genericComponent()({
  name: 'VdField',
  props: makeVdFieldProps(),
  emits: { 'click:clear': (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    const hasError = computed(() => props.errorMessages.length > 0)
    const hasSuccess = computed(() => !hasError.value && props.successMessages.length > 0)
    const message = computed(() => {
      if (hasError.value) return props.errorMessages[0]
      if (hasSuccess.value) return props.successMessages[0]
      return props.hint
    })
    const showMessage = computed(
      () =>
        hasError.value ||
        hasSuccess.value ||
        (!!props.hint && (props.persistentHint || props.focused))
    )

    const stateColor = computed(() => {
      if (hasError.value) return 'danger'
      if (hasSuccess.value) return 'success'
      return props.color
    })

    useRender(() => {
      const floating = props.labelPlaceholder && props.label

      return h(
        'div',
        {
          class: [
            'vd-field',
            {
              'vd-field--focused': props.focused,
              'vd-field--active': props.active || props.focused,
              'vd-field--error': hasError.value,
              'vd-field--success': hasSuccess.value,
              'vd-field--disabled': props.disabled,
              'vd-field--floating-label': floating,
            },
            props.class,
          ],
          style: [{ '--vd-field-color': `var(--vd-theme-${stateColor.value})` }, props.style],
        },
        [
          props.label && !floating
            ? h('label', { class: 'vd-field__label-top' }, props.label)
            : null,
          h('div', { class: 'vd-field__control' }, [
            props.prependIcon
              ? h(VdIcon, { icon: props.prependIcon, class: 'vd-field__prepend' })
              : null,
            h('div', { class: 'vd-field__input' }, [
              floating ? h('label', { class: 'vd-field__label' }, props.label) : null,
              slots.default?.(),
            ]),
            props.clearable && props.active
              ? h(VdIcon, {
                  icon: '$clear',
                  class: 'vd-field__clear',
                  size: 'small',
                  onClick: (e: MouseEvent) => emit('click:clear', e),
                })
              : null,
            props.appendIcon
              ? h(VdIcon, { icon: props.appendIcon, class: 'vd-field__append' })
              : null,
          ]),
          showMessage.value
            ? h(
                'div',
                {
                  class: ['vd-field__messages', { 'vd-field__messages--error': hasError.value }],
                },
                message.value
              )
            : null,
        ]
      )
    })
  },
})
