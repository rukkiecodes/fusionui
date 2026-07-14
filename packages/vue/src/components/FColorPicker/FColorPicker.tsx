import { computed, h, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import {
  HSVtoCSS,
  HSVtoHex,
  colorModeNames,
  colorModes,
  fromHSVA,
  modeHasAlpha,
  nullColor,
  toHSVA,
} from './color-space'
import type { ColorPickerMode, ColorValue, HSVA } from './color-space'

const defaultSwatches: string[] = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#FFEB3B',
  '#FF9800',
  '#795548',
  '#607D8B',
  '#000000',
  '#FFFFFF',
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const makeFColorPickerProps = propsFactory(
  {
    modelValue: {
      type: [String, Object] as PropType<ColorValue>,
      default: undefined,
    },
    /** Which channels the numeric inputs edit — also decides whether alpha is shown. */
    mode: { type: String as PropType<ColorPickerMode>, default: 'rgba' },
    /** The modes the mode-switch button cycles through. */
    modes: {
      type: Array as PropType<ColorPickerMode[]>,
      default: () => colorModeNames,
    },
    hideCanvas: Boolean,
    hideInputs: Boolean,
    hideSliders: Boolean,
    hideModeSwitch: Boolean,
    showSwatches: Boolean,
    swatches: { type: Array as PropType<string[]>, default: () => defaultSwatches },
    canvasHeight: { type: [String, Number] as PropType<string | number>, default: 150 },
    width: { type: [String, Number] as PropType<string | number>, default: 300 },
    disabled: Boolean,
    ...makeElevationProps(),
    ...makeRoundedProps({ rounded: 'lg' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FColorPicker'
)

/**
 * A colour picker: a saturation/brightness canvas, hue and alpha sliders, numeric
 * inputs per mode, and optional swatches.
 *
 * Everything is keyboard operable — the canvas thumb takes the arrow keys (Shift
 * for a coarse step), and hue/alpha are native range inputs — and the value is
 * always readable as text, never conveyed by colour alone.
 */
export const FColorPicker = genericComponent()({
  name: 'FColorPicker',
  props: makeFColorPickerProps(),
  emits: {
    'update:modelValue': (_v: string | Record<string, number>) => true,
    'update:mode': (_v: ColorPickerMode) => true,
  },
  setup(props: any, { emit }: any) {
    provideTheme(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props)

    // The picker's own HSVA is the source of truth while the user drags: HSV→RGB
    // is lossy at the edges (black has no hue), so round-tripping through the
    // model on every move would make the hue jump. It re-syncs when the model
    // changes to a genuinely different colour.
    const hsva = ref<HSVA>(toHSVA(props.modelValue) ?? nullColor)

    watch(
      () => props.modelValue,
      value => {
        const next = toHSVA(value)
        if (!next) return
        // Ignore echoes of what we just emitted.
        if (HSVtoHex(next, true) === HSVtoHex(hsva.value, true)) return
        hsva.value = next
      }
    )

    const mode = computed<ColorPickerMode>({
      get: () => props.mode,
      set: value => emit('update:mode', value),
    })

    const showAlpha = computed(() => modeHasAlpha(mode.value))
    const inputs = computed(() => colorModes[mode.value] ?? colorModes.rgba)

    function update(next: HSVA): void {
      if (props.disabled) return
      hsva.value = next
      emit('update:modelValue', fromHSVA(next, props.modelValue))
    }

    // ---- canvas ------------------------------------------------------------
    const canvasRef = ref<HTMLElement>()

    function updateFromPointer(e: PointerEvent): void {
      const el = canvasRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      update({
        ...hsva.value,
        s: clamp((e.clientX - rect.left) / rect.width, 0, 1),
        v: clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1),
      })
    }

    function onCanvasDown(e: PointerEvent): void {
      if (props.disabled) return
      // Pointer capture keeps the drag alive outside the canvas and releases
      // itself on pointerup — no document-level listeners to leak.
      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)
      updateFromPointer(e)
    }

    function onCanvasMove(e: PointerEvent): void {
      const el = e.currentTarget as HTMLElement
      if (!el.hasPointerCapture?.(e.pointerId)) return
      updateFromPointer(e)
    }

    function onCanvasKey(e: KeyboardEvent): void {
      if (props.disabled) return
      const step = e.shiftKey ? 0.1 : 0.01
      const { s, v } = hsva.value
      let next: HSVA | null = null

      switch (e.key) {
        case 'ArrowLeft':
          next = { ...hsva.value, s: clamp(s - step, 0, 1) }
          break
        case 'ArrowRight':
          next = { ...hsva.value, s: clamp(s + step, 0, 1) }
          break
        case 'ArrowUp':
          next = { ...hsva.value, v: clamp(v + step, 0, 1) }
          break
        case 'ArrowDown':
          next = { ...hsva.value, v: clamp(v - step, 0, 1) }
          break
        case 'Home':
          next = { ...hsva.value, s: 0, v: 1 }
          break
        case 'End':
          next = { ...hsva.value, s: 1, v: 1 }
          break
        default:
          return
      }

      e.preventDefault()
      update(next)
    }

    const canvasLabel = computed(
      () =>
        `Saturation ${Math.round(hsva.value.s * 100)}%, brightness ${Math.round(
          hsva.value.v * 100
        )}%`
    )

    function renderCanvas() {
      return h(
        'div',
        {
          ref: canvasRef,
          class: 'fui-color-picker__canvas',
          style: {
            height: convertToUnit(props.canvasHeight),
            backgroundColor: `hsl(${hsva.value.h}, 100%, 50%)`,
          },
          onPointerdown: onCanvasDown,
          onPointermove: onCanvasMove,
        },
        [
          h('div', { class: 'fui-color-picker__canvas-saturation' }),
          h('div', { class: 'fui-color-picker__canvas-value' }),
          h('div', {
            class: 'fui-color-picker__canvas-thumb',
            style: {
              left: `${hsva.value.s * 100}%`,
              top: `${(1 - hsva.value.v) * 100}%`,
              backgroundColor: HSVtoCSS(hsva.value, false),
            },
            tabindex: props.disabled ? -1 : 0,
            role: 'slider',
            'aria-label': 'Saturation and brightness',
            'aria-valuetext': canvasLabel.value,
            'aria-valuenow': Math.round(hsva.value.s * 100),
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-disabled': props.disabled || undefined,
            onKeydown: onCanvasKey,
          }),
        ]
      )
    }

    // ---- sliders -----------------------------------------------------------
    // Native range inputs: keyboard, screen-reader and pointer support for free.
    function renderSliders() {
      return h('div', { class: 'fui-color-picker__sliders' }, [
        h('div', { class: 'fui-color-picker__preview' }, [
          h('div', {
            class: 'fui-color-picker__preview-swatch',
            style: { backgroundColor: HSVtoCSS(hsva.value) },
          }),
        ]),
        h('div', { class: 'fui-color-picker__tracks' }, [
          h('input', {
            class: 'fui-color-picker__slider fui-color-picker__slider--hue',
            type: 'range',
            min: 0,
            max: 360,
            step: 1,
            value: Math.round(hsva.value.h),
            disabled: props.disabled,
            'aria-label': 'Hue degrees',
            'aria-valuetext': `${Math.round(hsva.value.h)} degrees`,
            onInput: (e: Event) =>
              update({ ...hsva.value, h: Number((e.target as HTMLInputElement).value) }),
          }),
          showAlpha.value
            ? h('input', {
                class: 'fui-color-picker__slider fui-color-picker__slider--alpha',
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
                value: Math.round(hsva.value.a * 100),
                disabled: props.disabled,
                style: {
                  '--fui-color-picker-alpha-to': HSVtoCSS(hsva.value, false),
                },
                'aria-label': 'Alpha percent',
                'aria-valuetext': `${Math.round(hsva.value.a * 100)} percent`,
                onInput: (e: Event) =>
                  update({
                    ...hsva.value,
                    a: Number((e.target as HTMLInputElement).value) / 100,
                  }),
              })
            : null,
        ]),
      ])
    }

    // ---- numeric inputs ----------------------------------------------------
    function cycleMode(): void {
      const list = props.modes as ColorPickerMode[]
      const index = list.indexOf(mode.value)
      mode.value = list[(index + 1) % list.length]
    }

    function renderInputs() {
      return h('div', { class: 'fui-color-picker__inputs' }, [
        h(
          'div',
          { class: 'fui-color-picker__fields' },
          inputs.value.map(spec =>
            h('label', { key: spec.key, class: 'fui-color-picker__field' }, [
              h('input', {
                class: 'fui-color-picker__field-input',
                type: spec.type,
                min: spec.min,
                max: spec.max,
                step: spec.step,
                value: spec.getValue(hsva.value),
                disabled: props.disabled,
                'aria-label': spec.name,
                onChange: (e: Event) =>
                  update(spec.setValue(hsva.value, (e.target as HTMLInputElement).value)),
              }),
              h('span', { class: 'fui-color-picker__field-label' }, spec.label),
            ])
          )
        ),
        props.hideModeSwitch || (props.modes as ColorPickerMode[]).length < 2
          ? null
          : h(
              'button',
              {
                type: 'button',
                class: 'fui-color-picker__mode',
                disabled: props.disabled,
                'aria-label': `Color format: ${mode.value}. Activate to change.`,
                onClick: cycleMode,
              },
              mode.value.toUpperCase()
            ),
      ])
    }

    // ---- swatches ----------------------------------------------------------
    function renderSwatches() {
      const current = HSVtoHex(hsva.value, false).toLowerCase()

      return h(
        'div',
        { class: 'fui-color-picker__swatches', role: 'group', 'aria-label': 'Color swatches' },
        (props.swatches as string[]).map(swatch => {
          const selected = swatch.toLowerCase() === current
          return h('button', {
            key: swatch,
            type: 'button',
            class: ['fui-color-picker__swatch', { 'fui-color-picker__swatch--selected': selected }],
            style: { backgroundColor: swatch },
            disabled: props.disabled,
            'aria-label': swatch,
            'aria-pressed': selected,
            onClick: () => {
              const next = toHSVA(swatch)
              if (next) update({ ...next, a: hsva.value.a })
            },
          })
        })
      )
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-color-picker',
            { 'fui-color-picker--disabled': props.disabled },
            ...elevationClasses.value,
            ...roundedClasses.value,
            props.class,
          ],
          style: [{ width: convertToUnit(props.width) }, props.style],
        },
        [
          props.hideCanvas ? null : renderCanvas(),
          props.hideSliders ? null : renderSliders(),
          props.hideInputs ? null : renderInputs(),
          props.showSwatches ? renderSwatches() : null,
        ]
      )
    )
  },
})
