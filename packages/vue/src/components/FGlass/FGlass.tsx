import { ref, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useLiquidGlass } from '../../composables/liquidGlass'
import type { BezelProfile } from '../../engine/liquid-glass'

export const makeFGlassProps = propsFactory(
  {
    /** Corner radius px. Also drives the refraction geometry. */
    radius: { type: [Number, String] as PropType<number | string>, default: 24 },
    /** Width of the light-bending rim, px. */
    bezel: { type: [Number, String] as PropType<number | string>, default: 18 },
    /** Glass thickness px — how hard light bends at the rim. */
    depth: { type: [Number, String] as PropType<number | string>, default: 14 },
    /** Index of refraction. Glass ≈ 1.45. */
    ior: { type: [Number, String] as PropType<number | string>, default: 1.45 },
    /** Bezel profile: 'lens' (iOS look) or 'smooth'. */
    profile: { type: String as PropType<BezelProfile>, default: 'lens' },
    /** Backdrop blur px before refraction. */
    blur: { type: [Number, String] as PropType<number | string>, default: 2 },
    /** Backdrop saturation multiplier. */
    saturation: { type: [Number, String] as PropType<number | string>, default: 1.6 },
    /** Tint overlay color. */
    tint: { type: String, default: 'rgba(255,255,255,0.10)' },
    /** Press-to-squish interaction like iOS controls. */
    interactive: Boolean,
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FGlass'
)

export const FGlass = genericComponent()({
  name: 'FGlass',
  inheritAttrs: false,
  props: makeFGlassProps(),
  setup(props: any, { slots, attrs }: any) {
    provideTheme(props)

    const root = ref<HTMLElement | null>(null)
    const options = toRef(() => ({
      bezelWidth: Number(props.bezel),
      depth: Number(props.depth),
      ior: Number(props.ior),
      profile: props.profile,
      blur: Number(props.blur),
      saturation: Number(props.saturation),
      tint: props.tint,
    }))

    const { glassStyle, highlightStyle, refracting } = useLiquidGlass(root, options)

    useRender(() => {
      const Tag = props.tag
      return (
        <Tag
          ref={root}
          class={[
            'fui-glass',
            {
              'fui-glass--interactive': props.interactive,
              'fui-glass--refracting': refracting.value,
            },
            props.class,
          ]}
          style={[glassStyle.value, { borderRadius: `${Number(props.radius)}px` }, props.style]}
          {...attrs}
        >
          <span class="fui-glass__highlight" style={highlightStyle.value} aria-hidden="true" />
          <div class="fui-glass__content">{slots.default?.()}</div>
        </Tag>
      )
    })

    return {}
  },
})

export type FGlass = InstanceType<typeof FGlass>
