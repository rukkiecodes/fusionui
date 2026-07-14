import type { InjectionKey } from 'vue'

// Shared types + the tree context. Kept in its own module so FTreeview and
// FTreeviewItem can both reach it without a circular import (the tree renders
// items, the items render nested items through the same context).

export type FTreeviewSelectStrategy = 'leaf' | 'independent' | 'classic'
export type FTreeviewOpenStrategy = 'multiple' | 'single'
export type FTreeviewSelectionState = 'on' | 'off' | 'indeterminate'

/** A normalized node — the internal shape every item is projected onto. */
export interface FTreeNode {
  /** Value used in the `opened` / `selected` / `activated` models. */
  id: unknown
  /** The original user item. */
  raw: any
  title: string
  disabled: boolean
  /** 1-based depth, mapped straight onto `aria-level`. */
  level: number
  /** Index path from the roots — the basis of stable, SSR-safe element ids. */
  path: number[]
  parent: FTreeNode | null
  /** `null` for a leaf; an array (possibly empty, i.e. lazy) for a branch. */
  children: FTreeNode[] | null
}

export interface FTreeviewContext {
  treeId: string
  slots: Record<string, ((...args: any[]) => any) | undefined>
  hasCheckbox: (node: FTreeNode) => boolean
  isOpen: (node: FTreeNode) => boolean
  isActive: (node: FTreeNode) => boolean
  isLoading: (node: FTreeNode) => boolean
  isDisabled: (node: FTreeNode) => boolean
  isTabbable: (node: FTreeNode) => boolean
  /** `'true'` / `'false'` on nodes that can be selected or activated, else absent. */
  ariaSelected: (node: FTreeNode) => string | undefined
  selectionState: (node: FTreeNode) => FTreeviewSelectionState
  visibleChildren: (node: FTreeNode) => FTreeNode[]
  toggleOpen: (node: FTreeNode) => void
  toggleSelect: (node: FTreeNode) => void
  onRowClick: (node: FTreeNode) => void
  onKeydown: (e: KeyboardEvent, node: FTreeNode) => void
  setFocused: (node: FTreeNode) => void
  registerEl: (id: unknown, el: HTMLElement | null) => void
}

export const FTreeviewSymbol: InjectionKey<FTreeviewContext> = Symbol.for('fusionui:treeview')

/** Reads `key` off an item — a property name or a getter function. */
export function getItemProperty(item: any, key: string | ((item: any) => any) | undefined): any {
  if (key == null || item == null) return undefined
  if (typeof key === 'function') return key(item)
  if (typeof item !== 'object') return undefined
  return item[key]
}
