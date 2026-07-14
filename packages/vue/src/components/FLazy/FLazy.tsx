import { h, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'

export const makeFLazyProps = propsFactory(
  {
    /** Whether the content has been shown. Bindable — it never flips back to false. */
    modelValue: { type: Boolean, default: false },
    /** Reserved height until the content appears, so nothing jumps when it does. */
    minHeight: [String, Number] as PropType<string | number>,
    /** IntersectionObserver options — e.g. `{ rootMargin: '200px' }` to load early. */
    options: {
      type: Object as PropType<IntersectionObserverInit>,
      default: () => ({ rootMargin: '100px' }),
    },
    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FLazy'
)

/**
 * Defers rendering its default slot until it scrolls into view. Once shown it
 * stays shown — this is a mounting optimization, not a virtualizer (reach for
 * `FVirtualScroll` when rows must also be *unmounted* as they leave).
 *
 * Reserve `min-height` so the placeholder occupies the space its content will,
 * otherwise revealing it shifts the page.
 */
export const FLazy = genericComponent()({
  name: 'FLazy',
  props: makeFLazyProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
  },
  setup(props: any, { slots }: any) {
    const isActive = useProxiedModel(props, 'modelValue', false)
    const root = ref<HTMLElement>()
    let observer: IntersectionObserver | undefined

    onMounted(() => {
      if (isActive.value) return

      // No IntersectionObserver (old browser, jsdom) — show the content rather
      // than hide it forever. Failing open is the only safe default here.
      if (typeof IntersectionObserver === 'undefined') {
        isActive.value = true
        return
      }

      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        isActive.value = true
        // One-shot: stop observing the moment it has been revealed.
        observer?.disconnect()
      }, props.options)

      if (root.value) observer.observe(root.value)
    })

    onBeforeUnmount(() => observer?.disconnect())

    useRender(() =>
      h(
        props.tag,
        {
          ref: root,
          class: ['fui-lazy', props.class],
          style: [
            { minHeight: isActive.value ? undefined : convertToUnit(props.minHeight) },
            props.style,
          ],
        },
        [isActive.value ? slots.default?.() : slots.placeholder?.()]
      )
    )
  },
})
