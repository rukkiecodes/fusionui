import type { InjectionKey } from 'vue'
import type { GroupProvide } from '../../composables/group'

export const FBtnGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('fusionui:btn-group')
