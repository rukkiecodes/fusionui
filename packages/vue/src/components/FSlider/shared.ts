// Track maths and pointer plumbing shared by FSlider (one thumb) and
// FRangeSlider (two). Kept framework-free so both components stay thin.

export interface SliderScale {
  min: number
  max: number
  step: number
}

/** Snaps a raw value to the nearest step and clamps it into `[min, max]`. */
export function roundToStep(value: number, scale: SliderScale): number {
  const step = scale.step || 1
  const stepped = Math.round((value - scale.min) / step) * step + scale.min
  return clamp(Number(stepped.toFixed(6)), scale.min, scale.max)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Position of `value` along the track, as a 0–100 percentage. */
export function toPercent(value: number, scale: SliderScale): number {
  const range = scale.max - scale.min || 1
  return clamp(((value - scale.min) / range) * 100, 0, 100)
}

/** The value under `clientX` for a track element. */
export function valueFromClientX(el: HTMLElement, clientX: number, scale: SliderScale): number {
  const rect = el.getBoundingClientRect()
  const ratio = clamp((clientX - rect.left) / (rect.width || 1), 0, 1)
  return roundToStep(scale.min + ratio * (scale.max - scale.min), scale)
}

/**
 * Follows a pointer until it is released. Only ever called from a pointerdown
 * handler, so it never touches `window` during SSR.
 */
export function trackPointer(onMove: (clientX: number) => void, onEnd?: () => void): void {
  const move = (e: PointerEvent) => onMove(e.clientX)
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    onEnd?.()
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
