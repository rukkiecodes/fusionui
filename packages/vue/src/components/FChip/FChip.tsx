import { computed, h, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeSizeProps, useSize } from '../../composables/size'
import { makeVariantProps, useVariant } from '../../composables/variant'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { useGroupItem } from '../../composables/group'
import type { IconValue } from '../../composables/icons'
import { Ripple } from '../../directives/ripple'
import { FIcon } from '../FIcon'
import { FChipGroupSymbol } from '../FChipGroup/key'

export const makeFChipProps = propsFactory(
  {
    ...makeVariantProps({ variant: 'tonal' }),
    color: { type: String as PropType<string>, default: 'primary' },
    label: Boolean,
    pill: Boolean,
    closable: Boolean,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    link: Boolean,
    text: String as PropType<string>,
    modelValue: { type: Boolean, default: true },
    /** Value this chip contributes when it sits inside an `FChipGroup`. */
    value: null as unknown as PropType<unknown>,
    disabled: Boolean,
    /** Slides a check icon in while selected (set for you by `FChipGroup`). */
    filter: Boolean,
    /** Extra class applied while selected, on top of the group's `selected-class`. */
    selectedClass: String as PropType<string>,
    ...makeSizeProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FChip'
)

export const FChip = genericComponent()({
  name: 'FChip',
  props: makeFChipProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    'click:close': (_e: MouseEvent) => true,
    click: (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { sizeClasses } = useSize(props)
    // `null` when the chip is standalone — a plain chip stays a plain <span>.
    const group = useGroupItem(props, FChipGroupSymbol)

    const isSelected = computed(() => group?.isSelected.value ?? false)
    const isSelectable = computed(() => !!group)

    const variantColor = computed(() =>
      props.color && !props.color.startsWith('#') ? `var(--fui-theme-${props.color})` : undefined
    )

    // Contrast color for the solid fill a selected chip wears.
    const variantOn = computed(() =>
      props.color && !props.color.startsWith('#') ? `var(--fui-theme-on-${props.color})` : undefined
    )

    function onClose(e: MouseEvent): void {
      // Never let the close icon double as a selection toggle.
      e.stopPropagation()
      isActive.value = false
      emit('click:close', e)
    }

    function onClick(e: MouseEvent): void {
      if (props.disabled) return
      if (group) group.toggle()
      emit('click', e)
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!group || props.disabled) return
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      group.toggle()
    }

    useRender(() => {
      if (!isActive.value) return null
      return withDirectives(
        h(
          'span',
          {
            class: [
              'fui-chip',
              `fui-chip--variant-${props.variant}`,
              {
                'fui-chip--label': props.label,
                'fui-chip--pill': props.pill,
                'fui-chip--link': props.link,
                'fui-chip--selectable': isSelectable.value,
                'fui-chip--selected': isSelected.value,
                'fui-chip--disabled': props.disabled,
              },
              ...(group?.selectedClass.value ?? []),
              ...variantClasses.value,
              ...colorClasses.value,
              ...sizeClasses.value,
              props.class,
            ],
            style: [
              { '--fui-variant-color': variantColor.value, '--fui-variant-on': variantOn.value },
              colorStyles.value,
              props.style,
            ],
            // Selectable chips are toggle buttons: pressable, focusable, and
            // operable with Enter/Space.
            role: isSelectable.value ? 'button' : undefined,
            'aria-pressed': isSelectable.value ? isSelected.value : undefined,
            'aria-disabled': props.disabled || undefined,
            tabindex: isSelectable.value && !props.disabled ? 0 : undefined,
            onClick,
            onKeydown: isSelectable.value ? onKeydown : undefined,
          },
          [
            props.filter && isSelected.value
              ? h(FIcon, { icon: '$check', class: 'fui-chip__filter', size: 'small' })
              : null,
            props.prependIcon
              ? h(FIcon, { icon: props.prependIcon, class: 'fui-chip__prepend' })
              : null,
            h('span', { class: 'fui-chip__content' }, slots.default ? slots.default() : props.text),
            props.closable
              ? h(FIcon, {
                  icon: '$close',
                  class: 'fui-chip__close',
                  size: 'small',
                  onClick: onClose,
                })
              : null,
          ]
        ),
        [[Ripple, (props.link || isSelectable.value) && !props.disabled]]
      )
    })
  },
})
