<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const route = useRoute(), torneo = ref(null), mostrar = ref(true)
const { cargando, error, exito, ejecutar } = usePeticion()
function cargar() {
  ejecutar(async () => { torneo.value = await api(`/torneos/${route.params.id}`) })
}
onMounted(cargar)
</script>
<template>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
  <article v-if="torneo">
    <h1>{{ torneo.nombre }}</h1>
    <p>{{ torneo.videojuego }} · {{ torneo.estado }} · {{ torneo.modalidad }}</p>
    <button @click="mostrar = !mostrar">Mostrar u ocultar fechas</button>
    <div v-show="mostrar">
      <p>Inicio: {{ new Date(torneo.fechaInicio).toLocaleString() }}</p>
      <p>Cierre: {{ new Date(torneo.cierreInscripcion).toLocaleString() }}</p>
      <p>Cupo máximo: {{ torneo.cupoMaximo }}</p>
    </div>
  </article>
</template>
