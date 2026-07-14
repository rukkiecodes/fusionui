import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { isCssColor, isLightColor, parseColor } from '../../util/colors'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import type { AllowedTimeValues, TimeFormat, TimeParts, TimePeriod, TimeUnit } from './time'
import {
  createTimeValidator,
  formatTime,
  formatTimeLabel,
  parseTime,
  periodOf,
  unitLabel,
  unitRange,
} from './time'

type ColumnKey = TimeUnit | 'period'

interface ColumnOption {
  value: number | TimePeriod
  text: string
  disabled: boolean
  selected: boolean
}

interface ColumnDef {
  key: ColumnKey
  label: string
  options: ColumnOption[]
}

// Stable per-instance ids (a counter, not Math.random, so SSR and client markup
// match) — the listboxes reference their options via aria-activedescendant.
let pickerUid = 0

export const makeFTimePickerProps = propsFactory(
  {
    /** `HH:mm` or `HH:mm:ss` (always 24-hour, whatever `format` displays). */
    modelValue: { type: String as PropType<string | null>, default: null },
    format: { type: String as PropType<TimeFormat>, default: '24hr' },
    /** Inclusive lower bound, `HH:mm[:ss]`. */
    min: String as PropType<string>,
    /** Inclusive upper bound, `HH:mm[:ss]`. */
    max: String as PropType<string>,
    allowedHours: [Array, Function] as PropType<AllowedTimeValues>,
    allowedMinutes: [Array, Function] as PropType<AllowedTimeValues>,
    allowedSeconds: [Array, Function] as PropType<AllowedTimeValues>,
    useSeconds: Boolean,
    /** Let the mouse wheel step a column. */
    scrollable: Boolean,
    title: { type: String, default: 'Select time' },
    hideTitle: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    width: [Number, String] as PropType<number | string>,
    disabled: Boolean,
    readonly: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTimePicker'
)

/**
 * A column-list time picker: one scrollable listbox per unit (hour / minute /
 * second / AM-PM). Unlike an analog dial this maps cleanly onto the WAI-ARIA
 * listbox pattern — roving `aria-activedescendant`, arrow keys, Home/End — so it
 * is fully operable by keyboard and screen reader.
 */
export const FTimePicker = genericComponent()({
  name: 'FTimePicker',
  props: makeFTimePickerProps(),
  emits: {
    'update:modelValue': (_v: string | null) => true,
    'update:hour': (_v: number) => true,
    'update:minute': (_v: number) => true,
    'update:second': (_v: number) => true,
    'update:period': (_v: 'am' | 'pm') => true,
  },
  setup(props: any, { emit }: any) {
    provideTheme(props)

    const uid = `fui-time-picker-${++pickerUid}`
    const model = useProxiedModel(props, 'modelValue', null)

    const hour = ref<number | null>(null)
    const minute = ref<number | null>(null)
    const second = ref<number | null>(null)
    const period = ref<TimePeriod>('am')

    // Non-reactive element registry — used only for focus moves and scrolling.
    const listEls: Partial<Record<ColumnKey, HTMLElement | null>> = {}

    const parts = computed<TimeParts>(() => ({
      hour: hour.value,
      minute: minute.value,
      second: second.value,
    }))
    const current = computed(() => formatTime(parts.value, props.useSeconds))
    const validator = computed(() =>
      createTimeValidator({
        min: props.min,
        max: props.max,
        allowedHours: props.allowedHours,
        allowedMinutes: props.allowedMinutes,
        allowedSeconds: props.allowedSeconds,
      })
    )
    const label = computed(() => formatTimeLabel(parts.value, props.format, props.useSeconds))
    const isInteractive = computed(() => !props.disabled && !props.readonly)

    // Accent + its contrast pair, resolved the same way FBtn does it, so a
    // selected cell keeps a readable label on any theme or raw CSS color.
    const accent = computed(() => {
      const color = props.color
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          const { r, g, b } = parseColor(color)
          return `${r}, ${g}, ${b}`
        }
        return undefined
      }
      return `var(--fui-theme-${color})`
    })
    const accentOn = computed(() => {
      const color = props.color
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          return isLightColor(color) ? '0, 0, 0' : '255, 255, 255'
        }
        return '255, 255, 255'
      }
      return `var(--fui-theme-on-${color})`
    })

    function sync(value: string | null): void {
      const next = parseTime(value)
      hour.value = next.hour
      minute.value = next.minute
      second.value = props.useSeconds ? next.second : null
      period.value = periodOf(next.hour)
    }

    // The model is the source of truth; re-parse whenever it moves away from what
    // the columns currently spell out (external set, v-model, reset to null).
    watch(model, value => {
      if (value !== current.value) sync(value as string | null)
    })
    onMounted(() => {
      sync(model.value as string | null)
      scrollSelectedIntoView()
    })
    watch(
      () => props.useSeconds,
      on => {
        if (!on) second.value = null
        else if (second.value == null && hour.value != null) second.value = firstAllowed('second')
        commit()
      }
    )

    function firstAllowed(unit: TimeUnit): number | null {
      const range = unitRange(unit, props.format, period.value)
      const found = range.find(v => validator.value.isAllowed(unit, v, parts.value))
      return found ?? null
    }

    /**
     * A column list only ever sets one unit at a time, so the first pick would
     * otherwise leave the model incomplete (and un-emitted) — fill the untouched
     * units with their first allowed value instead of staying silent.
     */
    function completeParts(): void {
      if (hour.value == null) return
      if (minute.value == null) minute.value = firstAllowed('minute') ?? 0
      if (props.useSeconds && second.value == null) second.value = firstAllowed('second') ?? 0
    }

    function commit(): void {
      const next = current.value
      if (next !== model.value) model.value = next
    }

    function select(key: ColumnKey, value: number | TimePeriod): void {
      if (!isInteractive.value) return

      if (key === 'period') {
        const next = value as TimePeriod
        if (next === period.value) return
        period.value = next
        if (hour.value != null) {
          hour.value = next === 'pm' ? hour.value + 12 : hour.value - 12
          emit('update:hour', hour.value)
        }
        emit('update:period', next)
      } else if (key === 'hour') {
        hour.value = value as number
        period.value = periodOf(hour.value)
        emit('update:hour', hour.value)
      } else if (key === 'minute') {
        minute.value = value as number
        emit('update:minute', minute.value)
      } else {
        second.value = value as number
        emit('update:second', second.value)
      }

      if (hour.value == null) hour.value = firstAllowed('hour') ?? 0
      completeParts()
      commit()
      scrollSelectedIntoView()
    }

    const columns = computed<ColumnDef[]>(() => {
      const defs: ColumnDef[] = []
      const units: TimeUnit[] = props.useSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute']

      for (const unit of units) {
        const selectedValue =
          unit === 'hour' ? hour.value : unit === 'minute' ? minute.value : second.value
        defs.push({
          key: unit,
          label: unit === 'hour' ? 'Hour' : unit === 'minute' ? 'Minute' : 'Second',
          options: unitRange(unit, props.format, period.value).map(value => ({
            value,
            text: unitLabel(unit, value, props.format),
            disabled: !validator.value.isAllowed(unit, value, parts.value),
            selected: selectedValue === value,
          })),
        })
      }

      if (props.format === 'ampm') {
        defs.push({
          key: 'period',
          label: 'AM/PM',
          options: (['am', 'pm'] as TimePeriod[]).map(value => ({
            value,
            text: value.toUpperCase(),
            // A period is unreachable when no hour inside it is allowed.
            disabled: !unitRange('hour', 'ampm', value).some(hr =>
              validator.value.isAllowedHour(hr)
            ),
            selected: period.value === value,
          })),
        })
      }

      return defs
    })

    function optionId(key: ColumnKey, value: number | TimePeriod): string {
      return `${uid}-${key}-${value}`
    }
    function activeId(col: ColumnDef): string | undefined {
      const selected = col.options.find(o => o.selected)
      return selected ? optionId(col.key, selected.value) : undefined
    }

    /** Steps the column by `delta`, skipping disabled options and clamping at the ends. */
    function step(col: ColumnDef, delta: number): void {
      const { options } = col
      const from = options.findIndex(o => o.selected)
      if (from === -1) {
        const first = options.find(o => !o.disabled)
        if (first) select(col.key, first.value)
        return
      }
      let index = from
      for (let i = 0; i < options.length; i++) {
        index = Math.min(options.length - 1, Math.max(0, index + delta))
        if (!options[index].disabled) {
          if (index !== from) select(col.key, options[index].value)
          return
        }
        if (index === 0 || index === options.length - 1) return
      }
    }

    function jump(col: ColumnDef, edge: 'first' | 'last'): void {
      const enabled = col.options.filter(o => !o.disabled)
      const target = edge === 'first' ? enabled[0] : enabled[enabled.length - 1]
      if (target) select(col.key, target.value)
    }

    function focusColumn(index: number): void {
      const next = columns.value[index]
      if (!next) return
      listEls[next.key]?.focus()
    }

    function onColumnKeydown(e: KeyboardEvent, col: ColumnDef, index: number): void {
      if (!isInteractive.value) return
      // Minutes/seconds jump in fives on PageUp/PageDown; hours and AM/PM only
      // ever have a handful of options, so a coarse step there is just the edge.
      const coarse = col.key === 'minute' || col.key === 'second' ? 5 : 1

      switch (e.key) {
        case 'ArrowDown':
          step(col, 1)
          break
        case 'ArrowUp':
          step(col, -1)
          break
        case 'PageDown':
          step(col, coarse)
          break
        case 'PageUp':
          step(col, -coarse)
          break
        case 'Home':
          jump(col, 'first')
          break
        case 'End':
          jump(col, 'last')
          break
        case 'ArrowRight':
          focusColumn(index + 1)
          break
        case 'ArrowLeft':
          focusColumn(index - 1)
          break
        case 'Enter':
        case ' ':
          // Selection already follows focus; swallow Space so it can't scroll.
          break
        default:
          return
      }
      e.preventDefault()
    }

    function onColumnWheel(e: WheelEvent, col: ColumnDef): void {
      if (!props.scrollable || !isInteractive.value) return
      e.preventDefault()
      step(col, e.deltaY > 0 ? 1 : -1)
    }

    // Centre the selected cell in its column by driving `scrollTop` directly —
    // `scrollIntoView` would also scroll the page/menu the picker happens to be in.
    function scrollSelectedIntoView(): void {
      if (typeof window === 'undefined') return
      nextTick(() => {
        for (const col of columns.value) {
          const list = listEls[col.key]
          const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]')
          if (!list || !selected) continue
          const top = selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2
          list.scrollTop = Math.max(0, top)
        }
      })
    }

    function renderColumn(col: ColumnDef, index: number) {
      const labelId = `${uid}-${col.key}-label`
      return h('div', { key: col.key, class: 'fui-time-picker__column' }, [
        h('div', { class: 'fui-time-picker__column-label', id: labelId }, col.label),
        h(
          'div',
          {
            ref: (el: unknown) => {
              listEls[col.key] = (el as HTMLElement) ?? null
            },
            class: 'fui-time-picker__list',
            role: 'listbox',
            'aria-labelledby': labelId,
            'aria-activedescendant': activeId(col),
            'aria-disabled': props.disabled || undefined,
            'aria-readonly': props.readonly || undefined,
            tabindex: props.disabled ? -1 : 0,
            onKeydown: (e: KeyboardEvent) => onColumnKeydown(e, col, index),
            onWheel: (e: WheelEvent) => onColumnWheel(e, col),
          },
          col.options.map(option =>
            h(
              'div',
              {
                key: String(option.value),
                id: optionId(col.key, option.value),
                class: [
                  'fui-time-picker__option',
                  {
                    'fui-time-picker__option--selected': option.selected,
                    'fui-time-picker__option--disabled': option.disabled,
                  },
                ],
                role: 'option',
                'aria-selected': option.selected,
                'aria-disabled': option.disabled || undefined,
                onClick: () => {
                  if (!option.disabled) select(col.key, option.value)
                },
              },
              option.text
            )
          )
        ),
      ])
    }

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-time-picker',
            {
              'fui-time-picker--disabled': props.disabled,
              'fui-time-picker--readonly': props.readonly,
            },
            props.class,
          ],
          style: [
            { '--fui-time-picker-color': accent.value, '--fui-time-picker-on': accentOn.value },
            props.width ? { width: convertToUnit(props.width) } : undefined,
            props.style,
          ],
          role: 'group',
          'aria-label': props.title,
        },
        [
          !props.hideTitle
            ? h('div', { class: 'fui-time-picker__header' }, [
                h('span', { class: 'fui-time-picker__title' }, props.title),
                // The value is always available as text — never colour alone.
                h(
                  'span',
                  { class: 'fui-time-picker__value', role: 'status', 'aria-live': 'polite' },
                  label.value || '--:--'
                ),
              ])
            : null,
          h(
            'div',
            { class: 'fui-time-picker__columns' },
            columns.value.map((col, i) => renderColumn(col, i))
          ),
        ]
      )
    )
  },
})
