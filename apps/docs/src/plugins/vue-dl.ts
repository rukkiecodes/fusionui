import { createVueDL } from 'vue-dl'
import { featherSet, featherAliases } from '@vue-dl/icons-feather'

// Register the full Feather set so docs examples can use string icon names
// (`<vd-icon icon="bell" />`) in addition to the default semantic aliases.
export default createVueDL({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})
