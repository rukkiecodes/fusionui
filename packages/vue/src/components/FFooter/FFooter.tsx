import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeBorderProps, useBorder } from '../../composables/border'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { useLayoutItem } from '../../composables/layout'
import { convertToUnit } from '../../util/helpers'
import { surfaceColorTriplet, surfaceOnTriplet } from '../FSheet/FSheet'

export const makeFFooterProps = propsFactory(
  {
    // Participate in the layout: the footer docks to the bottom of the
    // surrounding <f-layout> and <f-main> insets itself above it.
    app: Boolean,
    // `auto` measures the rendered height; a number/string pins it.
    height: { type: [Number, String] as PropType<number | string>, default: 'auto' },
    // Fill the footer with a theme color (primary, success…) or any CSS color.
    color: String as PropType<string>,
    // Layout stacking order (lower = outer). 0 puts the footer outside the
    // sidebar, so a docked drawer stops above it.
    order: { type: Number, default: 0 },
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeTagProps({ tag: 'footer' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FFooter'
)

/**
 * The page footer surface. On its own it is a plain block at the end of the
 * document; with `app` inside an `<f-layout>` it registers as the bottom layout
 * item — exactly the way `FNavbar` registers as the top one.
 */
export const FFooter = genericComponent()({
  name: 'FFooter',
  props: makeFFooterProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)

    const rootRef = ref<HTMLElement>()
    const autoHeight = ref(56)
    const isAuto = computed(() => props.height == null || props.height === 'auto')
    // What the layout reserves at the bottom: the measured height when `auto`,
    // otherwise the pinned one.
    const layoutHeight = computed(() =>
      isAuto.value ? autoHeight.value : parseInt(String(props.height), 10) || 0
    )

    const { hasLayout, layoutItemStyles } = useLayoutItem({
      id: `fui-footer-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      position: ref('bottom') as any,
      size: layoutHeight,
      order: computed(() => Number(props.order ?? 0)) as any,
      active: computed(() => !!props.app) as any,
    })
    const inLayout = computed(() => hasLayout && !!props.app)

    let observer: ResizeObserver | null = null
    function measure(): void {
      if (rootRef.value) autoHeight.value = rootRef.value.offsetHeight || autoHeight.value
    }

    onMounted(() => {
      if (typeof window === 'undefined' || !hasLayout) return
      measure()
      if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
        observer = new ResizeObserver(measure)
        observer.observe(rootRef.value)
      }
    })
    onBeforeUnmount(() => observer?.disconnect())

    const colorStyles = computed(() => {
      const color = surfaceColorTriplet(props.color)
      if (!color) return null
      return {
        '--fui-footer-bg': color,
        '--fui-footer-on': surfaceOnTriplet(props.color),
      }
    })

    useRender(() =>
      h(
        props.tag,
        {
          ref: rootRef,
          class: [
            'fui-footer',
            {
              'fui-footer--app': inLayout.value,
              'fui-footer--colored': !!props.color,
            },
            ...borderClasses.value,
            ...roundedClasses.value,
            ...elevationClasses.value,
            props.class,
          ],
          style: [
            colorStyles.value,
            inLayout.value ? layoutItemStyles.value : null,
            // A pinned height wins over whatever the layout computed.
            isAuto.value ? null : { height: convertToUnit(props.height) },
            props.style,
          ],
        },
        slots.default?.()
      )
    )
  },
})
