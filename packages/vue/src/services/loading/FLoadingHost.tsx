import { defineComponent, h } from 'vue'
import type { CSSProperties } from 'vue'
import { FLoadingSpinner } from './FLoadingSpinner'
import { loadingQueue } from './useLoading'
import type { LoadingItem } from './useLoading'

function resolveTarget(target: LoadingItem['target']): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  return target
}

/** Resolve the overlay background (theme name → rgba with opacity; CSS color as-is). */
function resolveBackground(
  bg: string | undefined,
  opacity: number | undefined
): string | undefined {
  if (!bg) return undefined
  if (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('hsl')) return bg
  return `rgba(var(--fui-theme-${bg}), ${opacity ?? 1})`
}

const clampPct = (n: number) => Math.max(0, Math.min(100, n))

export const FLoadingHost = defineComponent({
  name: 'FLoadingHost',
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

        const bg = resolveBackground(item.background, item.opacity)
        if (bg) style.backgroundColor = bg
        else if (item.opacity != null)
          style.backgroundColor = `rgba(var(--fui-theme-background), ${item.opacity})`

        const hasProgress = typeof item.progress === 'number'

        return h(
          'div',
          {
            key: item.id,
            class: ['fui-loading', { 'fui-loading--scoped': !!el }],
            style,
          },
          [
            hasProgress
              ? h('div', { class: 'fui-loading__bar' }, [
                  h('div', {
                    class: 'fui-loading__bar-fill',
                    style: { width: `${clampPct(item.progress as number)}%` },
                  }),
                ])
              : null,
            h('div', { class: 'fui-loading__content' }, [
              h(FLoadingSpinner, {
                type: item.type,
                color: item.color,
                percent: item.percent,
                scale: item.scale,
              }),
              item.text ? h('div', { class: 'fui-loading__text' }, item.text) : null,
            ]),
          ]
        )
      })
  },
})
