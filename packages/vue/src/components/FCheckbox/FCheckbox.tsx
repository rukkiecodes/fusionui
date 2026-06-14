import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { parseColor } from '../../util/colors'
import { FIcon } from '../FIcon'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function controlColor(color: string): string {
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFCheckboxProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: false },
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: { type: String as PropType<string>, default: 'primary' },
    // A custom icon name to show in the box when checked (instead of the check mark).
    icon: String as PropType<string>,
    indeterminate: Boolean,
    // Strike through the label when checked (e.g. a to-do item).
    lineThrough: Boolean,
    loading: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCheckbox'
)

export const FCheckbox = genericComponent()({
  name: 'FCheckbox',
  props: makeFCheckboxProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', false)

    const isChecked = computed(() =>
      Array.isArray(model.value) ? model.value.includes(props.value) : !!model.value
    )
    const inactive = computed(() => props.disabled || props.loading)

    function toggle(): void {
      if (inactive.value) return
      if (Array.isArray(model.value)) {
        const next = [...model.value]
        const index = next.indexOf(props.value)
        if (index > -1) next.splice(index, 1)
        else next.push(props.value)
        model.value = next
      } else {
        model.value = !model.value
      }
    }

    function boxContent() {
      if (props.loading) return h('span', { class: 'fui-checkbox__loader' })
      if (slots.icon || props.icon) {
        return h(
          'span',
          { class: 'fui-checkbox__icon' },
          // 13px leaves breathing room inside the 16px-inner box (the check mark
          // it replaces reads smaller than a solid glyph at the same size).
          slots.icon ? slots.icon() : h(FIcon, { icon: props.icon, size: 13 })
        )
      }
      return h('svg', { viewBox: '0 0 24 24', class: 'fui-checkbox__mark' }, [
        props.indeterminate ? h('path', { d: 'M6 12h12' }) : h('path', { d: 'M5 12l5 5L20 7' }),
      ])
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-checkbox',
            'fui-selection-control',
            {
              'fui-selection-control--checked': isChecked.value,
              'fui-selection-control--indeterminate': props.indeterminate,
              'fui-selection-control--disabled': inactive.value,
              'fui-checkbox--line-through': props.lineThrough,
              'fui-checkbox--loading': props.loading,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': controlColor(props.color) }, props.style],
        },
        [
          h('input', {
            class: 'fui-selection-control__input',
            type: 'checkbox',
            checked: isChecked.value,
            disabled: inactive.value,
            onChange: toggle,
          }),
          h('span', { class: 'fui-selection-control__box fui-checkbox__box' }, [boxContent()]),
          slots.default || props.label
            ? h('span', { class: 'fui-selection-control__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
