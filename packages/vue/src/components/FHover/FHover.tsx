import { ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'

export const makeFHoverProps = propsFactory(
  {
    /** Controlled hover state (use `v-model`). Usually left alone. */
    modelValue: { type: Boolean, default: undefined },
    disabled: Boolean,
    /** Delay, in ms, before the hover registers — useful for tooltips. */
    openDelay: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** Delay, in ms, before the hover clears. */
    closeDelay: { type: [Number, String] as PropType<number | string>, default: 0 },
  },
  'FHover'
)

/**
 * A renderless hover tracker. It draws nothing itself — it hands the default slot
 * an `isHovering` flag plus the `props` to spread onto whatever element should be
 * watched:
 *
 * ```vue
 * <f-hover v-slot="{ isHovering, props }">
 *   <f-card v-bind="props" :elevation="isHovering ? 8 : 2" />
 * </f-hover>
 * ```
 */
export const FHover = genericComponent()({
  name: 'FHover',
  props: makeFHoverProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
  },
  setup(props: any, { slots, emit }: any) {
    // Uncontrolled by default; `modelValue` takes over when it is passed.
    const internal = ref(false)
    let timer: ReturnType<typeof setTimeout> | undefined

    function isHovering(): boolean {
      return props.modelValue ?? internal.value
    }

    function set(value: boolean, delay: number | string): void {
      if (timer) clearTimeout(timer)
      const ms = Number(delay) || 0

      const apply = (): void => {
        internal.value = value
        emit('update:modelValue', value)
      }

      if (ms <= 0) apply()
      else timer = setTimeout(apply, ms)
    }

    useRender(() =>
      slots.default?.({
        isHovering: isHovering(),
        props: {
          onMouseenter: () => {
            if (!props.disabled) set(true, props.openDelay)
          },
          onMouseleave: () => {
            if (!props.disabled) set(false, props.closeDelay)
          },
        },
      })
    )
  },
})
