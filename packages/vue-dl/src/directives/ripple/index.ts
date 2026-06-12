import type { DirectiveBinding, ObjectDirective } from 'vue'

// Vuesax-style ripple: a soft radial circle that grows from the click point to
// ~2.5x the element width and lingers while pressed, fading out on release.
// Color comes from the `--vd-ripple-color` CSS variable (white by default;
// components set it to their accent color for light backgrounds).

interface RippleElement extends HTMLElement {
  _vdRipple?: {
    enabled: boolean
    centered: boolean
    onPointerdown: (e: PointerEvent) => void
  }
}

function show(e: PointerEvent, el: RippleElement): void {
  const data = el._vdRipple
  if (!data?.enabled) return

  const rect = el.getBoundingClientRect()
  const x = data.centered ? rect.width / 2 : e.clientX - rect.left
  const y = data.centered ? rect.height / 2 : e.clientY - rect.top
  const size = el.clientWidth * 2.5
  const duration = el.clientWidth > 150 ? 0.9 : 0.6

  const container = document.createElement('span')
  container.className = 'vd-ripple__container'

  const effect = document.createElement('span')
  effect.className = 'vd-ripple__effect'
  effect.style.left = `${x}px`
  effect.style.top = `${y}px`
  effect.style.transitionDuration = `${duration}s`
  container.appendChild(effect)

  const computed = window.getComputedStyle(el)
  if (computed.position === 'static') {
    el.style.position = 'relative'
    el.dataset.vdRippleStatic = 'true'
  }

  // Insert behind later siblings (content) but above the element background.
  el.insertBefore(container, el.firstChild)

  // Next frame: grow + fade in.
  requestAnimationFrame(() => {
    effect.style.width = `${size}px`
    effect.style.height = `${size}px`
    effect.style.opacity = '1'
  })

  let released = false
  const remove = (): void => {
    if (released) return
    released = true
    effect.style.opacity = '0'
    window.setTimeout(() => {
      container.remove()
      if (!el.querySelector('.vd-ripple__container') && el.dataset.vdRippleStatic) {
        el.style.position = ''
        delete el.dataset.vdRippleStatic
      }
    }, duration * 500)
    el.removeEventListener('pointerup', remove)
    el.removeEventListener('pointerleave', remove)
  }
  el.addEventListener('pointerup', remove)
  el.addEventListener('pointerleave', remove)
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
