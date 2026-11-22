import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import AccesoView from '../views/AccesoView.vue'
import PerfilView from '../views/PerfilView.vue'
import EquiposView from '../views/EquiposView.vue'
import EquipoDetalleView from '../views/EquipoDetalleView.vue'
import TorneosView from '../views/TorneosView.vue'
import TorneoFormView from '../views/TorneoFormView.vue'
import TorneoDetalleView from '../views/TorneoDetalleView.vue'
import PartidosView from '../views/PartidosView.vue'
import PartidoDetalleView from '../views/PartidoDetalleView.vue'

import { api, token, usuario } from '../services/api'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: InicioView },
    { path: '/partidos', component: PartidosView, meta: { privada: true } },
    { path: '/partidos/:id', component: PartidoDetalleView, meta: { privada: true } },
    { path: '/login', component: AccesoView },
    { path: '/registro', component: AccesoView, props: { registro: true } },
    { path: '/perfil', component: PerfilView, meta: { privada: true } },
    { path: '/equipos', component: EquiposView, meta: { privada: true } },
    { path: '/equipos/nuevo', component: EquipoDetalleView, meta: { privada: true } },
    { path: '/equipos/:id', component: EquipoDetalleView, meta: { privada: true } },
    { path: '/torneos', component: TorneosView, meta: { privada: true } },
    { path: '/torneos/nuevo', component: TorneoFormView, meta: { privada: true, admin: true } },
    { path: '/torneos/:id/editar', component: TorneoFormView, meta: { privada: true, admin: true } },
    { path: '/torneos/:id', component: TorneoDetalleView, meta: { privada: true } },
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
