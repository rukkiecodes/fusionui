import { computed, getCurrentInstance, h, ref, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeGroupProps, makeGroupItemProps, useGroup, useGroupItem } from '../../composables/group'
import { useLayoutItem } from '../../composables/layout'
import { convertToUnit } from '../../util/helpers'
import { parseColor } from '../../util/colors'
import type { IconValue } from '../../composables/icons'
import { Ripple } from '../../directives/ripple'
import { FIcon } from '../FIcon'
import { FBottomNavSymbol } from './key'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function resolveColorTriplet(color?: string): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFBottomNavProps = propsFactory(
  {
    /** Accent color of the selected item — theme name or any CSS color. */
    color: { type: String as PropType<string>, default: 'primary' },
    /** Whether the bar is on screen. `false` slides it out below the fold. */
    active: { type: Boolean, default: true },
    /** Items share the width equally instead of hugging their content. */
    grow: Boolean,
    /** `shift` hides the labels until an item is selected. */
    mode: {
      type: String as PropType<'horizontal' | 'shift'>,
      default: 'horizontal',
      validator: (v: unknown) => !v || ['horizontal', 'shift'].includes(String(v)),
    },
    height: { type: [String, Number] as PropType<string | number>, default: 56 },
    /** Pin to the bottom of the viewport and register with the `<f-layout>` system. */
    app: Boolean,
    /** Layout stacking order when inside an `<f-layout>` (lower = outer). */
    order: { type: Number, default: 0 },
    ...makeGroupProps(),
    ...makeElevationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBottomNav'
)

/**
 * The bottom navigation bar — three to five top-level destinations, always in
 * reach of a thumb.
 *
 * Selection is the standard `useGroup` contract (`v-model` holds the selected
 * item's `value`), and with `app` the bar registers as a `bottom` layout item so
 * `<f-main>` insets itself and the sidebar/navbar stack around it, exactly the
 * way `FNavbar` and `FSidebar` do.
 */
export const FBottomNav = genericComponent()({
  name: 'FBottomNav',
  props: makeFBottomNavProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    useGroup(props, FBottomNavSymbol)
    const { elevationClasses } = useElevation(props)

    const accent = computed(() => resolveColorTriplet(props.color) ?? 'var(--fui-theme-primary)')
    const barHeight = computed(() => parseInt(String(props.height), 10) || 56)

    // Layout coordination: a bottom bar reserves its own height, so `<f-main>`
    // content never hides underneath it. Inactive ⇒ the layout slides it away.
    const { hasLayout, layoutItemStyles } = useLayoutItem({
      id: `fui-bottom-nav-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      position: ref('bottom') as any,
      size: barHeight,
      order: computed(() => Number(props.order ?? 0)) as any,
      active: computed(() => !!props.app && props.active) as any,
    })
    const inLayout = computed(() => hasLayout && props.app)

    useRender(() =>
      h(
        'nav',
        {
          class: [
            'fui-bottom-nav',
            {
              'fui-bottom-nav--app': props.app,
              'fui-bottom-nav--in-layout': inLayout.value,
              'fui-bottom-nav--hidden': !props.active,
              'fui-bottom-nav--grow': props.grow,
              'fui-bottom-nav--shift': props.mode === 'shift',
            },
            ...elevationClasses.value,
            props.class,
          ],
          style: [
            {
              '--fui-bottom-nav-color': accent.value,
              height: convertToUnit(props.height),
            },
            inLayout.value ? layoutItemStyles.value : null,
            props.style,
          ],
          role: 'navigation',
        },
        [h('div', { class: 'fui-bottom-nav__content' }, slots.default?.())]
      )
    )
  },
})

export const makeFBottomNavItemProps = propsFactory(
  {
    icon: [String, Object, Function] as PropType<IconValue>,
    /** Label text — the default slot wins over it. */
    text: String as PropType<string>,
    /** Router destination. Falls back to `$router.push` when vue-router is present. */
    to: String as PropType<string>,
    href: String as PropType<string>,
    target: String as PropType<string>,
    ripple: { type: Boolean, default: true },
    ...makeGroupItemProps(),
    ...makeComponentProps(),
  },
  'FBottomNavItem'
)

export const FBottomNavItem = genericComponent()({
  name: 'FBottomNavItem',
  props: makeFBottomNavItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    const group = useGroupItem(props, FBottomNavSymbol)
    const vm = getCurrentInstance()

    const isSelected = computed(() => !!group?.isSelected.value)

    function onClick(e: MouseEvent): void {
      if (props.disabled) return
      emit('click', e)
      // A destination stays selected when re-tapped — it is not a toggle.
      group?.select(true)
      if (props.to && !props.href) {
        const router = vm?.appContext.config.globalProperties.$router
        router?.push(props.to)
      }
    }

    useRender(() => {
      const Tag = props.href ? 'a' : 'button'

      return withDirectives(
        h(
          Tag,
          {
            class: [
              'fui-bottom-nav__item',
              {
                'fui-bottom-nav__item--active': isSelected.value,
                'fui-bottom-nav__item--disabled': props.disabled,
              },
              props.class,
            ],
            style: props.style,
            type: Tag === 'button' ? 'button' : undefined,
            disabled: Tag === 'button' ? props.disabled : undefined,
            href: props.href,
            target: props.target,
            'aria-current': isSelected.value ? 'page' : undefined,
            'aria-disabled': Tag === 'a' && props.disabled ? 'true' : undefined,
            onClick,
          },
          [
            slots.icon
              ? h('span', { class: 'fui-bottom-nav__icon' }, slots.icon())
              : props.icon
                ? h(FIcon, { icon: props.icon, class: 'fui-bottom-nav__icon' })
                : null,
            h(
              'span',
              { class: 'fui-bottom-nav__label' },
              slots.default ? slots.default() : props.text
            ),
          ]
        ),
        [[Ripple, props.ripple && !props.disabled]]
      )
    })
  },
})
