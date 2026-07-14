import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFLabelProps = propsFactory(
  {
    text: String as PropType<string>,
    /** `for` attribute — the id of the control this label names. */
    for: String as PropType<string>,
    clickable: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FLabel'
)

export const FLabel = genericComponent()({
  name: 'FLabel',
  props: makeFLabelProps(),
  emits: {
    click: (_e: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    function onClick(e: MouseEvent): void {
      if (props.disabled) return
      emit('click', e)
    }

    useRender(() =>
      h(
        'label',
        {
          class: [
            'fui-label',
            {
              'fui-label--clickable': props.clickable && !props.disabled,
              'fui-label--disabled': props.disabled,
            },
            props.class,
          ],
          style: props.style,
          // A native `<label for>` already forwards clicks and focus to the
          // control, so no extra ARIA is needed — only the disabled hint.
          for: props.for,
          'aria-disabled': props.disabled ? 'true' : undefined,
          onClick,
        },
        slots.default ? slots.default() : props.text
      )
    )
  },
})
