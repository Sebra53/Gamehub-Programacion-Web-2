
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { api, usuario } from '../services/api.js'
import { usePeticion } from '../composables/usePeticion.js'
import EstadoPeticion from '../components/EstadoPeticion.vue'

const partidos = ref([])
const torneos = ref([])
const inscritos = ref([])

const form = reactive({
  torneoId: '',
  equipoLocalId: '',
  equipoVisitanteId: '',
  fechaHora: '',
  ronda: 1
})

const admin = computed(() => usuario.value?.rol === 'ADMIN')
const { cargando, error, exito, ejecutar } = usePeticion()

async function datos() {
  partidos.value = await api('/partidos')
  torneos.value = await api('/torneos')
}

function cargar() {
  ejecutar(datos)
}

function elegirTorneo() {
  inscritos.value = []
  form.equipoLocalId = ''
  form.equipoVisitanteId = ''

  if (!form.torneoId) return

  ejecutar(async () => {
    inscritos.value = (
      await api(`/inscripciones/torneo/${form.torneoId}`)
    ).filter(i => i.estado === 'ACEPTADA')
  })
}

function crear() {
  ejecutar(async () => {
    if (form.equipoLocalId === form.equipoVisitanteId) {
      throw new Error('Elige dos equipos distintos')
    }

    await api('/partidos', 'POST', {
      ...form,
      torneoId: Number(form.torneoId),
      equipoLocalId: Number(form.equipoLocalId),
      equipoVisitanteId: Number(form.equipoVisitanteId),
      fechaHora: new Date(form.fechaHora).toISOString()
    })

    await datos()
  }, 'Partido programado')
}

onMounted(cargar)
</script>

<template>
  <h1>Partidos</h1>

  <form v-if="admin" @submit.prevent="crear">
    <h2>Programar partido</h2>

    <label>
      Torneo
      <select v-model="form.torneoId" required @change="elegirTorneo">
        <option value="" disabled>Selecciona</option>
        <option v-for="t in torneos" :key="t.id" :value="t.id">
          {{ t.nombre }}
        </option>
      </select>
    </label>

    <label>
      Local
      <select v-model="form.equipoLocalId" required>
        <option value="" disabled>Selecciona</option>
        <option v-for="i in inscritos" :key="i.id" :value="i.equipoId">
          {{ i.equipo.nombre }}
        </option>
      </select>
    </label>

    <label>
      Visitante
      <select v-model="form.equipoVisitanteId" required>
        <option value="" disabled>Selecciona</option>
        <option v-for="i in inscritos" :key="i.id" :value="i.equipoId">
          {{ i.equipo.nombre }}
        </option>
      </select>
    </label>

    <label>
      Fecha y hora
      <input v-model="form.fechaHora" type="datetime-local" required>
    </label>

    <label>
      Ronda
      <input v-model.number="form.ronda" type="number" min="1" required>
    </label>

    <button :disabled="cargando">Programar</button>
  </form>

  <EstadoPeticion
    :cargando="cargando"
    :error="error"
    :exito="exito"
    @reintentar="cargar"
  />

  <p v-if="!cargando && !error && !partidos.length">
    Todavía no hay partidos.
  </p>

  <article v-for="p in partidos" :key="p.id">
    <h2>{{ p.local.nombre }} contra {{ p.visitante.nombre }}</h2>
    <p>
      {{ p.torneo.nombre }} ·
      {{ new Date(p.fechaHora).toLocaleString() }} ·
      {{ p.estado }}
    </p>
    <RouterLink :to="`/partidos/${p.id}`">
      Detalle y resultado
    </RouterLink>
  </article>
</template>
