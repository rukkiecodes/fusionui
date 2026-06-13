import { defineComponent, h } from 'vue'
import { VdPopup } from '../../components/VdPopup'
import { VdBtn } from '../../components/VdBtn'
import { VdInput } from '../../components/VdInput'
import { dialogQueue, settleDialog } from './useDialog'
import type { DialogItem } from './useDialog'

export const VdDialogHost = defineComponent({
  name: 'VdDialogHost',
  setup() {
    function accept(item: DialogItem): void {
      if (item.type === 'confirm') settleDialog(item.id, true)
      else if (item.type === 'prompt') settleDialog(item.id, item.inputValue)
      else settleDialog(item.id, undefined)
    }
    function cancel(item: DialogItem): void {
      if (item.type === 'confirm') settleDialog(item.id, false)
      else if (item.type === 'prompt') settleDialog(item.id, null)
      else settleDialog(item.id, undefined)
    }

    return () =>
      dialogQueue.map(item =>
        h(
          VdPopup,
          {
            key: item.id,
            modelValue: true,
            title: item.title,
            persistent: true,
            closable: false,
            width: 420,
            'onUpdate:modelValue': (v: boolean) => {
              if (!v) cancel(item)
            },
          },
          {
            default: () => [
              item.text ? h('p', { class: 'vd-dialog__text' }, item.text) : null,
              item.type === 'prompt'
                ? h(VdInput, {
                    modelValue: item.inputValue,
                    placeholder: item.placeholder,
                    color: item.color,
                    'onUpdate:modelValue': (v: string) => {
                      item.inputValue = v
                    },
                  })
                : null,
            ],
            actions: () => [
              item.type !== 'alert'
                ? h(VdBtn, { variant: 'text', onClick: () => cancel(item) }, () => item.cancelText)
                : null,
              h(VdBtn, { color: item.color, onClick: () => accept(item) }, () => item.acceptText),
            ],
          }
        )
      )
  },
})
