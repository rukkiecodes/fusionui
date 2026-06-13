import { defineComponent, h } from 'vue'
import { VdNotifyHost } from './notify/VdNotifyHost'
import { VdLoadingHost } from './loading/VdLoadingHost'
import { VdDialogHost } from './dialog/VdDialogHost'

/** Renders the notify / loading / dialog hosts. Mounted once by createVueDL. */
export const VdServices = defineComponent({
  name: 'VdServices',
  setup() {
    return () => [h(VdNotifyHost), h(VdLoadingHost), h(VdDialogHost)]
  },
})
