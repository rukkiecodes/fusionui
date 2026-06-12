import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { isCssColor, parseColor } from '../../util/colors'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'

export type FieldVariant = 'default' | 'underlined' | 'shadow'
export type FieldState = 'success' | 'danger' | 'warning' | 'primary' | 'dark'

export const makeVdFieldProps = propsFactory(
  {
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    color: String as PropType<string>,
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    // Manual state tint (success / danger / warning / primary).
    state: String as PropType<FieldState>,
    // Strength / progress bar (0–100); its color shifts with the value.
    progress: { type: [Number, String] as PropType<number | string>, default: 0 },
    square: Boolean,
    transparent: Boolean,
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
    // A field is "colored" only when a color/state is explicitly set — the
    // plain default field keeps its neutral, borderless focus (Vuesax).
    const colored = computed(() => !!stateColor.value)
    const fieldColor = computed(() => {
      const c = stateColor.value
      if (!c) return undefined
      if (isCssColor(c)) {
        if (c.startsWith('#') || c.startsWith('rgb')) {
          const { r, g, b } = parseColor(c)
          return `${r}, ${g}, ${b}`
        }
        return undefined
      }
      return `var(--vd-theme-${c})`
    })
    const tinted = computed(() => hasError.value || hasSuccess.value || !!props.state)

    const progressVal = computed(() => Math.max(0, Math.min(100, Number(props.progress) || 0)))
    const progressColor = computed(() =>
      progressVal.value < 34 ? 'danger' : progressVal.value < 67 ? 'warning' : 'success'
    )

    useRender(() => {
      const floating = props.labelPlaceholder && props.label
      // A plain `label` renders pinned in the same spot a floating label ends
      // up, so both modes are pixel-identical (Vuesax).
      const pinned = !!props.label && !floating
      // Space for overlays is reserved up-front (not when they appear), so the
      // field never resizes — and never shifts surrounding layout.
      const hasPrepend = !!props.prependIcon
      const hasAfter = !!(props.appendIcon || props.loading || props.clearable || slots.append)

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
              'vd-field--colored': colored.value,
              'vd-field--floating-label': floating,
              'vd-field--pinned-label': pinned,
              'vd-field--has-prepend': hasPrepend,
              'vd-field--has-after': hasAfter,
            },
            props.class,
          ],
          style: [
            fieldColor.value ? { '--vd-field-color': fieldColor.value } : undefined,
            props.style,
          ],
        },
        [
          h('div', { class: 'vd-field__control' }, [
            props.prependIcon
              ? h('span', { class: 'vd-field__prepend' }, [
                  h(VdIcon, { icon: props.prependIcon, class: 'vd-field__icon', size: '1em' }),
                ])
              : null,
            h('div', { class: 'vd-field__input' }, [
              floating || pinned
                ? h(
                    'label',
                    { class: ['vd-field__label', { 'vd-field__label--pinned': pinned }] },
                    props.label
                  )
                : null,
              slots.default?.(),
            ]),
            // Right-side overlay — absolutely positioned so showing/hiding the
            // spinner or clear button never resizes the field.
            hasAfter
              ? h('div', { class: 'vd-field__after' }, [
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
                ])
              : null,
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
          // Vuesax `message-{color}` slots — colored helper text below the field.
          ...['success', 'danger', 'warn', 'primary'].map(t =>
            slots[`message-${t}`]
              ? h('div', { class: ['vd-field__message', `vd-field__message--${t}`] }, [
                  slots[`message-${t}`](),
                ])
              : null
          ),
        ]
      )
    })
  },
})
