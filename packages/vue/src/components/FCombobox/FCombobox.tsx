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
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const core = useCombobox(props, { allowCustom: true })

    useRender(() => renderCombobox('fui-combobox', props, slots, core))
  },
})
