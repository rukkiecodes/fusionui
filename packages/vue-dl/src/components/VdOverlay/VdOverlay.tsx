import { Teleport, Transition, h, onBeforeUnmount, onMounted, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'

let activeOverlays = 0

export const makeVdOverlayProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    persistent: Boolean,
    scrim: { type: [Boolean, String] as PropType<boolean | string>, default: true },
    contentClass: [String, Array, Object] as PropType<unknown>,
    transition: { type: String, default: 'vd-dialog-transition' },
    ...makeComponentProps(),
  },
  'VdOverlay'
)

export const VdOverlay = genericComponent()({
  name: 'VdOverlay',
  props: makeVdOverlayProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    const isActive = useProxiedModel(props, 'modelValue', false)

    function close(): void {
      if (!props.persistent) isActive.value = false
    }

    function onKeydown(e: KeyboardEvent): void {
      if (e.key === 'Escape' && isActive.value) close()
    }

    function lockScroll(lock: boolean): void {
      if (typeof document === 'undefined') return
      if (lock) {
        activeOverlays++
        document.documentElement.style.overflow = 'hidden'
      } else {
        activeOverlays = Math.max(0, activeOverlays - 1)
        if (activeOverlays === 0) document.documentElement.style.overflow = ''
      }
    }

    watch(isActive, val => lockScroll(val))
    onMounted(() => document.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      if (isActive.value) lockScroll(false)
    })

    useRender(() => {
      const activator = slots.activator?.({
        props: {
          onClick: () => {
            isActive.value = !isActive.value
          },
        },
        isActive: isActive.value,
      })

      return [
        activator,
        h(Teleport, { to: 'body' }, [
          h(
            Transition,
            { name: 'vd-fade' },
            {
              default: () =>
                isActive.value && props.scrim
                  ? h('div', {
                      class: 'vd-overlay__scrim',
                      style:
                        typeof props.scrim === 'string'
                          ? { backgroundColor: props.scrim }
                          : undefined,
                      onClick: close,
                    })
                  : null,
            }
          ),
          h(
            Transition,
            { name: props.transition },
            {
              default: () =>
                isActive.value
                  ? h(
                      'div',
                      {
                        class: ['vd-overlay__content', props.contentClass, props.class],
                        style: props.style,
                        role: 'dialog',
                        'aria-modal': 'true',
                      },
                      slots.default?.({ isActive: isActive.value, close })
                    )
                  : null,
            }
          ),
        ]),
      ]
    })
  },
})
