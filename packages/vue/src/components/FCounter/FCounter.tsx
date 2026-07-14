import { Transition, computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFCounterProps = propsFactory(
  {
    value: {
      type: [Number, String] as PropType<number | string>,
      default: 0,
    },
    max: [Number, String] as PropType<number | string>,
    active: Boolean,
    /** Skips the over-limit tint (a disabled input can't be corrected). */
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCounter'
)

export const FCounter = genericComponent()({
  name: 'FCounter',
  props: makeFCounterProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const counter = computed(() =>
      props.max != null ? `${props.value} / ${props.max}` : String(props.value)
    )

    const exceeded = computed(
      () =>
        props.max != null &&
        !props.disabled &&
        parseFloat(String(props.value)) > parseFloat(String(props.max))
    )

    useRender(() =>
      h(Transition, { name: 'fui-counter-transition' }, () =>
        props.active
          ? h(
              'div',
              {
                class: ['fui-counter', { 'fui-counter--exceeded': exceeded.value }, props.class],
                style: props.style,
                // The count updates on every keystroke — announcing each one
                // would be noise, so only the over-limit state is urgent.
                'aria-live': exceeded.value ? 'polite' : 'off',
              },
              slots.default
                ? slots.default({
                    counter: counter.value,
                    max: props.max,
                    value: props.value,
                  })
                : counter.value
            )
          : null
      )
    )
  },
})
