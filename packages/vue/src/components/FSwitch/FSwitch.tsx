import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { parseColor } from '../../util/colors'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function controlColor(color: string): string {
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFSwitchProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: false },
    /** Value when active — for an array v-model, or a non-boolean single value. */
    val: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Value when inactive (with `val`, for a non-boolean single value). */
    notValue: { type: null as unknown as PropType<unknown>, default: false },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    /** Square corners instead of the pill. */
    square: Boolean,
    /** Transparent thumb (pair with the `circle` slot for an icon-only thumb). */
    icon: Boolean,
    loading: Boolean,
    /** Undetermined state — centers the thumb and disables the control. */
    indeterminate: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSwitch'
)

export const FSwitch = genericComponent()({
  name: 'FSwitch',
  props: makeFSwitchProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', false)

    const isChecked = computed(() => {
      if (Array.isArray(model.value)) return model.value.includes(props.val)
      if (props.val !== undefined) return model.value === props.val
      return !!model.value
    })
    const inactive = computed(() => props.disabled || props.loading || props.indeterminate)

    function toggle(): void {
      if (inactive.value) return
      if (Array.isArray(model.value)) {
        const next = [...model.value]
        const index = next.indexOf(props.val)
        if (index > -1) next.splice(index, 1)
        else next.push(props.val)
        model.value = next
      } else if (props.val !== undefined) {
        model.value = isChecked.value ? props.notValue : props.val
      } else {
        model.value = !model.value
      }
    }

    function thumbContent() {
      if (props.loading) return h('span', { class: 'fui-switch__loader' })
      return slots.circle ? slots.circle() : null
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-switch',
            {
              'fui-switch--checked': isChecked.value,
              'fui-switch--disabled': inactive.value,
              'fui-switch--square': props.square,
              'fui-switch--icon': props.icon,
              'fui-switch--loading': props.loading,
              'fui-switch--indeterminate': props.indeterminate,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': controlColor(props.color) }, props.style],
        },
        [
          h('input', {
            class: 'fui-switch__input',
            type: 'checkbox',
            role: 'switch',
            checked: isChecked.value,
            disabled: inactive.value,
            onChange: toggle,
          }),
          h('span', { class: 'fui-switch__track' }, [
            slots.on || slots.off
              ? h('span', { class: 'fui-switch__content' }, [
                  isChecked.value ? slots.on?.() : slots.off?.(),
                ])
              : null,
            h('span', { class: 'fui-switch__thumb' }, [thumbContent()]),
          ]),
          slots.default || props.label
            ? h('span', { class: 'fui-switch__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
