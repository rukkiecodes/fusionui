import { createVueDL } from 'vue-dl'
import { featherSet, featherAliases } from '@vue-dl/icons-feather'

// Default to the operating system's color scheme, and follow it live.
const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const vuedl = createVueDL({
  theme: { defaultTheme: media?.matches ? 'dark' : 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})

media?.addEventListener?.('change', e => vuedl.theme.change(e.matches ? 'dark' : 'light'))

export default vuedl
