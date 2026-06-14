import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { parseColor } from '../../util/colors'
import { FIcon } from '../FIcon'
import { FRadioGroupSymbol } from './key'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function controlColor(color: string): string {
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFRadioProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    label: String as PropType<string>,
    color: String as PropType<string>,
    // A custom icon shown inside the circle when selected (instead of the dot).
    icon: String as PropType<string>,
    loading: Boolean,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'FRadio'
)

export const FRadio = genericComponent()({
  name: 'FRadio',
  props: makeFRadioProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    const group = inject(FRadioGroupSymbol, null)
    const standalone = useProxiedModel(props, 'modelValue', undefined)

    const isChecked = computed(() =>
      group ? group.modelValue.value === props.value : standalone.value === props.value
    )
    const color = computed(() => props.color ?? group?.color.value ?? 'primary')
    const isDisabled = computed(() => props.disabled || props.loading || !!group?.disabled.value)

    function select(): void {
      if (isDisabled.value) return
      if (group) group.select(props.value)
      else standalone.value = props.value
    }

    const hasIcon = computed(() => !!(slots.icon || props.icon))

    function circleContent() {
      if (props.loading) return h('span', { class: 'fui-radio__loader' })
      if (hasIcon.value) {
        return h(
          'span',
          { class: 'fui-radio__icon' },
          slots.icon ? slots.icon() : h(FIcon, { icon: props.icon, size: 12 })
        )
      }
      // The selected indicator is the thickened ring on the circle itself
      // (Vuesax style), so the default needs no inner element.
      return null
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-radio',
            'fui-selection-control',
            {
              'fui-selection-control--checked': isChecked.value,
              'fui-selection-control--disabled': isDisabled.value,
              'fui-radio--loading': props.loading,
              'fui-radio--icon': hasIcon.value,
            },
            props.class,
          ],
          style: [{ '--fui-control-color': controlColor(color.value) }, props.style],
        },
        [
          h('input', {
            class: 'fui-selection-control__input',
            type: 'radio',
            name: group?.name,
            checked: isChecked.value,
            disabled: isDisabled.value,
            onChange: select,
          }),
          h('span', { class: 'fui-selection-control__box fui-radio__circle' }, [circleContent()]),
          slots.default || props.label
            ? h('span', { class: 'fui-selection-control__label' }, slots.default?.() ?? props.label)
            : null,
        ]
      )
    )
  },
})
