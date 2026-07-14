import { Transition, computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeSizeProps, useSize } from '../../composables/size'
import { makeVariantProps } from '../../composables/variant'
import { useProxiedModel } from '../../composables/proxiedModel'
import { useLayoutItem } from '../../composables/layout'
import type { IconValue } from '../../composables/icons'
import { FBtn } from '../FBtn'

/** `<side> <align>` — accepts a space or a dash (`bottom end`, `top-start`). */
export type FFabLocation =
  | 'top start'
  | 'top end'
  | 'bottom start'
  | 'bottom end'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

/** The FAB's natural height per size token — feeds the layout slot it reserves. */
const heightBySize: Record<string, number> = {
  'x-small': 36,
  small: 46,
  default: 56,
  medium: 56,
  large: 68,
  'x-large': 80,
}

export const makeFFabProps = propsFactory(
  {
    /** Visibility (use `v-model`). The FAB scales in/out of view. */
    modelValue: { type: Boolean, default: true },
    /** The icon rendered inside the button — the whole point of a FAB. */
    icon: [Boolean, String, Object, Function] as PropType<boolean | IconValue>,
    /** Label for the `extended` (pill) form. The default slot wins over it. */
    text: String as PropType<string>,
    /** Grow into a pill with a label beside the icon. */
    extended: Boolean,
    /** Where a positioned FAB sits: `top`/`bottom` × `start`/`end`. */
    location: { type: String as PropType<FFabLocation>, default: 'bottom end' },
    /** Pin to the nearest positioned ancestor instead of the viewport. */
    absolute: Boolean,
    /** Pin to the viewport and participate in the `<f-layout>` system. */
    app: Boolean,
    /** Reserve layout space, so `<f-main>` content is never covered by the FAB. */
    layout: Boolean,
    /** Straddle the edge it is anchored to — half in, half out. */
    offset: Boolean,
    /** Animate in on the first render, not just on later toggles. */
    appear: Boolean,
    /** Layout stacking order when inside an `<f-layout>` (lower = outer). */
    order: { type: Number, default: 0 },
    disabled: Boolean,
    loading: Boolean,
    ripple: { type: Boolean, default: true },
    href: String as PropType<string>,
    ...makeVariantProps({ variant: 'elevated' }),
    // After the spread, so the FAB's own default wins (the FBtn/FChip pattern).
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeSizeProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FFab'
)

/**
 * A floating action button — an `FBtn` in a positioning shell.
 *
 * The button itself is a plain `FBtn` (every variant, colour, size and state it
 * has); `FFab` only owns *where the button floats*. When `app` is set inside an
 * `<f-layout>` the shell registers as a layout item, so the FAB rides above the
 * main content and clears the sidebar/navbar instead of overlapping them.
 */
export const FFab = genericComponent()({
  name: 'FFab',
  props: makeFFabProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    click: (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', true)
    const { sizeClasses } = useSize(props)

    const containerRef = ref<HTMLElement>()
    const height = ref(heightBySize[String(props.size)] ?? heightBySize.default)

    // `bottom end` / `bottom-end` → side `bottom`, align `end`.
    const parts = computed(() =>
      String(props.location ?? '')
        .split(/[\s-]+/)
        .filter(Boolean)
    )
    const side = computed(() => (parts.value[0] === 'top' ? 'top' : 'bottom'))
    const align = computed(() => (parts.value[1] === 'start' ? 'start' : 'end'))
    const positioned = computed(() => props.app || props.absolute)

    // Layout coordination: a bottom/top-anchored zero-height strip that clears the
    // other bars. `layout` decides whether it also *reserves* space (pushing
    // <f-main>) or just floats over the content, which is the usual FAB behaviour.
    const { hasLayout, layoutItemStyles } = useLayoutItem({
      id: `fui-fab-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      position: side as any,
      size: computed(() => (props.layout ? height.value + 24 : 0)) as any,
      order: computed(() => Number(props.order ?? 0)) as any,
      active: computed(() => !!props.app && model.value) as any,
      margin: computed(() => 0) as any,
    })
    const inLayout = computed(() => hasLayout && props.app)

    let observer: ResizeObserver | null = null
    onMounted(() => {
      if (typeof window === 'undefined' || !containerRef.value) return
      height.value = containerRef.value.offsetHeight || height.value
      if (typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(() => {
        if (containerRef.value) height.value = containerRef.value.offsetHeight || height.value
      })
      observer.observe(containerRef.value)
    })
    onBeforeUnmount(() => observer?.disconnect())

    function onClick(e: MouseEvent): void {
      emit('click', e)
    }

    useRender(() => {
      const btnProps = {
        color: props.color,
        variant: props.variant,
        size: props.size,
        disabled: props.disabled,
        loading: props.loading,
        ripple: props.ripple,
        href: props.href,
        // Extended = a pill with the icon leading the label; otherwise a circle
        // whose only content is the icon (`icon: true` lets the slot supply it).
        ...(props.extended
          ? { prependIcon: props.icon as IconValue | undefined, text: props.text }
          : { icon: props.icon ?? true, circle: true }),
        onClick,
      }
      // FBtn already falls back to its `text` prop when there is no default slot.
      const btnSlots = slots.default ? { default: () => slots.default() } : undefined

      return h(
        'div',
        {
          class: [
            'fui-fab',
            {
              'fui-fab--positioned': positioned.value,
              'fui-fab--absolute': props.absolute && !inLayout.value,
              'fui-fab--fixed': props.app && !inLayout.value,
              'fui-fab--in-layout': inLayout.value,
              'fui-fab--extended': props.extended,
              'fui-fab--offset': props.offset,
              [`fui-fab--${side.value}`]: positioned.value,
              [`fui-fab--${align.value}`]: positioned.value,
            },
            ...sizeClasses.value,
            props.class,
          ],
          style: [inLayout.value ? layoutItemStyles.value : null, props.style],
        },
        [
          h('div', { ref: containerRef, class: 'fui-fab__container' }, [
            h(
              Transition,
              { name: 'fui-fab', appear: props.appear },
              { default: () => (model.value ? h(FBtn, btnProps, btnSlots) : null) }
            ),
          ]),
        ]
      )
    })
  },
})
