import { createApp } from 'vue'
import { createFusionUI } from '@fusionui/vue'
import { featherSet, featherAliases } from '@fusionui/icons'
import '@fusionui/vue/styles'
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
