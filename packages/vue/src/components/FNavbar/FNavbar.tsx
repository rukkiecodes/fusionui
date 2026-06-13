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
import { parseColor } from '../../util/colors'
import { shellCornerSvg } from '../../engine/shell'

interface NavbarContext {
  activeId: Ref<string | undefined>
  setActive: (id: string | undefined) => void
  moveLine: (el: HTMLElement, transition?: boolean) => void
  clearLine: () => void
}

export const FNavbarKey: InjectionKey<NavbarContext> = Symbol.for('fusionui:navbar')
// Items rendered inside a group's dropdown track their own active state (a dot)
// and must NOT move the navbar's sliding line (which stays under the group).
export const FNavbarInDropdownKey: InjectionKey<boolean> = Symbol.for('fusionui:navbar-dropdown')

/** Resolve a color name/CSS color to an `r, g, b` triplet for rgb(var(--…)). */
function resolveColorTriplet(color?: string): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

export const makeFNavbarProps = propsFactory(
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
    // Fill the bar with a theme color (primary, success…) or any CSS color.
    color: String as PropType<string>,
    // Force white text (useful on a colored or dark bar).
    textWhite: Boolean,
    // CSS selector of the scroll container (defaults to the window).
    targetScroll: String as PropType<string>,
    // Detect a permanent sidebar below the navbar and form a fluid concave
    // ("negative radius") junction where the shell meets the recessed content —
    // the fusion-goo smooth-min of the two edges.
    gooCorner: Boolean,
    // Blend radius (px) of that junction.
    cornerSize: { type: Number, default: 22 },
    // Selector for the docked sidebar the navbar pairs with.
    sidebarSelector: { type: String as PropType<string>, default: '.fui-sidebar' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FNavbar'
)

export const FNavbar = genericComponent()({
  name: 'FNavbar',
  props: makeFNavbarProps(),
  emits: { 'update:modelValue': (_v: string | undefined) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)
    const navbarColor = computed(() => resolveColorTriplet(props.color))

    const rootRef = ref<HTMLElement>()
    const lineLeft = ref(0)
    const lineWidth = ref(0)
    const lineNoTransition = ref(false)
    const hidden = ref(false)
    const shadowActive = ref(false)
    const paddingActive = ref(false)
    let lastScrollTop = 0

    // Goo-corner junction state (the sidebar width is detected; the fillet
    // colour comes from `background: inherit`, so it tracks the theme for free).
    const sidebarW = ref(0)
    let gooObserver: ResizeObserver | null = null

    function measureGoo() {
      const root = rootRef.value
      if (!props.gooCorner || typeof document === 'undefined' || !root) return
      const navRect = root.getBoundingClientRect()
      const sb = document.querySelector(props.sidebarSelector) as HTMLElement | null
      const r = sb?.getBoundingClientRect()
      // Only a permanent, left-docked sidebar sitting below the navbar forms the
      // junction (ignore mobile overlay drawers).
      sidebarW.value =
        r && r.width > 0 && r.left <= navRect.left + 2 && r.top >= navRect.bottom - 2 ? r.width : 0
    }

    function moveLine(el: HTMLElement, transition = true) {
      lineNoTransition.value = !transition
      nextTick(() => {
        const root = rootRef.value
        if (!root) return
        // Measure against the root rect so nesting (e.g. a positioned group
        // wrapper) doesn't throw off the line position.
        const er = el.getBoundingClientRect()
        const rr = root.getBoundingClientRect()
        lineLeft.value = er.left - rr.left
        lineWidth.value = er.width
      })
    }
    function clearLine() {
      lineWidth.value = 0
    }

    provide(FNavbarKey, {
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
      const active = rootRef.value?.querySelector('.fui-navbar__item--active') as HTMLElement | null
      if (active) moveLine(active, false)
      else clearLine()
    }

    onMounted(() => {
      if (typeof window === 'undefined') return
      scrollEl().addEventListener('scroll', onScroll as EventListener, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      if (props.gooCorner) {
        measureGoo()
        // Re-measure after layout/fonts settle so the junction reliably draws
        // even if the sidebar wasn't fully laid out on the first tick.
        requestAnimationFrame(measureGoo)
        setTimeout(measureGoo, 120)
        setTimeout(measureGoo, 400)
        window.addEventListener('load', measureGoo)
        const sb = document.querySelector(props.sidebarSelector)
        if (sb && typeof ResizeObserver !== 'undefined') {
          gooObserver = new ResizeObserver(() => measureGoo())
          gooObserver.observe(sb)
        }
        window.addEventListener('resize', measureGoo, { passive: true })
      }
    })
    onBeforeUnmount(() => {
      if (typeof window === 'undefined') return
      scrollEl().removeEventListener('scroll', onScroll as EventListener)
      window.removeEventListener('resize', onResize)
      gooObserver?.disconnect()
      window.removeEventListener('resize', measureGoo)
      window.removeEventListener('load', measureGoo)
    })

    useRender(() =>
      h(
        'div',
        {
          ref: rootRef,
          class: [
            'fui-navbar',
            {
              'fui-navbar--fixed': props.fixed,
              'fui-navbar--shadow': props.shadow || shadowActive.value,
              'fui-navbar--hidden': hidden.value,
              'fui-navbar--square': props.square,
              'fui-navbar--padding': props.paddingScroll && !paddingActive.value,
              'fui-navbar--colored': !!navbarColor.value,
              'fui-navbar--text-white': props.textWhite,
            },
            props.class,
          ],
          style: [
            navbarColor.value ? { '--fui-navbar-color': navbarColor.value } : null,
            props.style,
          ],
        },
        [
          h('div', { class: 'fui-navbar__inner' }, [
            h('div', { class: 'fui-navbar__left' }, slots.left?.()),
            h('div', { class: 'fui-navbar__center' }, slots.default?.()),
            h('div', { class: 'fui-navbar__right' }, slots.right?.()),
          ]),
          !props.notLine
            ? h('div', {
                class: ['fui-navbar__line', { 'fui-navbar__line--still': lineNoTransition.value }],
                style: { left: `${lineLeft.value}px`, width: `${lineWidth.value}px` },
              })
            : null,
          // Fluid junction with a detected sidebar: a shell-coloured fillet in the
          // corner where the navbar bottom + sidebar right meet the content, so
          // the content reads with a convex rounded corner nestled into the shell
          // (the shell's inside corner carries the negative radius — Vuesax look).
          // `background: inherit` matches the shell colour and tracks the theme;
          // the clip-path is the fusion-goo corner curve.
          props.gooCorner && sidebarW.value > 0
            ? h('div', {
                class: 'fui-navbar__goo',
                'aria-hidden': 'true',
                style: {
                  position: 'absolute',
                  left: `${sidebarW.value}px`,
                  top: '100%',
                  width: `${props.cornerSize}px`,
                  height: `${props.cornerSize}px`,
                  backgroundColor: 'inherit',
                  clipPath: `path('${shellCornerSvg(props.cornerSize)}')`,
                  pointerEvents: 'none',
                },
              })
            : null,
        ]
      )
    )
  },
})

export const makeFNavbarItemProps = propsFactory(
  {
    id: String as PropType<string>,
    active: Boolean,
    // A non-interactive bold label (e.g. a section title inside a group dropdown).
    header: Boolean,
    to: String as PropType<string>,
    href: String as PropType<string>,
    target: { type: String, default: '_blank' },
    ...makeComponentProps(),
  },
  'FNavbarItem'
)

export const FNavbarItem = genericComponent()({
  name: 'FNavbarItem',
  props: makeFNavbarItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    const navbar = inject(FNavbarKey, null)
    const inDropdown = inject(FNavbarInDropdownKey, false)
    const el = ref<HTMLElement>()
    const vm = getCurrentInstance()

    const isActive = computed(
      () => props.active || (!!props.id && navbar?.activeId.value === props.id)
    )

    function syncLine(transition = true) {
      // Dropdown items mark themselves with a dot, not the navbar line.
      if (inDropdown) return
      if (isActive.value && el.value && navbar) navbar.moveLine(el.value, transition)
    }

    onMounted(() => {
      // Wait for fonts/layout to settle before measuring (Vuesax does the same).
      if (!inDropdown) setTimeout(() => syncLine(false), 150)
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

    useRender(() => {
      if (props.header) {
        return h(
          'div',
          {
            class: ['fui-navbar__item', 'fui-navbar__item--header', props.class],
            style: props.style,
          },
          slots.default?.()
        )
      }
      return h(
        'button',
        {
          ref: el,
          type: 'button',
          class: ['fui-navbar__item', { 'fui-navbar__item--active': isActive.value }, props.class],
          style: props.style,
          onClick,
        },
        slots.default?.()
      )
    })
  },
})

export const makeFNavbarGroupProps = propsFactory(
  {
    id: String as PropType<string>,
    title: String as PropType<string>,
    active: Boolean,
    ...makeComponentProps(),
  },
  'FNavbarGroup'
)

export const FNavbarGroup = genericComponent()({
  name: 'FNavbarGroup',
  props: makeFNavbarGroupProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    const navbar = inject(FNavbarKey, null)
    const triggerEl = ref<HTMLElement>()
    // Items in this group's dropdown shouldn't drive the navbar line.
    provide(FNavbarInDropdownKey, true)

    const isActive = computed(
      () => props.active || (!!props.id && navbar?.activeId.value === props.id)
    )

    function syncLine(transition = true) {
      if (isActive.value && triggerEl.value && navbar) navbar.moveLine(triggerEl.value, transition)
    }
    onMounted(() => setTimeout(() => syncLine(false), 150))
    watch(isActive, val => val && nextTick(() => syncLine()))

    function onClick(e: MouseEvent) {
      emit('click', e)
      if (props.id && navbar) navbar.setActive(props.id)
    }

    useRender(() =>
      h('div', { class: ['fui-navbar__group', props.class], style: props.style }, [
        h(
          'button',
          {
            ref: triggerEl,
            type: 'button',
            class: [
              'fui-navbar__item',
              'fui-navbar__group-trigger',
              { 'fui-navbar__item--active': isActive.value },
            ],
            onClick,
          },
          slots.label ? slots.label() : props.title
        ),
        h('div', { class: 'fui-navbar__dropdown' }, slots.default?.()),
      ])
    )
  },
})
