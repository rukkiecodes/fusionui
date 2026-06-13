import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import {
  createFusionUI,
  useNotify,
  useLoading,
  useDialog,
  notifyQueue,
  loadingQueue,
  dialogQueue,
  clearNotify,
  closeAllLoading,
  FNotifyHost,
  FDialogHost,
} from '../index'

afterEach(() => {
  clearNotify()
  closeAllLoading()
  dialogQueue.splice(0, dialogQueue.length)
  vi.useRealTimers()
})

describe('useNotify', () => {
  it('pushes notifications and applies semantic presets', () => {
    const { notify } = useNotify()
    notify({ title: 'Hi' })
    expect(notifyQueue).toHaveLength(1)

    notify.success({ text: 'Saved' })
    const last = notifyQueue[notifyQueue.length - 1]
    expect(last.color).toBe('success')
    expect(last.icon).toBe('$success')
  })

  it('auto-dismisses after the duration and supports sticky', () => {
    vi.useFakeTimers()
    const { notify } = useNotify()
    const handle = notify({ text: 'temp', duration: 1000 })
    notify({ text: 'sticky', duration: 0 })
    expect(notifyQueue).toHaveLength(2)

    vi.advanceTimersByTime(1000)
    expect(notifyQueue.find(n => n.id === handle.id)).toBeUndefined()
    expect(notifyQueue).toHaveLength(1) // sticky remains
  })

  it('dismiss and clear work', () => {
    const { notify, dismiss, clear } = useNotify()
    const h1 = notify({ text: 'a', duration: 0 })
    notify({ text: 'b', duration: 0 })
    dismiss(h1.id)
    expect(notifyQueue).toHaveLength(1)
    clear()
    expect(notifyQueue).toHaveLength(0)
  })
})

describe('useLoading', () => {
  it('opens and closes via the handle', () => {
    const loading = useLoading()
    const handle = loading.open({ text: 'Loading…' })
    expect(loadingQueue).toHaveLength(1)
    handle.close()
    expect(loadingQueue).toHaveLength(0)
  })

  it('stacks multiple loaders and closeAll clears them', () => {
    const loading = useLoading()
    loading.open()
    loading.open({ target: '#x' })
    expect(loadingQueue).toHaveLength(2)
    loading.closeAll()
    expect(loadingQueue).toHaveLength(0)
  })
})

describe('useDialog', () => {
  it('confirm resolves true when accepted in the host', async () => {
    const result = useDialog().confirm({ title: 'Sure?', text: 'Proceed' })
    mount(FDialogHost, { global: { plugins: [createFusionUI({ services: false })] } })
    await nextTick()

    const actions = document.body.querySelectorAll('.fui-popup__actions .fui-btn')
    expect(actions.length).toBe(2)
    ;(actions[actions.length - 1] as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    await expect(result).resolves.toBe(true)
    expect(dialogQueue).toHaveLength(0)
  })

  it('prompt resolves the input value, and cancel resolves null', async () => {
    const promptResult = useDialog().prompt({ title: 'Name?', defaultValue: 'Ada' })
    expect(dialogQueue[0].inputValue).toBe('Ada')
    // resolve programmatically through the host store
    const { settleDialog } = await import('../services/dialog/useDialog')
    settleDialog(dialogQueue[0].id, dialogQueue[0].inputValue)
    await expect(promptResult).resolves.toBe('Ada')

    const cancelResult = useDialog().prompt({ title: 'Again?' })
    settleDialog(dialogQueue[0].id, null)
    await expect(cancelResult).resolves.toBeNull()
  })
})

describe('FNotifyHost', () => {
  it('renders queued notifications', async () => {
    const wrapper = mount(FNotifyHost, {
      global: { plugins: [createFusionUI({ services: false })] },
    })
    useNotify().notify({ title: 'Rendered', color: 'primary', duration: 0 })
    await nextTick()
    expect(wrapper.find('.fui-notify').exists()).toBe(true)
    expect(wrapper.text()).toContain('Rendered')
  })
})
