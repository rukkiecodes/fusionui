import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { provideTheme } from '../../composables/theme'
import { comboboxSharedProps, renderCombobox, useCombobox } from './shared'

export const makeFAutocompleteProps = propsFactory({ ...comboboxSharedProps }, 'FAutocomplete')

/**
 * A select whose menu filters as you type. The value is always one of `items` —
 * text that never matched an option is reverted when the field is left. Use
 * `FCombobox` when the user must be able to invent values.
 */
export const FAutocomplete = genericComponent()({
  name: 'FAutocomplete',
  props: makeFAutocompleteProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const core = useCombobox(props)

    useRender(() => renderCombobox('fui-autocomplete', props, slots, core))
  },
})
