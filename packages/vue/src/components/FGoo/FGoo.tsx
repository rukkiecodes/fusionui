import { computed, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useGooey, GOO_FILTER_ID } from '../../composables/gooey'
import type { GooKernel } from '../../engine/gooey'
import type { GooRenderMode } from '../../composables/gooey'

export interface FGooBlobInit {
  x: number
  y: number
  r: number
  vx?: number
  vy?: number
  pinned?: boolean
}

export const makeFGooProps = propsFactory(
  {
    /** Initial blobs. If omitted, `count` random blobs are scattered. */
    blobs: Array as PropType<FGooBlobInit[]>,
    count: { type: Number, default: 6 },
    /** Random blob radius range when auto-generating. */
    minRadius: { type: Number, default: 22 },
    maxRadius: { type: Number, default: 46 },
    /** Fill of the goo. Defaults to the theme primary. */
    color: String,
    /** Field kernel. 'cubic' is controllable; 'inverseSquare' is the gooiest. */
    kernel: { type: String as PropType<GooKernel>, default: 'cubic' },
    /** Merge reach 0..1 — lower reaches further (mapped to field threshold). */
    reach: { type: Number, default: 0.5 },
    /** Surface-tension strength. */
    cohesion: { type: Number, default: 45 },
    /** Pull toward the centroid so blobs coalesce (0 = free float). */
    gather: { type: Number, default: 4 },
    /** Viscosity (settling damping). */
    viscosity: { type: Number, default: 1.4 },
    gravity: { type: Array as unknown as PropType<[number, number]>, default: () => [0, 0] },
    /** 'contour' = true vector isosurface; 'filter' = fast SVG goo filter. */
    mode: { type: String as PropType<GooRenderMode>, default: 'contour' },
    /** Cursor force: + attracts, − repels, 0 off. */
    pointer: { type: Number, default: 0 },
    pointerRadius: { type: Number, default: 150 },
    /** Marching-squares cell px (contour mode). */
    cell: { type: Number, default: 8 },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FGoo'
)

export const FGoo = genericComponent()({
  name: 'FGoo',
  inheritAttrs: false,
  props: makeFGooProps(),
  setup(props: any, { slots, attrs }: any) {
    provideTheme(props)

    const root = ref<HTMLElement | null>(null)

    const initial: FGooBlobInit[] =
      props.blobs ??
      Array.from({ length: props.count }, () => ({
        x: Math.random() * 600,
        y: Math.random() * 400,
        r: props.minRadius + Math.random() * (props.maxRadius - props.minRadius),
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
      }))

    const { path, circles, clearPointer, impulse, system, wake } = useGooey(
      root,
      initial.map(b => ({ ...b, vx: b.vx ?? 0, vy: b.vy ?? 0 })),
      {
        mode: props.mode,
        cell: props.cell,
        pointerStrength: props.pointer,
        pointerRadius: props.pointerRadius,
        params: {
          field: { kernel: props.kernel, threshold: props.reach },
          physics: {
            cohesion: props.cohesion,
            gather: props.gather,
            viscosity: props.viscosity,
            gravity: props.gravity,
          },
        },
      }
    )

    // Field + physics props are live: push them into the running system so a
    // playground (or any reactive parent) re-tunes the goo without remounting.
    watch(
      () => [
        props.kernel,
        props.reach,
        props.cohesion,
        props.gather,
        props.viscosity,
        props.gravity,
      ],
      () => {
        system.setParams({
          field: { kernel: props.kernel, threshold: props.reach },
          physics: {
            cohesion: props.cohesion,
            gather: props.gather,
            viscosity: props.viscosity,
            gravity: props.gravity,
          },
        })
        wake()
      },
      { deep: true }
    )

    const fill = computed(() => props.color || 'rgb(var(--fui-theme-primary))')

    // Read the pointer strength/radius live off props (not the construction-time
    // closure) so changing them mid-flight takes effect.
    function onMove(e: PointerEvent) {
      if (!props.pointer || !root.value) return
      const r = root.value.getBoundingClientRect()
      system.pointer.x = e.clientX - r.left
      system.pointer.y = e.clientY - r.top
      system.pointer.strength = props.pointer
      system.pointer.radius = props.pointerRadius
      system.pointer.active = true
      wake()
    }

    useRender(() => (
      <div
        ref={root}
        class={['fui-goo', `fui-goo--${props.mode}`, props.class]}
        style={props.style}
        onPointermove={onMove}
        onPointerleave={() => clearPointer()}
        {...attrs}
      >
        <svg class="fui-goo__svg" preserveAspectRatio="none" aria-hidden="true">
          {props.mode === 'filter' && (
            <defs>
              <filter id={GOO_FILTER_ID}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
                <feColorMatrix
                  in="b"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          )}
          {props.mode === 'contour' ? (
            <path d={path.value} fill={fill.value} class="fui-goo__path" />
          ) : (
            <g filter={`url(#${GOO_FILTER_ID})`}>
              {circles.value.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={fill.value} />
              ))}
            </g>
          )}
        </svg>
        {slots.default?.({ impulse })}
      </div>
    ))

    return { impulse }
  },
})

export type FGoo = InstanceType<typeof FGoo>
