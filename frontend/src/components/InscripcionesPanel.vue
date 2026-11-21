<script setup>
import { ref, computed, onMounted } from 'vue'
import { api, usuario } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from './EstadoPeticion.vue'
const props = defineProps({ torneoId: { type: Number, required: true } })
const inscripciones = ref([]), equipos = ref([]), equipoId = ref('')
const { cargando, error, exito, ejecutar } = usePeticion()
const propios = computed(() => equipos.value.filter(e =>
  usuario.value?.rol === 'ADMIN' || e.capitanId === usuario.value?.id))
const aceptadas = computed(() => inscripciones.value.filter(i => i.estado === 'ACEPTADA'))
async function datos() {
  inscripciones.value = await api(`/inscripciones/torneo/${props.torneoId}`)
  equipos.value = await api('/equipos')
}
function cargar() { ejecutar(datos) }
function inscribir() {
  ejecutar(async () => {
    await api('/inscripciones', 'POST', {
      torneoId: props.torneoId, equipoId: Number(equipoId.value),
    })
    await datos()
  }, 'Equipo inscrito')
}
function puede(i) {
  return usuario.value?.rol === 'ADMIN' || i.equipo.capitanId === usuario.value?.id
}
function cancelar(i) {
  if (!confirm('¿Cancelar esta inscripción?')) return
  ejecutar(async () => {
    await api(`/inscripciones/${i.id}/cancelar`, 'PATCH')
    await datos()
  }, 'Inscripción cancelada')
}
onMounted(cargar)
</script>
<template>
  <h2>Inscripciones</h2><p>Equipos aceptados: {{ aceptadas.length }}</p>
  <form @submit.prevent="inscribir">
    <label>Equipo<select v-model="equipoId" required>
      <option value="" disabled>Selecciona tu equipo</option>
      <option v-for="e in propios" :key="e.id" :value="e.id">{{ e.nombre }}</option>
    </select></label>
    <button :disabled="cargando">Inscribir equipo</button>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
  <p v-if="!cargando && !error && !inscripciones.length">Sin inscripciones.</p>
  <ul><li v-for="i in inscripciones" :key="i.id">
    {{ i.equipo.nombre }} · {{ i.estado }}
    <button v-if="i.estado === 'ACEPTADA' && puede(i)" :disabled="cargando" @click="cancelar(i)">Cancelar</button>
  </li></ul>
</template>
