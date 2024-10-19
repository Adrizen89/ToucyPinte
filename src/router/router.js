import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'homeForm',
    component: HomeView,
  },
  {
    path: '/dashboardVue',
    name: 'dashboard',
    component: HomeView,
  },
  {
    path: '/paramsVue',
    name: 'params',
    component: HomeView,
  },
  {
    path: '/montantVue',
    name: 'montant',
    component: HomeView,
  },
  {
    path: '/detteVue',
    name: 'dette',
    component: HomeView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
