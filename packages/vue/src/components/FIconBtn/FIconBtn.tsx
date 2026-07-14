import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps } from '../../composables/rounded'
import { makeSizeProps } from '../../composables/size'
import { makeVariantProps } from '../../composables/variant'
import { makeThemeProps } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FBtn } from '../FBtn'

export const makeFIconBtnProps = propsFactory(
  {
    icon: [String, Object, Function] as PropType<IconValue>,
    /**
     * The button's accessible name. An icon is not a label, so this is
     * required — screen readers have nothing else to announce.
     */
    ariaLabel: {
      type: String as PropType<string>,
      required: true,
    },
    /** Renders the pressed look; when set, the button also reports `aria-pressed`. */
    active: {
      type: Boolean,
      default: undefined,
    },
    loading: Boolean,
    disabled: Boolean,
    ...makeVariantProps({ variant: 'flat' }),
    ...makeSizeProps(),
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FIconBtn'
)

export const FIconBtn = genericComponent()({
  name: 'FIconBtn',
  props: makeFIconBtnProps(),
  emits: {
    click: (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    // Everything visual — variants, sizes, ripple, loader, theming — already
    // lives in FBtn. This is a wrapper that locks in the icon-only shape and
    // the accessible name; it deliberately re-implements none of it.

    // Bare `rounded` means "make it a circle" (the usual icon-button shape);
    // a named value (`sm` … `pill`, `0`) falls through to FBtn's radius scale.
    const isCircle = computed(() => props.rounded === true || props.rounded === '')

    // A toggle button must expose its state, but a plain action button must not
    // claim to be a toggle — so `aria-pressed` only appears once `active` is set.
    const isToggle = computed(() => typeof props.active === 'boolean')

    function onClick(e: MouseEvent): void {
      emit('click', e)
    }

    useRender(() =>
      h(
        FBtn,
        {
          // `true` keeps FBtn's square icon-only geometry while letting the
          // default slot supply the glyph.
          icon: slots.default ? true : props.icon,
          variant: props.variant,
          color: props.color,
          size: props.size,
          circle: isCircle.value,
          rounded: isCircle.value ? undefined : props.rounded,
          tile: props.tile,
          loading: props.loading,
          disabled: props.disabled,
          active: !!props.active,
          theme: props.theme,
          class: ['fui-icon-btn', props.class],
          style: props.style,
          'aria-label': props.ariaLabel,
          'aria-pressed': isToggle.value ? String(props.active) : undefined,
          onClick,
        },
        slots.default ? { default: () => slots.default() } : undefined
      )
    )
  },
})
