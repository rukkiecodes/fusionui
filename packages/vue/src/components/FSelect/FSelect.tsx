import { computed, h, onBeforeUnmount, ref, watch, withDirectives } from 'vue'
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
  title?: string
  value?: unknown
  /** A non-selectable group header. */
  header?: string
}

export const makeFSelectProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    items: { type: Array as PropType<unknown[]>, default: () => [] },
    itemTitle: { type: String, default: 'title' },
    itemValue: { type: String, default: 'value' },
    label: String as PropType<string>,
    labelPlaceholder: Boolean,
    placeholder: String as PropType<string>,
    color: String as PropType<string>,
    // Manual state tint (success / danger / warning / primary).
    state: String as PropType<string>,
    multiple: Boolean,
    // Reduce the chips of a multiple select to two + a "+N" counter.
    collapseChips: Boolean,
    // Add a search box that filters the options.
    filter: Boolean,
    clearable: Boolean,
    loading: Boolean,
    square: Boolean,
    prependIcon: [String, Object, Function] as PropType<unknown>,
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
    const query = ref('')
    const rootRef = ref<HTMLElement>()

    // The menu is position:fixed so it escapes any clipping/overflow ancestor;
    // its coordinates come from the field's rect and re-measure on scroll/resize.
    const tick = ref(0)
    let raf = 0
    let listening = false
    function schedule() {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        tick.value++
      })
    }
    function setListeners(on: boolean) {
      if (typeof window === 'undefined' || on === listening) return
      const fn = on ? window.addEventListener : window.removeEventListener
      fn('scroll', schedule, true)
      fn('resize', schedule)
      listening = on
    }
    watch(menuOpen, open => setListeners(open))
    onBeforeUnmount(() => {
      setListeners(false)
      if (raf) cancelAnimationFrame(raf)
    })
    const menuStyle = computed(() => {
      void tick.value
      const el = rootRef.value
      if (!el) return undefined
      // Measure the field control (not the whole select, which includes the
      // hint) so the menu lines up flush with — and matches the width of — the
      // input box exactly.
      const control = (el.querySelector('.fui-field__control') as HTMLElement | null) ?? el
      const r = control.getBoundingClientRect()
      return {
        position: 'fixed',
        top: `${r.bottom + 4}px`,
        left: `${r.left}px`,
        width: `${r.width}px`,
      } as Record<string, string>
    })

    const normalized = computed<NormalizedItem[]>(() =>
      props.items.map((item: unknown) => {
        if (item != null && typeof item === 'object' && 'header' in item) {
          return { header: String((item as Record<string, unknown>).header) }
        }
        return item != null && typeof item === 'object'
          ? {
              title: String((item as Record<string, unknown>)[props.itemTitle]),
              value: (item as Record<string, unknown>)[props.itemValue],
            }
          : { title: String(item), value: item }
      })
    )

    // Apply the filter query, then drop group headers left with no visible item.
    const visibleItems = computed<NormalizedItem[]>(() => {
      const q = props.filter ? query.value.trim().toLowerCase() : ''
      const matched = normalized.value.filter(
        it => it.header !== undefined || !q || (it.title ?? '').toLowerCase().includes(q)
      )
      return matched.filter((it, i) => {
        if (it.header === undefined) return true
        for (let j = i + 1; j < matched.length; j++) {
          if (matched[j].header !== undefined) break
          return true
        }
        return false
      })
    })

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
    const collapsed = computed(
      () => props.multiple && props.collapseChips && selectedValues.value.length > 2
    )
    const chipValues = computed(() =>
      collapsed.value ? selectedValues.value.slice(0, 2) : selectedValues.value
    )

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

    // Reset the search query whenever the menu closes.
    watch(menuOpen, open => {
      if (!open) query.value = ''
    })

    function renderMenu() {
      const options = visibleItems.value
      const hasOptions = options.some(it => it.header === undefined)
      return h('div', { class: 'fui-select__menu', style: menuStyle.value }, [
        props.filter
          ? h('div', { class: 'fui-select__search' }, [
              h('input', {
                class: 'fui-select__search-input',
                value: query.value,
                placeholder: 'Search…',
                onInput: (e: Event) => (query.value = (e.target as HTMLInputElement).value),
                onClick: (e: Event) => e.stopPropagation(),
                onVnodeMounted: (vnode: any) => vnode.el?.focus(),
              }),
            ])
          : null,
        props.loading
          ? h('div', { class: 'fui-select__empty' }, 'Loading…')
          : !hasOptions
            ? h('div', { class: 'fui-select__empty' }, 'No options')
            : options.map((opt, i) =>
                opt.header !== undefined
                  ? h('div', { key: `h${i}`, class: 'fui-select__group-title' }, opt.header)
                  : h(
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
              ),
      ])
    }

    useRender(() =>
      withDirectives(
        h(
          'div',
          {
            ref: rootRef,
            class: ['fui-select', { 'fui-select--open': menuOpen.value }, props.class],
            style: props.style,
          },
          [
            h(
              FField,
              {
                label: props.label,
                labelPlaceholder: props.labelPlaceholder,
                color: props.color,
                state: props.state,
                appendIcon: '$dropdown',
                prependIcon: props.prependIcon,
                clearable: props.clearable,
                loading: props.loading,
                square: props.square,
                hint: props.hint,
                persistentHint: props.persistentHint,
                errorMessages: errorMessages.value,
                successMessages: props.successMessages,
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
                        ? [
                            ...chipValues.value.map(v =>
                              h(
                                FChip,
                                {
                                  key: String(v),
                                  size: 'small',
                                  color: props.color,
                                  closable: true,
                                  'onClick:close': () => selectItem({ value: v }),
                                },
                                () => titleFor(v)
                              )
                            ),
                            collapsed.value
                              ? h(
                                  FChip,
                                  { size: 'small', color: props.color },
                                  () => `+${selectedValues.value.length - 2}`
                                )
                              : null,
                          ]
                        : h('span', titleFor(model.value)),
                  ]),
              }
            ),
            menuOpen.value ? renderMenu() : null,
          ]
        ),
        [[ClickOutside, { handler: close }]]
      )
    )
  },
})
