<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api.js'
import { usePeticion } from '../composables/usePeticion.js'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const route = useRoute(), router = useRouter()
const form = reactive({ nombre: '', videojuego: '', modalidad: 'LIGA',
  fechaInicio: '', cierreInscripcion: '', cupoMaximo: 8, estado: 'ABIERTO' })
const { cargando, error, exito, ejecutar } = usePeticion()
function local(iso) {
  const fecha = new Date(iso)
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 16)
}
function cargar() {
  if (!route.params.id) return
  ejecutar(async () => {
    const t = await api(`/torneos/${route.params.id}`)
    for (const clave of Object.keys(form)) form[clave] = t[clave]
    form.fechaInicio = local(t.fechaInicio)
    form.cierreInscripcion = local(t.cierreInscripcion)
  })
}
function guardar() {
  ejecutar(async () => {
    if (new Date(form.cierreInscripcion) >= new Date(form.fechaInicio)) {
      throw new Error('El cierre debe ser anterior al inicio')
    }
    const dto = { ...form,
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      cierreInscripcion: new Date(form.cierreInscripcion).toISOString() }
    const t = await api(route.params.id ? `/torneos/${route.params.id}` : '/torneos',
      route.params.id ? 'PATCH' : 'POST', dto)
    await router.push(`/torneos/${t.id}`)
  })
}
onMounted(cargar)
</script>
<template>
  <h1>{{ route.params.id ? 'Editar torneo' : 'Crear torneo' }}</h1>
  <form @submit.prevent="guardar">
    <label>Nombre<input v-model.trim="form.nombre" required minlength="3" maxlength="100"></label>
    <label>Videojuego<input v-model.trim="form.videojuego" required minlength="2" maxlength="60"></label>
    <label>Modalidad<select v-model="form.modalidad"><option>LIGA</option></select></label>
    <label>Inicio<input v-model="form.fechaInicio" type="datetime-local" required></label>
    <label>Cierre de inscripción<input v-model="form.cierreInscripcion" type="datetime-local" required></label>
    <label>Cupo<input v-model.number="form.cupoMaximo" type="number" min="2" max="128" required></label>
    <label>Estado<select v-model="form.estado">
      <option>ABIERTO</option><option>CERRADO</option><option>FINALIZADO</option>
    </select></label>
    <button :disabled="cargando">Guardar</button>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="cargar" />
</template>
