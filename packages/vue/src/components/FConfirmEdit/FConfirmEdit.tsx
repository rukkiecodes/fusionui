import { computed, h, ref, toRaw, watchEffect } from 'vue'
import type { PropType, VNode } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FBtn } from '../FBtn'

/** Structural clone that survives SSR (no `structuredClone` in older runtimes). */
function clone<T>(value: T): T {
  const raw = toRaw(value) as unknown
  if (raw == null || typeof raw !== 'object') return raw as T
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(raw) as T
    } catch {
      // Falls through to the manual clone for values structuredClone rejects
      // (functions, class instances, …).
    }
  }
  if (Array.isArray(raw)) return raw.map(v => clone(v)) as unknown as T
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(raw as Record<string, unknown>)) {
    out[key] = clone((raw as Record<string, unknown>)[key])
  }
  return out as T
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    // NaN === NaN
    return a !== a && b !== b
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const aKeys = Object.keys(a as Record<string, unknown>)
  const bKeys = Object.keys(b as Record<string, unknown>)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every(
    key =>
      key in (b as Record<string, unknown>) &&
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
  )
}

export type FConfirmEditAction = 'save' | 'cancel'

export const makeFConfirmEditProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    color: { type: String as PropType<string>, default: 'primary' },
    okText: { type: String as PropType<string>, default: 'OK' },
    cancelText: { type: String as PropType<string>, default: 'Cancel' },
    /** `true` disables both buttons; an array disables the ones it names. */
    disabled: {
      type: [Boolean, Array] as PropType<boolean | FConfirmEditAction[]>,
      default: undefined,
    },
    /** Render no buttons — drive `save` / `cancel` from the default slot. */
    hideActions: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FConfirmEdit'
)

/**
 * Wraps an editable control and holds its edits in a draft: the bound value only
 * changes when the user confirms with OK. Cancel throws the draft away and puts
 * the original value back.
 */
export const FConfirmEdit = genericComponent()({
  name: 'FConfirmEdit',
  props: makeFConfirmEditProps(),
  emits: {
    'update:modelValue': (_v: unknown) => true,
    save: (_v: unknown) => true,
    cancel: () => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    const model = useProxiedModel(props, 'modelValue', undefined)
    // The draft. It re-clones whenever the committed value changes underneath
    // us, so an external update never leaves a stale edit behind.
    const draft = ref<unknown>(clone(model.value))
    watchEffect(() => {
      draft.value = clone(model.value)
    })

    const isPristine = computed(() => deepEqual(model.value, draft.value))

    function isActionDisabled(action: FConfirmEditAction): boolean {
      if (typeof props.disabled === 'boolean') return props.disabled
      if (Array.isArray(props.disabled)) return props.disabled.includes(action)
      return isPristine.value
    }

    function save(): void {
      model.value = draft.value
      emit('save', draft.value)
    }

    function cancel(): void {
      draft.value = clone(model.value)
      emit('cancel')
    }

    /** Usable as a component (`<component :is="actions" />`) or called directly. */
    function actions(actionProps?: Record<string, unknown>): VNode[] {
      return [
        h(FBtn, {
          key: 'cancel',
          class: 'fui-confirm-edit__cancel',
          variant: 'text',
          color: props.color,
          disabled: isActionDisabled('cancel'),
          text: props.cancelText,
          onClick: cancel,
          ...actionProps,
        }),
        h(FBtn, {
          key: 'ok',
          class: 'fui-confirm-edit__ok',
          variant: 'text',
          color: props.color,
          disabled: isActionDisabled('save'),
          text: props.okText,
          onClick: save,
          ...actionProps,
        }),
      ]
    }

    // The slot may place the buttons itself (via the `actions` slot prop); when
    // it does, we must not render a second row of them.
    let actionsUsed = false

    useRender(() => {
      const content = slots.default?.({
        model: draft,
        save,
        cancel,
        isPristine: isPristine.value,
        get actions() {
          actionsUsed = true
          return actions
        },
      })

      return h(
        'div',
        {
          class: ['fui-confirm-edit', props.class],
          style: props.style,
        },
        [
          content,
          !props.hideActions && !actionsUsed
            ? h('div', { class: 'fui-confirm-edit__actions' }, actions())
            : null,
        ]
      )
    })

    return { save, cancel, isPristine }
  },
})
