import { computed, h, nextTick, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import type { FieldVariant } from '../FField'
import { FField } from '../FField'
import { FMenu } from '../FMenu'
import type { FMenuLocation } from '../FMenu'
import { FDatePicker } from '../FDatePicker'
import type { FDatePickerView } from '../FDatePicker'
import { formatDate, isDateAllowed, parseDate, sortRange } from '../FDatePicker/date'
import type { AllowedDates, DateLike } from '../FDatePicker/date'

export type FDateInputFormat = string | ((date: Date) => string)

function wrap(value: unknown): unknown[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export const makeFDateInputProps = propsFactory(
  {
    /** `Date` (default), `Date[]` with `multiple`, or `[start, end]` with `range`. */
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    multiple: Boolean,
    range: Boolean,
    /** A token pattern (see `formatDate`) or a function that renders the value. */
    format: {
      type: [String, Function] as PropType<FDateInputFormat>,
      default: 'YYYY-MM-DD',
    },
    /** Show the picker. Bindable with `v-model:menu`. */
    menu: Boolean,
    menuLocation: { type: String as PropType<FMenuLocation>, default: 'bottom' },
    min: [String, Number, Date] as PropType<DateLike>,
    max: [String, Number, Date] as PropType<DateLike>,
    allowedDates: [Array, Function] as PropType<AllowedDates>,
    showAdjacentMonths: { type: Boolean, default: true },
    showWeek: Boolean,
    firstDayOfWeek: { type: [Number, String] as PropType<number | string>, default: 0 },
    view: { type: String as PropType<FDatePickerView>, default: 'month' },
    locale: { type: String as PropType<string>, default: 'en-US' },
    hideHeader: { type: Boolean, default: true },
    // ---- field chrome (mirrors FInput) ----
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    placeholder: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    state: String as PropType<'success' | 'danger' | 'warning' | 'primary' | 'dark'>,
    square: Boolean,
    transparent: Boolean,
    prependIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$calendar' },
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
  'FDateInput'
)

/**
 * A date text field that opens an `FDatePicker` in an `FMenu`. The field chrome
 * is `FField` (same as `FInput`/`FSelect`), so labels, hints, errors, rules and
 * the clear button all behave identically.
 *
 * Keyboard: `ArrowDown` (or `Alt`+`ArrowDown`) opens the picker and moves focus
 * into the day grid; `Escape` closes it and returns focus to the input; typing a
 * date and pressing `Enter`/blurring parses it.
 */
export const FDateInput = genericComponent()({
  name: 'FDateInput',
  props: makeFDateInputProps(),
  emits: {
    'update:modelValue': (_v: unknown) => true,
    'update:menu': (_v: boolean) => true,
    'update:focused': (_v: boolean) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    // Generated in setup so the server and client agree — `aria-controls` on the
    // input has to name the picker the menu reveals.
    const pickerId = `fui-date-picker-${getUid()}`

    const model = useProxiedModel(
      props,
      'modelValue',
      undefined,
      (v: unknown) =>
        wrap(v)
          .map(d => parseDate(d as DateLike))
          .filter(Boolean) as Date[],
      (v: Date[]) => (props.multiple || props.range ? v : (v[0] ?? null))
    )
    const menu = useProxiedModel(props, 'menu', false)
    const { errorMessages, successMessages, validate } = useValidation(props)

    const focused = ref(false)
    /** What the user is typing; `null` while the field mirrors the model. */
    const draft = ref<string | null>(null)
    const inputRef = ref<HTMLInputElement>()
    const pickerRef = ref<{ focusGrid: () => void }>()

    const constraints = computed(() => ({
      min: parseDate(props.min),
      max: parseDate(props.max),
      allowed: props.allowedDates,
    }))

    function render(date: Date): string {
      if (typeof props.format === 'function') return props.format(date)
      return formatDate(date, props.format, props.locale)
    }

    /** The read-only text shown when the user isn't mid-edit. */
    const display = computed(() => {
      const value = model.value
      if (!value.length) return ''
      if (props.range) {
        const [start, end] = value
        return end ? `${render(start)} – ${render(end)}` : render(start)
      }
      if (props.multiple) {
        if (value.length <= 2) return value.map(render).join(', ')
        return `${value.length} dates selected`
      }
      return render(value[0])
    })

    const text = computed(() => draft.value ?? display.value)
    const isActive = computed(() => focused.value || menu.value || !!text.value)
    /** Free typing only makes sense for a single date. */
    const typeable = computed(
      () => !props.multiple && !props.range && !props.readonly && !props.disabled
    )
    const interactive = computed(() => !props.disabled && !props.readonly)

    function commit(raw: string): void {
      const value = raw.trim()
      if (!value) {
        model.value = []
        draft.value = null
        return
      }
      const parsed = parseDate(value)
      if (parsed && isDateAllowed(parsed, constraints.value)) {
        model.value = [parsed]
        draft.value = null
      } else {
        // Unparseable — snap back to the last good value.
        draft.value = null
      }
      if (props.validateOn !== 'submit') validate()
    }

    function openMenu(moveFocus: boolean): void {
      if (!interactive.value || menu.value) return
      menu.value = true
      if (moveFocus) nextTick(() => pickerRef.value?.focusGrid())
    }

    function closeMenu(restoreFocus: boolean): void {
      if (!menu.value) return
      menu.value = false
      if (restoreFocus) nextTick(() => inputRef.value?.focus())
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!interactive.value) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (menu.value) pickerRef.value?.focusGrid()
        else openMenu(true)
        return
      }
      if (e.key === 'Escape' && menu.value) {
        e.preventDefault()
        closeMenu(true)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (typeable.value && draft.value != null) commit(draft.value)
        closeMenu(true)
      }
    }

    function onBlur(): void {
      focused.value = false
      emit('update:focused', false)
      if (typeable.value && draft.value != null) commit(draft.value)
      if (props.validateOn === 'blur') validate()
    }

    // A single date closes the picker as soon as it is chosen; multiple/range
    // keep it open so the next click continues the selection.
    watch(
      () => model.value.map((d: Date) => d.getTime()).join(),
      () => {
        if (props.validateOn === 'input') validate()
        if (props.multiple) return
        if (props.range && model.value.length < 2) return
        if (menu.value) closeMenu(true)
      }
    )

    useRender(() =>
      h(
        FMenu,
        {
          modelValue: menu.value,
          'onUpdate:modelValue': (v: boolean) => {
            menu.value = v
          },
          location: props.menuLocation,
          closeOnContentClick: false,
          disabled: !interactive.value,
          class: ['fui-date-input', props.class],
          contentClass: 'fui-date-input__menu',
          style: props.style,
        },
        {
          activator: ({ props: activatorProps }: any) =>
            h(
              FField,
              {
                class: 'fui-date-input__field',
                label: props.label,
                labelPlaceholder: props.labelPlaceholder,
                color: props.color,
                variant: props.variant,
                state: props.state,
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
                focused: focused.value || menu.value,
                active: isActive.value,
                disabled: props.disabled,
                theme: props.theme,
                onClick: (e: MouseEvent) => {
                  if (!interactive.value) return
                  const target = e.target as HTMLElement | null
                  // The clear button owns its own click — never toggle on it.
                  if (target?.closest?.('.fui-field__clear')) return
                  // The calendar icon is a deliberate "open the picker" affordance;
                  // clicking the text keeps the caret so the value stays typeable.
                  const onIcon = !!target?.closest?.('.fui-field__prepend')
                  if (menu.value) closeMenu(onIcon)
                  else {
                    activatorProps.onClick()
                    if (onIcon) nextTick(() => pickerRef.value?.focusGrid())
                  }
                },
                'onClick:clear': () => {
                  model.value = []
                  draft.value = null
                  inputRef.value?.focus()
                },
              },
              {
                default: ({ id }: { id?: string }) =>
                  h('input', {
                    id,
                    ref: inputRef,
                    class: 'fui-date-input__el',
                    type: 'text',
                    value: text.value,
                    placeholder: props.labelPlaceholder
                      ? undefined
                      : (props.placeholder ??
                        (typeof props.format === 'string' ? props.format : undefined)),
                    disabled: props.disabled,
                    readonly: props.readonly || !typeable.value,
                    autocomplete: 'off',
                    role: 'combobox',
                    'aria-haspopup': 'dialog',
                    'aria-expanded': menu.value ? 'true' : 'false',
                    'aria-controls': pickerId,
                    onInput: (e: Event) => {
                      draft.value = (e.target as HTMLInputElement).value
                    },
                    onFocus: () => {
                      focused.value = true
                      emit('update:focused', true)
                    },
                    onBlur,
                    onKeydown,
                  }),
                ...Object.fromEntries(
                  Object.keys(slots)
                    .filter((k: string) => k.startsWith('message-'))
                    .map((k: string) => [k, slots[k]])
                ),
              }
            ),
          default: () =>
            h(
              FDatePicker,
              {
                id: pickerId,
                ref: pickerRef,
                modelValue: props.multiple || props.range ? model.value : (model.value[0] ?? null),
                'onUpdate:modelValue': (v: unknown) => {
                  const next = wrap(v)
                    .map(d => parseDate(d as DateLike))
                    .filter(Boolean) as Date[]
                  model.value =
                    props.range && next.length === 2 ? sortRange(next[0], next[1]) : next
                },
                multiple: props.multiple,
                range: props.range,
                min: props.min,
                max: props.max,
                allowedDates: props.allowedDates,
                showAdjacentMonths: props.showAdjacentMonths,
                showWeek: props.showWeek,
                firstDayOfWeek: props.firstDayOfWeek,
                view: props.view,
                color: props.color,
                locale: props.locale,
                hideHeader: props.hideHeader,
                theme: props.theme,
                onEscape: () => closeMenu(true),
              },
              {
                ...(slots.title ? { title: slots.title } : {}),
                ...(slots.header ? { header: slots.header } : {}),
                ...(slots.day ? { day: slots.day } : {}),
                ...(slots.actions ? { actions: slots.actions } : {}),
              }
            ),
        }
      )
    )
  },
})
