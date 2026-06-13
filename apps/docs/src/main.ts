import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import App from './App.vue'
import fusionui from './plugins/fusionui'
import Example from './components/Example.vue'
import Markup from './components/Markup.vue'
import ApiTable from './components/ApiTable.vue'
import ButtonPlayground from './components/ButtonPlayground.vue'
import InputPlayground from './components/InputPlayground.vue'
import CardPlayground from './components/CardPlayground.vue'
import AlertPlayground from './components/AlertPlayground.vue'
import '@fusionui/vue/styles'
import './styles/docs.scss'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

createApp(App)
  .use(router)
  .use(fusionui)
  // Make doc helpers available inside markdown pages without imports.
  .component('Example', Example)
  .component('Markup', Markup)
  .component('ApiTable', ApiTable)
  .component('ButtonPlayground', ButtonPlayground)
  .component('InputPlayground', InputPlayground)
  .component('CardPlayground', CardPlayground)
  .component('AlertPlayground', AlertPlayground)
  .mount('#app')
