import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'

// Default to the operating system's color scheme, and follow it live.
const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const fusionui = createFusionUI({
  theme: { defaultTheme: media?.matches ? 'dark' : 'light' },
  icons: {
    defaultSet: 'fusion',
    sets: { fusion: fusionSet },
    aliases: fusionAliases,
  },
})

media?.addEventListener?.('change', e => fusionui.theme.change(e.matches ? 'dark' : 'light'))

export default fusionui
