import { Teleport, Transition, computed, h, onBeforeUnmount, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
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
    /** Lock the page scroll while open. */
    overflowHidden: Boolean,
    /** Frost the backdrop. */
    blur: Boolean,
    /** Hard square corners. */
    square: Boolean,
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

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !props.preventClose) close()
    }

    function setBodyLock(on: boolean) {
      if (typeof document === 'undefined' || !props.overflowHidden) return
      document.body.style.overflow = on ? 'hidden' : ''
    }

    watch(active, v => {
      if (typeof window === 'undefined') return
      if (v) window.addEventListener('keydown', onKeydown)
      else window.removeEventListener('keydown', onKeydown)
      setBodyLock(v)
    })
    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
      setBodyLock(false)
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
