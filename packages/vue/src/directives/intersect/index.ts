import type { DirectiveBinding, ObjectDirective } from 'vue'

interface IntersectElement extends HTMLElement {
  _vdIntersect?: {
    observer: IntersectionObserver
  }
}

type IntersectHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void

type IntersectValue =
  | IntersectHandler
  | { handler: IntersectHandler; options?: IntersectionObserverInit }

function mounted(el: IntersectElement, binding: DirectiveBinding<IntersectValue>): void {
  if (typeof IntersectionObserver === 'undefined') return

  const value = binding.value
  const handler = typeof value === 'function' ? value : value.handler
  const options = typeof value === 'function' ? undefined : value.options
  const once = !!binding.modifiers.once

  const observer = new IntersectionObserver((entries, obs) => {
    const isIntersecting = entries.some(e => e.isIntersecting)
    handler(isIntersecting, entries, obs)
    if (once && isIntersecting) {
      unmounted(el)
    }
  }, options)

  el._vdIntersect = { observer }
  observer.observe(el)
}

function unmounted(el: IntersectElement): void {
  if (el._vdIntersect) {
    el._vdIntersect.observer.disconnect()
    delete el._vdIntersect
  }
}

export const Intersect: ObjectDirective<IntersectElement> = {
  mounted,
  unmounted,
}

export default Intersect
