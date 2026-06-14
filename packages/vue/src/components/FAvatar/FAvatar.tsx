import { Fragment, computed, h, inject, onBeforeUnmount, provide, ref } from 'vue'
import type { InjectionKey, PropType, Ref, VNode } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { convertToUnit } from '../../util/helpers'
import { isLightColor, parseColor } from '../../util/colors'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

interface AvatarGroupContext {
  max: Ref<number>
  float: Ref<boolean>
  ids: Ref<symbol[]>
  /** Total avatar count, counted from the group's slot so it's correct on the
   *  first (and server) render — not lagged behind child registration. */
  total: Ref<number>
  register: (id: symbol) => void
  unregister: (id: symbol) => void
}

/** Shared between FAvatarGroup and the FAvatars it stacks. */
export const FAvatarGroupKey: InjectionKey<AvatarGroupContext> = Symbol.for('fusionui:avatar-group')

// Named sizes; any number/`'70'` falls through to convertToUnit. Default 44px
// matches Vuesax.
const sizeMap: Record<string, string> = {
  'x-small': '28px',
  small: '34px',
  default: '44px',
  large: '56px',
  'x-large': '72px',
}

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function colorTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

/** The contrasting "on" color for a fill — the theme's on-token for a named
 *  color, or black/white by luminance for a custom one (matches FAlert). */
function onColorTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return isLightColor(color) ? '0, 0, 0' : '255, 255, 255'
  }
  return `var(--fui-theme-on-${color})`
}

export const makeFAvatarProps = propsFactory(
  {
    /** Background fill — a theme color name (`primary`…) or any CSS color. */
    color: String as PropType<string>,
    /** Pixel size (number / `'70'`) or a named size (`x-small`…`x-large`). */
    size: { type: [String, Number] as PropType<string | number>, default: 'default' },
    /** A photo URL, shown cover-fit. */
    image: String as PropType<string>,
    /** A leading icon (when there's no image). */
    icon: [String, Object, Function] as PropType<IconValue>,
    /** Initials — shown when there's no image/icon. 1–5 chars show as-is; longer
     *  text reduces to one letter per word. */
    text: String as PropType<string>,
    /** Full circle (the default is a Vuesax rounded square). */
    circle: Boolean,
    /** Hard square corners. */
    square: Boolean,
    /** A status badge. */
    badge: Boolean,
    /** Badge color (defaults to primary). */
    badgeColor: String as PropType<string>,
    badgePosition: { type: String as PropType<BadgePosition>, default: 'bottom-right' },
    /** A colored "story" ring around the avatar. */
    history: Boolean,
    /** An Instagram-style gradient ring (implies a ring). */
    historyGradient: Boolean,
    /** A loading overlay with a spinner. */
    loading: Boolean,
    /** Animated typing dots in the badge ("is typing"). */
    writing: Boolean,
    /** Cursor pointer, for clickable avatars. */
    pointer: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FAvatar'
)

export const FAvatar = genericComponent()({
  name: 'FAvatar',
  props: makeFAvatarProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    // Optional group coordination (overlap / max / `+N`).
    const group = inject(FAvatarGroupKey, null)
    const id = Symbol('fui-avatar')
    if (group) {
      group.register(id)
      onBeforeUnmount(() => group.unregister(id))
    }
    const index = computed(() => (group ? group.ids.value.indexOf(id) : -1))
    const total = computed(() => (group ? group.total.value : 0))
    const max = computed(() => (group ? group.max.value : 0))
    const isHidden = computed(() => max.value > 0 && index.value > max.value - 1)
    const isLatest = computed(
      () => max.value > 0 && index.value === max.value - 1 && total.value > max.value
    )
    const overflow = computed(() => total.value - max.value)

    const dimension = computed(() => sizeMap[String(props.size)] ?? convertToUnit(props.size))
    const colorVar = computed(() => colorTriplet(props.color))
    const onVar = computed(() => onColorTriplet(props.color))
    const badgeVar = computed(() => colorTriplet(props.badgeColor) ?? 'var(--fui-theme-primary)')
    const badgeOnVar = computed(
      () => onColorTriplet(props.badgeColor) ?? 'var(--fui-theme-on-primary)'
    )

    // Initials: 1–5 chars as-is; longer text → one letter per word (Vuesax).
    const letters = computed(() => {
      const t = (props.text ?? '').trim()
      if (!t) return ''
      if (t.length > 5)
        return t
          .split(/\s+/)
          .map((w: string) => w[0] ?? '')
          .join('')
      return t
    })

    function content() {
      if (props.image) return h('img', { class: 'fui-avatar__image', src: props.image, alt: '' })
      if (props.icon) return h(FIcon, { icon: props.icon })
      if (letters.value) return letters.value
      return slots.default?.()
    }

    useRender(() => {
      const showBadge = !!slots.badge || props.badge || props.writing
      const ring = props.history || props.historyGradient

      return h(
        'div',
        {
          class: [
            'fui-avatar-content',
            {
              'fui-avatar-content--circle': props.circle,
              'fui-avatar-content--square': props.square,
              'fui-avatar-content--colored': !!colorVar.value,
              'fui-avatar-content--history': ring,
              'fui-avatar-content--history-gradient': props.historyGradient,
              'fui-avatar-content--pointer': props.pointer,
              'fui-avatar-content--has-icons': !!slots.icons,
              'fui-avatar-content--hidden': isHidden.value,
            },
            props.class,
          ],
          style: [
            { width: dimension.value, height: dimension.value },
            colorVar.value
              ? { '--fui-avatar-color': colorVar.value, '--fui-avatar-on': onVar.value }
              : null,
            { '--fui-avatar-badge': badgeVar.value, '--fui-avatar-badge-on': badgeOnVar.value },
            props.style,
          ],
        },
        [
          props.loading
            ? h('div', { class: 'fui-avatar__loading' }, [
                h('div', { class: 'fui-avatar__loading-spinner' }),
              ])
            : null,
          h(
            'div',
            {
              class: [
                'fui-avatar',
                letters.value.length > 2 ? `fui-avatar--letter-${letters.value.length}` : null,
              ],
            },
            [content()]
          ),
          showBadge
            ? h(
                'div',
                {
                  class: [
                    'fui-avatar__badge',
                    `fui-avatar__badge--${props.badgePosition}`,
                    {
                      'fui-avatar__badge--slot': !!slots.badge && !props.writing,
                      'fui-avatar__badge--writing': props.writing,
                    },
                  ],
                },
                props.writing
                  ? h('div', { class: 'fui-avatar__points' }, [
                      h('span', { class: 'fui-avatar__point' }),
                      h('span', { class: 'fui-avatar__point' }),
                      h('span', { class: 'fui-avatar__point' }),
                    ])
                  : slots.badge?.()
              )
            : null,
          isLatest.value ? h('div', { class: 'fui-avatar__latest' }, `+${overflow.value}`) : null,
          slots.icons ? h('div', { class: 'fui-avatar__icons' }, slots.icons()) : null,
        ]
      )
    })
  },
})

export const makeFAvatarGroupProps = propsFactory(
  {
    /** Show at most N avatars; the rest collapse into a `+N` indicator. */
    max: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** Wrap avatars with spacing instead of overlapping them. */
    float: Boolean,
    ...makeComponentProps(),
  },
  'FAvatarGroup'
)

/** Count the FAvatar children in a slot's vnodes (descending into v-for
 *  fragments), so the group knows its total before any child registers. */
function countAvatars(nodes?: VNode[] | null): number {
  let n = 0
  for (const node of nodes ?? []) {
    if (node == null || typeof node !== 'object') continue
    if (node.type === FAvatar) n++
    else if (node.type === Fragment && Array.isArray(node.children))
      n += countAvatars(node.children as VNode[])
  }
  return n
}

export const FAvatarGroup = genericComponent()({
  name: 'FAvatarGroup',
  props: makeFAvatarGroupProps(),
  setup(props: any, { slots }: any) {
    const ids = ref<symbol[]>([])
    // Total comes from counting the slot's avatar vnodes, which the group
    // evaluates before its children mount — so `+N` is right on the first (and
    // server) render rather than appearing a tick after registration.
    const total = computed(() => countAvatars(slots.default?.()))

    provide(FAvatarGroupKey, {
      max: computed(() => Number(props.max) || 0),
      float: computed(() => !!props.float),
      ids,
      total,
      register: (regId: symbol) => {
        ids.value.push(regId)
      },
      unregister: (regId: symbol) => {
        const i = ids.value.indexOf(regId)
        if (i !== -1) ids.value.splice(i, 1)
      },
    })

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-avatar__group', { 'fui-avatar__group--float': props.float }, props.class],
          style: props.style,
        },
        slots.default?.()
      )
    )
  },
})
