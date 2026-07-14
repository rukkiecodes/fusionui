import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { provideTheme } from '../../composables/theme'
import { comboboxSharedProps, renderCombobox, useCombobox } from '../FAutocomplete/shared'

export const makeFComboboxProps = propsFactory({ ...comboboxSharedProps }, 'FCombobox')

/**
 * `FAutocomplete` that also accepts values of its own: pressing Enter — or
 * leaving the field — commits whatever is typed, even when nothing in `items`
 * matches. With `multiple`, every entry becomes another chip, which makes it the
 * component to reach for when collecting tags.
 */
export const FCombobox = genericComponent()({
  name: 'FCombobox',
  props: makeFComboboxProps(),
  emits: {
    'update:modelValue': (_v: unknown) => true,
    /** The typed query — what a server-side filter listens to. */
    'update:search': (_v: string) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    // `emit` has to reach the core, or the `update:search` watcher inside it
    // fires into nothing and the event never leaves the component.
    const core = useCombobox(props, { allowCustom: true, emit })

    useRender(() => renderCombobox('fui-combobox', props, slots, core))
  },
})
