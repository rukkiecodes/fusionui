import { onMounted, ref } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'

export const makeFNoSsrProps = propsFactory({}, 'FNoSsr')

/**
 * Renders its default slot only on the client, after mount. Nothing is emitted
 * during SSR, and nothing is rendered on the first client pass either — that is
 * deliberate: the first client render must match the server's output exactly or
 * Vue reports a hydration mismatch. The `placeholder` slot fills the gap in the
 * meantime, and it *is* server-rendered, so it must be stable across both.
 *
 * Use it to wrap anything that genuinely cannot exist on the server — a chart
 * that measures the DOM, a widget reading `localStorage`, a date rendered in the
 * visitor's own timezone.
 */
export const FNoSsr = genericComponent()({
  name: 'FNoSsr',
  props: makeFNoSsrProps(),
  setup(_props: any, { slots }: any) {
    const mounted = ref(false)

    onMounted(() => {
      mounted.value = true
    })

    useRender(() => (mounted.value ? slots.default?.() : slots.placeholder?.()))
  },
})
