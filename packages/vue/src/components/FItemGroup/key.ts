import type { InjectionKey } from 'vue'
import type { GroupProvide } from '../../composables/group'

export const FItemGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:item-group')
