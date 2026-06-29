import { reactive } from 'vue'
import type { IconValue } from '../../composables/icons'

export type NotifyPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'

export interface NotifyOptions {
  title?: string
  text?: string
  /** Theme colour key (primary/secondary/accent/success/warning/danger/info). */
  color?: string
  /** Coloured edge accent (theme key). */
  border?: string
  icon?: IconValue
  position?: NotifyPosition
  /** Auto-dismiss after N ms. `0` keeps it until dismissed. */
  duration?: number
  closable?: boolean
  progress?: boolean
  /** Subtle tinted style instead of a filled colour. */
  flat?: boolean
  /** Square corners. */
  square?: boolean
  /** Show a spinner instead of content. */
  loading?: boolean
  /** `'auto'` shrinks to content, `'100%'` spans the viewport. */
  width?: 'auto' | '100%' | string
  /** Remove inner padding (for custom content). */
  notPadding?: boolean
  /** Dismiss when the body is clicked. */
  clickClose?: boolean
  onClick?: () => void
}

export interface NotifyItem extends NotifyOptions {
  id: number
  position: NotifyPosition
  duration: number
}

export interface NotifyHandle {
  id: number
  dismiss: () => void
}

let uid = 0
export const notifyQueue = reactive<NotifyItem[]>([])

export function dismissNotify(id: number): void {
  const index = notifyQueue.findIndex(n => n.id === id)
  if (index > -1) notifyQueue.splice(index, 1)
}

export function clearNotify(): void {
  notifyQueue.splice(0, notifyQueue.length)
}

function push(options: NotifyOptions): NotifyHandle {
  const id = uid++
  const item: NotifyItem = {
    id,
    position: 'bottom-right',
    duration: 4000,
    closable: true,
    ...options,
  }
  notifyQueue.push(item)
  if (item.duration > 0) {
    setTimeout(() => dismissNotify(id), item.duration)
  }
  return { id, dismiss: () => dismissNotify(id) }
}

type NotifyFn = ((options: NotifyOptions) => NotifyHandle) & {
  success: (options: NotifyOptions) => NotifyHandle
  error: (options: NotifyOptions) => NotifyHandle
  warning: (options: NotifyOptions) => NotifyHandle
  info: (options: NotifyOptions) => NotifyHandle
}

const notify = Object.assign((options: NotifyOptions) => push(options), {
  success: (o: NotifyOptions) => push({ color: 'success', icon: '$success', ...o }),
  error: (o: NotifyOptions) => push({ color: 'danger', icon: '$error', ...o }),
  warning: (o: NotifyOptions) => push({ color: 'warning', icon: '$warning', ...o }),
  info: (o: NotifyOptions) => push({ color: 'primary', icon: '$info', ...o }),
}) as NotifyFn

/** Imperative toast notifications. */
export function useNotify() {
  return { notify, dismiss: dismissNotify, clear: clearNotify }
}
