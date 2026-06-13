import { computed, h, ref, withDirectives } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import { ClickOutside } from '../../directives/click-outside'
import { FField } from '../FField'
import { FChip } from '../FChip'
import { FIcon } from '../FIcon'

interface NormalizedItem {
  title: string
  value: unknown
}

export const makeFSelectProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    items: { type: Array as PropType<unknown[]>, default: () => [] },
    itemTitle: { type: String, default: 'title' },
    itemValue: { type: String, default: 'value' },
    label: String as PropType<string>,
    placeholder: String as PropType<string>,
    color: String as PropType<string>,
    multiple: Boolean,
    clearable: Boolean,
    hint: String as PropType<string>,
    persistentHint: Boolean,
    ...makeValidationProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSelect'
)

export const FSelect = genericComponent()({
  name: 'FSelect',
  props: makeFSelectProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', props.multiple ? [] : undefined)
    const { errorMessages, validate } = useValidation(props)
    const menuOpen = ref(false)

    const normalized = computed<NormalizedItem[]>(() =>
      props.items.map((item: unknown) =>
        item != null && typeof item === 'object'
          ? {
              title: String((item as Record<string, unknown>)[props.itemTitle]),
              value: (item as Record<string, unknown>)[props.itemValue],
            }
          : { title: String(item), value: item }
      )
    )

    const selectedValues = computed<unknown[]>(() =>
      props.multiple
        ? Array.isArray(model.value)
          ? model.value
          : []
        : model.value != null
          ? [model.value]
          : []
    )
    const isActive = computed(() => selectedValues.value.length > 0)

    function isSelected(opt: NormalizedItem): boolean {
      return selectedValues.value.includes(opt.value)
    }

    function selectItem(opt: NormalizedItem): void {
      if (props.multiple) {
        const next = [...selectedValues.value]
        const index = next.indexOf(opt.value)
        if (index > -1) next.splice(index, 1)
        else next.push(opt.value)
        model.value = next
      } else {
        model.value = opt.value
        menuOpen.value = false
      }
      if (props.validateOn !== 'submit') validate()
    }

    function titleFor(value: unknown): string {
      return normalized.value.find(o => o.value === value)?.title ?? String(value)
    }

    function close(): void {
      menuOpen.value = false
    }

    useRender(() =>
      withDirectives(
        h(
          'div',
          {
            class: ['fui-select', { 'fui-select--open': menuOpen.value }, props.class],
            style: props.style,
          },
          [
            h(
              FField,
              {
                label: props.label,
                color: props.color,
                appendIcon: '$dropdown',
                clearable: props.clearable,
                hint: props.hint,
                persistentHint: props.persistentHint,
                errorMessages: errorMessages.value,
                active: isActive.value,
                focused: menuOpen.value,
                disabled: props.disabled,
                theme: props.theme,
                onClick: () => {
                  if (!props.disabled) menuOpen.value = !menuOpen.value
                },
                'onClick:clear': () => {
                  model.value = props.multiple ? [] : undefined
                },
              },
              {
                default: () =>
                  h('div', { class: 'fui-select__selection' }, [
                    !isActive.value
                      ? h('span', { class: 'fui-select__placeholder' }, props.placeholder)
                      : props.multiple
                        ? selectedValues.value.map(v =>
                            h(
                              FChip,
                              {
                                key: String(v),
                                size: 'small',
                                color: props.color,
                                closable: true,
                                'onClick:close': () => selectItem({ title: '', value: v }),
                              },
                              () => titleFor(v)
                            )
                          )
                        : h('span', titleFor(model.value)),
                  ]),
              }
            ),
            menuOpen.value
              ? h(
                  'div',
                  { class: 'fui-select__menu' },
                  normalized.value.map(opt =>
                    h(
                      'div',
                      {
                        key: String(opt.value),
                        class: [
                          'fui-select__option',
                          { 'fui-select__option--selected': isSelected(opt) },
                        ],
                        onClick: () => selectItem(opt),
                      },
                      [
                        h('span', opt.title),
                        isSelected(opt)
                          ? h(FIcon, { icon: '$check', size: 'small', color: props.color })
                          : null,
                      ]
                    )
                  )
                )
              : null,
          ]
        ),
        [[ClickOutside, { handler: close }]]
      )
    )
  },
})
