import { computed, h, provide, reactive, shallowRef, useId, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FTreeviewItem } from './FTreeviewItem'
import { FTreeviewSymbol, getItemProperty } from './shared'
import type {
  FTreeNode,
  FTreeviewOpenStrategy,
  FTreeviewSelectStrategy,
  FTreeviewSelectionState,
} from './shared'

export const makeFTreeviewProps = propsFactory(
  {
    items: { type: Array as PropType<any[]>, default: () => [] },
    itemTitle: {
      type: [String, Function] as PropType<string | ((item: any) => string)>,
      default: 'title',
    },
    itemValue: {
      type: [String, Function] as PropType<string | ((item: any) => unknown)>,
      default: 'value',
    },
    itemChildren: {
      type: [String, Function] as PropType<string | ((item: any) => any[] | undefined)>,
      default: 'children',
    },
    // Expansion
    opened: { type: Array as PropType<unknown[]>, default: undefined },
    openAll: Boolean,
    openStrategy: {
      type: String as PropType<FTreeviewOpenStrategy>,
      default: 'multiple',
    },
    // `undefined` resolves to "clicking a branch opens it" unless the tree is activatable.
    openOnClick: { type: Boolean, default: undefined },
    // Selection
    selectable: Boolean,
    selected: { type: Array as PropType<unknown[]>, default: undefined },
    selectStrategy: {
      type: String as PropType<FTreeviewSelectStrategy>,
      default: 'leaf',
    },
    // Activation
    activatable: Boolean,
    activated: { type: Array as PropType<unknown[]>, default: undefined },
    multipleActive: Boolean,
    // Filtering
    search: String as PropType<string>,
    customFilter: Function as PropType<(item: any, search: string) => boolean>,
    // Lazy branches
    loadChildren: Function as PropType<(item: any) => Promise<void>>,
    disabled: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    noDataText: { type: String as PropType<string>, default: 'No results found' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTreeview'
)

export const FTreeview = genericComponent()({
  name: 'FTreeview',
  props: makeFTreeviewProps(),
  emits: {
    'update:opened': (_v: unknown[]) => true,
    'update:selected': (_v: unknown[]) => true,
    'update:activated': (_v: unknown[]) => true,
    'click:open': (_v: { id: unknown; value: boolean; item: any }) => true,
    'click:select': (_v: { id: unknown; value: boolean; item: any }) => true,
    'click:activate': (_v: { id: unknown; value: boolean; item: any }) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const treeId = useId() ?? 'fui-treeview'

    // ---------------------------------------------------------------- normalize
    // The raw items are projected onto FTreeNodes once per items change: every
    // lookup below (open/select/activate/focus) then works on stable node ids.
    function normalize(
      items: any[],
      parent: FTreeNode | null,
      level: number,
      path: number[]
    ): FTreeNode[] {
      return items.map((raw, index) => {
        const title = String(getItemProperty(raw, props.itemTitle) ?? '')
        const rawValue = getItemProperty(raw, props.itemValue)
        const rawChildren = getItemProperty(raw, props.itemChildren)
        const nodePath = [...path, index]
        const node: FTreeNode = {
          id: rawValue !== undefined ? rawValue : title,
          raw,
          title,
          disabled: !!getItemProperty(raw, 'disabled'),
          level,
          path: nodePath,
          parent,
          children: null,
        }
        // An array — even an empty one — marks a branch, which is what makes a
        // not-yet-loaded (lazy) node expandable.
        if (Array.isArray(rawChildren)) {
          node.children = normalize(rawChildren, node, level + 1, nodePath)
        }
        return node
      })
    }

    const nodes = computed<FTreeNode[]>(() => normalize(props.items ?? [], null, 1, []))

    const branchIds = computed<unknown[]>(() => {
      const ids: unknown[] = []
      const visit = (list: FTreeNode[]): void => {
        for (const node of list) {
          if (!node.children) continue
          ids.push(node.id)
          visit(node.children)
        }
      }
      visit(nodes.value)
      return ids
    })

    // ---------------------------------------------------------------- expansion
    const opened = useProxiedModel(
      props,
      'opened',
      props.openAll ? branchIds.value : ([] as unknown[])
    )
    const openedSet = computed(() => new Set(opened.value ?? []))

    // `open-all` keeps up with branches that appear later (e.g. after a lazy load).
    watch(branchIds, ids => {
      if (props.openAll) opened.value = ids
    })

    const loadingIds = reactive(new Set<unknown>())

    async function loadChildren(node: FTreeNode): Promise<void> {
      if (!props.loadChildren || !node.children || node.children.length > 0) return
      if (loadingIds.has(node.id)) return
      loadingIds.add(node.id)
      try {
        await props.loadChildren(node.raw)
      } finally {
        loadingIds.delete(node.id)
      }
    }

    function collapseSubtree(node: FTreeNode, set: Set<unknown>): void {
      set.delete(node.id)
      for (const child of node.children ?? []) collapseSubtree(child, set)
    }

    function toggleOpen(node: FTreeNode): void {
      if (!node.children || isDisabled(node)) return
      const set = new Set(opened.value ?? [])
      const value = !set.has(node.id)
      if (value) {
        // `single` is the accordion strategy: opening a node closes its siblings.
        if (props.openStrategy === 'single') {
          const siblings = node.parent ? (node.parent.children ?? []) : nodes.value
          for (const sibling of siblings) {
            if (sibling.id !== node.id) collapseSubtree(sibling, set)
          }
        }
        set.add(node.id)
      } else {
        set.delete(node.id)
      }
      opened.value = Array.from(set)
      emit('click:open', { id: node.id, value, item: node.raw })
      if (value) void loadChildren(node)
    }

    /** `*` — expand every branch that sits alongside the focused node. */
    function expandSiblings(node: FTreeNode): void {
      const siblings = node.parent ? (node.parent.children ?? []) : nodes.value
      const set = new Set(opened.value ?? [])
      for (const sibling of siblings) {
        if (!sibling.children || isDisabled(sibling)) continue
        if (!set.has(sibling.id)) {
          set.add(sibling.id)
          emit('click:open', { id: sibling.id, value: true, item: sibling.raw })
          void loadChildren(sibling)
        }
      }
      opened.value = Array.from(set)
    }

    // ---------------------------------------------------------------- selection
    const selected = useProxiedModel(props, 'selected', [] as unknown[])

    /**
     * Every node's tri-state, computed in one pass. Under `classic` a branch is
     * derived from its descendants (all → on, none → off, otherwise
     * indeterminate) and only leaves are ever written to the model.
     */
    const selectionStates = computed(() => {
      const map = new Map<unknown, FTreeviewSelectionState>()
      const set = new Set(selected.value ?? [])
      const classic = props.selectStrategy === 'classic'

      const visit = (node: FTreeNode): FTreeviewSelectionState => {
        const isBranch = !!node.children && node.children.length > 0
        if (classic && isBranch) {
          let every = true
          let none = true
          for (const child of node.children!) {
            const childState = visit(child)
            if (childState !== 'on') every = false
            if (childState !== 'off') none = false
          }
          const state: FTreeviewSelectionState = every ? 'on' : none ? 'off' : 'indeterminate'
          map.set(node.id, state)
          return state
        }
        const state: FTreeviewSelectionState = set.has(node.id) ? 'on' : 'off'
        map.set(node.id, state)
        for (const child of node.children ?? []) visit(child)
        return state
      }

      for (const node of nodes.value) visit(node)
      return map
    })

    function selectionState(node: FTreeNode): FTreeviewSelectionState {
      return selectionStates.value.get(node.id) ?? 'off'
    }

    function leafDescendants(node: FTreeNode, acc: FTreeNode[] = []): FTreeNode[] {
      if (!node.children || node.children.length === 0) {
        acc.push(node)
        return acc
      }
      for (const child of node.children) leafDescendants(child, acc)
      return acc
    }

    /** `leaf` hides the checkbox on branches — only leaves take part in selection. */
    function hasCheckbox(node: FTreeNode): boolean {
      if (!props.selectable) return false
      return props.selectStrategy !== 'leaf' || node.children === null
    }

    function toggleSelect(node: FTreeNode): void {
      if (!hasCheckbox(node) || isDisabled(node)) return
      const set = new Set(selected.value ?? [])
      const value = selectionState(node) !== 'on'

      if (props.selectStrategy === 'classic') {
        // Cascade down: a branch writes its (enabled) leaf descendants.
        for (const leaf of leafDescendants(node)) {
          if (leaf.disabled) continue
          if (value) set.add(leaf.id)
          else set.delete(leaf.id)
        }
      } else if (value) {
        set.add(node.id)
      } else {
        set.delete(node.id)
      }

      selected.value = Array.from(set)
      emit('click:select', { id: node.id, value, item: node.raw })
    }

    // --------------------------------------------------------------- activation
    const activated = useProxiedModel(props, 'activated', [] as unknown[])

    function isActive(node: FTreeNode): boolean {
      return (activated.value ?? []).includes(node.id)
    }

    function activate(node: FTreeNode): void {
      if (!props.activatable || isDisabled(node)) return
      const set = new Set(activated.value ?? [])
      const value = !set.has(node.id)
      if (props.multipleActive) {
        if (value) set.add(node.id)
        else set.delete(node.id)
      } else {
        set.clear()
        if (value) set.add(node.id)
      }
      activated.value = Array.from(set)
      emit('click:activate', { id: node.id, value, item: node.raw })
    }

    // ---------------------------------------------------------------- filtering
    const searchQuery = computed(() =>
      String(props.search ?? '')
        .trim()
        .toLowerCase()
    )

    /**
     * `null` when not searching. Otherwise the ids that stay mounted: every match,
     * every ancestor of a match (so the path to it is never hidden) and every
     * descendant of a match (so an opened folder still shows its contents).
     */
    const visibleIds = computed<Set<unknown> | null>(() => {
      if (!searchQuery.value) return null
      const query = searchQuery.value
      const set = new Set<unknown>()

      const matches = (node: FTreeNode): boolean =>
        props.customFilter
          ? !!props.customFilter(node.raw, query)
          : node.title.toLowerCase().includes(query)

      const addSubtree = (node: FTreeNode): void => {
        set.add(node.id)
        for (const child of node.children ?? []) addSubtree(child)
      }

      const visit = (node: FTreeNode): boolean => {
        const self = matches(node)
        let branchMatched = false
        for (const child of node.children ?? []) {
          if (visit(child)) branchMatched = true
        }
        if (self) addSubtree(node)
        if (self || branchMatched) {
          set.add(node.id)
          return true
        }
        return false
      }

      for (const node of nodes.value) visit(node)
      return set
    })

    function visibleChildren(node: FTreeNode): FTreeNode[] {
      const children = node.children ?? []
      const visible = visibleIds.value
      return visible ? children.filter(child => visible.has(child.id)) : children
    }

    const visibleRoots = computed(() => {
      const visible = visibleIds.value
      return visible ? nodes.value.filter(node => visible.has(node.id)) : nodes.value
    })

    function isOpen(node: FTreeNode): boolean {
      if (!node.children) return false
      // While searching, every surviving branch is forced open so matches deeper
      // down are actually reachable.
      if (visibleIds.value) return visibleIds.value.has(node.id)
      return openedSet.value.has(node.id)
    }

    function isLoading(node: FTreeNode): boolean {
      return loadingIds.has(node.id)
    }

    function isDisabled(node: FTreeNode): boolean {
      return props.disabled || node.disabled
    }

    /** Selection is the primary state when the tree has checkboxes; activation otherwise. */
    function ariaSelected(node: FTreeNode): string | undefined {
      if (props.selectable) {
        return hasCheckbox(node) ? String(selectionState(node) === 'on') : undefined
      }
      if (props.activatable) return String(isActive(node))
      return undefined
    }

    // -------------------------------------------------------- focus / keyboard
    // Roving tabindex: exactly one node carries tabindex="0" — the last focused
    // one, or the first visible node before the tree has ever been entered.
    const els = new Map<unknown, HTMLElement>()
    const focusedId = shallowRef<unknown>(undefined)

    const flatVisible = computed<FTreeNode[]>(() => {
      const flat: FTreeNode[] = []
      const visit = (list: FTreeNode[]): void => {
        for (const node of list) {
          flat.push(node)
          if (isOpen(node)) visit(visibleChildren(node))
        }
      }
      visit(visibleRoots.value)
      return flat
    })

    const tabbableId = computed(() => {
      const list = flatVisible.value
      const focused = focusedId.value
      if (focused !== undefined && list.some(node => node.id === focused)) return focused
      return list[0]?.id
    })

    function isTabbable(node: FTreeNode): boolean {
      return node.id === tabbableId.value
    }

    function registerEl(id: unknown, el: HTMLElement | null): void {
      if (el) els.set(id, el)
      else els.delete(id)
    }

    function setFocused(node: FTreeNode): void {
      focusedId.value = node.id
    }

    function focusNode(node: FTreeNode | undefined): void {
      if (!node) return
      focusedId.value = node.id
      els.get(node.id)?.focus()
    }

    function move(node: FTreeNode, offset: number): void {
      const list = flatVisible.value
      const index = list.findIndex(candidate => candidate.id === node.id)
      if (index === -1) return
      focusNode(list[index + offset])
    }

    function onRowClick(node: FTreeNode): void {
      if (isDisabled(node)) return
      focusNode(node)
      // An activatable tree reserves the row click for activation — the chevron
      // still opens the branch — unless `open-on-click` is explicitly asked for.
      if (props.activatable) {
        activate(node)
        if (node.children && props.openOnClick === true) toggleOpen(node)
        return
      }
      const openOnClick = props.openOnClick ?? true
      if (node.children && openOnClick) toggleOpen(node)
      else if (hasCheckbox(node)) toggleSelect(node)
    }

    function onKeydown(e: KeyboardEvent, node: FTreeNode): void {
      const list = flatVisible.value
      let handled = true

      switch (e.key) {
        case 'ArrowDown':
          move(node, 1)
          break
        case 'ArrowUp':
          move(node, -1)
          break
        case 'ArrowRight':
          // Closed branch → open it. Open branch → step into its first child.
          if (node.children && !isOpen(node)) toggleOpen(node)
          else if (node.children && isOpen(node)) focusNode(visibleChildren(node)[0])
          else handled = false
          break
        case 'ArrowLeft':
          // Open branch → close it. Anything else → step out to the parent.
          if (node.children && isOpen(node)) toggleOpen(node)
          else if (node.parent) focusNode(node.parent)
          else handled = false
          break
        case 'Home':
          focusNode(list[0])
          break
        case 'End':
          focusNode(list[list.length - 1])
          break
        case 'Enter':
          if (props.activatable) activate(node)
          else if (node.children) toggleOpen(node)
          else if (hasCheckbox(node)) toggleSelect(node)
          break
        case ' ':
        case 'Spacebar':
          if (hasCheckbox(node)) toggleSelect(node)
          else if (props.activatable) activate(node)
          else if (node.children) toggleOpen(node)
          break
        case '*':
          expandSiblings(node)
          break
        default:
          handled = false
      }

      if (!handled) return
      e.preventDefault()
      // Nested treeitems are DOM ancestors of one another — without this the
      // parent node would handle the same key again.
      e.stopPropagation()
    }

    provide(FTreeviewSymbol, {
      treeId,
      slots,
      hasCheckbox,
      isOpen,
      isActive,
      isLoading,
      isDisabled,
      isTabbable,
      ariaSelected,
      selectionState,
      visibleChildren,
      toggleOpen,
      toggleSelect,
      onRowClick,
      onKeydown,
      setFocused,
      registerEl,
    })

    useRender(() => {
      const roots = visibleRoots.value
      return h(
        'div',
        {
          class: ['fui-treeview', { 'fui-treeview--disabled': props.disabled }, props.class],
          style: [{ '--fui-treeview-color': `var(--fui-theme-${props.color})` }, props.style],
          role: 'tree',
          'aria-multiselectable': props.selectable ? 'true' : undefined,
          'aria-disabled': props.disabled ? 'true' : undefined,
        },
        roots.length
          ? roots.map((node, index) =>
              h(FTreeviewItem, {
                key: String(node.path.join('-')),
                node,
                posinset: index + 1,
                setsize: roots.length,
              })
            )
          : [
              slots['no-data']
                ? slots['no-data']()
                : h('div', { class: 'fui-treeview__no-data' }, props.noDataText),
            ]
      )
    })
  },
})
