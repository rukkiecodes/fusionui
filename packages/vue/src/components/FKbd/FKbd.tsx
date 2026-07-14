import { computed, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeBorderProps, useBorder } from '../../composables/border'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeSizeProps, useSize } from '../../composables/size'
import { surfaceColorTriplet } from '../FSheet/FSheet'

// Friendly labels for the keys people actually write in a shortcut string.
// Anything unknown passes through untouched (a single character is uppercased),
// so `keys="ctrl+⌘"` or `:keys="['Fn', 'F5']"` still render exactly as given.
const keyLabels: Record<string, string> = {
  cmd: 'Cmd',
  command: 'Cmd',
  meta: 'Cmd',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  option: 'Option',
  opt: 'Option',
  enter: 'Enter',
  return: 'Enter',
  esc: 'Esc',
  escape: 'Esc',
  tab: 'Tab',
  space: 'Space',
  backspace: 'Backspace',
  del: 'Del',
  delete: 'Del',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
}

function keyLabel(key: string): string {
  const known = keyLabels[key.toLowerCase()]
  if (known) return known
  return key.length === 1 ? key.toUpperCase() : key
}

export const makeFKbdProps = propsFactory(
  {
    // A shortcut: either a string in the usual `ctrl+k` notation or an array of
    // key names. Each key becomes its own cap.
    keys: [String, Array] as PropType<string | string[]>,
    // What is drawn between the caps of a shortcut.
    separator: { type: String as PropType<string>, default: '+' },
    // Convenience for a single cap (the default slot wins).
    text: String as PropType<string>,
    // Tint the caps with a theme color (primary, success…) or any CSS color.
    color: String as PropType<string>,
    ...makeSizeProps(),
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeTagProps({ tag: 'kbd' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FKbd'
)

/**
 * A keyboard key cap. Give it one key (`<f-kbd>Esc</f-kbd>`) or a whole shortcut
 * (`<f-kbd keys="ctrl+k" />`), which renders one cap per key with a separator.
 */
export const FKbd = genericComponent()({
  name: 'FKbd',
  props: makeFKbdProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { sizeClasses } = useSize(props)

    // A shortcut string is always split on `+` (the canonical notation) — the
    // `separator` prop only controls what gets *drawn* between the caps.
    const caps = computed<string[]>(() => {
      const raw = props.keys
      if (raw == null || raw === '') return []
      const list: unknown[] = Array.isArray(raw) ? raw : String(raw).split('+')
      return list
        .map(key => String(key).trim())
        .filter(Boolean)
        .map(keyLabel)
    })

    const colorStyles = computed(() => {
      const color = surfaceColorTriplet(props.color)
      return color ? { '--fui-kbd-color': color } : null
    })

    useRender(() => {
      const isGroup = caps.value.length > 0

      // The separator is real text, not `aria-hidden`, so a screen reader
      // announces "Ctrl + K" rather than "Ctrl K".
      const children: VNodeChild = isGroup
        ? caps.value.flatMap((key, i) => {
            const cap = h('kbd', { class: 'fui-kbd__key' }, key)
            return i === 0
              ? [cap]
              : [h('span', { class: 'fui-kbd__separator' }, props.separator), cap]
          })
        : slots.default
          ? slots.default()
          : props.text

      return h(
        props.tag,
        {
          class: [
            'fui-kbd',
            { 'fui-kbd--group': isGroup },
            ...sizeClasses.value,
            ...borderClasses.value,
            ...roundedClasses.value,
            ...elevationClasses.value,
            props.class,
          ],
          style: [colorStyles.value, props.style],
        },
        // Wrapped: `children` is a VNodeChild (possibly null), which is only a
        // valid `h()` argument as an array element.
        [children]
      )
    })
  },
})
