import { reactive } from 'vue'

export type DialogType = 'alert' | 'confirm' | 'prompt'

export interface DialogOptions {
  title?: string
  text?: string
  acceptText?: string
  cancelText?: string
  color?: string
}

export interface PromptOptions extends DialogOptions {
  placeholder?: string
  defaultValue?: string
}

export interface DialogItem extends PromptOptions {
  id: number
  type: DialogType
  resolve: (value: unknown) => void
  inputValue: string
}

let uid = 0
export const dialogQueue = reactive<DialogItem[]>([])

export function settleDialog(id: number, value: unknown): void {
  const index = dialogQueue.findIndex(d => d.id === id)
  if (index > -1) {
    const item = dialogQueue[index]
    dialogQueue.splice(index, 1)
    item.resolve(value)
  }
}

function pushDialog<T>(type: DialogType, options: DialogOptions): Promise<T> {
  return new Promise<T>(resolve => {
    dialogQueue.push({
      id: uid++,
      type,
      color: 'primary',
      acceptText: 'OK',
      cancelText: 'Cancel',
      inputValue: (options as PromptOptions).defaultValue ?? '',
      ...options,
      resolve: resolve as (value: unknown) => void,
    })
  })
}

/** Promise-based alert / confirm / prompt dialogs. */
export function useDialog() {
  return {
    alert: (options: DialogOptions = {}) => pushDialog<void>('alert', options),
    confirm: (options: DialogOptions = {}) => pushDialog<boolean>('confirm', options),
    prompt: (options: PromptOptions = {}) => pushDialog<string | null>('prompt', options),
  }
}
