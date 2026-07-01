import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { convertToUnit } from '../../util/helpers'

export const makeFImageProps = propsFactory(
  {
    /** The image URL. */
    src: String as PropType<string>,
    /** A tiny/low-res image shown (blurred) while `src` loads. */
    lazySrc: String as PropType<string>,
    /** Alt text. */
    alt: { type: String as PropType<string>, default: '' },
    /** Fill and crop the container instead of fitting inside it. */
    cover: Boolean,
    /** Container aspect ratio (e.g. `16/9`). Falls back to the image's own ratio. */
    aspectRatio: [String, Number] as PropType<string | number>,
    /** `object-position` for the image. */
    position: String as PropType<string>,
    /** A CSS gradient painted over the image (e.g. `to top, rgba(0,0,0,.6), transparent`). */
    gradient: String as PropType<string>,
    /** Load immediately instead of lazily (native `loading`). */
    eager: Boolean,
    /** Corner rounding token, `true` (md), or a CSS length. */
    rounded: {
      type: [Boolean, String, Number] as PropType<boolean | string | number>,
      default: false,
    },
    ...makeDimensionProps(),
    ...makeComponentProps(),
  },
  'FImage'
)

export const FImage = genericComponent()({
  name: 'FImage',
  props: makeFImageProps(),
  emits: {
    load: (_src: string | undefined) => true,
    error: (_src: string | undefined) => true,
  },
  setup(props: any, { slots, emit }: any) {
    const { dimensionStyles } = useDimension(props)
    const loaded = ref(false)
    const errored = ref(false)
    // When no ratio/height is given we adopt the image's natural ratio once known.
    const naturalRatio = ref<number | null>(null)

    const ratio = computed(() => props.aspectRatio ?? naturalRatio.value ?? undefined)

    function onLoad(e: Event): void {
      loaded.value = true
      const img = e.target as HTMLImageElement
      if (props.aspectRatio == null && props.height == null && img?.naturalWidth) {
        naturalRatio.value = img.naturalWidth / img.naturalHeight
      }
      emit('load', props.src)
    }
    function onError(): void {
      errored.value = true
      emit('error', props.src)
    }

    const roundedStyle = computed(() => {
      const r = props.rounded
      if (r === false || r == null) return undefined
      if (r === true) return 'var(--fui-radius-md, 12px)'
      return convertToUnit(r)
    })

    useRender(() => {
      const objectFit = props.cover ? 'cover' : 'contain'
      return h(
        'div',
        {
          class: ['fui-image', props.class],
          style: [
            dimensionStyles.value,
            ratio.value != null ? { aspectRatio: String(ratio.value) } : null,
            roundedStyle.value ? { borderRadius: roundedStyle.value } : null,
            props.style,
          ],
        },
        [
          // Blur-up placeholder.
          props.lazySrc && !loaded.value
            ? h('img', {
                class: 'fui-image__placeholder-img',
                src: props.lazySrc,
                alt: '',
                'aria-hidden': true,
              })
            : null,
          // Main image.
          props.src && !errored.value
            ? h('img', {
                class: ['fui-image__img', { 'fui-image__img--loaded': loaded.value }],
                src: props.src,
                alt: props.alt,
                draggable: false,
                loading: props.eager ? 'eager' : 'lazy',
                decoding: 'async',
                style: { objectFit, objectPosition: props.position || 'center' },
                onLoad,
                onError,
              })
            : null,
          // Gradient overlay.
          props.gradient
            ? h('div', {
                class: 'fui-image__gradient',
                style: { backgroundImage: `linear-gradient(${props.gradient})` },
              })
            : null,
          // Loading placeholder slot (shown until loaded, no error).
          !loaded.value && !errored.value && slots.placeholder
            ? h('div', { class: 'fui-image__overlay' }, slots.placeholder())
            : null,
          // Error slot.
          errored.value && slots.error
            ? h('div', { class: 'fui-image__overlay' }, slots.error())
            : null,
          // Default content overlay (rendered above the image).
          slots.default ? h('div', { class: 'fui-image__content' }, slots.default()) : null,
        ]
      )
    })
  },
})
