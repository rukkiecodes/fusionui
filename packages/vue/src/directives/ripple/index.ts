import type { DirectiveBinding, ObjectDirective } from 'vue'

// Vuesax-style ripple: a soft radial circle that grows from the click point to
// ~2.5x the element width and lingers while pressed, fading out on release.
// Color comes from the `--fui-ripple-color` CSS variable (white by default;
// components set it to their accent color for light backgrounds).

interface RippleElement extends HTMLElement {
  _fuiRipple?: {
    enabled: boolean
    centered: boolean
    onPointerdown: (e: PointerEvent) => void
  }
}

function show(e: PointerEvent, el: RippleElement): void {
  const data = el._fuiRipple
  if (!data?.enabled) return

  const rect = el.getBoundingClientRect()
  const x = data.centered ? rect.width / 2 : e.clientX - rect.left
  const y = data.centered ? rect.height / 2 : e.clientY - rect.top
  const time = el.clientWidth > 150 ? 1.2 : 0.6

  const container = document.createElement('span')
  container.className = 'fui-ripple__container'

  const effect = document.createElement('span')
  effect.className = 'fui-ripple__effect'
  effect.style.left = `${x}px`
  effect.style.top = `${y}px`
  effect.style.transition = `all ${time}s ease`
  container.appendChild(effect)

  if (window.getComputedStyle(el).position === 'static') {
    el.style.position = 'relative'
    el.dataset.fuiRippleStatic = 'true'
  }

  // Insert behind later siblings (content) but above the element background.
  el.insertBefore(container, el.firstChild)

  // Reading clientWidth forces a synchronous reflow so the browser paints the
  // ripple at its initial 0 size BEFORE we set the final size — this is what
  // makes the grow transition fire reliably (the Vuesax technique).
  const size = el.clientWidth * 2.5
  effect.style.width = `${size}px`
  effect.style.height = `${size}px`
  effect.style.opacity = '1'

  // Even a quick click should show the ripple: wait before fading unless the
  // press already lasted long enough.
  let pressedLongEnough = false
  window.setTimeout(() => {
    pressedLongEnough = true
  }, 300)

  let removed = false
  const remove = (): void => {
    if (removed) return
    removed = true
    el.removeEventListener('pointerup', remove)
    el.removeEventListener('pointerleave', remove)

    window.setTimeout(
      () => {
        effect.style.transition = `opacity ${time * 0.6}s ease`
        effect.style.opacity = '0'
        window.setTimeout(() => {
          container.remove()
          if (!el.querySelector('.fui-ripple__container') && el.dataset.fuiRippleStatic) {
            el.style.position = ''
            delete el.dataset.fuiRippleStatic
          }
        }, time * 600)
      },
      pressedLongEnough ? 0 : time * 400
    )
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

  el._fuiRipple = { enabled: isEnabled(binding.value), centered, onPointerdown }
  el.classList.add('fui-ripple')
  el.addEventListener('pointerdown', onPointerdown)
}

function updated(el: RippleElement, binding: DirectiveBinding): void {
  if (!el._fuiRipple) return
  el._fuiRipple.enabled = isEnabled(binding.value)
  el._fuiRipple.centered = !!binding.modifiers.center
}

function unmounted(el: RippleElement): void {
  if (el._fuiRipple) {
    el.removeEventListener('pointerdown', el._fuiRipple.onPointerdown)
    delete el._fuiRipple
  }
}

export const Ripple: ObjectDirective<RippleElement> = {
  mounted,
  updated,
  unmounted,
}

export default Ripple
