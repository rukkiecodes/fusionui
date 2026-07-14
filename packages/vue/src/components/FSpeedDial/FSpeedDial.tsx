import { TransitionGroup, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { getUid } from '../../util/helpers'
import { FMenu } from '../FMenu'
import type { FMenuLocation } from '../FMenu/FMenu'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** The focusable actions inside the fan, in DOM order. */
function focusables(root: HTMLElement | undefined): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  )
}

export const makeFSpeedDialProps = propsFactory(
  {
    /** Open state (use `v-model`). */
    modelValue: { type: Boolean, default: false },
    /** Which way the actions fan out from the activator. */
    location: { type: String as PropType<FMenuLocation>, default: 'top' },
    /** Transition name for the individual actions as they stagger in. */
    transition: { type: String as PropType<string>, default: 'fui-speed-dial' },
    /** Fan out on hover instead of on click. Clicking still works. */
    openOnHover: Boolean,
    /** Gap (px) between the activator and the first action. */
    offset: { type: Number, default: 12 },
    /** Close the fan when an action is clicked. */
    closeOnContentClick: { type: Boolean, default: true },
    /** Accessible name for the group of actions. */
    label: { type: String as PropType<string>, default: 'Actions' },
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSpeedDial'
)

/**
 * A FAB that fans out a column of secondary actions.
 *
 * Positioning, teleporting, outside-click and `Escape` all come from `FMenu` —
 * `FSpeedDial` only adds the fan layout, the stagger, hover intent and the
 * disclosure semantics (`aria-expanded` / `aria-haspopup` on the activator,
 * arrow-key roving between the actions, focus returned on close).
 */
export const FSpeedDial = genericComponent()({
  name: 'FSpeedDial',
  props: makeFSpeedDialProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', false)
    const contentId = `fui-speed-dial-${getUid()}`

    const activatorRef = ref<HTMLElement>()
    const actionsRef = ref<HTMLElement>()
    // The fan is teleported to <body>, so it can't inherit the activator's width.
    // Measuring it lets the column of (smaller) actions centre on the FAB.
    const activatorWidth = ref(56)
    // Only steal focus into the fan when it was opened from the keyboard.
    const viaKeyboard = ref(false)
    let closeTimer: ReturnType<typeof setTimeout> | undefined

    function open(): void {
      if (!props.disabled) isActive.value = true
    }
    function close(): void {
      isActive.value = false
    }
    function cancelClose(): void {
      if (closeTimer) clearTimeout(closeTimer)
      closeTimer = undefined
    }
    // Hover intent: the pointer has to cross the `offset` gap to reach the
    // actions, so closing is deferred long enough to make that trip.
    function scheduleClose(): void {
      cancelClose()
      closeTimer = setTimeout(close, 120)
    }
    function onHoverEnter(): void {
      cancelClose()
      open()
    }

    function focusAction(index: number): void {
      const items = focusables(actionsRef.value)
      if (!items.length) return
      const i = ((index % items.length) + items.length) % items.length
      items[i].focus()
    }

    function onActivatorKeydown(e: KeyboardEvent): void {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        viaKeyboard.value = true
      }
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !isActive.value) {
        e.preventDefault()
        open()
      }
    }

    function onActionsKeydown(e: KeyboardEvent): void {
      const items = focusables(actionsRef.value)
      if (!items.length) return
      const current = items.indexOf(document.activeElement as HTMLElement)
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        focusAction(current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        focusAction(current - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        focusAction(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        focusAction(items.length - 1)
      } else if (e.key === 'Tab') {
        // Tabbing out of a transient fan should dismiss it, not leave it hanging.
        close()
      }
    }

    function measure(): void {
      if (activatorRef.value) activatorWidth.value = activatorRef.value.offsetWidth || 56
    }

    let observer: ResizeObserver | null = null
    onMounted(() => {
      if (typeof window === 'undefined') return
      measure()
      if (typeof ResizeObserver === 'undefined' || !activatorRef.value) return
      observer = new ResizeObserver(measure)
      observer.observe(activatorRef.value)
    })
    onBeforeUnmount(() => {
      cancelClose()
      observer?.disconnect()
    })

    watch(isActive, async (value: boolean) => {
      if (typeof document === 'undefined') return
      if (value) {
        measure()
        await nextTick()
        if (viaKeyboard.value) focusAction(0)
      } else {
        // Escape / outside-click / an action fired: hand focus back to the FAB so
        // the keyboard user isn't dumped at the top of the document.
        const active = document.activeElement as HTMLElement | null
        if (active && actionsRef.value?.contains(active)) {
          focusables(activatorRef.value)[0]?.focus()
        }
        viaKeyboard.value = false
      }
    })

    useRender(() =>
      h(
        FMenu,
        {
          modelValue: isActive.value,
          'onUpdate:modelValue': (value: boolean) => {
            isActive.value = value
          },
          location: props.location,
          offset: props.offset,
          disabled: props.disabled,
          closeOnContentClick: props.closeOnContentClick,
          contentClass: ['fui-speed-dial__content', `fui-speed-dial__content--${props.location}`],
          class: ['fui-speed-dial', props.class],
          style: props.style,
        },
        {
          activator: ({ props: menuProps, isActive: open }: any) =>
            h(
              'div',
              {
                ref: activatorRef,
                class: 'fui-speed-dial__activator',
                onMouseenter: props.openOnHover ? onHoverEnter : undefined,
                onMouseleave: props.openOnHover ? scheduleClose : undefined,
                onPointerdown: () => {
                  viaKeyboard.value = false
                },
                onKeydown: onActivatorKeydown,
              },
              slots.activator?.({
                props: {
                  ...menuProps,
                  'aria-haspopup': 'true',
                  'aria-expanded': String(open),
                  'aria-controls': contentId,
                },
                isActive: open,
              })
            ),
          default: ({ close: closeMenu }: any) =>
            h(
              'div',
              {
                ref: actionsRef,
                id: contentId,
                class: 'fui-speed-dial__actions',
                role: 'group',
                'aria-label': props.label,
                // Match the activator so the column of actions centres on the FAB.
                style: { width: `${activatorWidth.value}px` },
                onMouseenter: props.openOnHover ? cancelClose : undefined,
                onMouseleave: props.openOnHover ? scheduleClose : undefined,
                onKeydown: onActionsKeydown,
              },
              [
                h(
                  TransitionGroup,
                  {
                    name: props.transition,
                    tag: 'div',
                    class: 'fui-speed-dial__list',
                    appear: true,
                  },
                  { default: () => slots.default?.({ close: closeMenu }) }
                ),
              ]
            ),
        }
      )
    )
  },
})
