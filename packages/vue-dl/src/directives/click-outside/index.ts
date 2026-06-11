import type { DirectiveBinding, ObjectDirective } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  _vdClickOutside?: {
    handler: (e: MouseEvent) => void
  }
}

type ClickOutsideValue =
  | ((e: MouseEvent) => void)
  | { handler: (e: MouseEvent) => void; include?: () => HTMLElement[] }

function mounted(el: ClickOutsideElement, binding: DirectiveBinding<ClickOutsideValue>): void {
  const value = binding.value
  const handler = typeof value === 'function' ? value : value.handler
  const include = typeof value === 'function' ? () => [] : (value.include ?? (() => []))

  const onClick = (e: MouseEvent): void => {
    const target = e.target as Node | null
    if (!target) return
    const elements = [el, ...include()]
    const isInside = elements.some(element => element.contains(target))
    if (!isInside) handler(e)
  }

  el._vdClickOutside = { handler: onClick }
  // Defer to capture phase on document so it runs predictably.
  window.requestAnimationFrame(() => {
    document.addEventListener('click', onClick, true)
  })
}

function unmounted(el: ClickOutsideElement): void {
  if (el._vdClickOutside) {
    document.removeEventListener('click', el._vdClickOutside.handler, true)
    delete el._vdClickOutside
  }
}

export const ClickOutside: ObjectDirective<ClickOutsideElement> = {
  mounted,
  unmounted,
}

export default ClickOutside
