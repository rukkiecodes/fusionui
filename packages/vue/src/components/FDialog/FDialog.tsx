import { Teleport, Transition, computed, h, onBeforeUnmount, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { useFocusTrap } from '../../composables/focusTrap'
import { convertToUnit } from '../../util/helpers'
import { parseColor } from '../../util/colors'
import { FIcon } from '../FIcon'

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function colorTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

// Body scroll lock, ref-counted so stacked dialogs lock/unlock cleanly. The page
// is held fixed while any dialog is open; a padding-right matching the removed
// scrollbar keeps the layout from shifting.
let scrollLocks = 0
let savedOverflow = ''
let savedPaddingRight = ''
function lockBodyScroll() {
  if (typeof document === 'undefined') return
  if (scrollLocks === 0) {
    const { body, documentElement } = document
    savedOverflow = body.style.overflow
    savedPaddingRight = body.style.paddingRight
    const barWidth = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`
  }
  scrollLocks++
}
function unlockBodyScroll() {
  if (typeof document === 'undefined' || scrollLocks === 0) return
  scrollLocks--
  if (scrollLocks === 0) {
    document.body.style.overflow = savedOverflow
    document.body.style.paddingRight = savedPaddingRight
  }
}

export const makeFDialogProps = propsFactory(
  {
    /** Visibility (use `v-model`). */
    modelValue: { type: Boolean, default: false },
    /** Accent color for the loading spinner — theme name or any CSS color. */
    color: { type: String as PropType<string>, default: 'primary' },
    /** A custom width (number → px). */
    width: [String, Number] as PropType<string | number>,
    /** Cover the whole viewport. */
    fullScreen: Boolean,
    /** Hide the close button. */
    notClose: Boolean,
    /** Don't close on backdrop click / Escape; nudge instead. */
    preventClose: Boolean,
    /** Drop the header/content/footer padding. */
    notPadding: Boolean,
    /** Frost the backdrop. */
    blur: Boolean,
    /** Hard square corners. */
    square: Boolean,
    /** @deprecated The page scroll is now always locked while a dialog is open. */
    overflowHidden: Boolean,
    /** Shrink to the content's width. */
    autoWidth: Boolean,
    /** Scroll the content area when it's tall (instead of the page). */
    scroll: Boolean,
    /** Left-align the header instead of centering it. */
    notCenter: Boolean,
    /** Show a loading overlay over the dialog. */
    loading: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FDialog'
)

export const FDialog = genericComponent()({
  name: 'FDialog',
  props: makeFDialogProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    close: () => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const active = useProxiedModel(props, 'modelValue', false)
    const rebound = ref(false)
    const accent = computed(() => colorTriplet(props.color) ?? 'var(--fui-theme-primary)')

    function close() {
      active.value = false
      emit('close')
    }

    function nudge() {
      // The "you can't dismiss this" shake for a prevent-close dialog.
      rebound.value = true
      window.setTimeout(() => (rebound.value = false), 300)
    }

    function onBackdropPointer(e: MouseEvent) {
      if ((e.target as Element | null)?.closest?.('.fui-dialog__box')) return
      if (props.preventClose) nudge()
      else close()
    }

    // The dialog is modal (`aria-modal`), so focus must move into it, stay inside
    // it, and be handed back to the opener on close. FDialog does not build on
    // FOverlay, so it takes the same trap from the shared composable.
    const boxRef = ref<HTMLElement>()
    const { onTrapKeydown } = useFocusTrap(boxRef, active)

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !props.preventClose) {
        close()
        return
      }
      onTrapKeydown(e)
    }

    // Balance the body lock per instance so an active dialog that unmounts still
    // releases its lock.
    let locked = false
    function applyLock(on: boolean) {
      if (on && !locked) {
        lockBodyScroll()
        locked = true
      } else if (!on && locked) {
        unlockBodyScroll()
        locked = false
      }
    }

    watch(active, v => {
      if (typeof window === 'undefined') return
      if (v) window.addEventListener('keydown', onKeydown)
      else window.removeEventListener('keydown', onKeydown)
      applyLock(v)
    })
    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
      applyLock(false)
    })

    useRender(() =>
      h(Teleport, { to: 'body' }, [
        h(
          Transition,
          { name: 'fui-dialog' },
          {
            default: () =>
              active.value
                ? h(
                    'div',
                    {
                      class: [
                        'fui-dialog',
                        {
                          'fui-dialog--blur': props.blur,
                          'fui-dialog--full-screen': props.fullScreen,
                        },
                      ],
                      onClick: onBackdropPointer,
                    },
                    [
                      h(
                        'div',
                        {
                          ref: boxRef,
                          // Focusable so the box can hold focus itself when it
                          // contains no controls of its own.
                          tabindex: -1,
                          class: [
                            'fui-dialog__box',
                            {
                              'fui-dialog__box--full-screen': props.fullScreen,
                              'fui-dialog__box--square': props.square,
                              'fui-dialog__box--auto-width': props.autoWidth,
                              'fui-dialog__box--scroll': props.scroll,
                              'fui-dialog__box--not-padding': props.notPadding,
                              'fui-dialog__box--not-center': props.notCenter,
                              'fui-dialog__box--rebound': rebound.value,
                            },
                            props.class,
                          ],
                          style: [
                            { '--fui-dialog-accent': accent.value },
                            props.width ? { width: convertToUnit(props.width) } : null,
                            props.style,
                          ],
                          role: 'dialog',
                          'aria-modal': 'true',
                        },
                        [
                          props.loading
                            ? h('div', { class: 'fui-dialog__loading' }, [
                                h('span', { class: 'fui-dialog__spinner' }),
                              ])
                            : null,
                          props.notClose
                            ? null
                            : h(
                                'button',
                                {
                                  type: 'button',
                                  class: 'fui-dialog__close',
                                  'aria-label': 'Close',
                                  onClick: close,
                                },
                                [h(FIcon, { icon: 'x' })]
                              ),
                          slots.header
                            ? h('header', { class: 'fui-dialog__header' }, slots.header())
                            : null,
                          h(
                            'div',
                            {
                              class: [
                                'fui-dialog__content',
                                { 'fui-dialog__content--not-footer': !slots.footer },
                              ],
                            },
                            slots.default?.()
                          ),
                          slots.footer
                            ? h('footer', { class: 'fui-dialog__footer' }, slots.footer())
                            : null,
                        ]
                      ),
                    ]
                  )
                : null,
          }
        ),
      ])
    )
  },
})
