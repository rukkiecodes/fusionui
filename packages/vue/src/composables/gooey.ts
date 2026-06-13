/**
 * useGooey — web adapter (Vue 3).
 *
 * Runs a GooSystem on requestAnimationFrame and exposes a reactive SVG path of
 * the metaball isosurface (marching squares). Two render modes:
 *
 *   'contour' — the real isosurface as a vector <path>. Crisp at any zoom,
 *               exact bridges. Component renders the returned `path`.
 *   'filter'  — blob circles fed through an SVG goo filter (blur + alpha
 *               contrast). Cheaper for many instances; the classic look.
 *               Component renders `circles` inside <g filter>.
 *
 * The physics is identical in both; only rendering differs. The sim sleeps
 * automatically once everything settles (kinetic energy under a floor) and
 * wakes on interaction, so an idle gooey background costs ~nothing.
 */

import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import { GooSystem } from '../engine/gooey'
import type { Blob, DeepPartial, GooParams } from '../engine/gooey'

export type GooRenderMode = 'contour' | 'filter'

export interface UseGooeyOptions {
  params?: DeepPartial<GooParams>
  /** Marching-squares cell size px (contour mode). Lower = smoother + slower. */
  cell?: number
  /** Chaikin smoothing passes (contour mode). */
  smoothing?: number
  mode?: GooRenderMode
  /** Pointer behaviour: + attracts blobs to the cursor, − repels. */
  pointerStrength?: number
  pointerRadius?: number
  /** Sleep when total KE drops below this (px²/s² · mass). 0 disables sleep. */
  sleepEnergy?: number
}

export interface UseGooeyReturn {
  system: GooSystem
  /** SVG path of the gooey field (contour mode). */
  path: Ref<string>
  /** Blob circles for filter mode: {cx,cy,r}. */
  circles: Ref<Array<{ cx: number; cy: number; r: number }>>
  /** Whether the sim is currently awake. */
  running: Ref<boolean>
  setPointer: (x: number, y: number) => void
  clearPointer: () => void
  /** Nudge a blob (e.g. on click) and wake the sim. */
  impulse: (index: number, vx: number, vy: number) => void
  wake: () => void
}

export function useGooey(
  container: Ref<HTMLElement | null>,
  blobs: Blob[],
  options: UseGooeyOptions = {}
): UseGooeyReturn {
  const {
    cell = 8,
    smoothing = 2,
    mode = 'contour',
    pointerStrength = 0,
    pointerRadius = 140,
    sleepEnergy = 12,
  } = options

  const system = new GooSystem(blobs, options.params)
  const path = ref('')
  const circles = shallowRef<Array<{ cx: number; cy: number; r: number }>>([])
  const running = ref(true)

  // Reduced-motion: never run the animation loop. Settle the field once to a
  // resting frame and render it statically — the goo's shape without the motion.
  const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let raf = 0
  let last = 0
  let idleFrames = 0

  function render() {
    if (mode === 'contour') {
      path.value = system.toPath(cell, smoothing)
    } else {
      circles.value = system.blobs.map(b => ({ cx: b.x, cy: b.y, r: b.r }))
    }
  }

  function totalEnergy(): number {
    let ke = 0
    for (const b of system.blobs) ke += (b.mass ?? b.r * b.r) * (b.vx * b.vx + b.vy * b.vy)
    return ke
  }

  function frame(now: number) {
    const dt = last ? (now - last) / 1000 : 1 / 60
    last = now
    system.step(dt)
    render()

    // auto-sleep once settled and the pointer isn't engaged
    if (sleepEnergy > 0 && !system.pointer.active) {
      if (totalEnergy() < sleepEnergy) idleFrames++
      else idleFrames = 0
      if (idleFrames > 30) {
        running.value = false
        raf = 0
        return
      }
    }
    raf = requestAnimationFrame(frame)
  }

  function wake() {
    if (reducedMotion) {
      // Settle to a resting frame, render once, never animate.
      for (let i = 0; i < 180; i++) system.step(1 / 60)
      render()
      running.value = false
      return
    }
    if (running.value && raf) return
    running.value = true
    idleFrames = 0
    last = 0
    raf = requestAnimationFrame(frame)
  }

  function syncBounds() {
    const el = container.value
    if (!el) return
    const r = el.getBoundingClientRect()
    system.setBounds(r.width, r.height)
    render()
  }

  let ro: ResizeObserver | null = null
  onMounted(() => {
    syncBounds()
    ro = new ResizeObserver(() => {
      syncBounds()
      wake()
    })
    if (container.value) ro.observe(container.value)
    wake()
  })

  watch(container, el => {
    ro?.disconnect()
    if (el && ro) ro.observe(el)
    syncBounds()
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    cancelAnimationFrame(raf)
  })

  function setPointer(x: number, y: number) {
    system.pointer.x = x
    system.pointer.y = y
    system.pointer.strength = pointerStrength
    system.pointer.radius = pointerRadius
    system.pointer.active = pointerStrength !== 0
    wake()
  }
  function clearPointer() {
    system.pointer.active = false
  }
  function impulse(index: number, vx: number, vy: number) {
    const b = system.blobs[index]
    if (b) {
      b.vx += vx
      b.vy += vy
      wake()
    }
  }

  return {
    system,
    path,
    circles,
    running,
    setPointer,
    clearPointer,
    impulse,
    wake,
  }
}

/** Stable id for the shared SVG goo filter (filter mode). */
export const GOO_FILTER_ID = 'fui-goo-filter'
