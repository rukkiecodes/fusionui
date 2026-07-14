import { Teleport, Transition, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'
import { useFocusTrap } from '../../composables/focusTrap'

let activeOverlays = 0

export const makeFOverlayProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    persistent: Boolean,
    scrim: { type: [Boolean, String] as PropType<boolean | string>, default: true },
    contentClass: [String, Array, Object] as PropType<unknown>,
    transition: { type: String, default: 'fui-dialog-transition' },
    /** Opt out of the focus trap — for a non-modal overlay that shouldn't hold focus. */
    noTrap: Boolean,
    ...makeComponentProps(),
  },
  'FOverlay'
)

/**
 * The base modal surface: scrim, Escape, ref-counted scroll lock, and focus
 * management. Everything modal is built on it (FDialog, FPopup, FBottomSheet),
 * so the focus trap lives HERE rather than in each of them — a dialog that
 * announces `aria-modal` while letting Tab wander off behind the scrim is
 * lying to a screen-reader user.
 */
export const FOverlay = genericComponent()({
  name: 'FOverlay',
  props: makeFOverlayProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    const isActive = useProxiedModel(props, 'modelValue', false)
    const contentRef = ref<HTMLElement>()

    const { onTrapKeydown } = useFocusTrap(contentRef, isActive, {
      disabled: () => !!props.noTrap,
    })

    function close(): void {
      if (!props.persistent) isActive.value = false
    }

    function onKeydown(e: KeyboardEvent): void {
      if (!isActive.value) return
      if (e.key === 'Escape') {
        close()
        return
      }
      onTrapKeydown(e)
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
            { name: 'fui-fade' },
            {
              default: () =>
                isActive.value && props.scrim
                  ? h('div', {
                      class: 'fui-overlay__scrim',
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
                        ref: contentRef,
                        class: ['fui-overlay__content', props.contentClass, props.class],
                        style: props.style,
                        role: 'dialog',
                        'aria-modal': 'true',
                        // Focusable so the panel itself can hold focus when it
                        // contains no controls of its own.
                        tabindex: -1,
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
