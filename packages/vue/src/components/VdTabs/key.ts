import type { InjectionKey, Ref } from 'vue'

export interface TabsProvide {
  selected: Ref<unknown>
  color: Ref<string>
  select: (value: unknown) => void
  register: (value: unknown, el: HTMLElement) => void
  unregister: (value: unknown) => void
}

export const VdTabsSymbol: InjectionKey<TabsProvide> = Symbol.for('vuedl:tabs')

export interface TabsWindowProvide {
  selected: Ref<unknown>
}

export const VdTabsWindowSymbol: InjectionKey<TabsWindowProvide> = Symbol.for('vuedl:tabs-window')
