import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FIcon } from '../FIcon'
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  endOfWeek,
  formatDate,
  formatLongDate,
  getMonthGrid,
  getMonthNames,
  getWeekNumber,
  getWeekdayNames,
  isDateAllowed,
  isMonthAllowed,
  isSameDay,
  isSameMonth,
  isWithin,
  isYearAllowed,
  parseDate,
  sortRange,
  startOfDay,
  startOfWeek,
  toISO,
} from './date'
import type { AllowedDates, DateLike } from './date'

export type FDatePickerView = 'month' | 'months' | 'year'

/** How many years either side of the current one the year view offers when no
 *  `min`/`max` narrows it down. */
const YEAR_SPAN = 50

function wrap(value: unknown): unknown[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export const makeFDatePickerProps = propsFactory(
  {
    /** `Date` (default), `Date[]` with `multiple`, or `[start, end]` with `range`. */
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    multiple: Boolean,
    range: Boolean,
    min: [String, Number, Date] as PropType<DateLike>,
    max: [String, Number, Date] as PropType<DateLike>,
    /** A list of selectable dates, or a predicate run against every day. */
    allowedDates: [Array, Function] as PropType<AllowedDates>,
    showAdjacentMonths: Boolean,
    /** Prefix each row with its ISO-8601 week number. */
    showWeek: Boolean,
    /** 0 = Sunday … 6 = Saturday. */
    firstDayOfWeek: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** Which panel is showing: the day grid, the month picker or the year picker. */
    view: { type: String as PropType<FDatePickerView>, default: 'month' },
    /** Controlled display month (0–11) — pairs with `update:month`. */
    month: [Number, String] as PropType<number | string>,
    /** Controlled display year — pairs with `update:year`. */
    year: [Number, String] as PropType<number | string>,
    color: { type: String as PropType<string>, default: 'primary' },
    /** BCP-47 tag used for month/weekday names. Fixed by default so SSR and the
     *  client always render identical markup. */
    locale: { type: String as PropType<string>, default: 'en-US' },
    /** Token pattern used by the header summary — see `formatDate`. */
    headerFormat: { type: String as PropType<string>, default: 'ddd, MMM D' },
    title: { type: String as PropType<string>, default: 'Select date' },
    header: { type: String as PropType<string>, default: 'Enter date' },
    hideHeader: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FDatePicker'
)

/**
 * The calendar panel. The day grid implements the WAI-ARIA date-picker grid
 * pattern: `role="grid"`, one tabbable cell (roving tabindex), arrow-key
 * navigation across month boundaries, and a polite live region that announces
 * the period whenever it changes.
 */
export const FDatePicker = genericComponent()({
  name: 'FDatePicker',
  props: makeFDatePickerProps(),
  emits: {
    'update:modelValue': (_v: unknown) => true,
    'update:view': (_v: FDatePickerView) => true,
    'update:month': (_v: number) => true,
    'update:year': (_v: number) => true,
    'click:date': (_v: Date) => true,
    escape: () => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    const uid = getUid()
    const periodId = `fui-date-picker-period-${uid}`

    // "Today" is read inside setup — never at module scope — so the module is
    // side-effect free and safe to import during SSR.
    const today = ref(startOfDay(new Date()))

    const gridRef = ref<HTMLElement>()
    const yearsRef = ref<HTMLElement>()
    /** Announced by the live region; empty on first render so nothing is read
     *  out just because the picker mounted. */
    const announcement = ref('')

    const model = useProxiedModel(
      props,
      'modelValue',
      undefined,
      (v: unknown) =>
        wrap(v)
          .map(d => parseDate(d as DateLike))
          .filter(Boolean) as Date[],
      (v: Date[]) => (props.multiple || props.range ? v : (v[0] ?? null))
    )

    const view = useProxiedModel(props, 'view', 'month')

    const firstDay = computed(() => Number(props.firstDayOfWeek) || 0)
    const minDate = computed(() => parseDate(props.min))
    const maxDate = computed(() => parseDate(props.max))
    const constraints = computed(() => ({
      min: minDate.value,
      max: maxDate.value,
      allowed: props.allowedDates,
    }))

    /** The date the panel orients itself around when nothing is selected. */
    const anchor = computed(() => {
      const selected = model.value[0]
      if (selected) return selected
      return clampDate(today.value, minDate.value, maxDate.value)
    })

    const _month = useProxiedModel(props, 'month', undefined)
    const _year = useProxiedModel(props, 'year', undefined)
    const displayMonth = computed<number>({
      get: () => (_month.value == null ? anchor.value.getMonth() : Number(_month.value)),
      set: v => {
        _month.value = v
      },
    })
    const displayYear = computed<number>({
      get: () => (_year.value == null ? anchor.value.getFullYear() : Number(_year.value)),
      set: v => {
        _year.value = v
      },
    })

    const displayDate = computed(() => new Date(displayYear.value, displayMonth.value, 1))

    /** The cell that owns tabindex="0" — the roving focus. */
    const focused = ref<Date>(startOfDay(anchor.value))
    /** Hovered/keyboard-previewed end of an in-progress range. */
    const preview = ref<Date | null>(null)

    const weekdays = computed(() => ({
      short: getWeekdayNames(props.locale, 'short', firstDay.value),
      long: getWeekdayNames(props.locale, 'long', firstDay.value),
    }))
    const months = computed(() => getMonthNames(props.locale, 'short'))
    const weeks = computed(() =>
      getMonthGrid(displayYear.value, displayMonth.value, firstDay.value)
    )

    const monthLabel = computed(() => getMonthNames(props.locale, 'long')[displayMonth.value])
    const periodLabel = computed(() => `${monthLabel.value} ${displayYear.value}`)

    const years = computed(() => {
      const from = minDate.value ? minDate.value.getFullYear() : displayYear.value - YEAR_SPAN
      const to = maxDate.value ? maxDate.value.getFullYear() : displayYear.value + YEAR_SPAN
      const list: number[] = []
      for (let y = from; y <= to; y++) list.push(y)
      return list
    })

    // ---- selection ------------------------------------------------------

    const rangeStart = computed(() => (props.range ? (model.value[0] ?? null) : null))
    const rangeEnd = computed(() => (props.range ? (model.value[1] ?? null) : null))
    /** While a range is half-open, the hovered/focused day previews the other end. */
    const previewEnd = computed(() =>
      props.range && rangeStart.value && !rangeEnd.value ? preview.value : null
    )

    function isSelected(date: Date): boolean {
      if (props.range) {
        return isSameDay(date, rangeStart.value) || isSameDay(date, rangeEnd.value)
      }
      return model.value.some((d: Date) => isSameDay(d, date))
    }

    function isInRange(date: Date): boolean {
      if (!props.range) return false
      if (rangeStart.value && rangeEnd.value) {
        return isWithin(date, rangeStart.value, rangeEnd.value)
      }
      if (rangeStart.value && previewEnd.value) {
        return isWithin(date, rangeStart.value, previewEnd.value)
      }
      return false
    }

    const interactive = computed(() => !props.disabled && !props.readonly)

    function select(date: Date): void {
      if (!interactive.value || !isDateAllowed(date, constraints.value)) return
      const day = startOfDay(date)

      if (props.range) {
        const current = model.value
        if (current.length !== 1) {
          model.value = [day]
          preview.value = null
        } else {
          model.value = sortRange(current[0], day)
          preview.value = null
        }
      } else if (props.multiple) {
        const current = model.value.slice()
        const index = current.findIndex((d: Date) => isSameDay(d, day))
        if (index > -1) current.splice(index, 1)
        else current.push(day)
        current.sort((a: Date, b: Date) => a.getTime() - b.getTime())
        model.value = current
      } else {
        model.value = [day]
      }

      emit('click:date', day)
    }

    // ---- navigation & roving focus ---------------------------------------

    function announce(text: string): void {
      announcement.value = text
    }

    function goToDate(date: Date, { focusCell = false } = {}): void {
      const target = startOfDay(clampDate(date, minDate.value, maxDate.value))
      const changed = !isSameMonth(target, displayDate.value)
      focused.value = target
      if (changed) {
        displayMonth.value = target.getMonth()
        displayYear.value = target.getFullYear()
        announce(
          `${getMonthNames(props.locale, 'long')[target.getMonth()]} ${target.getFullYear()}`
        )
      }
      if (props.range && model.value.length === 1) preview.value = target
      if (focusCell) {
        nextTick(() => {
          const el = gridRef.value?.querySelector<HTMLElement>(`[data-date="${toISO(target)}"]`)
          el?.focus()
        })
      }
    }

    function shiftMonth(amount: number): void {
      const next = addMonths(displayDate.value, amount)
      displayMonth.value = next.getMonth()
      displayYear.value = next.getFullYear()
      // Keep the roving focus inside the visible month.
      const day = Math.min(
        focused.value.getDate(),
        new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
      )
      focused.value = startOfDay(new Date(next.getFullYear(), next.getMonth(), day))
      announce(`${getMonthNames(props.locale, 'long')[next.getMonth()]} ${next.getFullYear()}`)
    }

    const canGoPrev = computed(() => {
      const min = minDate.value
      if (!min) return true
      return !isSameMonth(displayDate.value, min) && displayDate.value.getTime() > min.getTime()
    })
    const canGoNext = computed(() => {
      const max = maxDate.value
      if (!max) return true
      const lastOfView = new Date(displayYear.value, displayMonth.value + 1, 0)
      return lastOfView.getTime() < max.getTime()
    })

    function onGridKeydown(e: KeyboardEvent): void {
      const current = focused.value
      let next: Date | null = null

      switch (e.key) {
        case 'ArrowLeft':
          next = addDays(current, -1)
          break
        case 'ArrowRight':
          next = addDays(current, 1)
          break
        case 'ArrowUp':
          next = addDays(current, -7)
          break
        case 'ArrowDown':
          next = addDays(current, 7)
          break
        case 'PageUp':
          next = e.shiftKey ? addYears(current, -1) : addMonths(current, -1)
          break
        case 'PageDown':
          next = e.shiftKey ? addYears(current, 1) : addMonths(current, 1)
          break
        case 'Home':
          next = startOfWeek(current, firstDay.value)
          break
        case 'End':
          next = endOfWeek(current, firstDay.value)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          select(current)
          return
        case 'Escape':
          emit('escape')
          return
        default:
          return
      }

      e.preventDefault()
      goToDate(next, { focusCell: true })
    }

    function focusGrid(): void {
      const el = gridRef.value?.querySelector<HTMLElement>(`[data-date="${toISO(focused.value)}"]`)
      el?.focus()
    }

    // Follow the selection when it lands outside the visible month (e.g. typed
    // into FDateInput), so the panel always shows what is selected.
    watch(
      () => model.value.map((d: Date) => d.getTime()).join(),
      () => {
        const last = model.value[model.value.length - 1]
        if (!last) return
        focused.value = startOfDay(last)
        if (!isSameMonth(last, displayDate.value)) {
          displayMonth.value = last.getMonth()
          displayYear.value = last.getFullYear()
        }
      }
    )

    // Scroll the active year into view when the year panel opens.
    watch(view, v => {
      if (v !== 'year') return
      nextTick(() => {
        const el = yearsRef.value?.querySelector<HTMLElement>('[data-active="true"]')
        el?.scrollIntoView({ block: 'center' })
      })
    })

    onMounted(() => {
      focused.value = startOfDay(anchor.value)
    })

    // ---- render ----------------------------------------------------------

    const accent = computed(() =>
      props.color && !props.color.startsWith('#') && !props.color.startsWith('rgb')
        ? `var(--fui-theme-${props.color})`
        : undefined
    )
    const onAccent = computed(() =>
      props.color && !props.color.startsWith('#') && !props.color.startsWith('rgb')
        ? `var(--fui-theme-on-${props.color})`
        : undefined
    )

    const headerText = computed(() => {
      const value = model.value
      if (!value.length) return props.header
      if (props.range) {
        const [start, end] = value
        const from = formatDate(start, props.headerFormat, props.locale)
        if (!end) return `${from} –`
        return `${from} – ${formatDate(end, props.headerFormat, props.locale)}`
      }
      if (props.multiple) {
        if (value.length === 1) return formatDate(value[0], props.headerFormat, props.locale)
        return `${value.length} dates selected`
      }
      return formatDate(value[0], props.headerFormat, props.locale)
    })

    function renderControls() {
      return h('div', { class: 'fui-date-picker__controls' }, [
        h(
          'button',
          {
            type: 'button',
            class: 'fui-date-picker__nav',
            'aria-label': 'Previous month',
            disabled: props.disabled || !canGoPrev.value || view.value !== 'month',
            onClick: () => shiftMonth(-1),
          },
          [h(FIcon, { icon: '$prev', size: '1.1em' })]
        ),
        h('div', { class: 'fui-date-picker__period' }, [
          h(
            'button',
            {
              type: 'button',
              id: periodId,
              class: [
                'fui-date-picker__period-btn',
                { 'fui-date-picker__period-btn--active': view.value === 'months' },
              ],
              'aria-pressed': view.value === 'months',
              'aria-label': `${monthLabel.value}, choose a month`,
              disabled: props.disabled,
              onClick: () => {
                view.value = view.value === 'months' ? 'month' : 'months'
                if (view.value === 'months') announce(String(displayYear.value))
              },
            },
            [h('span', monthLabel.value), h(FIcon, { icon: '$dropdown', size: '0.95em' })]
          ),
          h(
            'button',
            {
              type: 'button',
              class: [
                'fui-date-picker__period-btn',
                { 'fui-date-picker__period-btn--active': view.value === 'year' },
              ],
              'aria-pressed': view.value === 'year',
              'aria-label': `${displayYear.value}, choose a year`,
              disabled: props.disabled,
              onClick: () => {
                view.value = view.value === 'year' ? 'month' : 'year'
                if (view.value === 'year') announce('Choose a year')
              },
            },
            [h('span', String(displayYear.value)), h(FIcon, { icon: '$dropdown', size: '0.95em' })]
          ),
        ]),
        h(
          'button',
          {
            type: 'button',
            class: 'fui-date-picker__nav',
            'aria-label': 'Next month',
            disabled: props.disabled || !canGoNext.value || view.value !== 'month',
            onClick: () => shiftMonth(1),
          },
          [h(FIcon, { icon: '$next', size: '1.1em' })]
        ),
      ])
    }

    function renderDay(date: Date) {
      const adjacent = !isSameMonth(date, displayDate.value)
      const iso = toISO(date)

      if (adjacent && !props.showAdjacentMonths) {
        // The cell still exists so the grid keeps its shape for screen readers.
        return h('div', {
          key: iso,
          class: 'fui-date-picker__cell fui-date-picker__cell--blank',
          role: 'gridcell',
        })
      }

      const selected = isSelected(date)
      const allowed = isDateAllowed(date, constraints.value)
      const disabled = props.disabled || !allowed
      const inRange = isInRange(date)
      const isToday = isSameDay(date, today.value)
      const tabbable = isSameDay(date, focused.value)

      const slotProps = { date, iso, selected, disabled, today: isToday, adjacent }

      return h(
        'div',
        {
          key: iso,
          class: [
            'fui-date-picker__cell',
            {
              'fui-date-picker__cell--in-range': inRange,
              'fui-date-picker__cell--range-start':
                props.range && isSameDay(date, rangeStart.value),
              'fui-date-picker__cell--range-end':
                props.range &&
                (isSameDay(date, rangeEnd.value) ||
                  (!rangeEnd.value && isSameDay(date, previewEnd.value))),
            },
          ],
          role: 'gridcell',
          'aria-selected': selected ? 'true' : 'false',
        },
        [
          h(
            'button',
            {
              type: 'button',
              class: [
                'fui-date-picker__day',
                {
                  'fui-date-picker__day--selected': selected,
                  'fui-date-picker__day--today': isToday,
                  'fui-date-picker__day--adjacent': adjacent,
                  'fui-date-picker__day--disabled': disabled,
                },
              ],
              'data-date': iso,
              // Disabled days stay focusable (aria-disabled, not [disabled]) so
              // arrow-key navigation can move across them — per the ARIA pattern.
              'aria-disabled': disabled ? 'true' : undefined,
              'aria-current': isToday ? 'date' : undefined,
              'aria-label': formatLongDate(date, props.locale),
              tabindex: tabbable ? 0 : -1,
              onClick: () => {
                if (adjacent) goToDate(date)
                select(date)
              },
              onFocus: () => {
                focused.value = startOfDay(date)
                if (props.range && model.value.length === 1) preview.value = startOfDay(date)
              },
              onMouseenter: () => {
                if (props.range && model.value.length === 1) preview.value = startOfDay(date)
              },
            },
            slots.day ? slots.day(slotProps) : [h('span', String(date.getDate()))]
          ),
        ]
      )
    }

    function renderMonthView() {
      return h(
        'div',
        {
          ref: gridRef,
          class: 'fui-date-picker__grid',
          role: 'grid',
          'aria-labelledby': periodId,
          'aria-multiselectable': props.multiple || props.range ? 'true' : undefined,
          onKeydown: onGridKeydown,
          onMouseleave: () => {
            if (props.range && model.value.length === 1) preview.value = null
          },
        },
        [
          h('div', { class: 'fui-date-picker__row fui-date-picker__row--head', role: 'row' }, [
            props.showWeek
              ? h(
                  'div',
                  {
                    class: 'fui-date-picker__weekday fui-date-picker__weekday--week',
                    role: 'columnheader',
                    'aria-label': 'Week number',
                  },
                  '#'
                )
              : null,
            ...weekdays.value.short.map((name: string, i: number) =>
              h(
                'div',
                {
                  key: name + i,
                  class: 'fui-date-picker__weekday',
                  role: 'columnheader',
                  'aria-label': weekdays.value.long[i],
                },
                name
              )
            ),
          ]),
          ...weeks.value.map((week: Date[]) =>
            h('div', { key: toISO(week[0]), class: 'fui-date-picker__row', role: 'row' }, [
              props.showWeek
                ? h(
                    'div',
                    {
                      class: 'fui-date-picker__week-number',
                      role: 'rowheader',
                      'aria-label': `Week ${getWeekNumber(week[0])}`,
                    },
                    String(getWeekNumber(week[0]))
                  )
                : null,
              ...week.map(renderDay),
            ])
          ),
        ]
      )
    }

    function renderMonthsView() {
      return h(
        'div',
        { class: 'fui-date-picker__months', role: 'group', 'aria-label': 'Select month' },
        months.value.map((name: string, index: number) => {
          const allowed = isMonthAllowed(displayYear.value, index, constraints.value)
          const active = index === displayMonth.value
          return h(
            'button',
            {
              key: name,
              type: 'button',
              class: [
                'fui-date-picker__month-btn',
                { 'fui-date-picker__month-btn--active': active },
              ],
              'aria-pressed': active,
              disabled: props.disabled || !allowed,
              onClick: () => {
                displayMonth.value = index
                view.value = 'month'
                announce(`${getMonthNames(props.locale, 'long')[index]} ${displayYear.value}`)
                nextTick(focusGrid)
              },
            },
            slots.month ? slots.month({ month: index, name, active }) : name
          )
        })
      )
    }

    function renderYearView() {
      return h(
        'div',
        {
          ref: yearsRef,
          class: 'fui-date-picker__years',
          role: 'group',
          'aria-label': 'Select year',
        },
        years.value.map((year: number) => {
          const allowed = isYearAllowed(year, constraints.value)
          const active = year === displayYear.value
          return h(
            'button',
            {
              key: year,
              type: 'button',
              class: ['fui-date-picker__year-btn', { 'fui-date-picker__year-btn--active': active }],
              'aria-pressed': active,
              'data-active': active ? 'true' : undefined,
              disabled: props.disabled || !allowed,
              onClick: () => {
                displayYear.value = year
                view.value = 'month'
                announce(`${monthLabel.value} ${year}`)
                nextTick(focusGrid)
              },
            },
            slots.year ? slots.year({ year, active }) : String(year)
          )
        })
      )
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-date-picker',
            `fui-date-picker--${view.value}`,
            {
              'fui-date-picker--show-week': props.showWeek,
              'fui-date-picker--disabled': props.disabled,
            },
            props.class,
          ],
          style: [
            { '--fui-date-picker-color': accent.value, '--fui-date-picker-on': onAccent.value },
            props.style,
          ],
        },
        [
          !props.hideHeader
            ? h('div', { class: 'fui-date-picker__header' }, [
                slots.title
                  ? slots.title()
                  : h('div', { class: 'fui-date-picker__title' }, props.title),
                slots.header
                  ? slots.header({ header: headerText.value })
                  : h('div', { class: 'fui-date-picker__header-text' }, headerText.value),
              ])
            : null,
          h('div', { class: 'fui-date-picker__body' }, [
            renderControls(),
            view.value === 'months'
              ? renderMonthsView()
              : view.value === 'year'
                ? renderYearView()
                : renderMonthView(),
          ]),
          slots.actions ? h('div', { class: 'fui-date-picker__actions' }, slots.actions()) : null,
          // Polite live region — announces the period as the user navigates.
          h(
            'div',
            { class: 'fui-date-picker__live', role: 'status', 'aria-live': 'polite' },
            announcement.value
          ),
        ]
      )
    )

    return { focusGrid, focusDate: goToDate, periodLabel }
  },
})
