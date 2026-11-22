
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api, usuario } from '../services/api.js'
import { usePeticion } from '../composables/usePeticion.js'
import EstadoPeticion from '../components/EstadoPeticion.vue'

const route = useRoute()
const partido = ref(null)
const resultado = ref(null)

const form = reactive({
  puntajeLocal: 0,
  puntajeVisitante: 0
})

const admin = computed(() => usuario.value?.rol === 'ADMIN')

const { cargando, error, exito, ejecutar } = usePeticion()

async function datos() {
  partido.value = await api(`/partidos/${route.params.id}`)

  resultado.value = await api(
    `/partidos/${route.params.id}/resultado`
  )

  if (resultado.value) {
    Object.assign(form, {
      puntajeLocal: resultado.value.puntajeLocal,
      puntajeVisitante: resultado.value.puntajeVisitante
    })
  }
}

function cargar() {
  ejecutar(datos)
}

function guardar() {
  ejecutar(async () => {
    await api(
      `/partidos/${route.params.id}/resultado`,
      'PUT',
      form
    )

    await datos()
  }, 'Resultado oficial guardado')
}

function cancelar() {
  if (!confirm('¿Cancelar este partido?')) return

  ejecutar(async () => {
    await api(
      `/partidos/${route.params.id}/cancelar`,
      'PATCH'
    )

    await datos()
  }, 'Partido cancelado')
}

onMounted(cargar)
</script>

<template>
  <EstadoPeticion
    :cargando="cargando"
    :error="error"
    :exito="exito"
    @reintentar="cargar"
  />

  <article v-if="partido">
    <h1>
      {{ partido.local.nombre }}
      contra
      {{ partido.visitante.nombre }}
    </h1>

    <p>
      {{ partido.torneo.nombre }} ·
      Ronda {{ partido.ronda }} ·
      {{ partido.estado }}
    </p>

    <p>
      {{ new Date(partido.fechaHora).toLocaleString() }}
    </p>

    <p v-if="resultado">
      Resultado oficial:
      {{ resultado.puntajeLocal }} –
      {{ resultado.puntajeVisitante }}
    </p>

    <p v-else>
      Sin resultado oficial.
    </p>

    <form
      v-if="admin && partido.estado !== 'CANCELADO'"
      @submit.prevent="guardar"
    >
      <label>
        Puntaje local
        <input
          v-model.number="form.puntajeLocal"
          type="number"
          min="0"
          max="999"
          required
        >
      </label>

      <label>
        Puntaje visitante
        <input
          v-model.number="form.puntajeVisitante"
          type="number"
          min="0"
          max="999"
          required
        >
      </label>

      <button :disabled="cargando">
        Guardar resultado oficial
      </button>
    </form>

    <button
      v-if="admin && partido.estado === 'PROGRAMADO'"
      :disabled="cargando"
      @click="cancelar"
    >
      Cancelar partido
    </button>

    <RouterLink :to="`/torneos/${partido.torneoId}`">
      Ver torneo
    </RouterLink>
  </article>
</template>
