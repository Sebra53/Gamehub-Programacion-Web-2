import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: InicioView }],
})
