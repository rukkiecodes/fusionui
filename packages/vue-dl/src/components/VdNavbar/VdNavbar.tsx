import {
  computed,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import type { InjectionKey, PropType, Ref } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'

interface NavbarContext {
  activeId: Ref<string | undefined>
  setActive: (id: string | undefined) => void
  moveLine: (el: HTMLElement, transition?: boolean) => void
  clearLine: () => void
}

export const VdNavbarKey: InjectionKey<NavbarContext> = Symbol.for('vue-dl:navbar')

export const makeVdNavbarProps = propsFactory(
  {
    // Active item id (v-model).
    modelValue: String as PropType<string>,
    fixed: Boolean,
    shadow: Boolean,
    // Gain a shadow only once the page scrolls.
    shadowScroll: Boolean,
    // Slide away when scrolling down, return when scrolling up.
    hideScroll: Boolean,
    // Extra breathing room that compresses once the page scrolls.
    paddingScroll: Boolean,
    square: Boolean,
    // Hide the sliding active line.
    notLine: Boolean,
    // CSS selector of the scroll container (defaults to the window).
    targetScroll: String as PropType<string>,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdNavbar'
)

export const VdNavbar = genericComponent()({
  name: 'VdNavbar',
  props: makeVdNavbarProps(),
  emits: { 'update:modelValue': (_v: string | undefined) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)

    const rootRef = ref<HTMLElement>()
    const lineLeft = ref(0)
    const lineWidth = ref(0)
    const lineNoTransition = ref(false)
    const hidden = ref(false)
    const shadowActive = ref(false)
    const paddingActive = ref(false)
    let lastScrollTop = 0

    function moveLine(el: HTMLElement, transition = true) {
      lineNoTransition.value = !transition
      nextTick(() => {
        lineLeft.value = el.offsetLeft
        lineWidth.value = el.scrollWidth
      })
    }
    function clearLine() {
      lineWidth.value = 0
    }

    provide(VdNavbarKey, {
      activeId: model,
      setActive: id => {
        model.value = id
      },
      moveLine,
      clearLine,
    })

    function scrollEl(): Element | Window {
      if (props.targetScroll && typeof document !== 'undefined') {
        return document.querySelector(props.targetScroll) ?? window
      }
      return window
    }

    function onScroll() {
      const el = scrollEl()
      const top = el instanceof Window ? window.pageYOffset : el.scrollTop
      if (props.hideScroll) hidden.value = top > lastScrollTop && top > 0
      if (props.shadowScroll) shadowActive.value = top > 0
      if (props.paddingScroll) paddingActive.value = top > 0
      lastScrollTop = top
    }

    function onResize() {
      const active = rootRef.value?.querySelector('.vd-navbar__item--active') as HTMLElement | null
      if (active) moveLine(active, false)
      else clearLine()
    }

    onMounted(() => {
      if (typeof window === 'undefined') return
      scrollEl().addEventListener('scroll', onScroll as EventListener, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
    })
    onBeforeUnmount(() => {
      if (typeof window === 'undefined') return
      scrollEl().removeEventListener('scroll', onScroll as EventListener)
      window.removeEventListener('resize', onResize)
    })

    useRender(() =>
      h(
        'div',
        {
          ref: rootRef,
          class: [
            'vd-navbar',
            {
              'vd-navbar--fixed': props.fixed,
              'vd-navbar--shadow': props.shadow || shadowActive.value,
              'vd-navbar--hidden': hidden.value,
              'vd-navbar--square': props.square,
              'vd-navbar--padding': props.paddingScroll && !paddingActive.value,
            },
            props.class,
          ],
          style: props.style,
        },
        [
          h('div', { class: 'vd-navbar__inner' }, [
            h('div', { class: 'vd-navbar__left' }, slots.left?.()),
            h('div', { class: 'vd-navbar__center' }, slots.default?.()),
            h('div', { class: 'vd-navbar__right' }, slots.right?.()),
          ]),
          !props.notLine
            ? h('div', {
                class: ['vd-navbar__line', { 'vd-navbar__line--still': lineNoTransition.value }],
                style: { left: `${lineLeft.value}px`, width: `${lineWidth.value}px` },
              })
            : null,
        ]
      )
    )
  },
})

export const makeVdNavbarItemProps = propsFactory(
  {
    id: String as PropType<string>,
    active: Boolean,
    to: String as PropType<string>,
    href: String as PropType<string>,
    target: { type: String, default: '_blank' },
    ...makeComponentProps(),
  },
  'VdNavbarItem'
)

export const VdNavbarItem = genericComponent()({
  name: 'VdNavbarItem',
  props: makeVdNavbarItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    const navbar = inject(VdNavbarKey, null)
    const el = ref<HTMLElement>()
    const vm = getCurrentInstance()

    const isActive = computed(
      () => props.active || (!!props.id && navbar?.activeId.value === props.id)
    )

    function syncLine(transition = true) {
      if (isActive.value && el.value && navbar) navbar.moveLine(el.value, transition)
    }

    onMounted(() => {
      // Wait for fonts/layout to settle before measuring (Vuesax does the same).
      setTimeout(() => syncLine(false), 150)
    })
    watch(isActive, val => val && nextTick(() => syncLine()))

    function onClick(e: MouseEvent) {
      emit('click', e)
      if (props.id && navbar) navbar.setActive(props.id)
      if (props.to) {
        const router = vm?.appContext.config.globalProperties.$router
        router?.push(props.to)
      } else if (props.href && typeof window !== 'undefined') {
        window.open(props.href, props.target)
      }
    }

    useRender(() =>
      h(
        'button',
        {
          ref: el,
          type: 'button',
          class: ['vd-navbar__item', { 'vd-navbar__item--active': isActive.value }, props.class],
          style: props.style,
          onClick,
        },
        slots.default?.()
      )
    )
  },
})
