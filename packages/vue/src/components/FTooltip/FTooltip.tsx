import { computed, h, onBeforeUnmount, ref, watch, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { ClickOutside } from '../../directives/click-outside'
import { parseColor } from '../../util/colors'

type Location = 'top' | 'bottom' | 'left' | 'right'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function colorTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFTooltipProps = propsFactory(
  {
    /** Content text (shorthand for the `tooltip` slot). */
    text: String as PropType<string>,
    /** Which side of the trigger the tooltip sits on. */
    location: { type: String as PropType<Location>, default: 'top' },
    /** Background fill — a theme color name or any CSS color. Dark by default. */
    color: String as PropType<string>,
    /** Hide the pointing arrow. */
    notArrow: Boolean,
    /** Softer, more rounded corners. */
    circle: Boolean,
    /** Hard square corners. */
    square: Boolean,
    /** A light, outlined style instead of a solid fill. */
    border: Boolean,
    /** A light style with a thick accent edge on the pointing side. */
    borderThick: Boolean,
    /** A light, elevated style (surface fill + shadow). */
    shadow: Boolean,
    /** Show a loading spinner and dim the content. */
    loading: Boolean,
    /** Keep the tooltip open while the pointer is over it. */
    interactivity: Boolean,
    /** Don't open on hover — drive visibility with `v-model` instead. */
    notHover: Boolean,
    /** Delay before opening, in ms. */
    delay: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** Gap between trigger and tooltip, in px. */
    offset: { type: [Number, String] as PropType<number | string>, default: 8 },
    /** Controlled open state (use with `notHover`). */
    modelValue: { type: Boolean, default: false },
    ...makeComponentProps(),
  },
  'FTooltip'
)

export const FTooltip = genericComponent()({
  name: 'FTooltip',
  props: makeFTooltipProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    const active = useProxiedModel(props, 'modelValue', false)
    const rootRef = ref<HTMLElement>()
    const hoveringTip = ref(false)
    let openTimer: ReturnType<typeof setTimeout> | undefined
    let closeTimer: ReturnType<typeof setTimeout> | undefined

    // The tooltip is position:fixed so it escapes any clipping/overflow ancestor;
    // its coordinates come from the trigger's rect and re-measure on scroll/resize.
    const tick = ref(0)
    let raf = 0
    let listening = false
    function schedule() {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        tick.value++
      })
    }
    function setListeners(on: boolean) {
      if (typeof window === 'undefined' || on === listening) return
      const fn = on ? window.addEventListener : window.removeEventListener
      fn('scroll', schedule, true)
      fn('resize', schedule)
      listening = on
    }
    watch(active, v => {
      setListeners(v)
      if (v) tick.value++
    })
    onBeforeUnmount(() => {
      setListeners(false)
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    })

    function open() {
      clearTimeout(closeTimer)
      const d = Number(props.delay) || 0
      if (d) {
        clearTimeout(openTimer)
        openTimer = setTimeout(() => (active.value = true), d)
      } else {
        active.value = true
      }
    }
    function close() {
      clearTimeout(openTimer)
      if (props.interactivity) {
        clearTimeout(closeTimer)
        closeTimer = setTimeout(() => {
          if (!hoveringTip.value) active.value = false
        }, 250)
      } else {
        active.value = false
      }
    }

    const colorVar = computed(() => colorTriplet(props.color))
    const gap = computed(() => Number(props.offset) || 0)

    // Center the tooltip on the trigger with a transform, so we never need to
    // measure the tooltip's own size to position it.
    const tipStyle = computed(() => {
      void tick.value
      const base: Record<string, string> = {}
      if (colorVar.value) base['--fui-tooltip-color'] = colorVar.value
      const el = rootRef.value
      if (!el) return base
      const r = el.getBoundingClientRect()
      const g = gap.value
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      let placed: Record<string, string>
      switch (props.location) {
        case 'bottom':
          placed = { top: `${r.bottom}px`, left: `${cx}px`, transform: `translate(-50%, ${g}px)` }
          break
        case 'left':
          placed = {
            top: `${cy}px`,
            left: `${r.left}px`,
            transform: `translate(calc(-100% - ${g}px), -50%)`,
          }
          break
        case 'right':
          placed = {
            top: `${cy}px`,
            left: `${r.right}px`,
            transform: `translate(${g}px, -50%)`,
          }
          break
        default:
          placed = {
            top: `${r.top}px`,
            left: `${cx}px`,
            transform: `translate(-50%, calc(-100% - ${g}px))`,
          }
      }
      return { position: 'fixed', ...placed, ...base }
    })

    useRender(() => {
      const triggerHandlers = props.notHover
        ? {}
        : {
            onMouseenter: open,
            onMouseleave: close,
            onFocusin: open,
            onFocusout: close,
          }

      const tip = active.value
        ? h(
            'div',
            {
              class: [
                'fui-tooltip__content',
                `fui-tooltip__content--${props.location}`,
                {
                  'fui-tooltip__content--colored': !!colorVar.value,
                  'fui-tooltip__content--no-arrow': props.notArrow,
                  'fui-tooltip__content--circle': props.circle,
                  'fui-tooltip__content--square': props.square,
                  'fui-tooltip__content--border': props.border,
                  'fui-tooltip__content--border-thick': props.borderThick,
                  'fui-tooltip__content--shadow': props.shadow,
                  'fui-tooltip__content--loading': props.loading,
                },
              ],
              role: 'tooltip',
              style: tipStyle.value,
              onMouseenter: props.interactivity
                ? () => {
                    hoveringTip.value = true
                    clearTimeout(closeTimer)
                  }
                : undefined,
              onMouseleave: props.interactivity
                ? () => {
                    hoveringTip.value = false
                    close()
                  }
                : undefined,
            },
            [
              props.loading ? h('span', { class: 'fui-tooltip__loading' }) : null,
              h(
                'span',
                { class: 'fui-tooltip__inner' },
                slots.tooltip ? slots.tooltip() : props.text
              ),
            ]
          )
        : null

      return withDirectives(
        h(
          'span',
          {
            ref: rootRef,
            class: ['fui-tooltip', props.class],
            style: props.style,
            ...triggerHandlers,
          },
          [slots.activator?.({ active: active.value }) ?? slots.default?.(), tip]
        ),
        props.notHover
          ? [
              [
                ClickOutside,
                {
                  handler: () => {
                    active.value = false
                  },
                },
              ],
            ]
          : []
      )
    })
  },
})
