import { h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FOverlay } from '../FOverlay'

export const makeFBottomSheetProps = propsFactory(
  {
    /** Visibility (use `v-model`). */
    modelValue: { type: Boolean, default: false },
    /** Detach the sheet from the edges — a narrower, fully rounded card. */
    inset: Boolean,
    /** Don't dismiss on backdrop click or `Escape`. */
    persistent: Boolean,
    /** Let a tall sheet scroll its own body instead of growing past the fold. */
    scrollable: Boolean,
    /** Hide the drag-handle affordance at the top of the sheet. */
    notHandle: Boolean,
    /** Dim the page behind the sheet (`false`, or a CSS color for a custom scrim). */
    scrim: { type: [Boolean, String] as PropType<boolean | string>, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBottomSheet'
)

/**
 * A dialog that slides up from the bottom edge — the thumb-friendly place to put
 * a share menu, a filter panel or a set of contextual actions on a phone.
 *
 * It is `FOverlay` with a different geometry: the scrim, the teleport, the
 * ref-counted body scroll lock and the `Escape` handling are all the overlay's,
 * so a bottom sheet stacks with dialogs and menus instead of fighting them. What
 * the sheet adds on top is focus management — focus moves into the sheet on open,
 * `Tab` cycles inside it, and the previously focused element gets focus back.
 */
export const FBottomSheet = genericComponent()({
  name: 'FBottomSheet',
  props: makeFBottomSheetProps(),
  emits: { 'update:modelValue': (_v: boolean) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', false)
    const sheetRef = ref<HTMLElement>()
    useRender(() =>
      h(
        FOverlay,
        {
          modelValue: isActive.value,
          'onUpdate:modelValue': (value: boolean) => {
            isActive.value = value
          },
          persistent: props.persistent,
          scrim: props.scrim,
          transition: 'fui-bottom-sheet',
          contentClass: ['fui-bottom-sheet', { 'fui-bottom-sheet--inset': props.inset }],
        },
        {
          activator: slots.activator,
          default: ({ close }: any) =>
            h(
              'div',
              {
                ref: sheetRef,
                class: [
                  'fui-bottom-sheet__sheet',
                  { 'fui-bottom-sheet__sheet--scrollable': props.scrollable },
                  props.class,
                ],
                style: props.style,
                tabindex: -1,
              },
              [
                props.notHandle
                  ? null
                  : h('div', { class: 'fui-bottom-sheet__handle', 'aria-hidden': 'true' }),
                h(
                  'div',
                  { class: 'fui-bottom-sheet__content' },
                  slots.default?.({ isActive: isActive.value, close })
                ),
              ]
            ),
        }
      )
    )
  },
})
