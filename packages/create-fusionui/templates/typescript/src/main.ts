import { createApp } from 'vue'
import { createFusionUI } from '@rukkiecodes/vue'
import { featherSet, featherAliases } from '@rukkiecodes/icons'
import '@rukkiecodes/vue/styles'
import App from './App.vue'

const fusionui = createFusionUI({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})

createApp(App).use(fusionui).mount('#app')
