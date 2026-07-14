import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createFusionUI, FDialog, FOverlay } from '../index'

// FOverlay announces `aria-modal="true"`. A modal that lets Tab wander off behind
// the scrim is lying to a screen-reader user, so the focus trap is part of the
// contract, not a nicety — it shipped without one. This locks it down.
//
// The overlay is driven through a host with `v-model`: `useProxiedModel` stays
// UNCONTROLLED unless the parent supplies an `onUpdate:modelValue` listener, so
// merely calling `setProps({ modelValue: true })` would never open it.
function host(Component: any, slots: Record<string, () => unknown>) {
  const open = ref(false)
  const Host = defineComponent({
    setup: () => () =>
      h(
        Component,
        {
          modelValue: open.value,
          'onUpdate:modelValue': (v: boolean) => {
            open.value = v
          },
        },
        slots
      ),
  })
  const wrapper = mount(Host, {
    attachTo: document.body,
    global: { plugins: [createFusionUI()] },
  })
  return { wrapper, open }
}

async function settle() {
  await nextTick()
  await nextTick()
}

describe('FOverlay focus management', () => {
  it('moves focus into the overlay on open and restores it on close', async () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const { wrapper, open } = host(FOverlay, {
      default: () => [h('button', { class: 'a' }, 'A'), h('button', { class: 'b' }, 'B')],
    })

    open.value = true
    await settle()
    expect(document.activeElement?.className).toBe('a')

    open.value = false
    await settle()
    // Focus came back to whatever opened it.
    expect(document.activeElement).toBe(opener)

    wrapper.unmount()
    opener.remove()
  })

  it('wraps Tab and Shift+Tab inside the overlay', async () => {
    const { wrapper, open } = host(FOverlay, {
      default: () => [h('button', { class: 'a' }, 'A'), h('button', { class: 'b' }, 'B')],
    })
    open.value = true
    await settle()

    const first = document.body.querySelector<HTMLElement>('.a')!
    const last = document.body.querySelector<HTMLElement>('.b')!

    last.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(first)

    first.focus()
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true })
    )
    await nextTick()
    expect(document.activeElement).toBe(last)

    wrapper.unmount()
  })

  it('focuses the panel itself when it holds no controls', async () => {
    const { wrapper, open } = host(FOverlay, {
      default: () => h('p', 'Nothing focusable here'),
    })

    open.value = true
    await settle()

    // Focus must never be left stranded on an element behind the scrim.
    expect(document.activeElement?.classList.contains('fui-overlay__content')).toBe(true)

    wrapper.unmount()
  })

  // FDialog does not build on FOverlay — it teleports its own box — so it takes
  // the trap from the shared composable rather than inheriting it.
  it('FDialog traps focus too', async () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const { wrapper, open } = host(FDialog, {
      default: () => h('button', { class: 'confirm' }, 'Confirm'),
    })

    open.value = true
    await settle()

    // The first focusable is the dialog's own close button, so assert what
    // actually matters: focus is inside the dialog, not still behind it.
    const box = document.body.querySelector('.fui-dialog__box')!
    expect(box.contains(document.activeElement)).toBe(true)

    open.value = false
    await settle()
    expect(document.activeElement).toBe(opener)

    wrapper.unmount()
    opener.remove()
  })
})
