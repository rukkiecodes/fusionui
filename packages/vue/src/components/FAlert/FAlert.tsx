import { Transition, computed, h, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { isCssColor, isLightColor, parseColor } from '../../util/colors'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export type AlertVariant =
  | 'default'
  | 'solid'
  | 'border'
  | 'shadow'
  | 'gradient'
  | 'flat'
  | 'relief'
export type AlertType = 'success' | 'info' | 'warning' | 'error'

const typeColor: Record<AlertType, string> = {
  success: 'success',
  info: 'primary',
  warning: 'warning',
  error: 'danger',
}
const typeIcon: Record<AlertType, string> = {
  success: '$success',
  info: '$info',
  warning: '$warning',
  error: '$error',
}

export const makeVdAlertProps = propsFactory(
  {
    variant: { type: String as PropType<AlertVariant>, default: 'default' },
    // Accent color — a theme name (primary, success…) or any CSS color.
    color: String as PropType<string>,
    // Semantic shortcut: sets a color + default icon.
    type: String as PropType<AlertType>,
    title: String as PropType<string>,
    text: String as PropType<string>,
    icon: {
      type: [Boolean, String, Object, Function] as PropType<boolean | IconValue>,
      default: undefined,
    },
    closable: Boolean,
    progress: { type: [Number, String] as PropType<number | string>, default: 0 },
    // Collapsible content: pass a boolean to make the title toggle it.
    hiddenContent: { type: Boolean as PropType<boolean | null>, default: null },
    // Current page for the `page-N` slots (1-based).
    page: { type: [Number, String] as PropType<number | string>, default: 0 },
    modelValue: { type: Boolean, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FAlert'
)

export const FAlert = genericComponent()({
  name: 'FAlert',
  props: makeVdAlertProps(),
  emits: {
    'update:modelValue': (_v: boolean) => true,
    'update:hiddenContent': (_v: boolean) => true,
    'update:page': (_v: number) => true,
  },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const isActive = useProxiedModel(props, 'modelValue', true)
    const hidden = useProxiedModel(props, 'hiddenContent', null)
    const page = useProxiedModel(props, 'page', 0)

    const resolved = computed(
      () => props.color ?? (props.type ? typeColor[props.type as AlertType] : undefined)
    )

    const alertColor = computed(() => {
      const color = resolved.value
      if (!color) return 'var(--fui-theme-primary)'
      if (isCssColor(color)) {
        if (color.startsWith('#') || color.startsWith('rgb')) {
          const { r, g, b } = parseColor(color)
          return `${r}, ${g}, ${b}`
        }
        return 'var(--fui-theme-primary)'
      }
      return `var(--fui-theme-${color})`
    })
    const alertOn = computed(() => {
      const color = resolved.value
      if (!color) return 'var(--fui-theme-on-primary)'
      if (isCssColor(color) && (color.startsWith('#') || color.startsWith('rgb'))) {
        return isLightColor(color) ? '0, 0, 0' : '255, 255, 255'
      }
      if (isCssColor(color)) return '255, 255, 255'
      return `var(--fui-theme-on-${color})`
    })

    const icon = computed(() => {
      if (props.icon === false) return undefined
      if (props.icon != null && props.icon !== true) return props.icon
      return props.type ? typeIcon[props.type as AlertType] : undefined
    })

    const collapsible = computed(() => typeof props.hiddenContent === 'boolean')

    // ---- Pagination ------------------------------------------------------
    const pageSlots = computed(() =>
      Object.keys(slots)
        .filter(k => /^page-\d+$/.test(k))
        .sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]))
    )
    const totalPages = computed(() => pageSlots.value.length)
    const currentPageSlot = computed(() => slots[`page-${page.value}`])

    // ---- Height animations (show/hide, collapse, pagination) -------------
    // The root animates for show/hide (via the Transition hooks); the content
    // element animates for collapse and pagination so the two never conflict.
    const rootRef = ref<HTMLElement>()
    const contentRef = ref<HTMLElement>()

    function afterTransition(el: HTMLElement, fn: () => void) {
      const done = () => {
        fn()
        el.removeEventListener('transitionend', done)
      }
      el.addEventListener('transitionend', done)
    }

    function expandContent() {
      const c = contentRef.value
      if (!c) return
      c.style.height = c.scrollHeight + 'px'
      afterTransition(c, () => (c.style.height = 'auto'))
    }
    function collapseContent() {
      const c = contentRef.value
      if (!c) return
      c.style.height = c.scrollHeight + 'px'
      void c.offsetHeight
      c.style.height = '0'
    }

    onMounted(() => {
      if (totalPages.value && !page.value) page.value = 1
      nextTick(() => {
        if (hidden.value === true) {
          const c = contentRef.value
          if (!c) return
          c.style.transition = 'none'
          c.style.height = '0'
          void c.offsetHeight
          c.style.transition = ''
        }
      })
    })

    // Collapse / expand the content when `hiddenContent` toggles.
    watch(hidden, val => (val ? collapseContent() : expandContent()))

    // Tween the content height between pages.
    watch(page, () => {
      const c = contentRef.value
      if (!c) return
      c.style.height = c.offsetHeight + 'px'
      nextTick(() => {
        void c.offsetHeight
        c.style.height = c.scrollHeight + 'px'
        afterTransition(c, () => (c.style.height = 'auto'))
      })
    })

    function onBeforeEnter(el: any) {
      el.style.height = '0'
    }
    function onEnter(el: any) {
      void el.offsetHeight
      el.style.height = el.scrollHeight + 'px'
    }
    function onAfterEnter(el: any) {
      el.style.height = 'auto'
    }
    function onLeave(el: any) {
      el.style.height = el.scrollHeight + 'px'
      void el.offsetHeight
      el.style.height = '0'
    }

    function close() {
      isActive.value = false
    }
    function toggleHidden() {
      if (collapsible.value) hidden.value = !hidden.value
    }
    function prevPage() {
      if (Number(page.value) > 1) page.value = Number(page.value) - 1
    }
    function nextPage() {
      if (Number(page.value) < totalPages.value) page.value = Number(page.value) + 1
    }

    useRender(() => {
      const hasTitle = !!(slots.title || props.title)
      const hasContent = !!(slots.default || props.text || totalPages.value)

      const alertNode = h(
        'div',
        {
          ref: rootRef,
          class: [
            'fui-alert',
            `fui-alert--${props.variant}`,
            { 'fui-alert--collapsible': collapsible.value },
            { 'fui-alert--has-pages': totalPages.value > 0 },
            props.class,
          ],
          style: [
            { '--fui-alert-color': alertColor.value, '--fui-alert-on': alertOn.value },
            props.style,
          ],
          role: 'alert',
        },
        [
          icon.value || slots.icon
            ? h('div', { class: 'fui-alert__icon' }, [
                slots.icon ? slots.icon() : h(FIcon, { icon: icon.value }),
              ])
            : null,

          hasTitle
            ? h(
                'div',
                {
                  class: ['fui-alert__title', { 'fui-alert__title--clickable': collapsible.value }],
                  onClick: toggleHidden,
                },
                [
                  h('span', slots.title ? slots.title() : props.title),
                  collapsible.value
                    ? h(FIcon, {
                        icon: '$dropdown',
                        class: [
                          'fui-alert__chevron',
                          { 'fui-alert__chevron--open': !hidden.value },
                        ],
                      })
                    : null,
                ]
              )
            : null,

          hasContent
            ? h('div', { ref: contentRef, class: 'fui-alert__content' }, [
                h('div', { class: 'fui-alert__content__text' }, [
                  currentPageSlot.value ? currentPageSlot.value() : null,
                  slots.default ? slots.default() : props.text,
                ]),
              ])
            : null,

          props.closable
            ? h(
                'button',
                {
                  class: 'fui-alert__close',
                  type: 'button',
                  'aria-label': 'Close',
                  onClick: close,
                },
                [h(FIcon, { icon: '$close' })]
              )
            : null,

          slots.footer ? h('div', { class: 'fui-alert__footer' }, [slots.footer()]) : null,

          Number(props.progress)
            ? h('div', { class: 'fui-alert__progress' }, [
                h('div', {
                  class: 'fui-alert__progress__bar',
                  style: { width: `${props.progress}%` },
                }),
              ])
            : null,

          totalPages.value > 0
            ? h('div', { class: 'fui-alert__pagination' }, [
                h('button', { type: 'button', onClick: prevPage, 'aria-label': 'Previous' }, '‹'),
                h('span', `${page.value} / ${totalPages.value}`),
                h('button', { type: 'button', onClick: nextPage, 'aria-label': 'Next' }, '›'),
              ])
            : null,
        ]
      )

      return h(
        Transition,
        { name: 'fui-alert-collapse', onBeforeEnter, onEnter, onAfterEnter, onLeave },
        { default: () => (isActive.value ? alertNode : null) }
      )
    })
  },
})
