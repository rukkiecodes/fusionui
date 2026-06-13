import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'
import { convertToUnit } from '../../util/helpers'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const makeVdProgressCircularProps = propsFactory(
  {
    modelValue: { type: [Number, String] as PropType<number | string>, default: 0 },
    indeterminate: Boolean,
    size: { type: [Number, String] as PropType<number | string>, default: 32 },
    width: { type: [Number, String] as PropType<number | string>, default: 4 },
    color: String as PropType<string>,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FProgressCircular'
)

export const FProgressCircular = genericComponent()({
  name: 'FProgressCircular',
  props: makeVdProgressCircularProps(),
  setup(props: any) {
    provideTheme(props)
    const { colorClasses, colorStyles } = useColor(() => ({ text: props.color }))

    const normalized = computed(() =>
      Math.max(0, Math.min(100, parseFloat(String(props.modelValue))))
    )
    const strokeOffset = computed(() => CIRCUMFERENCE * (1 - normalized.value / 100))

    useRender(() => {
      const size = convertToUnit(props.size)
      return h(
        'div',
        {
          class: [
            'fui-progress-circular',
            { 'fui-progress-circular--indeterminate': props.indeterminate },
            ...colorClasses.value,
            props.class,
          ],
          style: [{ width: size, height: size }, colorStyles.value, props.style],
          role: 'progressbar',
          'aria-valuenow': props.indeterminate ? undefined : normalized.value,
        },
        [
          h('svg', { viewBox: '0 0 44 44', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('circle', {
              class: 'fui-progress-circular__underlay',
              cx: 22,
              cy: 22,
              r: RADIUS,
              fill: 'transparent',
              'stroke-width': props.width,
            }),
            h('circle', {
              class: 'fui-progress-circular__overlay',
              cx: 22,
              cy: 22,
              r: RADIUS,
              fill: 'transparent',
              'stroke-width': props.width,
              'stroke-dasharray': CIRCUMFERENCE.toFixed(3),
              'stroke-dashoffset': props.indeterminate ? undefined : strokeOffset.value.toFixed(3),
            }),
          ]),
        ]
      )
    })
  },
})
