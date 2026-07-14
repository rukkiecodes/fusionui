import { computed, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'

/**
 * The bone vocabulary. Each entry maps a type to the primitives it is built
 * from — a comma-separated list, optionally repeated with `@n` (`text@3`).
 * Types that map to themselves (`text`, `avatar`, …) are the leaf primitives
 * and get their shape from the stylesheet.
 */
export const skeletonTypes = {
  actions: 'button@2',
  article: 'heading, paragraph',
  avatar: 'avatar',
  button: 'button',
  card: 'image, heading, sentences',
  'card-avatar': 'image, list-item-avatar',
  chip: 'chip',
  divider: 'divider',
  heading: 'heading',
  image: 'image',
  'list-item': 'text',
  'list-item-avatar': 'avatar, text',
  'list-item-two-line': 'sentences',
  'list-item-avatar-two-line': 'avatar, sentences',
  'list-item-three-line': 'paragraph',
  'list-item-avatar-three-line': 'avatar, paragraph',
  ossein: 'ossein',
  paragraph: 'text@3',
  sentences: 'text@2',
  subtitle: 'text',
  table: 'table-heading, table-thead, table-tbody, table-tfoot',
  'table-heading': 'chip, text',
  'table-thead': 'heading@6',
  'table-tbody': 'table-row-divider@6',
  'table-row': 'text@6',
  'table-row-divider': 'table-row, divider',
  'table-tfoot': 'text@2, avatar@2',
  text: 'text',
} as const

export type FSkeletonType = keyof typeof skeletonTypes

type Bones = VNodeChild | Bones[]

function genBone(type: string, children: Bones = []): VNodeChild {
  return h('div', { class: ['fui-skeleton__bone', `fui-skeleton__${type}`] }, children as never)
}

/** `text@3` → three `text` structures. */
function genBones(bone: string): Bones {
  const [type, length] = bone.split('@')
  return Array.from({ length: Number(length) || 1 }).map(() => genStructure(type))
}

/** Recursively expands a type into its bone tree. */
function genStructure(type?: string): Bones {
  let children: Bones = []
  if (!type) return children

  const bone = (skeletonTypes as Record<string, string>)[type]

  // Leaf primitive (maps to itself) — stop recursing.
  if (type === bone) {
    /* no children */
  } else if (type.includes(',')) {
    return mapBones(type)
  } else if (type.includes('@')) {
    return genBones(type)
  } else if (bone?.includes(',')) {
    children = mapBones(bone)
  } else if (bone?.includes('@')) {
    children = genBones(bone)
  } else if (bone) {
    children = [genStructure(bone)]
  }

  return [genBone(type, children)]
}

function mapBones(bones: string): Bones {
  return bones
    .replace(/\s/g, '')
    .split(',')
    .map(bone => genStructure(bone))
}

export const makeFSkeletonProps = propsFactory(
  {
    /** The skeleton's shape — a type name, a comma-separated list, or an array. Repeat a bone with `@n` (e.g. `text@3`). */
    type: {
      type: [String, Array] as PropType<FSkeletonType | string | readonly string[]>,
      default: 'ossein',
    },
    /** Render as static boilerplate: no shimmer and no screen-reader announcement. */
    boilerplate: Boolean,
    /** Force the skeleton on even when default-slot content is present. */
    loading: Boolean,
    /** Message announced to assistive tech while the skeleton is visible. */
    loadingText: { type: String as PropType<string>, default: 'Loading…' },
    /** Background of the skeleton surface — a theme name or any CSS color. */
    color: String as PropType<string>,
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSkeleton'
)

/**
 * A loading placeholder that mimics the shape of the content it stands in for.
 * Wrap the real content in the default slot and flip `loading` to swap between
 * the two.
 */
export const FSkeleton = genericComponent()({
  name: 'FSkeleton',
  props: makeFSkeletonProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    const bones = computed(() => {
      const type = Array.isArray(props.type) ? props.type.join(',') : String(props.type)
      return genStructure(type)
    })

    useRender(() => {
      // Content wins once it has arrived, unless `loading` is explicitly held on.
      const isLoading = !slots.default || props.loading
      if (!isLoading) return slots.default()

      const a11yProps = props.boilerplate
        ? {}
        : { role: 'alert', 'aria-live': 'polite', 'aria-label': props.loadingText }

      return h(
        'div',
        {
          class: [
            'fui-skeleton',
            { 'fui-skeleton--boilerplate': props.boilerplate },
            ...elevationClasses.value,
            ...colorClasses.value,
            props.class,
          ],
          style: [dimensionStyles.value, colorStyles.value, props.style],
          ...a11yProps,
        },
        bones.value as never
      )
    })
  },
})
