import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import App from './App.vue'
import fusionui from './plugins/fusionui'
import NativeSnack from './components/NativeSnack.vue'
import '@rukkiecodes/vue/styles'
import './styles/docs.scss'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: to => (to.hash ? { el: to.hash, top: 80 } : { top: 0 }),
})

createApp(App)
  .use(router)
  .use(fusionui)
  // Available inside markdown pages without an import.
  .component('NativeSnack', NativeSnack)
  .mount('#app')
