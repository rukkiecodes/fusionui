import { defineComponent, h } from 'vue'
import { FNotifyHost } from './notify/FNotifyHost'
import { FLoadingHost } from './loading/FLoadingHost'
import { FDialogHost } from './dialog/FDialogHost'

/** Renders the notify / loading / dialog hosts. Mounted once by createFusionUI. */
export const FServices = defineComponent({
  name: 'FServices',
  setup() {
    return () => [h(FNotifyHost), h(FLoadingHost), h(FDialogHost)]
  },
})
