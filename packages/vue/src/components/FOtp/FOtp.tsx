import { computed, h, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { parseColor } from '../../util/colors'

type OtpSize = 'small' | 'default' | 'large'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function controlColor(color: string): string {
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFOtpProps = propsFactory(
  {
    modelValue: { type: String, default: '' },
    /** Number of boxes. */
    length: { type: [Number, String] as PropType<number | string>, default: 6 },
    /** `number` accepts digits only; `text` accepts any character. */
    type: { type: String as PropType<'number' | 'text'>, default: 'number' },
    /** Hide the entered characters (password dots). */
    mask: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    /** A state tint (`success` / `danger` / `warning`) — overrides color. */
    state: String as PropType<string>,
    size: { type: String as PropType<OtpSize>, default: 'default' },
    square: Boolean,
    disabled: Boolean,
    loading: Boolean,
    autofocus: Boolean,
    /** A character shown between the boxes (e.g. `-`). */
    separator: String as PropType<string>,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FOtp'
)

export const FOtp = genericComponent()({
  name: 'FOtp',
  props: makeFOtpProps(),
  emits: {
    'update:modelValue': (_v: string) => true,
    complete: (_v: string) => true,
  },
  setup(props: any, { emit }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', '')
    const len = computed(() => Math.max(1, Number(props.length) || 6))
    const inactive = computed(() => props.disabled || props.loading)
    const accent = computed(() => controlColor(props.state ?? props.color))

    const inputs = ref<HTMLInputElement[]>([])
    const digits = computed(() => {
      const s = String(model.value ?? '')
      return Array.from({ length: len.value }, (_, i) => s[i] ?? '')
    })

    function focus(i: number) {
      const el = inputs.value[i]
      if (el) {
        el.focus()
        el.select()
      }
    }

    function commit(chars: string[]) {
      const next = chars.join('').slice(0, len.value)
      model.value = next
      if (next.length === len.value) emit('complete', next)
    }

    function onInput(i: number, e: Event) {
      let v = (e.target as HTMLInputElement).value
      if (props.type === 'number') v = v.replace(/\D/g, '')
      v = v.slice(-1)
      const arr = digits.value.slice()
      arr[i] = v
      commit(arr)
      if (v && i < len.value - 1) focus(i + 1)
    }

    function onKeydown(i: number, e: KeyboardEvent) {
      const arr = digits.value.slice()
      if (e.key === 'Backspace') {
        if (arr[i]) {
          arr[i] = ''
          commit(arr)
        } else if (i > 0) {
          e.preventDefault()
          arr[i - 1] = ''
          commit(arr)
          focus(i - 1)
        }
      } else if (e.key === 'ArrowLeft' && i > 0) {
        e.preventDefault()
        focus(i - 1)
      } else if (e.key === 'ArrowRight' && i < len.value - 1) {
        e.preventDefault()
        focus(i + 1)
      }
    }

    function onPaste(i: number, e: ClipboardEvent) {
      e.preventDefault()
      let text = e.clipboardData?.getData('text') ?? ''
      if (props.type === 'number') text = text.replace(/\D/g, '')
      if (!text) return
      const arr = digits.value.slice()
      for (let k = 0; k < text.length && i + k < len.value; k++) arr[i + k] = text[k]
      commit(arr)
      focus(Math.min(i + text.length, len.value - 1))
    }

    onMounted(() => {
      if (props.autofocus && !inactive.value) focus(0)
    })

    useRender(() => {
      const boxes: ReturnType<typeof h>[] = []
      for (let i = 0; i < len.value; i++) {
        if (props.separator && i > 0) {
          boxes.push(h('span', { key: `s${i}`, class: 'fui-otp__sep' }, props.separator))
        }
        boxes.push(
          h('input', {
            key: i,
            ref: (el: unknown) => {
              if (el) inputs.value[i] = el as HTMLInputElement
            },
            class: ['fui-otp__box', { 'fui-otp__box--filled': !!digits.value[i] }],
            type: props.mask ? 'password' : 'text',
            inputmode: props.type === 'number' ? 'numeric' : 'text',
            autocomplete: i === 0 ? 'one-time-code' : 'off',
            maxlength: 1,
            value: digits.value[i],
            disabled: inactive.value,
            'aria-label': `Digit ${i + 1}`,
            onInput: (e: Event) => onInput(i, e),
            onKeydown: (e: KeyboardEvent) => onKeydown(i, e),
            onFocus: (e: FocusEvent) => (e.target as HTMLInputElement).select(),
            onPaste: (e: ClipboardEvent) => onPaste(i, e),
          })
        )
      }
      if (props.loading) boxes.push(h('span', { key: 'l', class: 'fui-otp__loader' }))

      return h(
        'div',
        {
          class: [
            'fui-otp',
            `fui-otp--${props.size}`,
            {
              'fui-otp--square': props.square,
              'fui-otp--disabled': inactive.value,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': accent.value }, props.style],
        },
        boxes
      )
    })
  },
})
