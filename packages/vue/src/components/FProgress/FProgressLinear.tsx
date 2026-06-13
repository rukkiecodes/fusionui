import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'
import { convertToUnit } from '../../util/helpers'

export const makeFProgressLinearProps = propsFactory(
  {
    modelValue: { type: [Number, String] as PropType<number | string>, default: 0 },
    indeterminate: Boolean,
    height: { type: [Number, String] as PropType<number | string>, default: 4 },
    color: String as PropType<string>,
    striped: Boolean,
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FProgressLinear'
)

export const FProgressLinear = genericComponent()({
  name: 'FProgressLinear',
  props: makeFProgressLinearProps(),
  setup(props: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    const normalized = computed(() =>
      Math.max(0, Math.min(100, parseFloat(String(props.modelValue))))
    )

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-progress-linear',
            { 'fui-progress-linear--indeterminate': props.indeterminate },
            ...roundedClasses.value,
            props.class,
          ],
          style: [{ height: convertToUnit(props.height) }, props.style],
          role: 'progressbar',
          'aria-valuenow': props.indeterminate ? undefined : normalized.value,
        },
        [
          h('div', {
            class: [
              'fui-progress-linear__bar',
              { 'fui-progress-linear--striped': props.striped },
              ...colorClasses.value,
            ],
            style: [
              colorStyles.value,
              props.indeterminate ? {} : { width: `${normalized.value}%` },
            ],
          }),
        ]
      )
    )
  },
})
