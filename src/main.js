import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import HomePageVue from './pages/HomePage.vue'
import AuthorizationPageVue from './pages/AuthorizationPage.vue'
import ChooseProjectPageVue from './pages/ChooseProjectPage.vue'
import ChooseMilestonePageVue from './pages/ChooseMilestonePage.vue'
import LoadIssuesPageVue from './pages/LoadIssuesPage.vue'
import CalculateEffortPageVue from './pages/CalculateEffortPage.vue'
import ChartPageVue from './pages/ChartPage.vue'

import * as Vue from 'vue';
import * as VueRouter from 'vue-router'; // alternative ways of importing

const routes = [
  { path: '/', component: HomePageVue },
	{ path: '/stage/auth_callback', component: AuthorizationPageVue},
	{ path: '/stage/choose_project', component: ChooseProjectPageVue},
	{ path: '/stage/choose_milestone', component: ChooseMilestonePageVue},
	{ path: '/stage/load_issues', component: LoadIssuesPageVue},
	{ path: '/stage/calculate_effort', component: CalculateEffortPageVue},
	{ path: '/stage/chart', component: ChartPageVue},
  // { path: '/about', component: About },
]

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
})

const app = Vue.createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)

app.mount('#app')