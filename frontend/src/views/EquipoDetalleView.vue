<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, usuario } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const route = useRoute(), router = useRouter(), equipo = ref(null)
const form = reactive({ nombre: '', juegoPreferido: '', estado: 'ACTIVO', correos: '' })
const puede = computed(() => !route.params.id || usuario.value?.rol === 'ADMIN' ||
  equipo.value?.capitanId === usuario.value?.id)
const { cargando, error, exito, ejecutar } = usePeticion()
function cargar() {
  if (!route.params.id) return
  ejecutar(async () => {
    equipo.value = await api(`/equipos/${route.params.id}`)
    const e = equipo.value
    Object.assign(form, { nombre: e.nombre, juegoPreferido: e.juegoPreferido,
      estado: e.estado, correos: e.integrantes.map(u => u.correo).join(', ') })
  })
}
function guardar() {
  ejecutar(async () => {
    const dto = { nombre: form.nombre, juegoPreferido: form.juegoPreferido,
      estado: form.estado,
      integrantesCorreos: form.correos.split(',').map(c => c.trim()).filter(Boolean) }
    if (dto.integrantesCorreos.some(c => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c))) {
      throw new Error('Revisa los correos separados por coma')
    }
    const e = await api(route.params.id ? `/equipos/${route.params.id}` : '/equipos',
      route.params.id ? 'PATCH' : 'POST', dto)
    if (route.params.id) equipo.value = await api(`/equipos/${e.id}`)
    else await router.push(`/equipos/${e.id}`)
  }, 'Equipo guardado')
}
function borrar() {
  if (!confirm('¿Eliminar este equipo sin actividad?')) return
  ejecutar(async () => {
    await api(`/equipos/${route.params.id}`, 'DELETE')
    await router.push('/equipos')
  })
}
onMounted(cargar)
</script>
<template>
  <h1>{{ equipo?.nombre || 'Crear equipo' }}</h1>
  <article v-if="equipo">
    <p>Capitán: {{ equipo.capitan.alias }}</p>
    <p>{{ equipo.juegoPreferido }} · {{ equipo.estado }}</p>
    <h2>Integrantes</h2>
    <ul><li v-for="u in equipo.integrantes" :key="u.id">{{ u.alias }}</li></ul>
  </article>
  <form v-if="puede" @submit.prevent="guardar">
    <label>Nombre<input v-model.trim="form.nombre" required minlength="3" maxlength="80"></label>
    <label>Videojuego<input v-model.trim="form.juegoPreferido" required minlength="2" maxlength="60"></label>
    <label>Estado<select v-model="form.estado"><option>ACTIVO</option><option>INACTIVO</option></select></label>
    <label>Correos de integrantes separados por coma<input v-model.trim="form.correos"></label>
    <button :disabled="cargando">Guardar equipo</button>
    <button v-if="equipo" type="button" :disabled="cargando" @click="borrar">Eliminar</button>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
</template>
