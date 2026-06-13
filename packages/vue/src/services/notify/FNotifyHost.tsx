import { TransitionGroup, computed, defineComponent, h } from 'vue'
import { FIcon } from '../../components/FIcon'
import { notifyQueue, dismissNotify } from './useNotify'
import type { NotifyItem, NotifyPosition } from './useNotify'

const positions: NotifyPosition[] = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
]

export const FNotifyHost = defineComponent({
  name: 'FNotifyHost',
  setup() {
    const byPosition = computed(() => {
      const map = new Map<NotifyPosition, NotifyItem[]>()
      for (const pos of positions) map.set(pos, [])
      for (const item of notifyQueue) map.get(item.position)!.push(item)
      return map
    })

    return () =>
      positions.map(position => {
        const items = byPosition.value.get(position)!
        if (!items.length) return null
        return h(
          TransitionGroup,
          {
            key: position,
            tag: 'div',
            name: 'fui-notify',
            class: ['fui-notify-host', `fui-notify-host--${position}`],
          },
          () =>
            items.map(item =>
              h(
                'div',
                {
                  key: item.id,
                  class: ['fui-notify', `bg-${item.color}`],
                  onClick: item.onClick,
                },
                [
                  item.icon ? h(FIcon, { icon: item.icon, class: 'fui-notify__icon' }) : null,
                  h('div', { class: 'fui-notify__body' }, [
                    item.title ? h('div', { class: 'fui-notify__title' }, item.title) : null,
                    item.text ? h('div', { class: 'fui-notify__text' }, item.text) : null,
                  ]),
                  item.closable
                    ? h(FIcon, {
                        icon: '$close',
                        size: 'small',
                        class: 'fui-notify__close',
                        onClick: (e: MouseEvent) => {
                          e.stopPropagation()
                          dismissNotify(item.id)
                        },
                      })
                    : null,
                  item.progress && item.duration > 0
                    ? h('div', {
                        class: 'fui-notify__progress',
                        style: { animationDuration: `${item.duration}ms` },
                      })
                    : null,
                ]
              )
            )
        )
      })
  },
})
