import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'

export type FieldVariant = 'default' | 'underlined' | 'shadow'
export type FieldState = 'success' | 'danger' | 'warning' | 'primary'

export const makeVdFieldProps = propsFactory(
  {
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    // Manual state tint (success / danger / warning / primary).
    state: String as PropType<FieldState>,
    // Strength / progress bar (0–100); its color shifts with the value.
    progress: { type: [Number, String] as PropType<number | string>, default: 0 },
    square: Boolean,
    transparent: Boolean,
    // Render prepend / append icons as little cards that lift on focus (Vuesax).
    iconCard: Boolean,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    clearable: Boolean,
    block: Boolean,
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
      if (props.state) return props.state
      return props.color
    })
    const tinted = computed(() => hasError.value || hasSuccess.value || !!props.state)

    const progressVal = computed(() => Math.max(0, Math.min(100, Number(props.progress) || 0)))
    const progressColor = computed(() =>
      progressVal.value < 34 ? 'danger' : progressVal.value < 67 ? 'warning' : 'success'
    )

    useRender(() => {
      const floating = props.labelPlaceholder && props.label

      return h(
        'div',
        {
          class: [
            'vd-field',
            `vd-field--variant-${props.variant}`,
            {
              'vd-field--focused': props.focused,
              'vd-field--active': props.active || props.focused,
              'vd-field--error': hasError.value,
              'vd-field--success': hasSuccess.value,
              'vd-field--tinted': tinted.value,
              'vd-field--disabled': props.disabled,
              'vd-field--loading': props.loading,
              'vd-field--block': props.block,
              'vd-field--square': props.square,
              'vd-field--transparent': props.transparent,
              'vd-field--icon-card': props.iconCard,
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
              ? h('span', { class: 'vd-field__prepend' }, [
                  h(VdIcon, { icon: props.prependIcon, class: 'vd-field__icon', size: '1em' }),
                ])
              : null,
            h('div', { class: 'vd-field__input' }, [
              floating ? h('label', { class: 'vd-field__label' }, props.label) : null,
              slots.default?.(),
            ]),
            props.loading ? h('span', { class: 'vd-field__loading' }) : null,
            props.clearable && props.active && !props.loading
              ? h(VdIcon, {
                  icon: '$clear',
                  class: 'vd-field__icon vd-field__clear',
                  size: '1.1em',
                  onClick: (e: MouseEvent) => emit('click:clear', e),
                })
              : null,
            props.appendIcon
              ? h('span', { class: 'vd-field__append' }, [
                  h(VdIcon, { icon: props.appendIcon, class: 'vd-field__icon', size: '1em' }),
                ])
              : null,
            slots.append?.(),
            props.variant === 'underlined' ? h('span', { class: 'vd-field__line' }) : null,
          ]),
          progressVal.value > 0
            ? h(
                'div',
                { class: ['vd-field__progress', `vd-field__progress--${progressColor.value}`] },
                [
                  h('div', {
                    class: 'vd-field__progress-bar',
                    style: { width: `${progressVal.value}%` },
                  }),
                ]
              )
            : null,
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
