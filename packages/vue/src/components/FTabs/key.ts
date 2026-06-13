import type { InjectionKey, Ref } from 'vue'

export interface TabsProvide {
  selected: Ref<unknown>
  color: Ref<string>
  select: (value: unknown) => void
  register: (value: unknown, el: HTMLElement) => void
  unregister: (value: unknown) => void
}

export const FTabsSymbol: InjectionKey<TabsProvide> = Symbol.for('fusionui:tabs')

export interface TabsWindowProvide {
  selected: Ref<unknown>
}

export const FTabsWindowSymbol: InjectionKey<TabsWindowProvide> = Symbol.for('fusionui:tabs-window')
