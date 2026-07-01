import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { FImage } from '../FImage'

export const makeFCarouselItemProps = propsFactory(
  {
    /** Image URL — renders an `FImage` filling the slide. Omit and use the default slot for custom content. */
    src: String as PropType<string>,
    /** Low-res blur-up placeholder passed through to `FImage`. */
    lazySrc: String as PropType<string>,
    alt: { type: String as PropType<string>, default: '' },
    /** Crop to fill the slide (default) vs. fit inside it. */
    cover: { type: Boolean, default: true },
    eager: Boolean,
    ...makeComponentProps(),
  },
  'FCarouselItem'
)

/** A single carousel slide. Analogous to Vuetify's `v-carousel-item`. */
export const FCarouselItem = genericComponent()({
  name: 'FCarouselItem',
  props: makeFCarouselItemProps(),
  setup(props: any, { slots }: any) {
    useRender(() =>
      props.src
        ? h(
            FImage,
            {
              class: ['fui-carousel-item', props.class],
              style: props.style,
              src: props.src,
              lazySrc: props.lazySrc,
              alt: props.alt,
              cover: props.cover,
              eager: props.eager,
              height: '100%',
            },
            slots.default ? { default: slots.default } : undefined
          )
        : h(
            'div',
            { class: ['fui-carousel-item', props.class], style: props.style },
            slots.default?.()
          )
    )
  },
})
