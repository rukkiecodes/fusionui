import { Teleport, Transition, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useProxiedModel } from '../../composables/proxiedModel'

export type FMenuLocation = 'bottom' | 'top' | 'bottom-end' | 'top-end'

export const makeFMenuProps = propsFactory(
  {
    modelValue: { type: Boolean, default: false },
    location: { type: String as PropType<FMenuLocation>, default: 'bottom' },
    openOnHover: Boolean,
    closeOnContentClick: { type: Boolean, default: true },
    contentClass: [String, Array, Object] as PropType<unknown>,
    /** Gap (px) between the activator and the menu. */
    offset: { type: Number, default: 6 },
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'FMenu'
)

/**
 * A floating menu. The activator renders in place; the content is **teleported to
 * <body>** and positioned (fixed) anchored to the activator — so it escapes every
 * ancestor's stacking context / overflow clipping and always floats on top.
 */
export const FMenu = genericComponent()({
  name: 'FMenu',
  props: makeFMenuProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    const isActive = useProxiedModel(props, 'modelValue', false)
    const activatorRef = ref<HTMLElement>()
    const contentRef = ref<HTMLElement>()
    const menuStyle = ref<CSSProperties>({})

    function toggle(): void {
      if (!props.disabled) isActive.value = !isActive.value
    }
    function close(): void {
      isActive.value = false
    }

    // Position the (teleported) content relative to the activator's viewport rect.
    // `-end` aligns the right edges; `top` flips above. The shift is done with a
    // transform so we never need to measure the content first.
    function updatePosition(): void {
      const el = activatorRef.value
      if (!el || typeof el.getBoundingClientRect !== 'function') return
      const r = el.getBoundingClientRect()
      const loc = String(props.location)
      const gap = Number(props.offset) || 0
      const top = loc.startsWith('top') ? r.top - gap : r.bottom + gap
      const left = loc.endsWith('-end') ? r.right : r.left
      const ty = loc.startsWith('top') ? -100 : 0
      const tx = loc.endsWith('-end') ? -100 : 0
      menuStyle.value = {
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        transform: `translate(${tx}%, ${ty}%)`,
      }
    }

    function onDocPointer(e: Event): void {
      const t = e.target as Node
      if (contentRef.value?.contains(t) || activatorRef.value?.contains(t)) return
      close()
    }
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') close()
    }

    function bind(): void {
      if (typeof window === 'undefined') return
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      document.addEventListener('keydown', onKey)
      // Defer the outside-click listener so the opening click doesn't close it.
      setTimeout(() => document.addEventListener('pointerdown', onDocPointer, true), 0)
    }
    function unbind(): void {
      if (typeof window === 'undefined') return
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDocPointer, true)
    }

    watch(isActive, async (open: boolean) => {
      if (open) {
        await nextTick()
        updatePosition()
        bind()
      } else {
        unbind()
      }
    })
    onBeforeUnmount(unbind)

    useRender(() =>
      h(
        'div',
        {
          ref: activatorRef,
          class: ['fui-menu', props.class],
          style: props.style,
          onMouseenter: props.openOnHover
            ? () => {
                if (!props.disabled) isActive.value = true
              }
            : undefined,
          onMouseleave: props.openOnHover ? close : undefined,
        },
        [
          slots.activator?.({ props: { onClick: toggle }, isActive: isActive.value }),
          h(Teleport, { to: 'body' }, [
            h(
              Transition,
              { name: 'fui-menu' },
              {
                default: () =>
                  isActive.value
                    ? h(
                        'div',
                        {
                          ref: contentRef,
                          class: [
                            'fui-menu__content',
                            `fui-menu__content--${props.location}`,
                            props.contentClass,
                          ],
                          style: menuStyle.value,
                          onClick: props.closeOnContentClick ? close : undefined,
                        },
                        slots.default?.({ close })
                      )
                    : null,
              }
            ),
          ]),
        ]
      )
    )
  },
})
