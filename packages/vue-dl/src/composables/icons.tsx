import { computed, defineComponent, h, inject, toValue } from 'vue'
import type { Component, FunctionalComponent, InjectionKey, MaybeRefOrGetter, PropType } from 'vue'
import { propsFactory } from '../util/propsFactory'

// NOTE: Minimal icon framework so components can render icons now. Batch 04
// fleshes out the Feather set, the SVG/component renderers, and the generator.

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

export const IconSymbol: InjectionKey<InternalIconOptions> = Symbol.for('vuedl:icons')

/** Renders a single-path or multi-node SVG icon (Feather icons are multi-node). */
export const VdSvgIcon = defineComponent({
  name: 'VdSvgIcon',
  props: iconRendererProps,
  setup(props) {
    return () => {
      const children = Array.isArray(props.icon)
        ? props.icon.map((p, i) => h('path', { key: i, d: String(p) }))
        : typeof props.icon === 'string'
          ? [h('path', { d: props.icon })]
          : []
      return h(props.tag, { class: 'vd-icon__svg' }, [
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
            role: 'img',
          },
          children
        ),
      ])
    }
  },
})

/** Renders a component icon (e.g. a generated Feather component). */
export const VdComponentIcon = defineComponent({
  name: 'VdComponentIcon',
  props: iconRendererProps,
  setup(props) {
    return () => {
      const Icon = props.icon
      return h(
        props.tag,
        { class: 'vd-icon__component' },
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
    sets: { svg: { component: VdSvgIcon }, ...options.sets },
    aliases: options.aliases ?? {},
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
  if (!icons) throw new Error('[Vue DL] Could not find icon configuration')

  return computed(() => {
    let icon = toValue(iconProp)
    if (icon == null)
      return { component: VdComponentIcon, icon: undefined as IconValue | undefined }

    if (typeof icon === 'string') {
      icon = icon.trim()
      if (icon.startsWith('$')) {
        icon = icons.aliases[icon.slice(1)] ?? icon
      }
    }

    if (Array.isArray(icon)) {
      return { component: VdSvgIcon, icon }
    }
    if (typeof icon !== 'string') {
      return { component: VdComponentIcon, icon }
    }

    const setName = Object.keys(icons.sets).find(s => (icon as string).startsWith(`${s}:`))
    const iconName = setName ? icon.slice(setName.length + 1) : icon
    const set = icons.sets[setName ?? icons.defaultSet] ?? { component: VdSvgIcon }
    return { component: set.component, icon: iconName }
  })
}
