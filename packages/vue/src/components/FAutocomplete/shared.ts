import { computed, h, nextTick, onBeforeUnmount, ref, watch, withDirectives } from 'vue'
import type { PropType, VNode } from 'vue'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps } from '../../composables/theme'
import { makeValidationProps, useValidation } from '../../composables/validation'
import { useProxiedModel } from '../../composables/proxiedModel'
import { ClickOutside } from '../../directives/click-outside'
import { FField } from '../FField'
import { FChip } from '../FChip'
import { FIcon } from '../FIcon'

/**
 * The engine shared by `FAutocomplete` and `FCombobox`. They are the same
 * component — a `FSelect` whose field is a text input that filters the menu —
 * except that a combobox may commit values that are not in `items`
 * (`allowCustom`). Everything else (filtering, the menu, the WAI-ARIA combobox
 * pattern, the keyboard map) lives here so the two stay in lockstep.
 */

export interface NormalizedItem {
  title?: string
  value?: unknown
  /** A non-selectable group header. */
  header?: string
  /** The original entry from `items` — handed to `customFilter`. */
  raw?: unknown
}

export type ComboboxFilter = (title: string, query: string, item: unknown) => boolean | number

/** Props both components share. Each wraps them in its own `propsFactory`. */
export const comboboxSharedProps = {
  modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
  items: { type: Array as PropType<unknown[]>, default: () => [] },
  itemTitle: { type: String, default: 'title' },
  itemValue: { type: String, default: 'value' },
  label: String as PropType<string>,
  labelPlaceholder: Boolean,
  placeholder: String as PropType<string>,
  color: String as PropType<string>,
  /** Manual state tint (success / danger / warning / primary). */
  state: String as PropType<string>,
  multiple: Boolean,
  /** Render the selection as chips instead of plain text. */
  chips: Boolean,
  /** Give every chip a close button. Implies `chips`. */
  closableChips: Boolean,
  /** Reduce the chips of a multiple selection to two + a "+N" counter. */
  collapseChips: Boolean,
  clearable: Boolean,
  loading: Boolean,
  square: Boolean,
  prependIcon: [String, Object, Function] as PropType<unknown>,
  hint: String as PropType<string>,
  persistentHint: Boolean,
  /** Replace the default "does the title contain the query" match. */
  customFilter: Function as PropType<ComboboxFilter>,
  /** Show every item, whatever is typed — filter server-side instead. */
  noFilter: Boolean,
  /** Highlight the first match so Enter commits it straight away. */
  autoSelectFirst: Boolean,
  /** Message shown when nothing matches. */
  noDataText: { type: String, default: 'No matching results' },
  ...makeValidationProps(),
  ...makeThemeProps(),
  ...makeComponentProps(),
}

// Stable per-instance ids for `aria-controls` / `aria-activedescendant`. A
// counter (not Math.random) keeps the SSR and client markup identical.
let comboboxUid = 0

export interface ComboboxOptions {
  /** Let the user commit free text that is not in `items` (FCombobox). */
  allowCustom?: boolean
  /** The component's `emit` — used for `update:search`. */
  emit?: (event: string, ...args: unknown[]) => void
}

export function useCombobox(props: any, config: ComboboxOptions = {}) {
  const allowCustom = !!config.allowCustom

  const model = useProxiedModel(props, 'modelValue', props.multiple ? [] : undefined)
  const { errorMessages, successMessages, validate } = useValidation(props)

  const uid = ++comboboxUid
  const menuId = `fui-combobox-${uid}-listbox`
  const optionId = (index: number) => `fui-combobox-${uid}-opt-${index}`

  const menuOpen = ref(false)
  const focused = ref(false)
  /** The text in the field. */
  const search = ref('')
  /** True once the user types — the menu only filters on typed text. */
  const dirty = ref(false)
  /** Index into `options` of the visually focused option (-1 = none). */
  const activeIndex = ref(-1)
  const rootRef = ref<HTMLElement>()
  const inputRef = ref<HTMLInputElement>()
  const menuRef = ref<HTMLElement>()

  // ---------------------------------------------------------------- menu rect
  // The menu is position:fixed so it escapes any clipping/overflow ancestor;
  // its coordinates come from the field's rect and re-measure on scroll/resize.
  const tick = ref(0)
  let raf = 0
  let listening = false
  function schedule(): void {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      tick.value++
    })
  }
  function setListeners(on: boolean): void {
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
    // Measure the field control (not the whole component, which includes the
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

  // ------------------------------------------------------------------- items
  const normalized = computed<NormalizedItem[]>(() =>
    props.items.map((item: unknown) => {
      if (item != null && typeof item === 'object' && 'header' in item) {
        return { header: String((item as Record<string, unknown>).header), raw: item }
      }
      return item != null && typeof item === 'object'
        ? {
            title: String((item as Record<string, unknown>)[props.itemTitle]),
            value: (item as Record<string, unknown>)[props.itemValue],
            raw: item,
          }
        : { title: String(item), value: item, raw: item }
    })
  )

  /** Drop group headers that the filter left with no item under them. */
  function pruneHeaders(list: NormalizedItem[]): NormalizedItem[] {
    return list.filter((it, i) => {
      if (it.header === undefined) return true
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].header !== undefined) break
        return true
      }
      return false
    })
  }

  const query = computed(() => (dirty.value ? search.value.trim() : ''))

  /** Everything the menu renders, headers included. */
  const visibleItems = computed<NormalizedItem[]>(() => {
    const q = query.value
    if (props.noFilter || !q) return normalized.value
    const lower = q.toLowerCase()
    const matched = normalized.value.filter(it => {
      if (it.header !== undefined) return true
      const title = it.title ?? ''
      if (props.customFilter) return !!props.customFilter(title, q, it.raw)
      return title.toLowerCase().includes(lower)
    })
    return pruneHeaders(matched)
  })

  /** The selectable rows only — `activeIndex` indexes into this. */
  const options = computed<NormalizedItem[]>(() =>
    visibleItems.value.filter(it => it.header === undefined)
  )

  const selectedValues = computed<unknown[]>(() =>
    props.multiple
      ? Array.isArray(model.value)
        ? model.value
        : []
      : model.value != null && model.value !== ''
        ? [model.value]
        : []
  )
  const hasSelection = computed(() => selectedValues.value.length > 0)
  const hasChips = computed(() => props.chips || props.closableChips)
  const collapsed = computed(
    () => props.multiple && props.collapseChips && selectedValues.value.length > 2
  )
  const chipValues = computed(() =>
    collapsed.value ? selectedValues.value.slice(0, 2) : selectedValues.value
  )
  const isActive = computed(() => focused.value || hasSelection.value || !!search.value)

  function titleFor(value: unknown): string {
    return (
      normalized.value.find(o => o.header === undefined && o.value === value)?.title ??
      String(value)
    )
  }
  function isSelected(opt: NormalizedItem): boolean {
    return selectedValues.value.includes(opt.value)
  }

  // Keep the active option in range, and honour `autoSelectFirst`.
  watch([options, dirty, menuOpen], () => {
    if (!menuOpen.value) {
      activeIndex.value = -1
      return
    }
    if (props.autoSelectFirst && dirty.value && options.value.length) {
      activeIndex.value = 0
      return
    }
    if (activeIndex.value >= options.value.length) activeIndex.value = options.value.length - 1
  })

  // Scroll the focused option into view (client-only — `menuRef` is never set
  // during SSR).
  watch(activeIndex, index => {
    if (index < 0) return
    nextTick(() => {
      const el = menuRef.value?.querySelector(`[data-index="${index}"]`) as HTMLElement | null
      el?.scrollIntoView?.({ block: 'nearest' })
    })
  })

  // -------------------------------------------------------------- selection
  function focusInput(): void {
    inputRef.value?.focus()
  }

  /** Put the field text back in sync with the committed value. */
  function syncSearch(): void {
    search.value = props.multiple ? '' : hasSelection.value ? titleFor(model.value) : ''
    dirty.value = false
  }

  function runValidation(): void {
    if (props.validateOn !== 'submit') validate()
  }

  function selectItem(opt: NormalizedItem): void {
    if (props.multiple) {
      const next = [...selectedValues.value]
      const index = next.indexOf(opt.value)
      if (index > -1) next.splice(index, 1)
      else next.push(opt.value)
      model.value = next
      search.value = ''
      dirty.value = false
    } else {
      model.value = opt.value
      search.value = opt.title ?? ''
      dirty.value = false
      menuOpen.value = false
    }
    runValidation()
    focusInput()
  }

  function removeValue(value: unknown): void {
    if (props.multiple) {
      model.value = selectedValues.value.filter(v => v !== value)
    } else {
      model.value = undefined
      search.value = ''
    }
    runValidation()
  }

  function clear(): void {
    model.value = props.multiple ? [] : undefined
    search.value = ''
    dirty.value = false
    runValidation()
  }

  /** An item whose title is exactly the text (case-insensitive fallback). */
  function matchItem(text: string): NormalizedItem | undefined {
    const items = normalized.value.filter(it => it.header === undefined)
    return (
      items.find(it => it.title === text) ??
      items.find(it => (it.title ?? '').toLowerCase() === text.toLowerCase())
    )
  }

  /** FCombobox only: commit whatever is typed, item or not. */
  function commitCustom(): boolean {
    const text = search.value.trim()
    if (!text) {
      // Emptying the field clears a single combobox.
      if (!props.multiple && hasSelection.value) {
        model.value = undefined
        runValidation()
      }
      dirty.value = false
      return false
    }

    const match = matchItem(text)
    if (match) {
      selectItem(match)
      return true
    }

    if (props.multiple) {
      if (!selectedValues.value.includes(text)) model.value = [...selectedValues.value, text]
      search.value = ''
    } else {
      model.value = text
      menuOpen.value = false
    }
    dirty.value = false
    runValidation()
    return true
  }

  // --------------------------------------------------------------- keyboard
  function open(): void {
    if (props.disabled || props.readonly) return
    menuOpen.value = true
  }
  function close(): void {
    menuOpen.value = false
  }

  function onInput(e: Event): void {
    search.value = (e.target as HTMLInputElement).value
    dirty.value = true
    activeIndex.value = -1
    open()
  }

  function onFocus(): void {
    focused.value = true
  }

  function onBlur(): void {
    focused.value = false
    menuOpen.value = false
    if (allowCustom) commitCustom()
    // Text that never became a value is reverted — an autocomplete's value is
    // always one of its items, and a combobox has just committed its own.
    syncSearch()
    if (props.validateOn === 'blur') validate()
  }

  function move(step: number): void {
    const count = options.value.length
    if (!count) return
    const from = activeIndex.value
    const next = from < 0 ? (step > 0 ? 0 : count - 1) : (from + step + count) % count
    activeIndex.value = next
  }

  function onKeydown(e: KeyboardEvent): void {
    if (props.disabled || props.readonly) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!menuOpen.value) open()
        else move(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!menuOpen.value) open()
        else move(-1)
        break
      case 'Home':
        if (menuOpen.value && options.value.length) {
          e.preventDefault()
          activeIndex.value = 0
        }
        break
      case 'End':
        if (menuOpen.value && options.value.length) {
          e.preventDefault()
          activeIndex.value = options.value.length - 1
        }
        break
      case 'Enter': {
        const opt = menuOpen.value ? options.value[activeIndex.value] : undefined
        if (opt) {
          e.preventDefault()
          selectItem(opt)
        } else if (allowCustom && search.value.trim()) {
          e.preventDefault()
          commitCustom()
        }
        break
      }
      case 'Escape':
        if (menuOpen.value) {
          e.preventDefault()
          e.stopPropagation()
          close()
        }
        break
      case 'Tab':
        close()
        break
      case 'Backspace':
        // Backspace on an empty multiple field removes the last selection.
        if (props.multiple && !search.value && hasSelection.value) {
          e.preventDefault()
          removeValue(selectedValues.value[selectedValues.value.length - 1])
        }
        break
    }
  }

  // A menu close (Escape, outside click, selection) always leaves the field
  // text consistent with the committed value.
  watch(menuOpen, isOpen => {
    if (!isOpen && !focused.value) syncSearch()
    if (!isOpen) dirty.value = false
  })

  // Reflect an externally changed value while the user isn't editing.
  watch(
    () => model.value,
    () => {
      if (!focused.value) syncSearch()
    },
    { immediate: true }
  )

  // `update:search` is what a server-side filter listens to (pair it with
  // `no-filter`, so the menu shows exactly what came back).
  watch(search, value => config.emit?.('update:search', value))

  return {
    allowCustom,
    model,
    menuId,
    optionId,
    menuOpen,
    focused,
    search,
    activeIndex,
    rootRef,
    inputRef,
    menuRef,
    menuStyle,
    visibleItems,
    options,
    selectedValues,
    hasSelection,
    hasChips,
    collapsed,
    chipValues,
    isActive,
    errorMessages,
    successMessages,
    titleFor,
    isSelected,
    selectItem,
    removeValue,
    clear,
    open,
    close,
    focusInput,
    onInput,
    onFocus,
    onBlur,
    onKeydown,
  }
}

export type ComboboxCore = ReturnType<typeof useCombobox>

/**
 * The shared markup. `block` is the BEM block of the calling component
 * (`fui-autocomplete` / `fui-combobox`) so each keeps its own namespace.
 */
export function renderCombobox(block: string, props: any, slots: any, c: ComboboxCore): VNode {
  const optionIndex = { current: -1 }

  function renderOption(opt: NormalizedItem): VNode {
    const index = ++optionIndex.current
    const selected = c.isSelected(opt)
    const active = c.activeIndex.value === index
    return h(
      'div',
      {
        key: `o${index}-${String(opt.value)}`,
        id: c.optionId(index),
        'data-index': index,
        role: 'option',
        'aria-selected': String(selected),
        class: [
          `${block}__option`,
          {
            [`${block}__option--selected`]: selected,
            [`${block}__option--active`]: active,
          },
        ],
        onClick: () => c.selectItem(opt),
        onMouseenter: () => {
          c.activeIndex.value = index
        },
      },
      [
        slots.item
          ? slots.item({ item: opt.raw, title: opt.title, value: opt.value, index, selected })
          : h('span', opt.title),
        selected ? h(FIcon, { icon: '$check', size: 'small', color: props.color }) : null,
      ]
    )
  }

  function renderMenu(): VNode {
    const empty = c.options.value.length === 0
    return h(
      'div',
      {
        ref: c.menuRef,
        id: c.menuId,
        role: 'listbox',
        'aria-multiselectable': props.multiple ? 'true' : undefined,
        'aria-label': props.label,
        class: `${block}__menu`,
        style: c.menuStyle.value,
        // Keep focus in the input while the menu is being clicked.
        onMousedown: (e: MouseEvent) => e.preventDefault(),
      },
      props.loading
        ? [h('div', { class: `${block}__empty` }, 'Loading…')]
        : empty
          ? [
              h(
                'div',
                { class: `${block}__empty` },
                slots['no-data'] ? slots['no-data']() : props.noDataText
              ),
            ]
          : c.visibleItems.value.map((opt, i) =>
              opt.header !== undefined
                ? h(
                    'div',
                    { key: `h${i}`, role: 'presentation', class: `${block}__group-title` },
                    opt.header
                  )
                : renderOption(opt)
            )
    )
  }

  function renderSelection(): VNode[] {
    const nodes: VNode[] = []

    if (c.hasChips.value && c.hasSelection.value) {
      for (const v of c.chipValues.value) {
        nodes.push(
          h(
            FChip,
            {
              key: String(v),
              size: 'small',
              color: props.color,
              closable: props.closableChips && !props.disabled && !props.readonly,
              onMousedown: (e: MouseEvent) => e.preventDefault(),
              'onClick:close': () => c.removeValue(v),
            },
            () => (slots.chip ? slots.chip({ value: v, title: c.titleFor(v) }) : c.titleFor(v))
          )
        )
      }
      if (c.collapsed.value) {
        nodes.push(
          h(
            FChip,
            { key: '__more', size: 'small', color: props.color },
            () => `+${c.selectedValues.value.length - 2}`
          )
        )
      }
    } else if (props.multiple && c.hasSelection.value && !c.search.value) {
      // No chips: the selection reads as plain text until the user types.
      nodes.push(
        h(
          'span',
          { class: `${block}__text` },
          c.selectedValues.value.map(v => c.titleFor(v)).join(', ')
        )
      )
    }

    return nodes
  }

  return withDirectives(
    h(
      'div',
      {
        ref: c.rootRef,
        class: [block, { [`${block}--open`]: c.menuOpen.value }, props.class],
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
            errorMessages: c.errorMessages.value,
            successMessages: c.successMessages.value,
            active: c.isActive.value,
            focused: c.focused.value || c.menuOpen.value,
            disabled: props.disabled,
            theme: props.theme,
            onClick: () => {
              if (props.disabled || props.readonly) return
              c.focusInput()
              c.open()
            },
            'onClick:clear': () => {
              c.clear()
              c.focusInput()
            },
          },
          {
            default: ({ id }: { id?: string }) =>
              h('div', { class: `${block}__selection` }, [
                ...renderSelection(),
                h('input', {
                  ref: c.inputRef,
                  id,
                  class: `${block}__input`,
                  type: 'text',
                  role: 'combobox',
                  autocomplete: 'off',
                  autocapitalize: 'none',
                  spellcheck: 'false',
                  'aria-autocomplete': 'list',
                  'aria-haspopup': 'listbox',
                  'aria-expanded': String(c.menuOpen.value),
                  'aria-controls': c.menuId,
                  'aria-activedescendant':
                    c.menuOpen.value && c.activeIndex.value >= 0
                      ? c.optionId(c.activeIndex.value)
                      : undefined,
                  'aria-invalid': c.errorMessages.value.length ? 'true' : undefined,
                  value: c.search.value,
                  placeholder:
                    props.labelPlaceholder || c.hasSelection.value ? undefined : props.placeholder,
                  disabled: props.disabled,
                  readonly: props.readonly,
                  onInput: c.onInput,
                  onFocus: c.onFocus,
                  onBlur: c.onBlur,
                  onKeydown: c.onKeydown,
                }),
              ]),
          }
        ),
        c.menuOpen.value ? renderMenu() : null,
      ]
    ),
    [[ClickOutside, { handler: c.close }]]
  )
}
