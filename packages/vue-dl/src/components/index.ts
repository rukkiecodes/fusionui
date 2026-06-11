import type { Component } from 'vue'
import { VdIcon } from './VdIcon'

export * from './VdIcon'

/** Built-in components registered globally by createVueDL().install. */
export const components: Record<string, Component> = {
  VdIcon,
}
