import { createApp } from 'vue'
import { createVueDL } from 'vue-dl'
import { featherSet, featherAliases } from '@vue-dl/icons-feather'
import 'vue-dl/styles'
import App from './App.vue'

const vuedl = createVueDL({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'feather',
    sets: { feather: featherSet },
    aliases: featherAliases,
  },
})

createApp(App).use(vuedl).mount('#app')
