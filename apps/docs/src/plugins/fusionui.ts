import { createFusionUI } from '@fusionui/vue'
import { featherSet, featherAliases } from '@fusionui/icons'

// Default to the operating system's color scheme, and follow it live.
const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const fusionui = createFusionUI({
  theme: { defaultTheme: media?.matches ? 'dark' : 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})

media?.addEventListener?.('change', e => fusionui.theme.change(e.matches ? 'dark' : 'light'))

export default fusionui
