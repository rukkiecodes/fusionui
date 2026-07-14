import type { InjectionKey, Ref } from 'vue'
import type { GroupProvide } from '../../composables/group'

export type ExpansionPanelsVariant = 'default' | 'accordion' | 'inset' | 'popout'

export interface ExpansionPanelsProvide {
  variant: Ref<ExpansionPanelsVariant>
  /** Panels can be opened but not closed (and vice versa) — no toggling at all. */
  readonly: Ref<boolean>
  /** Disables every panel in the accordion. */
  disabled: Ref<boolean>
  /** Headers register so Home/End/Arrow keys can rove between them. */
  registerHeader: (id: number, el: HTMLElement) => void
  unregisterHeader: (id: number) => void
  onHeaderKeydown: (e: KeyboardEvent, id: number) => void
  /** `false` when closing would leave a `mandatory` accordion with nothing open. */
  canDeselect: (id: number) => boolean
}

/** Selection group shared by `FExpansionPanels` and its `FExpansionPanel` children. */
export const FExpansionPanelsSymbol: InjectionKey<GroupProvide> = Symbol.for(
  'fusionui:expansion-panels'
)

/** Presentation/behaviour context inherited by every panel. */
export const FExpansionPanelsContextSymbol: InjectionKey<ExpansionPanelsProvide> = Symbol.for(
  'fusionui:expansion-panels-context'
)
