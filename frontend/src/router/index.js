import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import AccesoView from '../views/AccesoView.vue'
import PerfilView from '../views/PerfilView.vue'
import { api, token, usuario } from '../services/api'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: InicioView },
    { path: '/login', component: AccesoView },
    { path: '/registro', component: AccesoView, props: { registro: true } },
    { path: '/perfil', component: PerfilView, meta: { privada: true } },
    { path: '/:pathMatch(.*)*', component: InicioView },
  ],
})
router.beforeEach(async (to) => {
  if (token.value) {
    try { usuario.value = await api('/auth/yo') }
    catch { return to.meta.privada ? '/login' : true }
  }
  if (to.meta.privada && !usuario.value) return '/login'
  if (to.meta.admin && usuario.value?.rol !== 'ADMIN') return '/torneos'
  return true
})
