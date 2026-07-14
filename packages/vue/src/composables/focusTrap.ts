import { nextTick, onBeforeUnmount, watch } from 'vue'
import type { Ref } from 'vue'

// Focus management for anything modal.
//
// A surface that announces `aria-modal="true"` while letting Tab wander off
// behind its scrim is lying to a screen-reader user: everything behind a modal is
// inert, so there is nothing back there worth reaching. Both FOverlay and FDialog
// need this, and FDialog does not build on FOverlay, so it lives here rather than
// being written twice and drifting.

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Deliberately NOT the usual `offsetParent !== null` shortcut: `offsetParent` is
 * null for any `position: fixed` element — so a pinned control inside the panel
 * would be skipped — and it is null for everything under jsdom, which would make
 * the trap untestable.
 */
function isVisible(el: HTMLElement): boolean {
  if (el.hidden) return false
  if (typeof getComputedStyle !== 'function') return true
  const style = getComputedStyle(el)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

export function focusables(root: HTMLElement | undefined | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible)
}

export interface FocusTrapOptions {
  /** Skip the trap entirely — for a non-modal surface that shouldn't hold focus. */
  disabled?: () => boolean
}

/**
 * While `isActive` is true: move focus into `contentRef`, keep Tab inside it, and
 * hand focus back to whatever opened it on close.
 *
 * Returns the `keydown` handler so the caller can bind it wherever it already
 * listens (both consumers keep their own document/window listener).
 */
export function useFocusTrap(
  contentRef: Ref<HTMLElement | undefined | null>,
  isActive: Ref<boolean>,
  options: FocusTrapOptions = {}
): { onTrapKeydown: (e: KeyboardEvent) => void } {
  /** Whatever held focus before we opened, so it can be given back. */
  let returnTo: HTMLElement | null = null

  const disabled = (): boolean => options.disabled?.() ?? false

  function onTrapKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !isActive.value || disabled()) return

    const items = focusables(contentRef.value)
    const first = items[0] ?? contentRef.value
    const last = items[items.length - 1] ?? contentRef.value
    if (!first || !last) return

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // `flush: 'post'` because the panel is teleported and wrapped in a Transition:
  // it is not in the DOM yet when a default (pre) watcher would run.
  watch(
    isActive,
    async (open: boolean) => {
      if (typeof document === 'undefined' || disabled()) return

      if (open) {
        returnTo = document.activeElement as HTMLElement | null
        await nextTick()
        // Prefer the first control; fall back to the panel itself, so focus is
        // never left stranded on an element behind the scrim.
        const [first] = focusables(contentRef.value)
        ;(first ?? contentRef.value)?.focus()
      } else {
        returnTo?.focus?.()
        returnTo = null
      }
    },
    { flush: 'post' }
  )

  onBeforeUnmount(() => {
    returnTo = null
  })

  return { onTrapKeydown }
}
