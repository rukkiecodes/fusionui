import type { InjectionKey } from 'vue'
import type { GroupProvide } from '../../composables/group'

export const VdBtnGroupSymbol: InjectionKey<GroupProvide> = Symbol.for('vuedl:btn-group')
