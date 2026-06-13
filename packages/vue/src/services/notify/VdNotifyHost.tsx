import { TransitionGroup, computed, defineComponent, h } from 'vue'
import { VdIcon } from '../../components/VdIcon'
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

export const VdNotifyHost = defineComponent({
  name: 'VdNotifyHost',
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
            name: 'vd-notify',
            class: ['vd-notify-host', `vd-notify-host--${position}`],
          },
          () =>
            items.map(item =>
              h(
                'div',
                {
                  key: item.id,
                  class: ['vd-notify', `bg-${item.color}`],
                  onClick: item.onClick,
                },
                [
                  item.icon ? h(VdIcon, { icon: item.icon, class: 'vd-notify__icon' }) : null,
                  h('div', { class: 'vd-notify__body' }, [
                    item.title ? h('div', { class: 'vd-notify__title' }, item.title) : null,
                    item.text ? h('div', { class: 'vd-notify__text' }, item.text) : null,
                  ]),
                  item.closable
                    ? h(VdIcon, {
                        icon: '$close',
                        size: 'small',
                        class: 'vd-notify__close',
                        onClick: (e: MouseEvent) => {
                          e.stopPropagation()
                          dismissNotify(item.id)
                        },
                      })
                    : null,
                  item.progress && item.duration > 0
                    ? h('div', {
                        class: 'vd-notify__progress',
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
