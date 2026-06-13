import { Ripple } from './ripple'
import { ClickOutside } from './click-outside'
import { Intersect } from './intersect'
import type { ObjectDirective } from 'vue'

export { Ripple, ClickOutside, Intersect }

/** Directive registry consumed by `createVueDL().install`. Keys become `v-<key>`. */
export const directives: Record<string, ObjectDirective<any>> = {
  ripple: Ripple,
  'click-outside': ClickOutside,
  intersect: Intersect,
}
