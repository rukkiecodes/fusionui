import type { InjectionKey, Ref } from 'vue'
import type { GroupProvide } from '../../composables/group'

export interface SlideGroupProvide {
  direction: Ref<'horizontal' | 'vertical'>
  /** Items hand their root element over so the group can scroll/focus them. */
  registerEl: (id: number, el: HTMLElement) => void
  unregisterEl: (id: number) => void
  /** Keeps the focused item inside the viewport. */
  onItemFocus: (id: number) => void
  /** Arrow/Home/End roving focus across the strip. */
  onItemKeydown: (e: KeyboardEvent, id: number) => void
  /** `false` when unselecting would empty a `mandatory` group. */
  canDeselect: (id: number) => boolean
}

/** Selection group shared by `FSlideGroup` and its `FSlideGroupItem` children. */
export const FSlideGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:slide-group')

/** Scroll/focus context — kept apart from the generic group contract. */
export const FSlideGroupContextSymbol: InjectionKey<SlideGroupProvide> = Symbol.for(
  'fusionui:slide-group-context'
)
