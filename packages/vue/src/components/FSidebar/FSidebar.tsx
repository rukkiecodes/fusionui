import {
  computed,
  getCurrentInstance,
  h,
  inject,
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
import { convertToUnit } from '../../util/helpers'
import { FIcon } from '../FIcon'

interface SidebarContext {
  activeId: Ref<string | undefined>
  setActive: (id: string | undefined) => void
  reduced: Ref<boolean>
}

export const FSidebarKey: InjectionKey<SidebarContext> = Symbol.for('fusionui:sidebar')

export const makeFSidebarProps = propsFactory(
  {
    // Active item id (v-model).
    modelValue: String as PropType<string>,
    // Drawer visibility for the overlay mode (v-model:open).
    open: Boolean,
    // Render in place as part of the layout instead of a fixed overlay.
    permanent: Boolean,
    // Collapse to a 50px icon rail (Discord style).
    reduce: Boolean,
    // Expand the rail while hovered.
    hoverExpand: Boolean,
    right: Boolean,
    square: Boolean,
    // Hide the rounded active-line indicator.
    notLineActive: Boolean,
    width: { type: [String, Number] as PropType<string | number>, default: 260 },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSidebar'
)

export const FSidebar = genericComponent()({
  name: 'FSidebar',
  props: makeFSidebarProps(),
  emits: {
    'update:modelValue': (_v: string | undefined) => true,
    'update:open': (_v: boolean) => true,
  },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)
    const isOpen = useProxiedModel(props, 'open', false)

    const hovered = ref(false)
    const reduced = computed(() => props.reduce && !(props.hoverExpand && hovered.value))

    provide(FSidebarKey, {
      activeId: model,
      setActive: id => {
        model.value = id
      },
      reduced,
    })

    // Overlay mode closes when clicking anywhere outside the drawer.
    function onWindowClick(e: MouseEvent) {
      if (!isOpen.value || props.permanent) return
      if (!(e.target as Element | null)?.closest?.('.fui-sidebar')) isOpen.value = false
    }
    let listening = false
    function syncListener(open: boolean) {
      if (typeof window === 'undefined' || props.permanent) return
      if (open && !listening) {
        // Delay so the opening click itself doesn't immediately close it.
        setTimeout(() => window.addEventListener('click', onWindowClick), 200)
        listening = true
      } else if (!open && listening) {
        window.removeEventListener('click', onWindowClick)
        listening = false
      }
    }
    watch(isOpen, syncListener)
    onMounted(() => syncListener(isOpen.value))
    onBeforeUnmount(() => {
      if (listening && typeof window !== 'undefined')
        window.removeEventListener('click', onWindowClick)
    })

    useRender(() =>
      h(
        'aside',
        {
          class: [
            'fui-sidebar',
            {
              'fui-sidebar--open': isOpen.value || props.permanent,
              'fui-sidebar--permanent': props.permanent,
              'fui-sidebar--reduce': reduced.value,
              'fui-sidebar--right': props.right,
              'fui-sidebar--square': props.square,
              'fui-sidebar--no-line': props.notLineActive,
            },
            props.class,
          ],
          style: [{ '--fui-sidebar-width': convertToUnit(props.width) }, props.style],
          onMouseenter: () => {
            hovered.value = true
          },
          onMouseleave: () => {
            hovered.value = false
          },
        },
        [
          slots.logo ? h('div', { class: 'fui-sidebar__logo' }, slots.logo()) : null,
          slots.header ? h('div', { class: 'fui-sidebar__header' }, slots.header()) : null,
          h('div', { class: 'fui-sidebar__body' }, slots.default?.()),
          slots.footer ? h('div', { class: 'fui-sidebar__footer' }, slots.footer()) : null,
        ]
      )
    )
  },
})

export const makeFSidebarItemProps = propsFactory(
  {
    id: String as PropType<string>,
    active: Boolean,
    to: String as PropType<string>,
    href: String as PropType<string>,
    target: { type: String, default: '_blank' },
    ...makeComponentProps(),
  },
  'FSidebarItem'
)

export const FSidebarItem = genericComponent()({
  name: 'FSidebarItem',
  props: makeFSidebarItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    const sidebar = inject(FSidebarKey, null)
    const vm = getCurrentInstance()

    const isActive = computed(
      () => props.active || (!!props.id && sidebar?.activeId.value === props.id)
    )

    function onClick(e: MouseEvent) {
      emit('click', e)
      if (props.id && sidebar) sidebar.setActive(props.id)
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
          type: 'button',
          class: [
            'fui-sidebar__item',
            {
              'fui-sidebar__item--active': isActive.value,
              'fui-sidebar__item--has-icon': !!slots.icon,
            },
            props.class,
          ],
          style: props.style,
          onClick,
        },
        [
          slots.icon ? h('div', { class: 'fui-sidebar__item-icon' }, slots.icon()) : null,
          h('div', { class: 'fui-sidebar__item-text' }, slots.default?.()),
        ]
      )
    )
  },
})

export const makeFSidebarGroupProps = propsFactory(
  {
    open: Boolean,
    ...makeComponentProps(),
  },
  'FSidebarGroup'
)

export const FSidebarGroup = genericComponent()({
  name: 'FSidebarGroup',
  props: makeFSidebarGroupProps(),
  setup(props: any, { slots }: any) {
    const isOpen = ref(props.open)
    const contentRef = ref<HTMLElement>()
    const groupRef = ref<HTMLElement>()

    function afterTransition(el: HTMLElement, fn: () => void) {
      const done = () => {
        fn()
        el.removeEventListener('transitionend', done)
      }
      el.addEventListener('transitionend', done)
    }

    function toggle() {
      const c = contentRef.value
      if (!c) {
        isOpen.value = !isOpen.value
        return
      }
      if (isOpen.value) {
        c.style.height = c.scrollHeight + 'px'
        void c.offsetHeight
        c.style.height = '0'
      } else {
        c.style.height = c.scrollHeight + 'px'
        afterTransition(c, () => (c.style.height = 'auto'))
      }
      isOpen.value = !isOpen.value
    }

    onMounted(() => {
      // Open automatically when it contains the active item (Vuesax).
      if (groupRef.value?.querySelector('.fui-sidebar__item--active')) isOpen.value = true
      const c = contentRef.value
      if (!c) return
      c.style.transition = 'none'
      c.style.height = isOpen.value ? 'auto' : '0'
      void c.offsetHeight
      c.style.transition = ''
    })

    useRender(() =>
      h(
        'div',
        {
          ref: groupRef,
          class: ['fui-sidebar__group', { 'fui-sidebar__group--open': isOpen.value }, props.class],
          style: props.style,
        },
        [
          h('div', { class: 'fui-sidebar__group-header', onClick: toggle }, [
            slots.header?.(),
            h(FIcon, { icon: '$dropdown', class: 'fui-sidebar__group-chevron', size: 'small' }),
          ]),
          h('div', { ref: contentRef, class: 'fui-sidebar__group-content' }, slots.default?.()),
        ]
      )
    )
  },
})
