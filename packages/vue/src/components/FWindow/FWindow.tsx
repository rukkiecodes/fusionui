import { computed, h, provide, ref, toRef, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useGroup } from '../../composables/group'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FWindowContextSymbol, FWindowSymbol } from './key'

/** How far (px) a swipe must travel along the window's axis before it changes item. */
const SWIPE_THRESHOLD = 48

export const makeFWindowProps = propsFactory(
  {
    /** Value of the active `FWindowItem` (v-model). Defaults to the first item. */
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Wrap around at the ends instead of stopping. */
    continuous: Boolean,
    /** Invert the side each item transitions in from. */
    reverse: Boolean,
    /** The prev/next controls: `true`, `false`, or `'hover'`. */
    showArrows: { type: [Boolean, String] as PropType<boolean | 'hover'>, default: false },
    /** Slide along the x-axis (default) or the y-axis. */
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    /** Enable swipe/drag navigation. */
    touch: { type: Boolean, default: true },
    prevIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$prev' },
    nextIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$next' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FWindow'
)

/**
 * The sliding-pane primitive: one item is visible at a time and changing the
 * model transitions between them. Tab panels and carousels are this idea plus
 * chrome — reach for `FWindow` when you want the motion on its own (wizards,
 * onboarding steps, a stepped form).
 */
export const FWindow = genericComponent()({
  name: 'FWindow',
  props: makeFWindowProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const group = useGroup(props, FWindowSymbol)
    const isReversed = ref(false)

    const items = computed(() => group.items.value)
    const activeIndex = computed(() =>
      items.value.findIndex(item => group.selected.value.includes(item.value))
    )

    // A window always shows something: adopt the first item when nothing (or an
    // unknown value) is selected. Runs once the children have registered.
    watch(
      () => items.value.length,
      length => {
        if (length && activeIndex.value === -1) group.select(items.value[0].id, true)
      },
      { flush: 'post' }
    )

    // Which way the next transition travels. Resolved synchronously so the
    // transition classes are already right when Vue patches the DOM.
    watch(
      activeIndex,
      (newIndex, oldIndex) => {
        const last = items.value.length - 1
        if (items.value.length > 2 && newIndex === last && oldIndex === 0) isReversed.value = false
        else if (items.value.length > 2 && newIndex === 0 && oldIndex === last)
          isReversed.value = true
        else isReversed.value = newIndex < oldIndex
      },
      { flush: 'sync' }
    )

    const transition = computed(() => {
      const axis = props.direction === 'vertical' ? 'y' : 'x'
      const reversed = props.reverse ? !isReversed.value : isReversed.value
      return `fui-window-${axis}${reversed ? '-reverse' : ''}`
    })

    provide(FWindowContextSymbol, { transition, direction: toRef(() => props.direction) })

    const canMoveBack = computed(() => props.continuous || activeIndex.value > 0)
    const canMoveForward = computed(
      () => props.continuous || activeIndex.value < items.value.length - 1
    )

    function go(delta: number): void {
      const total = items.value.length
      if (!total) return
      const target = activeIndex.value + delta
      const index = props.continuous ? ((target % total) + total) % total : target
      if (index < 0 || index > total - 1) return
      group.select(items.value[index].id, true)
    }

    function prev(): void {
      if (canMoveBack.value) go(-1)
    }
    function next(): void {
      if (canMoveForward.value) go(1)
    }

    // ---- Swipe ----
    let startX = 0
    let startY = 0
    let tracking = false

    function onPointerdown(e: PointerEvent): void {
      if (!props.touch) return
      tracking = true
      startX = e.clientX
      startY = e.clientY
    }
    function onPointerup(e: PointerEvent): void {
      if (!tracking) return
      tracking = false
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const along = props.direction === 'vertical' ? dy : dx
      const across = props.direction === 'vertical' ? dx : dy
      // Ignore taps, and gestures that mostly travel across the window's axis.
      if (Math.abs(along) < SWIPE_THRESHOLD || Math.abs(along) <= Math.abs(across)) return
      if (along < 0) next()
      else prev()
    }
    function onPointercancel(): void {
      tracking = false
    }

    function control(kind: 'prev' | 'next'): VNodeChild {
      const isPrev = kind === 'prev'
      const controlProps = {
        icon: isPrev ? props.prevIcon : props.nextIcon,
        class: `fui-window__arrow fui-window__arrow--${kind}`,
        disabled: isPrev ? !canMoveBack.value : !canMoveForward.value,
        'aria-label': isPrev ? 'Previous' : 'Next',
        onClick: isPrev ? prev : next,
      }
      const slot = isPrev ? slots.prev : slots.next
      if (slot) return slot({ props: controlProps })

      return h(
        'button',
        {
          type: 'button',
          class: controlProps.class,
          disabled: controlProps.disabled,
          'aria-label': controlProps['aria-label'],
          onClick: controlProps.onClick,
        },
        h(FIcon, { icon: controlProps.icon })
      )
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-window',
            `fui-window--${props.direction}`,
            { 'fui-window--arrows-hover': props.showArrows === 'hover' },
            props.class,
          ],
          style: props.style,
          onPointerdown,
          onPointerup,
          onPointercancel,
        },
        [
          h('div', { class: 'fui-window__container' }, [
            slots.default?.({ group }),
            props.showArrows !== false && items.value.length > 1
              ? h('div', { class: 'fui-window__controls' }, [control('prev'), control('next')])
              : null,
          ]),
          slots.additional?.({ group }),
        ]
      )
    )
  },
})
