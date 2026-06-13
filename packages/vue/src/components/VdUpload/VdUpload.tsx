import { computed, h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { VdBtn } from '../VdBtn'
import { VdIcon } from '../VdIcon'

export const makeVdUploadProps = propsFactory(
  {
    modelValue: { type: Array as PropType<File[]>, default: () => [] },
    accept: String as PropType<string>,
    multiple: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    text: { type: String, default: 'Drag files here or click to browse' },
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdUpload'
)

export const VdUpload = genericComponent()({
  name: 'VdUpload',
  props: makeVdUploadProps(),
  emits: { 'update:modelValue': (_v: File[]) => true },
  setup(props: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', [])
    const inputRef = ref<HTMLInputElement | null>(null)
    const dragging = ref(false)

    const files = computed<File[]>(() => (Array.isArray(model.value) ? model.value : []))

    function addFiles(list: FileList | null): void {
      if (!list) return
      const incoming = Array.from(list)
      model.value = props.multiple ? [...files.value, ...incoming] : incoming.slice(0, 1)
    }

    function removeAt(index: number): void {
      const next = [...files.value]
      next.splice(index, 1)
      model.value = next
    }

    function onDrop(e: DragEvent): void {
      e.preventDefault()
      dragging.value = false
      if (!props.disabled) addFiles(e.dataTransfer?.files ?? null)
    }

    useRender(() =>
      h('div', { class: ['vd-upload', props.class], style: props.style }, [
        h(
          'div',
          {
            class: [
              'vd-upload__zone',
              {
                'vd-upload__zone--dragging': dragging.value,
                'vd-upload__zone--disabled': props.disabled,
              },
            ],
            style: { '--vd-upload-color': `var(--vd-theme-${props.color})` },
            onClick: () => inputRef.value?.click(),
            onDragover: (e: DragEvent) => {
              e.preventDefault()
              dragging.value = true
            },
            onDragleave: () => {
              dragging.value = false
            },
            onDrop,
          },
          [
            h(VdIcon, { icon: '$upload', size: 'large', color: props.color }),
            h('span', { class: 'vd-upload__text' }, props.text),
            h('input', {
              ref: inputRef,
              class: 'vd-upload__input',
              type: 'file',
              accept: props.accept,
              multiple: props.multiple,
              disabled: props.disabled,
              onChange: (e: Event) => addFiles((e.target as HTMLInputElement).files),
            }),
          ]
        ),
        files.value.length
          ? h(
              'ul',
              { class: 'vd-upload__list' },
              files.value.map((file, index) =>
                h('li', { key: `${file.name}-${index}`, class: 'vd-upload__item' }, [
                  h('span', { class: 'vd-upload__name' }, file.name),
                  h(VdBtn, {
                    icon: '$close',
                    variant: 'text',
                    size: 'x-small',
                    color: 'danger',
                    onClick: () => removeAt(index),
                  }),
                ])
              )
            )
          : null,
      ])
    )
  },
})
