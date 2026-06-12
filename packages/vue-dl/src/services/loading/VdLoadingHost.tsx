import { defineComponent, h } from 'vue'
import type { CSSProperties } from 'vue'
import { VdProgressCircular } from '../../components/VdProgress'
import { loadingQueue } from './useLoading'
import type { LoadingItem } from './useLoading'

function resolveTarget(target: LoadingItem['target']): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  return target
}

export const VdLoadingHost = defineComponent({
  name: 'VdLoadingHost',
  setup() {
    return () =>
      loadingQueue.map(item => {
        const el = resolveTarget(item.target)
        let style: CSSProperties
        if (el) {
          const rect = el.getBoundingClientRect()
          style = {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }
        } else {
          style = { position: 'fixed', inset: '0' }
        }

        return h(
          'div',
          {
            key: item.id,
            class: ['vd-loading', { 'vd-loading--scoped': !!el }],
            style,
          },
          [
            h('div', { class: 'vd-loading__content' }, [
              h(VdProgressCircular, { indeterminate: true, color: item.color, size: 48, width: 4 }),
              item.text ? h('div', { class: 'vd-loading__text' }, item.text) : null,
            ]),
          ]
        )
      })
  },
})
