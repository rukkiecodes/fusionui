import { computed, defineComponent, h, inject, toValue } from 'vue'
import type { Component, FunctionalComponent, InjectionKey, MaybeRefOrGetter, PropType } from 'vue'
import { featherAliases } from '@rukkiecodes/icons'
import { propsFactory } from '../util/propsFactory'

// Icon framework: resolves an icon value (alias / set:name / raw SVG / component)
// to a renderer. Feather is the default set; semantic aliases ($close, $success,
// …) ship by default so component internals work out of the box.

export type IconValue = string | FunctionalComponent | Component | unknown[]

export interface IconAliases {
  [name: string]: IconValue
}

export interface IconSet {
  component: Component
}

const iconRendererProps = {
  icon: { type: [String, Array, Object, Function] as PropType<IconValue>, default: undefined },
  tag: { type: String, default: 'i' },
}

export interface IconOptions {
  defaultSet?: string
  sets?: Record<string, IconSet>
  aliases?: IconAliases
}

export interface InternalIconOptions {
  defaultSet: string
  sets: Record<string, IconSet>
  aliases: IconAliases
}

export const IconSymbol: InjectionKey<InternalIconOptions> = Symbol.for('fusionui:icons')

/** Renders a single-path or multi-node SVG icon (Feather icons are multi-node). */
export const FSvgIcon = defineComponent({
  name: 'FSvgIcon',
  props: iconRendererProps,
  setup(props) {
    return () => {
      const children = Array.isArray(props.icon)
        ? props.icon.map((p, i) => h('path', { key: i, d: String(p) }))
        : typeof props.icon === 'string'
          ? [h('path', { d: props.icon })]
          : []
      return h(props.tag, { class: 'fui-icon__svg' }, [
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            width: '1em',
            height: '1em',
            role: 'img',
          },
          children
        ),
      ])
    }
  },
})

/** Renders a component icon (e.g. a generated Feather component). */
export const FComponentIcon = defineComponent({
  name: 'FComponentIcon',
  props: iconRendererProps,
  setup(props) {
    return () => {
      const Icon = props.icon
      return h(
        props.tag,
        { class: 'fui-icon__component' },
        typeof Icon === 'function' || (Icon && typeof Icon === 'object')
          ? [h(Icon as Component)]
          : []
      )
    }
  },
})

export function createIcons(options: IconOptions = {}): InternalIconOptions {
  return {
    defaultSet: options.defaultSet ?? 'feather',
    sets: { svg: { component: FSvgIcon }, ...options.sets },
    aliases: { ...featherAliases, ...options.aliases },
  }
}

export const makeIconProps = propsFactory(
  {
    icon: {
      type: [String, Array, Object, Function] as PropType<IconValue>,
      required: false,
    },
    tag: {
      type: String,
      default: 'i',
    },
  },
  'icon'
)

/** Resolves an icon value (alias, `set:name`, raw SVG, or component) to a renderer. */
export function useIcon(iconProp: MaybeRefOrGetter<IconValue | undefined>) {
  const icons = inject(IconSymbol)
  if (!icons) throw new Error('[FusionUI] Could not find icon configuration')

  return computed(() => {
    let icon = toValue(iconProp)
    if (icon == null) return { component: FComponentIcon, icon: undefined as IconValue | undefined }

    if (typeof icon === 'string') {
      icon = icon.trim()
      if (icon.startsWith('$')) {
        icon = icons.aliases[icon.slice(1)] ?? icon
      }
    }

    if (Array.isArray(icon)) {
      return { component: FSvgIcon, icon }
    }
    if (typeof icon !== 'string') {
      return { component: FComponentIcon, icon }
    }

    const setName = Object.keys(icons.sets).find(s => (icon as string).startsWith(`${s}:`))
    const iconName = setName ? icon.slice(setName.length + 1) : icon
    const set = icons.sets[setName ?? icons.defaultSet] ?? { component: FSvgIcon }
    return { component: set.component, icon: iconName }
  })
}
