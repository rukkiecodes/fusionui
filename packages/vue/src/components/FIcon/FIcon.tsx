import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeIconProps, useIcon } from '../../composables/icons'
import { useColor } from '../../composables/color'

const sizeMap: Record<string, string> = {
  'x-small': '12px',
  small: '16px',
  default: '24px',
  medium: '28px',
  large: '36px',
  'x-large': '48px',
}

export const makeFIconProps = propsFactory(
  {
    color: String as PropType<string>,
    size: { type: [String, Number] as PropType<string | number>, default: 'default' },
    start: Boolean,
    end: Boolean,
    spin: Boolean,
    ...makeIconProps(),
    ...makeComponentProps(),
  },
  'FIcon'
)

export const FIcon = genericComponent()({
  name: 'FIcon',
  props: makeFIconProps(),
  setup(
    props: {
      icon?: unknown
      tag: string
      color?: string
      size: string | number
      start: boolean
      end: boolean
      spin: boolean
      class?: unknown
      style?: unknown
    },
    { slots }: { slots: Record<string, ((...args: any[]) => any) | undefined> }
  ) {
    const iconData = useIcon(() => props.icon as never)
    const { colorClasses, colorStyles } = useColor(() => ({ text: props.color }))

    const fontSize = computed(() => {
      const s = props.size
      if (s == null) return undefined
      return sizeMap[String(s)] ?? convertToUnit(s)
    })

    useRender(() => {
      const classes = [
        'fui-icon',
        {
          'fui-icon--spin': props.spin,
          'fui-icon--start': props.start,
          'fui-icon--end': props.end,
        },
        ...colorClasses.value,
        props.class,
      ]
      const style = [{ fontSize: fontSize.value }, colorStyles.value, props.style]

      // No icon prop → render the default slot inside the icon container.
      if (props.icon == null && slots.default) {
        return h('i', { class: classes, style }, [slots.default()])
      }

      const { component, icon } = iconData.value
      return h(component, { tag: props.tag, icon, class: classes, style })
    })
  },
})
