import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeSizeProps, useSize } from '../../composables/size'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFRatingProps = propsFactory(
  {
    modelValue: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** How many items the scale has. */
    length: { type: [Number, String] as PropType<number | string>, default: 5 },
    /** Allow halves — the scale becomes 0, 0.5, 1, 1.5 … */
    halfIncrements: Boolean,
    /** Show a preview as the pointer moves across the items. */
    hover: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    /** Clicking the current value again clears it back to 0. */
    clearable: Boolean,
    /** Icon for a filled item. */
    fullIcon: { type: [String, Object, Function] as PropType<IconValue>, default: 'star' },
    /** Icon for an empty item. */
    emptyIcon: { type: [String, Object, Function] as PropType<IconValue>, default: 'star' },
    color: { type: String as PropType<string>, default: 'warning' },
    /** A text label under each item, e.g. `['Awful', 'Poor', 'OK', 'Good', 'Great']`. */
    itemLabels: Array as PropType<string[]>,
    /** The accessible name of the whole control. */
    ariaLabel: { type: String as PropType<string>, default: 'Rating' },
    /** Builds each item's spoken name. */
    itemAriaLabel: {
      type: Function as PropType<(value: number, length: number) => string>,
      default: (value: number, length: number) => `${value} of ${length}`,
    },
    ...makeSizeProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FRating'
)

/**
 * A star rating.
 *
 * It is a radio group, not a row of buttons: the container is a `radiogroup`,
 * each item a `radio` with its own spoken name, and a roving tabindex means one
 * Tab stop lands on the control and the arrow keys move within it (Home/End jump
 * to the ends). That is what the WAI-ARIA pattern asks for, and it is why the
 * rating is usable without a mouse.
 */
export const FRating = genericComponent()({
  name: 'FRating',
  props: makeFRatingProps(),
  emits: {
    'update:modelValue': (_v: number) => true,
  },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { sizeClasses } = useSize(props)

    const name = `fui-rating-${getUid()}`
    const model = useProxiedModel(props, 'modelValue', 0, (v: unknown) => Number(v) || 0)

    /** Preview value while hovering; null when the pointer is away. */
    const preview = ref<number | null>(null)

    const length = computed(() => Number(props.length) || 5)
    const step = computed(() => (props.halfIncrements ? 0.5 : 1))
    const interactive = computed(() => !props.readonly && !props.disabled)

    /** What the stars currently paint — the hover preview wins over the model. */
    const shown = computed(() => preview.value ?? model.value)

    const items = computed(() => Array.from({ length: length.value }, (_, i) => i + 1))

    function select(value: number): void {
      if (!interactive.value) return
      // Clicking the current value again clears it, when allowed.
      model.value = props.clearable && model.value === value ? 0 : value
    }

    /** Which half of the item the pointer is over — only meaningful for halves. */
    function valueAt(index: number, e: MouseEvent): number {
      if (!props.halfIncrements) return index
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const isFirstHalf = e.clientX - rect.left < rect.width / 2
      return isFirstHalf ? index - 0.5 : index
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!interactive.value) return

      const current = model.value
      let next: number | null = null

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = Math.min(current + step.value, length.value)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          next = Math.max(current - step.value, 0)
          break
        case 'Home':
          next = props.halfIncrements ? 0.5 : 1
          break
        case 'End':
          next = length.value
          break
        default:
          return
      }

      e.preventDefault()
      model.value = next
    }

    /**
     * How much of item `index` is filled: 1 full, 0.5 half, 0 empty. The half is
     * painted by clipping a filled icon over the empty one, so it works with any
     * icon rather than needing a dedicated half-star glyph.
     */
    function fillOf(index: number): number {
      const value = shown.value
      if (value >= index) return 1
      if (value >= index - 0.5) return 0.5
      return 0
    }

    function renderItem(index: number) {
      const fill = fillOf(index)
      const checked = Math.ceil(model.value) === index
      const label = props.itemAriaLabel(index, length.value)

      const icon = h('span', { class: 'fui-rating__icon' }, [
        h(FIcon, { icon: props.emptyIcon, class: 'fui-rating__empty' }),
        fill > 0
          ? h(
              'span',
              {
                class: ['fui-rating__full', { 'fui-rating__full--half': fill === 0.5 }],
              },
              [h(FIcon, { icon: props.fullIcon })]
            )
          : null,
      ])

      return h('div', { key: index, class: 'fui-rating__item' }, [
        h(
          'span',
          {
            class: ['fui-rating__btn', { 'fui-rating__btn--filled': fill > 0 }],
            // Radio semantics: exactly one item is tabbable, and the arrow keys
            // move between them (handled on the group).
            role: 'radio',
            'aria-label': label,
            'aria-checked': checked,
            'aria-setsize': length.value,
            'aria-posinset': index,
            tabindex: interactive.value && checked ? 0 : -1,
            onClick: (e: MouseEvent) => select(valueAt(index, e)),
            onMousemove: props.hover
              ? (e: MouseEvent) => {
                  if (interactive.value) preview.value = valueAt(index, e)
                }
              : undefined,
          },
          [slots.item ? slots.item({ index, value: index, fill, isFilled: fill > 0 }) : icon]
        ),
        props.itemLabels?.[index - 1]
          ? h('span', { class: 'fui-rating__label' }, props.itemLabels[index - 1])
          : null,
      ])
    }

    useRender(() => {
      // Nothing is tabbable when every item is unchecked (value 0), so the group
      // itself takes the tab stop and hands the arrow keys straight to the model.
      const noneChecked = model.value < 1

      return h(
        'div',
        {
          class: [
            'fui-rating',
            {
              'fui-rating--readonly': props.readonly,
              'fui-rating--disabled': props.disabled,
            },
            `text-${props.color}`,
            ...sizeClasses.value,
            props.class,
          ],
          style: props.style,
          role: 'radiogroup',
          'aria-label': props.ariaLabel,
          'aria-disabled': props.disabled || undefined,
          'aria-readonly': props.readonly || undefined,
          'data-name': name,
          tabindex: interactive.value && noneChecked ? 0 : -1,
          onKeydown,
          onMouseleave: props.hover
            ? () => {
                preview.value = null
              }
            : undefined,
        },
        items.value.map(renderItem)
      )
    })
  },
})
