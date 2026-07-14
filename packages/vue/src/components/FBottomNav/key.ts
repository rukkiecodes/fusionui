import type { InjectionKey } from 'vue'
import type { GroupProvide } from '../../composables/group'

export const FBottomNavSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:bottom-nav')
