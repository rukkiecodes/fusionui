import { reactive } from 'vue'

/** The spinner animation (Vuesax parity). */
export type LoadingType =
  | 'default'
  | 'points'
  | 'scale'
  | 'square'
  | 'square-rotate'
  | 'gradient'
  | 'rectangle'
  | 'circles'
  | 'border'
  | 'waves'
  | 'corners'

export interface LoadingOptions {
  /** Scope the loader to an element (or selector). Omit for fullscreen. */
  target?: HTMLElement | string | null
  /** Spinner animation. */
  type?: LoadingType
  /** Spinner color — a theme name (primary, success…) or any CSS color. */
  color?: string
  /** Overlay background — a theme name or any CSS color. */
  background?: string
  /** A label under the spinner. */
  text?: string
  /** A percentage label inside the spinner (e.g. 67 or '67%'). */
  percent?: number | string
  /** A determinate progress bar (0–100) across the top of the overlay. */
  progress?: number
  /** Scale the spinner (1 = 48px). */
  scale?: number
  /** Overlay opacity (0–1). */
  opacity?: number
}

export interface LoadingItem extends LoadingOptions {
  id: number
}

export interface LoadingHandle {
  id: number
  close: () => void
  /** Update any option live — e.g. `handle.update({ progress: 80 })`. */
  update: (patch: Partial<LoadingOptions>) => void
}

let uid = 0
export const loadingQueue = reactive<LoadingItem[]>([])

export function closeLoading(id: number): void {
  const index = loadingQueue.findIndex(l => l.id === id)
  if (index > -1) loadingQueue.splice(index, 1)
}

export function closeAllLoading(): void {
  loadingQueue.splice(0, loadingQueue.length)
}

function open(options: LoadingOptions = {}): LoadingHandle {
  const id = uid++
  loadingQueue.push({ id, type: 'default', color: 'primary', ...options })
  // The pushed object is wrapped in a reactive proxy by the array — grab it so
  // `update` mutations are tracked and re-render the host live.
  const item = loadingQueue[loadingQueue.length - 1]
  return {
    id,
    close: () => closeLoading(id),
    update: patch => Object.assign(item, patch),
  }
}

/** Imperative loading overlay (fullscreen or scoped to a target element). */
export function useLoading() {
  return { open, close: closeLoading, closeAll: closeAllLoading }
}
