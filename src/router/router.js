import DashboardView from '@/views/DashboardView.vue'
import FormAddView from '@/views/FormAddView.vue'
import FormDetteView from '@/views/FormDetteView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'homeForm',
    component: HomeView,
  },
  {
    path: '/dashboardView',
    name: 'dashboardView',
    component: DashboardView,
  },
  {
    path: '/paramsVue',
    name: 'params',
    component: HomeView,
  },
  {
    path: '/formAddView',
    name: 'formAddView',
    component: FormAddView,
  },
  {
    path: '/formDetteView',
    name: 'formDetteView',
    component: FormDetteView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
