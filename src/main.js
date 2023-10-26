import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import HomePageVue from './pages/HomePage.vue'

import * as Vue from 'vue';
import * as VueRouter from 'vue-router'; // alternative ways of importing

const routes = [
  { path: '/', component: HomePageVue },
  // { path: '/about', component: About },
]

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

const app = Vue.createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)

app.mount('#app')