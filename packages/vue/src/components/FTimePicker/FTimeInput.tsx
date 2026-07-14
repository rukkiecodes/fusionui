import { computed, h, nextTick, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import type { FieldVariant } from '../FField'
import { FField } from '../FField'
import { FIcon } from '../FIcon'
import { FMenu } from '../FMenu'
import type { FMenuLocation } from '../FMenu'
import { FTimePicker } from './FTimePicker'
import type { AllowedTimeValues, TimeFormat } from './time'
import { formatTime, formatTimeLabel, parseTime } from './time'

export const makeFTimeInputProps = propsFactory(
  {
    /** `HH:mm` or `HH:mm:ss`, 24-hour — the same contract as `FTimePicker`. */
    modelValue: { type: String as PropType<string | null>, default: null },
    format: { type: String as PropType<TimeFormat>, default: '24hr' },
    min: String as PropType<string>,
    max: String as PropType<string>,
    allowedHours: [Array, Function] as PropType<AllowedTimeValues>,
    allowedMinutes: [Array, Function] as PropType<AllowedTimeValues>,
    allowedSeconds: [Array, Function] as PropType<AllowedTimeValues>,
    useSeconds: Boolean,
    scrollable: Boolean,
    pickerTitle: { type: String, default: 'Select time' },
    location: { type: String as PropType<FMenuLocation>, default: 'bottom' },
    // Field chrome — mirrors FInput.
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    placeholder: String as PropType<string>,
    color: String as PropType<string>,
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    state: String as PropType<'success' | 'danger' | 'warning' | 'primary' | 'dark'>,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    clearable: Boolean,
    loading: Boolean,
    square: Boolean,
    transparent: Boolean,
    hint: String as PropType<string>,
    persistentHint: Boolean,
    ...makeValidationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTimeInput'
)

/**
 * A text field that opens an `FTimePicker` in an `FMenu`. The text stays typable
 * (`21:30`, `9:30 pm`) — the picker is an alternative, not the only way in.
 */
export const FTimeInput = genericComponent()({
  name: 'FTimeInput',
  props: makeFTimeInputProps(),
  emits: {
    'update:modelValue': (_v: string | null) => true,
    'update:focused': (_v: boolean) => true,
  },
  setup(props: any, { emit, slots }: any) {
    provideTheme(props)

    const model = useProxiedModel(props, 'modelValue', null)
    const { errorMessages, successMessages, validate } = useValidation(props)

    const menu = ref(false)
    const focused = ref(false)
    const text = ref('')
    const inputRef = ref<HTMLInputElement | null>(null)
    const pickerRef = ref<HTMLElement | null>(null)

    const isInteractive = computed(() => !props.disabled && !props.readonly)
    const display = computed(() =>
      formatTimeLabel(parseTime(model.value as string | null), props.format, props.useSeconds)
    )
    const placeholder = computed(
      () =>
        props.placeholder ??
        (props.format === 'ampm'
          ? props.useSeconds
            ? 'hh:mm:ss AM'
            : 'hh:mm AM'
          : props.useSeconds
            ? 'HH:mm:ss'
            : 'HH:mm')
    )

    watch(display, value => (text.value = value), { immediate: true })

    function open(focusPicker = false): void {
      if (!isInteractive.value || menu.value) return
      menu.value = true
      if (focusPicker) {
        nextTick(() => {
          pickerRef.value?.querySelector<HTMLElement>('.fui-time-picker__list')?.focus()
        })
      }
    }

    function close(restoreFocus = true): void {
      if (!menu.value) return
      menu.value = false
      if (restoreFocus) nextTick(() => inputRef.value?.focus())
    }

    // Escape / outside-click close the menu from inside FMenu; pull focus back to
    // the field whenever that happens while focus is still in the (now gone) menu.
    watch(menu, isOpen => {
      if (isOpen || typeof document === 'undefined') return
      const active = document.activeElement
      if (!active || active === document.body) inputRef.value?.focus()
    })

    function commitText(): void {
      const raw = text.value.trim()
      if (!raw) {
        if (model.value != null) model.value = null
        return
      }
      const next = formatTime(parseTime(raw), props.useSeconds)
      if (next && next !== model.value) model.value = next
      // Unparsable input never becomes the model — snap back to the last good value.
      text.value = display.value
    }

    function onInput(e: Event): void {
      text.value = (e.target as HTMLInputElement).value
      const next = formatTime(parseTime(text.value), props.useSeconds)
      if (next && next !== model.value) model.value = next
    }

    function onFocus(): void {
      focused.value = true
      emit('update:focused', true)
    }

    function onBlur(): void {
      focused.value = false
      emit('update:focused', false)
      commitText()
      if (props.validateOn === 'blur') validate()
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!isInteractive.value) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        open(true)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        commitText()
        close(false)
      } else if (e.key === 'Escape' && menu.value) {
        close()
      }
    }

    function renderField() {
      return h(
        FField,
        {
          class: 'fui-time-input__field',
          label: props.label,
          labelPlaceholder: props.labelPlaceholder,
          color: props.color,
          variant: props.variant,
          state: props.state,
          square: props.square,
          transparent: props.transparent,
          prependIcon: props.prependIcon,
          clearable: props.clearable,
          loading: props.loading,
          hint: props.hint,
          persistentHint: props.persistentHint,
          errorMessages: errorMessages.value,
          successMessages: successMessages.value,
          focused: focused.value || menu.value,
          active: !!text.value,
          disabled: props.disabled,
          theme: props.theme,
          onClick: () => open(false),
          'onClick:clear': () => {
            model.value = null
            text.value = ''
          },
        },
        {
          default: ({ id }: { id?: string }) =>
            h('input', {
              ref: inputRef,
              id,
              class: 'fui-time-input__el',
              type: 'text',
              inputmode: 'numeric',
              autocomplete: 'off',
              value: text.value,
              placeholder: props.labelPlaceholder ? undefined : placeholder.value,
              disabled: props.disabled,
              readonly: props.readonly,
              'aria-haspopup': 'dialog',
              'aria-expanded': menu.value,
              onInput,
              onFocus,
              onBlur,
              onKeydown,
            }),
          append: () =>
            h(
              'button',
              {
                type: 'button',
                class: 'fui-time-input__toggle',
                tabindex: -1,
                disabled: props.disabled,
                'aria-label': menu.value ? 'Close time picker' : 'Open time picker',
                'aria-expanded': menu.value,
                'aria-haspopup': 'dialog',
                onClick: (e: MouseEvent) => {
                  e.stopPropagation()
                  if (menu.value) close()
                  else open(true)
                },
              },
              [h(FIcon, { icon: '$clock', size: '1.05em' })]
            ),
          ...Object.fromEntries(
            Object.keys(slots)
              .filter((k: string) => k.startsWith('message-'))
              .map((k: string) => [k, slots[k]])
          ),
        }
      )
    }

    useRender(() =>
      h(
        FMenu,
        {
          class: ['fui-time-input', props.class],
          style: props.style,
          modelValue: menu.value,
          'onUpdate:modelValue': (v: boolean) => (menu.value = v),
          location: props.location,
          closeOnContentClick: false,
          contentClass: 'fui-time-input__menu',
          disabled: !isInteractive.value,
        },
        {
          activator: () => renderField(),
          default: () =>
            h('div', { ref: pickerRef }, [
              h(FTimePicker, {
                modelValue: model.value,
                'onUpdate:modelValue': (v: string | null) => {
                  model.value = v
                  if (props.validateOn === 'input') validate()
                },
                format: props.format,
                min: props.min,
                max: props.max,
                allowedHours: props.allowedHours,
                allowedMinutes: props.allowedMinutes,
                allowedSeconds: props.allowedSeconds,
                useSeconds: props.useSeconds,
                scrollable: props.scrollable,
                title: props.pickerTitle,
                color: props.color ?? 'primary',
                readonly: props.readonly,
                theme: props.theme,
              }),
            ]),
        }
      )
    )
  },
})
