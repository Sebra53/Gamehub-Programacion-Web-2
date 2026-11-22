
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from './EstadoPeticion.vue'

const props = defineProps({
  torneoId: { type: Number, required: true }
})

const filas = ref([])

const { cargando, error, exito, ejecutar } = usePeticion()

function cargar() {
  ejecutar(async () => {
    filas.value = await api(`/ranking/${props.torneoId}`)
  })
}

onMounted(cargar)
</script>

<template>
  <h2>Tabla de posiciones</h2>

  <p>Victoria 3 puntos · Empate 1 · Derrota 0</p>

  <button :disabled="cargando" @click="cargar">
    Actualizar tabla
  </button>

  <EstadoPeticion
    :cargando="cargando"
    :error="error"
    :exito="exito"
    @reintentar="cargar"
  />

  <p v-if="!cargando && !error && !filas.length">
    Sin equipos inscritos.
  </p>

  <div v-else-if="filas.length" class="tabla">
    <table>
      <thead>
        <tr>
          <th>Equipo</th>
          <th>PJ</th>
          <th>V</th>
          <th>E</th>
          <th>D</th>
          <th>DF</th>
          <th>Pts</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="f in filas" :key="f.equipoId">
          <td>{{ f.nombre }}</td>
          <td>{{ f.jugados }}</td>
          <td>{{ f.victorias }}</td>
          <td>{{ f.empates }}</td>
          <td>{{ f.derrotas }}</td>
          <td>{{ f.diferencia }}</td>
          <td>{{ f.puntos }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
