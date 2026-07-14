import { Fragment, cloneVNode, h, isVNode, toRef } from 'vue'
import type { VNode, VNodeArrayChildren } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeVariantProps } from '../../composables/variant'
import { makeGroupProps, useGroup } from '../../composables/group'
import { provideDefaults } from '../../composables/defaults'
import { FBtnGroupSymbol } from '../FBtnGroup/key'

export const makeFBtnToggleProps = propsFactory(
  {
    divided: Boolean,
    ...makeVariantProps({ variant: 'tonal' }),
    ...makeGroupProps(),
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBtnToggle'
)

/**
 * A row of `FBtn`s that behaves as one control: exactly one pressed button by
 * default, any number of them with `multiple`. It provides the same group
 * context `FBtnGroup` does, so the children stay ordinary buttons — they only
 * need a `value`.
 */
export const FBtnToggle = genericComponent()({
  name: 'FBtnToggle',
  props: makeFBtnToggleProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    const group = useGroup(props, FBtnGroupSymbol)

    // Children stay plain <f-btn>s — the toggle's variant/color reach them
    // through the defaults system, so a button that sets its own still wins.
    provideDefaults({
      FBtn: {
        variant: toRef(() => props.variant),
        color: toRef(() => props.color),
      },
    })

    /**
     * `aria-pressed` has to live on the buttons themselves. FBtn registers with
     * the group in mount order and falls back to its index when it has no
     * `value`, so the same walk reproduces each button's value here and clones
     * the vnode with the matching pressed state.
     */
    function withPressedState(
      nodes: VNodeArrayChildren,
      cursor: { index: number }
    ): VNodeArrayChildren {
      return nodes.map(node => {
        if (Array.isArray(node)) return withPressedState(node, cursor)
        if (!isVNode(node)) return node

        const vnode = node as VNode
        if (vnode.type === Fragment) {
          const children = withPressedState((vnode.children as VNodeArrayChildren) ?? [], cursor)
          // `Fragment` is a valid `h()` type at runtime, but Vue's overloads don't
          // admit it — a v-for in the default slot arrives as one, so we must
          // rebuild it rather than skip it.
          return h(Fragment as unknown as string, { key: vnode.key ?? undefined }, children)
        }

        const name = (vnode.type as { name?: string })?.name
        if (name !== 'FBtn') return node

        const index = cursor.index++
        const value = vnode.props?.value ?? index
        return cloneVNode(vnode, {
          'aria-pressed': group.selected.value.includes(value),
        })
      })
    }

    useRender(() => {
      const children = slots.default?.({
        isSelected: group.isSelected,
        select: group.select,
        selected: group.selected.value,
      })

      return h(
        'div',
        {
          class: [
            'fui-btn-toggle',
            { 'fui-btn-toggle--divided': props.divided },
            ...roundedClasses.value,
            props.class,
          ],
          style: props.style,
          role: 'group',
        },
        withPressedState(children ?? [], { index: 0 })
      )
    })
  },
})
