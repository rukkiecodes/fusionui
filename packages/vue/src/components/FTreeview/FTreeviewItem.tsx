import { h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { FIcon } from '../FIcon'
import { FProgressCircular } from '../FProgress'
import { FTreeviewSymbol } from './shared'
import type { FTreeNode } from './shared'

export const makeFTreeviewItemProps = propsFactory(
  {
    /** The normalized node FTreeview hands down — not meant to be built by hand. */
    node: { type: Object as PropType<FTreeNode>, required: true },
    /** 1-based index among its siblings (`aria-posinset`). */
    posinset: { type: Number, default: 1 },
    /** How many siblings it has (`aria-setsize`). */
    setsize: { type: Number, default: 1 },
    ...makeComponentProps(),
  },
  'FTreeviewItem'
)

/**
 * One `role="treeitem"` node. Rendered by FTreeview (and recursively by itself for
 * child branches) — it reads everything it needs from the tree context.
 */
export const FTreeviewItem = genericComponent()({
  name: 'FTreeviewItem',
  props: makeFTreeviewItemProps(),
  setup(props: any) {
    const tree = inject(FTreeviewSymbol)
    if (!tree) throw new Error('[FusionUI] FTreeviewItem must be used inside an FTreeview')

    function slotProps(node: FTreeNode) {
      return {
        item: node.raw,
        node,
        level: node.level,
        isOpen: tree!.isOpen(node),
        isSelected: tree!.selectionState(node) === 'on',
        isIndeterminate: tree!.selectionState(node) === 'indeterminate',
        isActive: tree!.isActive(node),
        isLoading: tree!.isLoading(node),
      }
    }

    /** Chevron / spinner / spacer — always the same width so titles stay aligned. */
    function renderToggle(node: FTreeNode) {
      if (tree!.isLoading(node)) {
        return h('span', { class: 'fui-treeview-item__toggle', 'aria-hidden': 'true' }, [
          h(FProgressCircular, { indeterminate: true, size: 16, width: 2 }),
        ])
      }
      if (!node.children) {
        return h('span', {
          class: 'fui-treeview-item__toggle fui-treeview-item__toggle--empty',
          'aria-hidden': 'true',
        })
      }
      return h(
        'span',
        {
          class: [
            'fui-treeview-item__toggle',
            { 'fui-treeview-item__toggle--open': tree!.isOpen(node) },
          ],
          // Expansion is announced by aria-expanded on the treeitem and driven by
          // Left/Right — the chevron is a mouse affordance only, never a tab stop.
          'aria-hidden': 'true',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            tree!.toggleOpen(node)
          },
        },
        [h(FIcon, { icon: '$next', size: 16 })]
      )
    }

    /**
     * A presentational checkbox: selection lives on the treeitem (`aria-selected`
     * / `aria-checked="mixed"`), so this must not be focusable or announced.
     */
    function renderCheckbox(node: FTreeNode) {
      const state = tree!.selectionState(node)
      return h(
        'span',
        {
          class: [
            'fui-treeview-item__checkbox',
            {
              'fui-treeview-item__checkbox--checked': state === 'on',
              'fui-treeview-item__checkbox--indeterminate': state === 'indeterminate',
            },
          ],
          'aria-hidden': 'true',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            tree!.toggleSelect(node)
          },
        },
        [
          h('svg', { viewBox: '0 0 24 24', class: 'fui-treeview-item__mark' }, [
            state === 'indeterminate'
              ? h('path', { d: 'M6 12h12' })
              : h('path', { d: 'M5 12l5 5L20 7' }),
          ]),
        ]
      )
    }

    useRender(() => {
      const node: FTreeNode = props.node
      const slots = tree.slots
      const state = tree.selectionState(node)
      const open = tree.isOpen(node)
      const disabled = tree.isDisabled(node)
      const selectable = tree.hasCheckbox(node)
      const titleId = `${tree.treeId}-${node.path.join('-')}`
      const children = open ? tree.visibleChildren(node) : []

      return h(
        'div',
        {
          class: [
            'fui-treeview-item',
            {
              'fui-treeview-item--active': tree.isActive(node),
              'fui-treeview-item--selected': state === 'on',
              'fui-treeview-item--disabled': disabled,
            },
            props.class,
          ],
          style: props.style,
          role: 'treeitem',
          'aria-level': node.level,
          'aria-posinset': props.posinset,
          'aria-setsize': props.setsize,
          // Only branches carry aria-expanded — a leaf that reports it reads as a
          // collapsed folder to a screen reader.
          'aria-expanded': node.children ? String(open) : undefined,
          'aria-selected': tree.ariaSelected(node),
          // The only way to voice a classic branch that is partly selected.
          'aria-checked': state === 'indeterminate' ? 'mixed' : undefined,
          'aria-disabled': disabled ? 'true' : undefined,
          'aria-busy': tree.isLoading(node) ? 'true' : undefined,
          // The group is a DOM child of the treeitem, so name the node from its
          // own title rather than letting the whole subtree be read out.
          'aria-labelledby': titleId,
          tabindex: tree.isTabbable(node) ? 0 : -1,
          ref: (el: any) => tree.registerEl(node.id, (el as HTMLElement) ?? null),
          onFocus: () => tree.setFocused(node),
          onKeydown: (e: KeyboardEvent) => tree.onKeydown(e, node),
        },
        [
          h(
            'div',
            {
              class: 'fui-treeview-item__row',
              style: { '--fui-treeview-level': node.level - 1 },
              onClick: () => tree.onRowClick(node),
            },
            [
              renderToggle(node),
              selectable ? renderCheckbox(node) : null,
              slots.prepend
                ? h('span', { class: 'fui-treeview-item__prepend' }, slots.prepend(slotProps(node)))
                : null,
              h(
                'span',
                { class: 'fui-treeview-item__title', id: titleId },
                slots.title ? slots.title(slotProps(node)) : node.title
              ),
              slots.append
                ? h('span', { class: 'fui-treeview-item__append' }, slots.append(slotProps(node)))
                : null,
            ]
          ),
          node.children && open
            ? h(
                'div',
                { class: 'fui-treeview-item__children', role: 'group' },
                children.map((child, index) =>
                  h(FTreeviewItem, {
                    key: String(child.path.join('-')),
                    node: child,
                    posinset: index + 1,
                    setsize: children.length,
                  })
                )
              )
            : null,
        ]
      )
    })
  },
})
