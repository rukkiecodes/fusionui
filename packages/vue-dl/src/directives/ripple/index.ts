import type { DirectiveBinding, ObjectDirective } from 'vue'

// The ripple is one of Vuesax's three signature interactions (with soft shadows
// and hover-lift). Ported as a directive so any component can opt in.

interface RippleElement extends HTMLElement {
  _vdRipple?: {
    enabled: boolean
    centered: boolean
    onPointerdown: (e: PointerEvent) => void
  }
}

const DEFAULT_DURATION = 600

function calculate(e: PointerEvent, el: HTMLElement, centered: boolean) {
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const radius = size / 2

  let localX = radius
  let localY = radius
  if (!centered) {
    localX = e.clientX - rect.left
    localY = e.clientY - rect.top
  }
  // Diameter large enough to cover the element from the click point.
  const diameter =
    2 *
    Math.max(
      Math.hypot(localX, localY),
      Math.hypot(rect.width - localX, localY),
      Math.hypot(localX, rect.height - localY),
      Math.hypot(rect.width - localX, rect.height - localY)
    )

  return { diameter, x: localX, y: localY }
}

function show(e: PointerEvent, el: RippleElement): void {
  const data = el._vdRipple
  if (!data?.enabled) return

  const container = document.createElement('span')
  container.className = 'vd-ripple__container'

  const animation = document.createElement('span')
  animation.className = 'vd-ripple__animation'

  const { diameter, x, y } = calculate(e, el, data.centered)
  const size = diameter || 10

  animation.style.width = `${size}px`
  animation.style.height = `${size}px`
  animation.style.left = `${x - size / 2}px`
  animation.style.top = `${y - size / 2}px`

  container.appendChild(animation)

  const computed = window.getComputedStyle(el)
  if (computed.position === 'static') {
    el.style.position = 'relative'
    el.dataset.vdRippleStatic = 'true'
  }

  el.appendChild(container)

  // Force reflow then trigger the scale/fade transition.
  void animation.offsetWidth
  animation.classList.add('vd-ripple__animation--enter')

  window.setTimeout(() => {
    animation.classList.add('vd-ripple__animation--leave')
    window.setTimeout(() => {
      container.remove()
      if (el.dataset.vdRippleStatic) {
        el.style.position = ''
        delete el.dataset.vdRippleStatic
      }
    }, DEFAULT_DURATION / 2)
  }, DEFAULT_DURATION / 2)
}

function isEnabled(value: unknown): boolean {
  return typeof value === 'undefined' || !!value
}

function mounted(el: RippleElement, binding: DirectiveBinding): void {
  const centered = !!binding.modifiers.center
  const onPointerdown = (e: PointerEvent) => show(e, el)

  el._vdRipple = { enabled: isEnabled(binding.value), centered, onPointerdown }
  el.classList.add('vd-ripple')
  el.addEventListener('pointerdown', onPointerdown)
}

function updated(el: RippleElement, binding: DirectiveBinding): void {
  if (!el._vdRipple) return
  el._vdRipple.enabled = isEnabled(binding.value)
  el._vdRipple.centered = !!binding.modifiers.center
}

function unmounted(el: RippleElement): void {
  if (el._vdRipple) {
    el.removeEventListener('pointerdown', el._vdRipple.onPointerdown)
    delete el._vdRipple
  }
}

export const Ripple: ObjectDirective<RippleElement> = {
  mounted,
  updated,
  unmounted,
}

export default Ripple
