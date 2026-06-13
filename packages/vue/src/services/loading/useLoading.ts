import { reactive } from 'vue'

export interface LoadingOptions {
  /** Scope the loader to an element (or selector). Omit for fullscreen. */
  target?: HTMLElement | string | null
  color?: string
  text?: string
}

export interface LoadingItem extends LoadingOptions {
  id: number
}

export interface LoadingHandle {
  id: number
  close: () => void
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
  loadingQueue.push({ id, color: 'primary', ...options })
  return { id, close: () => closeLoading(id) }
}

/** Imperative loading overlay (fullscreen or scoped to a target element). */
export function useLoading() {
  return { open, close: closeLoading, closeAll: closeAllLoading }
}
