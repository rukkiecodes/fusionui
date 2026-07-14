import { computed, h, nextTick, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { FField } from '../FField'
import type { FieldVariant } from '../FField'
import { FMenu } from '../FMenu'
import type { FMenuLocation } from '../FMenu'
import { FColorPicker } from './FColorPicker'
import { HSVtoCSS, HSVtoHex, isValidColor, toHSVA } from './color-space'
import type { ColorPickerMode, ColorValue } from './color-space'

export const makeFColorInputProps = propsFactory(
  {
    modelValue: { type: [String, Object] as PropType<ColorValue>, default: undefined },
    mode: { type: String as PropType<ColorPickerMode>, default: 'hexa' },
    /** Show the picker. Bindable with `v-model:menu`. */
    menu: Boolean,
    menuLocation: { type: String as PropType<FMenuLocation>, default: 'bottom' },
    showSwatches: Boolean,
    swatches: Array as PropType<string[]>,
    hideCanvas: Boolean,
    hideInputs: Boolean,
    hideSliders: Boolean,
    // ---- field chrome (mirrors FInput) ----
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    placeholder: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    variant: { type: String as PropType<FieldVariant>, default: 'default' },
    state: String as PropType<'success' | 'danger' | 'warning' | 'primary' | 'dark'>,
    square: Boolean,
    transparent: Boolean,
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
  'FColorInput'
)

/**
 * A colour text field that opens an `FColorPicker` in an `FMenu`. The swatch in
 * the prepend slot previews the current colour; the text stays editable, so a
 * value can always be typed or pasted rather than only dragged.
 */
export const FColorInput = genericComponent()({
  name: 'FColorInput',
  props: makeFColorInputProps(),
  emits: {
    'update:modelValue': (_v: unknown) => true,
    'update:menu': (_v: boolean) => true,
    'update:mode': (_v: ColorPickerMode) => true,
    'update:focused': (_v: boolean) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    const pickerId = `fui-color-picker-${getUid()}`

    const model = useProxiedModel(props, 'modelValue', undefined)
    const menu = useProxiedModel(props, 'menu', false)
    const { errorMessages, successMessages, validate } = useValidation(props)

    const focused = ref(false)
    /** What the user is typing; `null` while the field mirrors the model. */
    const draft = ref<string | null>(null)
    const inputRef = ref<HTMLInputElement>()

    const hsva = computed(() => toHSVA(model.value))

    /** The read-only text shown when the user isn't mid-edit. */
    const display = computed(() => {
      const value = model.value
      if (value == null || value === '') return ''
      if (typeof value === 'string') return value
      // An object model still needs a human-readable field value.
      return hsva.value ? HSVtoHex(hsva.value, true) : ''
    })

    const text = computed(() => draft.value ?? display.value)
    const isActive = computed(() => focused.value || menu.value || !!text.value)
    const interactive = computed(() => !props.disabled && !props.readonly)

    function commit(raw: string): void {
      const value = raw.trim()
      if (!value) {
        model.value = null
        draft.value = null
      } else if (isValidColor(value)) {
        model.value = value
        draft.value = null
      } else {
        // Unparseable — snap back to the last good value.
        draft.value = null
      }
      if (props.validateOn !== 'submit') validate()
    }

    function closeMenu(restoreFocus: boolean): void {
      if (!menu.value) return
      menu.value = false
      if (restoreFocus) nextTick(() => inputRef.value?.focus())
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!interactive.value) return
      if (e.key === 'Escape' && menu.value) {
        e.preventDefault()
        closeMenu(true)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (draft.value != null) commit(draft.value)
        closeMenu(true)
      }
    }

    function onBlur(): void {
      focused.value = false
      emit('update:focused', false)
      if (draft.value != null) commit(draft.value)
      if (props.validateOn === 'blur') validate()
    }

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
          class: ['fui-color-input', props.class],
          contentClass: 'fui-color-input__menu',
          style: props.style,
        },
        {
          activator: ({ props: activatorProps }: any) =>
            h(
              FField,
              {
                class: 'fui-color-input__field',
                label: props.label,
                labelPlaceholder: props.labelPlaceholder,
                color: props.color,
                variant: props.variant,
                state: props.state,
                square: props.square,
                transparent: props.transparent,
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
                  if (target?.closest?.('.fui-field__clear')) return
                  // The swatch is the deliberate "open the picker" affordance;
                  // clicking the text keeps the caret so the value stays typeable.
                  const onSwatch = !!target?.closest?.('.fui-color-input__swatch')
                  if (menu.value) closeMenu(onSwatch)
                  else if (onSwatch) activatorProps.onClick()
                },
                'onClick:clear': () => {
                  model.value = null
                  draft.value = null
                  inputRef.value?.focus()
                },
              },
              {
                prepend: () =>
                  h('button', {
                    type: 'button',
                    class: 'fui-color-input__swatch',
                    style: {
                      backgroundColor: hsva.value ? HSVtoCSS(hsva.value) : undefined,
                    },
                    disabled: !interactive.value,
                    tabindex: -1,
                    'aria-hidden': 'true',
                  }),
                default: ({ id }: { id?: string }) =>
                  h('input', {
                    id,
                    ref: inputRef,
                    class: 'fui-color-input__el',
                    type: 'text',
                    value: text.value,
                    placeholder: props.labelPlaceholder
                      ? undefined
                      : (props.placeholder ?? '#RRGGBB'),
                    disabled: props.disabled,
                    readonly: props.readonly,
                    autocomplete: 'off',
                    spellcheck: 'false',
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
            h(FColorPicker, {
              id: pickerId,
              modelValue: model.value,
              'onUpdate:modelValue': (v: unknown) => {
                model.value = v
                draft.value = null
                if (props.validateOn === 'input') validate()
              },
              mode: props.mode,
              'onUpdate:mode': (v: ColorPickerMode) => emit('update:mode', v),
              showSwatches: props.showSwatches,
              swatches: props.swatches,
              hideCanvas: props.hideCanvas,
              hideInputs: props.hideInputs,
              hideSliders: props.hideSliders,
              elevation: 0,
              theme: props.theme,
            }),
        }
      )
    )
  },
})
