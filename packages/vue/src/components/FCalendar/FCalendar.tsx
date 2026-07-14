import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FBtn } from '../FBtn'
import {
  addDays,
  addMonths,
  formatDate,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  isSameMonth,
  isWithin,
  parseDate,
  startOfDay,
  getWeekdayNames,
} from '../FDatePicker/date'
import type { DateLike } from '../FDatePicker/date'

export type FCalendarViewMode = 'month' | 'week' | 'day'

export interface FCalendarEvent {
  /** Anything you like — handed back untouched by `click:event`. */
  [key: string]: unknown
  title?: string
  start?: DateLike
  end?: DateLike
  color?: string
  /** Spans whole days rather than a time range. */
  allDay?: boolean
}

/** An event resolved to real Dates, so the grid never re-parses. */
interface ResolvedEvent {
  raw: FCalendarEvent
  title: string
  start: Date
  end: Date
  color?: string
  allDay: boolean
}

export const makeFCalendarProps = propsFactory(
  {
    /** The focused date — which month/week/day is on screen. */
    modelValue: { type: [String, Number, Date] as PropType<DateLike>, default: undefined },
    events: { type: Array as PropType<FCalendarEvent[]>, default: () => [] },
    viewMode: { type: String as PropType<FCalendarViewMode>, default: 'month' },
    firstDayOfWeek: { type: [Number, String] as PropType<number | string>, default: 0 },
    locale: { type: String as PropType<string>, default: 'en-US' },
    color: { type: String as PropType<string>, default: 'primary' },
    /** Cap how many events a month cell lists before collapsing to "+N more". */
    eventsPerDay: { type: [Number, String] as PropType<number | string>, default: 3 },
    hideHeader: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCalendar'
)

/**
 * A month / week / day event calendar.
 *
 * The grid is a real `role="grid"` — rows and gridcells, one focusable button per
 * day carrying its full spoken date — so it is navigable and announced properly
 * rather than being a wall of divs. Events are buttons, not decorations, so they
 * can be reached and activated from the keyboard.
 */
export const FCalendar = genericComponent()({
  name: 'FCalendar',
  props: makeFCalendarProps(),
  emits: {
    'update:modelValue': (_v: Date) => true,
    'update:viewMode': (_v: FCalendarViewMode) => true,
    'click:date': (_d: Date) => true,
    'click:event': (_e: FCalendarEvent, _native: MouseEvent) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    // "Today" is read in setup, never at module scope — a module-level Date would
    // be baked in at import time and could disagree between server and client.
    const today = startOfDay(new Date())

    const focused = useProxiedModel(
      props,
      'modelValue',
      undefined,
      (v: unknown) => parseDate(v as DateLike) ?? today,
      (v: Date) => v
    )

    const view = computed<FCalendarViewMode>({
      get: () => props.viewMode,
      set: v => emit('update:viewMode', v),
    })

    const firstDay = computed(() => Number(props.firstDayOfWeek) || 0)

    /** Events resolved once, sorted, so every cell lookup is a cheap filter. */
    const events = computed<ResolvedEvent[]>(() =>
      (props.events as FCalendarEvent[])
        .map((raw): ResolvedEvent | null => {
          const start = parseDate(raw.start)
          // An event without a usable start has nowhere to go — drop it rather
          // than guessing a date for it.
          if (!start) return null
          return {
            raw,
            title: String(raw.title ?? ''),
            start,
            end: parseDate(raw.end) ?? start,
            color: raw.color,
            allDay: !!raw.allDay,
          }
        })
        .filter((event): event is ResolvedEvent => event !== null)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    )

    function eventsOn(date: Date): ResolvedEvent[] {
      return events.value.filter(
        event =>
          isSameDay(event.start, date) ||
          isWithin(startOfDay(date), startOfDay(event.start), startOfDay(event.end))
      )
    }

    /** The days on screen, for whichever view is active. */
    const days = computed<Date[]>(() => {
      const date = focused.value
      if (view.value === 'day') return [date]
      if (view.value === 'week') return getWeekDays(date, firstDay.value)
      return getMonthGrid(date.getFullYear(), date.getMonth(), firstDay.value).flat()
    })

    const weekdayNames = computed(() => getWeekdayNames(props.locale, 'short', firstDay.value))

    /** The header's period label — what "previous/next" actually moves. */
    const title = computed(() => {
      const date = focused.value
      if (view.value === 'day') return formatDate(date, 'MMMM D, YYYY', props.locale)
      if (view.value === 'week') {
        const week = getWeekDays(date, firstDay.value)
        const from = formatDate(week[0], 'MMM D', props.locale)
        const to = formatDate(week[6], 'MMM D, YYYY', props.locale)
        return `${from} – ${to}`
      }
      return formatDate(date, 'MMMM YYYY', props.locale)
    })

    function shift(direction: -1 | 1): void {
      const date = focused.value
      if (view.value === 'month') focused.value = addMonths(date, direction)
      else if (view.value === 'week') focused.value = addDays(date, direction * 7)
      else focused.value = addDays(date, direction)
    }

    function onDayKeydown(e: KeyboardEvent, date: Date): void {
      const moves: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
      }
      const delta = moves[e.key]
      if (delta == null) return
      e.preventDefault()
      focused.value = addDays(date, delta)
    }

    function renderEvent(event: ResolvedEvent) {
      if (slots.event) return slots.event({ event: event.raw })

      return h(
        'button',
        {
          type: 'button',
          class: 'fui-calendar__event',
          style: event.color ? { '--fui-calendar-event': event.color } : undefined,
          onClick: (native: MouseEvent) => {
            native.stopPropagation()
            emit('click:event', event.raw, native)
          },
        },
        [
          event.allDay
            ? null
            : h(
                'span',
                { class: 'fui-calendar__event-time' },
                formatDate(event.start, 'h:mm A', props.locale)
              ),
          h('span', { class: 'fui-calendar__event-title' }, event.title),
        ]
      )
    }

    function renderDay(date: Date) {
      const dayEvents = eventsOn(date)
      const limit = view.value === 'month' ? Number(props.eventsPerDay) || 3 : dayEvents.length
      const shown = dayEvents.slice(0, limit)
      const overflow = dayEvents.length - shown.length

      const outside = view.value === 'month' && !isSameMonth(date, focused.value)
      const isToday = isSameDay(date, today)
      const isFocused = isSameDay(date, focused.value)

      return h(
        'div',
        {
          key: date.getTime(),
          class: [
            'fui-calendar__day',
            {
              'fui-calendar__day--outside': outside,
              'fui-calendar__day--today': isToday,
              'fui-calendar__day--selected': isFocused,
            },
          ],
          role: 'gridcell',
          'aria-selected': isFocused,
        },
        [
          h(
            'button',
            {
              type: 'button',
              class: 'fui-calendar__day-label',
              // Roving tabindex: only the focused day is a tab stop; arrows move.
              tabindex: isFocused ? 0 : -1,
              'aria-label': formatDate(date, 'dddd, MMMM D, YYYY', props.locale),
              'aria-current': isToday ? 'date' : undefined,
              onClick: () => {
                focused.value = date
                emit('click:date', date)
              },
              onKeydown: (e: KeyboardEvent) => onDayKeydown(e, date),
            },
            String(date.getDate())
          ),
          h('div', { class: 'fui-calendar__events' }, [
            ...shown.map(renderEvent),
            overflow > 0
              ? h(
                  'button',
                  {
                    type: 'button',
                    class: 'fui-calendar__more',
                    // Showing the rest = focusing that day, which switches to the
                    // day view where nothing is truncated.
                    onClick: () => {
                      focused.value = date
                      view.value = 'day'
                    },
                  },
                  `+${overflow} more`
                )
              : null,
          ]),
        ]
      )
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-calendar',
            `fui-calendar--${view.value}`,
            `text-${props.color}`,
            props.class,
          ],
          style: props.style,
        },
        [
          props.hideHeader
            ? null
            : h('div', { class: 'fui-calendar__header' }, [
                h(FBtn, {
                  icon: 'chevron-left',
                  variant: 'text',
                  size: 'small',
                  'aria-label': 'Previous period',
                  onClick: () => shift(-1),
                }),
                // A live region: moving the period must be announced, or a
                // screen-reader user has no idea what they just navigated to.
                h(
                  'div',
                  { class: 'fui-calendar__title', 'aria-live': 'polite' },
                  slots.header ? slots.header({ title: title.value }) : title.value
                ),
                h(FBtn, {
                  icon: 'chevron-right',
                  variant: 'text',
                  size: 'small',
                  'aria-label': 'Next period',
                  onClick: () => shift(1),
                }),
              ]),
          h('div', { class: 'fui-calendar__grid', role: 'grid', 'aria-label': title.value }, [
            view.value === 'day'
              ? null
              : h(
                  'div',
                  { class: 'fui-calendar__weekdays', role: 'row' },
                  weekdayNames.value.map(name =>
                    h(
                      'div',
                      { key: name, class: 'fui-calendar__weekday', role: 'columnheader' },
                      name
                    )
                  )
                ),
            h('div', { class: 'fui-calendar__days', role: 'row' }, days.value.map(renderDay)),
          ]),
        ]
      )
    )
  },
})
