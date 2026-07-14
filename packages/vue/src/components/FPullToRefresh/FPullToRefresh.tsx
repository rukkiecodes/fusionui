import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { getCurrentInstance } from '../../util/getCurrentInstance'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FIcon } from '../FIcon'
import { FProgressCircular } from '../FProgress'

/** Nearest scrollable ancestor, or `null` when the page itself scrolls. */
function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

export const makeFPullToRefreshProps = propsFactory(
  {
    /** Whether a refresh is in flight (v-model). `done()` and `v-model` both end it. */
    modelValue: { type: Boolean, default: false },
    /** How far (px) the content must travel before releasing triggers a refresh. */
    pullDownThreshold: { type: Number as PropType<number>, default: 64 },
    /** Turns the gesture off without unmounting the content. */
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FPullToRefresh'
)

/**
 * Pull the content down past a threshold and release to refresh — the mobile
 * gesture, as a container. It is strictly additive: on a device without touch,
 * or when the user prefers reduced motion, no gesture is wired up at all and
 * the component is a plain wrapper around its slot.
 */
export const FPullToRefresh = genericComponent()({
  name: 'FPullToRefresh',
  props: makeFPullToRefreshProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    load: (_options: { done: () => void }) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const vm = getCurrentInstance('FPullToRefresh')

    const refreshing = useProxiedModel(props, 'modelValue', false)
    const root = ref<HTMLElement | null>(null)

    /** Only true once we know we are in a browser that can produce the gesture. */
    const enabled = ref(false)
    const touching = ref(false)
    const pullDistance = ref(0)

    let startY = 0
    let scrollParent: HTMLElement | null = null
    let reducedQuery: MediaQueryList | null = null

    const active = computed(() => enabled.value && !props.disabled)
    const offset = computed(() =>
      Math.max(0, Math.min(pullDistance.value, props.pullDownThreshold))
    )
    const canRefresh = computed(
      () => pullDistance.value >= props.pullDownThreshold && !refreshing.value
    )
    /** Content sits at the threshold while the refresh runs, then springs back. */
    const contentOffset = computed(() =>
      refreshing.value ? props.pullDownThreshold : offset.value
    )

    function updateEnabled(): void {
      if (typeof window === 'undefined') {
        enabled.value = false
        return
      }
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const prefersReducedMotion = reducedQuery?.matches ?? false
      enabled.value = hasTouch && !prefersReducedMotion
    }

    function atTop(): boolean {
      if (scrollParent) return scrollParent.scrollTop <= 0
      if (typeof document === 'undefined') return false
      return (document.scrollingElement?.scrollTop ?? 0) <= 0
    }

    function done(): void {
      refreshing.value = false
      pullDistance.value = 0
    }

    function onTouchstart(e: TouchEvent): void {
      if (!active.value || refreshing.value) return
      // Recomputed per gesture: the scroll container can change with layout.
      scrollParent = getScrollParent(root.value)
      if (!atTop()) return
      touching.value = true
      startY = e.touches[0].clientY
    }

    function onTouchmove(e: TouchEvent): void {
      if (!active.value || !touching.value || refreshing.value) return

      const distance = e.touches[0].clientY - startY
      if (distance <= 0 || !atTop()) {
        pullDistance.value = 0
        return
      }

      pullDistance.value = distance
      // We own this gesture now — stop the page from scrolling underneath it.
      if (e.cancelable) e.preventDefault()
    }

    function onTouchend(): void {
      if (!active.value || !touching.value || refreshing.value) return
      touching.value = false

      if (!canRefresh.value) {
        pullDistance.value = 0
        return
      }

      refreshing.value = true
      // Without a listener there is nobody to call `done()` — don't hang.
      if (vm.vnode.props?.onLoad) emit('load', { done })
      else done()
    }

    onMounted(() => {
      if (typeof window === 'undefined') return
      reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      reducedQuery.addEventListener('change', updateEnabled)
      updateEnabled()
      scrollParent = getScrollParent(root.value)
    })

    onBeforeUnmount(() => {
      reducedQuery?.removeEventListener('change', updateEnabled)
      reducedQuery = null
    })

    // A parent flipping the model back to `false` ends the refresh too.
    watch(refreshing, value => {
      if (!value) pullDistance.value = 0
    })

    useRender(() => {
      const listeners = active.value
        ? { onTouchstart, onTouchmove, onTouchend, onTouchcancel: onTouchend }
        : {}

      return h(
        'div',
        {
          ref: root,
          class: [
            'fui-pull-to-refresh',
            { 'fui-pull-to-refresh--active': active.value },
            props.class,
          ],
          style: props.style,
          ...listeners,
        },
        [
          active.value
            ? h(
                'div',
                {
                  class: [
                    'fui-pull-to-refresh__pull-down',
                    { 'fui-pull-to-refresh__pull-down--touching': touching.value },
                  ],
                  style: {
                    height: convertToUnit(props.pullDownThreshold),
                    top: convertToUnit(-props.pullDownThreshold),
                    transform: `translateY(${contentOffset.value}px)`,
                  },
                  role: 'status',
                  'aria-live': 'polite',
                },
                slots.pullDown
                  ? slots.pullDown({
                      canRefresh: canRefresh.value,
                      refreshing: refreshing.value,
                      distance: offset.value,
                    })
                  : h('div', { class: 'fui-pull-to-refresh__indicator' }, [
                      refreshing.value
                        ? h(FProgressCircular, { indeterminate: true, size: 24, width: 3 })
                        : h(FIcon, {
                            icon: '$expand',
                            class: [
                              'fui-pull-to-refresh__arrow',
                              { 'fui-pull-to-refresh__arrow--flipped': canRefresh.value },
                            ],
                          }),
                    ])
              )
            : null,
          h(
            'div',
            {
              class: [
                'fui-pull-to-refresh__content',
                { 'fui-pull-to-refresh__content--touching': touching.value },
              ],
              style: active.value
                ? { transform: `translateY(${contentOffset.value}px)` }
                : undefined,
            },
            slots.default?.()
          ),
        ]
      )
    })
  },
})
