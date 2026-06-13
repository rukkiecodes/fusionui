import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType, CSSProperties } from 'vue'
import type { ShaderEffect, ShaderRunner, ShaderValues } from '../types'
import { resolveEffect } from '../effects'
import { shouldRunShader } from '../runtime/capability'
import { toRgb01 } from '../runtime/color'

/**
 * FShaderSurface — a lazy, disciplined GPU surface.
 *
 * - The static CSS fallback (from the effect) is applied inline immediately, so
 *   the surface looks right with zero JS and remains the look on non-WebGL2 /
 *   reduced-motion / SSR.
 * - The WebGL2 runtime is dynamically imported only when the surface scrolls
 *   into view AND the browser is capable AND motion is allowed — never in the
 *   critical path.
 * - An IntersectionObserver pauses the render loop off-screen to save battery.
 */
export const FShaderSurface = defineComponent({
  name: 'FShaderSurface',
  props: {
    /** Catalogue effect name or a custom ShaderEffect. */
    effect: {
      type: [String, Object] as PropType<string | ShaderEffect>,
      default: 'gradient',
    },
    colorA: { type: String, default: '#195bff' },
    colorB: { type: String, default: '#7d33ff' },
    /** 0..1 overall strength. */
    intensity: { type: Number, default: 0.9 },
    /** Render-loop FPS cap. */
    fps: { type: Number, default: 30 },
    tag: { type: String, default: 'div' },
  },
  setup(props, { slots }) {
    const root = ref<HTMLElement | null>(null)
    const canvas = ref<HTMLCanvasElement | null>(null)
    const live = ref(false) // true once the GL runner is drawing

    const values: ShaderValues = {
      colorA: toRgb01(props.colorA),
      colorB: toRgb01(props.colorB),
      intensity: props.intensity,
      pointer: [0.5, 0.5],
    }

    let runner: ShaderRunner | null = null
    let io: IntersectionObserver | null = null
    let visible = false
    let disposed = false

    function effectDef(): ShaderEffect {
      return resolveEffect(props.effect)
    }

    async function ensureRunner() {
      if (runner || disposed || !canvas.value) return
      // The heavy WebGL module loads here, on first on-screen frame only.
      const { createShaderRunner } = await import('../runtime/gl')
      if (disposed || !canvas.value) return
      try {
        runner = createShaderRunner(canvas.value, effectDef().frag, values, { fps: props.fps })
        live.value = true
        if (visible) runner.start()
      } catch {
        live.value = false // keep the CSS fallback on any GL failure
      }
    }

    function onPointer(e: PointerEvent) {
      const el = root.value
      if (!el) return
      const r = el.getBoundingClientRect()
      // uv origin bottom-left to match the fullscreen-triangle varying.
      values.pointer = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]
    }

    onMounted(() => {
      if (!shouldRunShader()) return // static fallback only
      io = new IntersectionObserver(
        entries => {
          visible = entries[0]?.isIntersecting ?? false
          if (visible) {
            if (!runner) void ensureRunner()
            else runner.start()
          } else {
            runner?.stop()
          }
        },
        { threshold: 0.01 }
      )
      if (root.value) io.observe(root.value)
      if (effectDef().usesPointer) root.value?.addEventListener('pointermove', onPointer)
    })

    watch(
      () => [props.colorA, props.colorB, props.intensity],
      () => {
        values.colorA = toRgb01(props.colorA)
        values.colorB = toRgb01(props.colorB)
        values.intensity = props.intensity
      }
    )

    // Switching the effect needs a fresh program.
    watch(
      () => props.effect,
      () => {
        runner?.destroy()
        runner = null
        live.value = false
        if (visible) void ensureRunner()
      }
    )

    onBeforeUnmount(() => {
      disposed = true
      io?.disconnect()
      root.value?.removeEventListener('pointermove', onPointer)
      runner?.destroy()
      runner = null
    })

    return () => {
      const def = effectDef()
      const fallback = def.fallback(props.colorA, props.colorB, props.intensity) as CSSProperties
      return h(
        props.tag,
        {
          ref: root,
          class: ['fui-shader-surface', { 'fui-shader-surface--live': live.value }],
          style: { position: 'relative', overflow: 'hidden', isolation: 'isolate' },
        },
        [
          // Static fallback layer — always present, sits under the canvas.
          h('span', {
            'aria-hidden': 'true',
            class: 'fui-shader-surface__fallback',
            style: {
              position: 'absolute',
              inset: '0',
              ...fallback,
            } as CSSProperties,
          }),
          // GPU layer — transparent until the runner draws.
          h('canvas', {
            ref: canvas,
            class: 'fui-shader-surface__canvas',
            style: {
              position: 'absolute',
              inset: '0',
              width: '100%',
              height: '100%',
              display: 'block',
              opacity: live.value ? '1' : '0',
              transition: 'opacity 300ms ease',
            } as CSSProperties,
          }),
          // Foreground content.
          slots.default
            ? h(
                'div',
                {
                  class: 'fui-shader-surface__content',
                  style: { position: 'relative', zIndex: 1 } as CSSProperties,
                },
                slots.default()
              )
            : null,
        ]
      )
    }
  },
})

export type FShaderSurface = InstanceType<typeof FShaderSurface>
