import type { InjectionKey } from 'vue'
import type { GroupProvide } from '../../composables/group'

export const FChipGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:chip-group')
