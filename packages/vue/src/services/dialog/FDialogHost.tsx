import { defineComponent, h } from 'vue'
import { FPopup } from '../../components/FPopup'
import { FBtn } from '../../components/FBtn'
import { FInput } from '../../components/FInput'
import { dialogQueue, settleDialog } from './useDialog'
import type { DialogItem } from './useDialog'

export const FDialogHost = defineComponent({
  name: 'FDialogHost',
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
          FPopup,
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
              item.text ? h('p', { class: 'fui-dialog__text' }, item.text) : null,
              item.type === 'prompt'
                ? h(FInput, {
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
                ? h(FBtn, { variant: 'text', onClick: () => cancel(item) }, () => item.cancelText)
                : null,
              h(FBtn, { color: item.color, onClick: () => accept(item) }, () => item.acceptText),
            ],
          }
        )
      )
  },
})
