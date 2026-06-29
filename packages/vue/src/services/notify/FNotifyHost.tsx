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

/** Maps a colour key to the theme RGB-triplet var used by `rgb(var(--fui-noti-c))`. */
function accentVar(key?: string): string | undefined {
  if (!key) return undefined
  return `var(--fui-theme-${key})`
}

export const FNotifyHost = defineComponent({
  name: 'FNotifyHost',
  setup() {
    const byPosition = computed(() => {
      const map = new Map<NotifyPosition, NotifyItem[]>()
      for (const pos of positions) map.set(pos, [])
      for (const item of notifyQueue) map.get(item.position)!.push(item)
      return map
    })

    function renderItem(item: NotifyItem) {
      const accent = accentVar(item.color || item.border)
      const classes = [
        'fui-notify',
        item.color && !item.flat ? 'fui-notify--color' : null,
        item.flat ? 'fui-notify--flat' : null,
        item.border ? 'fui-notify--border' : null,
        item.square ? 'fui-notify--square' : null,
        item.icon && !item.loading ? 'fui-notify--icon' : null,
        item.loading ? 'fui-notify--loading' : null,
        item.notPadding ? 'fui-notify--not-padding' : null,
        item.width === '100%' ? 'fui-notify--width-all' : null,
        item.width === 'auto' ? 'fui-notify--width-auto' : null,
        item.onClick || item.clickClose ? 'fui-notify--clickable' : null,
      ]

      const children = item.loading
        ? [h('div', { class: 'fui-notify__loading' })]
        : [
            item.icon ? h(FIcon, { icon: item.icon, class: 'fui-notify__icon' }) : null,
            h('div', { class: 'fui-notify__content' }, [
              item.title ? h('h4', { class: 'fui-notify__title' }, item.title) : null,
              item.text ? h('p', { class: 'fui-notify__text' }, item.text) : null,
            ]),
            item.closable
              ? h(
                  'button',
                  {
                    class: 'fui-notify__close',
                    type: 'button',
                    'aria-label': 'Close',
                    onClick: (e: MouseEvent) => {
                      e.stopPropagation()
                      dismissNotify(item.id)
                    },
                  },
                  [h(FIcon, { icon: '$close', size: 'small' })]
                )
              : null,
          ]

      if (item.progress && item.duration > 0) {
        children.push(
          h('div', {
            class: 'fui-notify__progress',
            style: { animationDuration: `${item.duration}ms` },
          })
        )
      }

      return h(
        'div',
        {
          key: item.id,
          class: classes,
          style: accent ? { '--fui-noti-c': accent } : undefined,
          onClick: () => {
            item.onClick?.()
            if (item.clickClose) dismissNotify(item.id)
          },
        },
        children
      )
    }

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
          () => items.map(renderItem)
        )
      })
  },
})
