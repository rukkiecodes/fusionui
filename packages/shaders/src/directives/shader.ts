import type { Directive, DirectiveBinding } from 'vue'
import type { ShaderEffect, ShaderRunner, ShaderValues } from '../types'
import { resolveEffect } from '../effects'
import { shouldRunShader } from '../runtime/capability'
import { toRgb01 } from '../runtime/color'

export interface ShaderDirectiveValue {
  effect?: string | ShaderEffect
  colorA?: string
  colorB?: string
  intensity?: number
  fps?: number
}

interface State {
  canvas: HTMLCanvasElement | null
  runner: ShaderRunner | null
  io: IntersectionObserver | null
  values: ShaderValues
  visible: boolean
  disposed: boolean
  onPointer?: (e: PointerEvent) => void
  onVisibility?: () => void
}

const store = new WeakMap<HTMLElement, State>()

function opts(
  binding: DirectiveBinding<ShaderDirectiveValue | undefined>
): Required<ShaderDirectiveValue> {
  const v = binding.value ?? {}
  return {
    effect: v.effect ?? 'gradient',
    colorA: v.colorA ?? '#195bff',
    colorB: v.colorB ?? '#7d33ff',
    intensity: v.intensity ?? 0.9,
    fps: v.fps ?? 30,
  }
}

function applyFallback(el: HTMLElement, def: ShaderEffect, o: Required<ShaderDirectiveValue>) {
  Object.assign(el.style, def.fallback(o.colorA, o.colorB, o.intensity))
}

/**
 * `v-shader` — run a catalogue effect behind any element. Same discipline as
 * FShaderSurface: static CSS fallback applied immediately, the WebGL runtime
 * lazy-loads only when on-screen and capable, and pauses off-screen.
 *
 *   <div v-shader="{ effect: 'gradient', colorA: '#195bff', colorB: '#7d33ff' }">…</div>
 */
export const vShader: Directive<HTMLElement, ShaderDirectiveValue | undefined> = {
  mounted(el, binding) {
    const o = opts(binding)
    const def = resolveEffect(o.effect)
    applyFallback(el, def, o)

    if (!shouldRunShader()) return

    const cs = getComputedStyle(el)
    if (cs.position === 'static') el.style.position = 'relative'

    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '0',
      opacity: '0',
      transition: 'opacity 300ms ease',
      pointerEvents: 'none',
    })
    el.insertBefore(canvas, el.firstChild)

    const state: State = {
      canvas,
      runner: null,
      io: null,
      visible: false,
      disposed: false,
      values: {
        colorA: toRgb01(o.colorA),
        colorB: toRgb01(o.colorB),
        intensity: o.intensity,
        pointer: [0.5, 0.5],
      },
    }
    store.set(el, state)

    const ensure = async () => {
      if (state.runner || state.disposed) return
      const { createShaderRunner } = await import('../runtime/gl')
      if (state.disposed) return
      try {
        state.runner = createShaderRunner(canvas, def.frag, state.values, { fps: o.fps })
        canvas.style.opacity = '1'
        if (state.visible) state.runner.start()
      } catch {
        canvas.style.opacity = '0'
      }
    }

    state.io = new IntersectionObserver(
      entries => {
        state.visible = entries[0]?.isIntersecting ?? false
        if (state.visible) {
          if (state.runner) state.runner.start()
          else void ensure()
        } else {
          state.runner?.stop()
        }
      },
      { threshold: 0.01 }
    )
    state.io.observe(el)

    // Pause when the tab is backgrounded (the IO only covers off-screen).
    state.onVisibility = () => {
      if (document.hidden) state.runner?.stop()
      else if (state.visible && state.runner) state.runner.start()
    }
    document.addEventListener('visibilitychange', state.onVisibility)

    if (def.usesPointer) {
      state.onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        state.values.pointer = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]
      }
      el.addEventListener('pointermove', state.onPointer)
    }
  },

  updated(el, binding) {
    const state = store.get(el)
    const o = opts(binding)
    if (!state) return
    state.values.colorA = toRgb01(o.colorA)
    state.values.colorB = toRgb01(o.colorB)
    state.values.intensity = o.intensity
  },

  unmounted(el) {
    const state = store.get(el)
    if (!state) return
    state.disposed = true
    state.io?.disconnect()
    if (state.onPointer) el.removeEventListener('pointermove', state.onPointer)
    if (state.onVisibility) document.removeEventListener('visibilitychange', state.onVisibility)
    state.runner?.destroy()
    state.canvas?.remove()
    store.delete(el)
  },
}
