<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const equipos = ref([])
const { cargando, error, exito, ejecutar } = usePeticion()
function cargar() { ejecutar(async () => { equipos.value = await api('/equipos') }) }
onMounted(cargar)
</script>
<template>
  <h1>Equipos</h1><RouterLink to="/equipos/nuevo">Crear equipo</RouterLink>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
  <p v-if="!cargando && !error && !equipos.length">Todavía no hay equipos.</p>
  <article v-for="e in equipos" :key="e.id">
    <h2>{{ e.nombre }}</h2><p>{{ e.juegoPreferido }} · {{ e.estado }}</p>
    <RouterLink :to="`/equipos/${e.id}`">Detalle e integrantes</RouterLink>
  </article>
</template>
