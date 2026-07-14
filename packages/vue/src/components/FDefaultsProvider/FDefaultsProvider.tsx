import { watchEffect } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { injectDefaults, provideDefaults } from '../../composables/defaults'
import type { DefaultsInstance } from '../../composables/defaults'
import { mergeDeep } from '../../util/helpers'

export const makeFDefaultsProviderProps = propsFactory(
  {
    /** `{ FBtn: { variant: 'tonal' }, global: { size: 'small' } }` */
    defaults: Object as PropType<DefaultsInstance>,
    /** Passes the inherited defaults straight through, ignoring `defaults`. */
    disabled: Boolean,
    /** Drops the inherited defaults — the subtree sees only `defaults`. */
    scoped: Boolean,
  },
  'FDefaultsProvider'
)

export const FDefaultsProvider = genericComponent()({
  name: 'FDefaultsProvider',
  props: makeFDefaultsProviderProps(),
  setup(props: any, { slots }: any) {
    // `provideDefaults` installs a fresh defaults ref for this subtree, seeded
    // with `inherited ⊕ props.defaults`. It snapshots at setup, so the effect
    // below keeps that same ref in sync as the props (or the inherited
    // defaults) change — every component reads through it via `useDefaults`.
    const inherited = injectDefaults()
    const provided = provideDefaults(props.defaults)

    watchEffect(() => {
      if (props.disabled) {
        provided.value = inherited.value
      } else if (props.scoped) {
        provided.value = (props.defaults ?? {}) as DefaultsInstance
      } else {
        provided.value = props.defaults
          ? (mergeDeep(inherited.value, props.defaults) as DefaultsInstance)
          : inherited.value
      }
    })

    useRender(() => slots.default?.())
  },
})
