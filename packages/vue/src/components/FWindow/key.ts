import type { InjectionKey, Ref } from 'vue'
import type { GroupProvide } from '../../composables/group'

export interface WindowProvide {
  /** Name of the Vue transition the active item should use. */
  transition: Ref<string>
  direction: Ref<'horizontal' | 'vertical'>
}

/** Selection group shared by `FWindow` and its `FWindowItem` children. */
export const FWindowSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:window')

/** Transition/direction context — separate from the group so items stay dumb. */
export const FWindowContextSymbol: InjectionKey<WindowProvide> =
  Symbol.for('fusionui:window-context')
