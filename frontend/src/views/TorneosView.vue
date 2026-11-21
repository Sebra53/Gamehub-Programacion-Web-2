<script setup>
import { ref, computed, onMounted } from 'vue'
import { api, usuario } from '../services/api.js'
import { usePeticion } from '../composables/usePeticion.js'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const torneos = ref([]), texto = ref(''), juego = ref(''), estado = ref('')
const admin = computed(() => usuario.value?.rol === 'ADMIN')
const juegos = computed(() => [...new Set(torneos.value.map(t => t.videojuego))])
const visibles = computed(() => torneos.value.filter(t =>
  t.nombre.toLowerCase().includes(texto.value.toLowerCase()) &&
  (!juego.value || t.videojuego === juego.value) &&
  (!estado.value || t.estado === estado.value)))
const { cargando, error, exito, ejecutar } = usePeticion()
function cargar() { ejecutar(async () => { torneos.value = await api('/torneos') }) }
async function borrar(id) {
  if (!confirm('¿Eliminar este torneo vacío?')) return
  await ejecutar(async () => {
    await api(`/torneos/${id}`, 'DELETE')
    torneos.value = await api('/torneos')
  }, 'Torneo eliminado')
}
onMounted(cargar)
</script>
<template>
  <h1>Torneos</h1>
  <RouterLink v-if="admin" to="/torneos/nuevo">Crear torneo</RouterLink>
  <form @submit.prevent>
    <label>Buscar por nombre<input v-model.trim="texto"></label>
    <label>Videojuego<select v-model="juego">
      <option value="">Todos</option>
      <option v-for="j in juegos" :key="j">{{ j }}</option>
    </select></label>
    <label>Estado<select v-model="estado">
      <option value="">Todos</option>
      <option>ABIERTO</option><option>CERRADO</option><option>FINALIZADO</option>
    </select></label>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
  <p v-if="!cargando && !error && !visibles.length">No hay torneos para esos filtros.</p>
  <article v-for="t in visibles" :key="t.id">
    <h2>{{ t.nombre }}</h2><p>{{ t.videojuego }} · {{ t.estado }}</p>
    <RouterLink :to="`/torneos/${t.id}`">Detalle</RouterLink>
    <template v-if="admin">
      <RouterLink :to="`/torneos/${t.id}/editar`">Editar</RouterLink>
      <button :disabled="cargando" @click="borrar(t.id)">Eliminar</button>
    </template>
  </article>
</template>
