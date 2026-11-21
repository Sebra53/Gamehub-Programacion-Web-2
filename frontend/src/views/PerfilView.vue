<script setup>
import { reactive } from 'vue'
import { api, usuario } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const form = reactive({ nombre: usuario.value.nombre, alias: usuario.value.alias })
const { cargando, error, exito, ejecutar } = usePeticion()
function guardar() {
  ejecutar(async () => {
    usuario.value = await api('/auth/yo', 'PATCH', form)
  }, 'Perfil actualizado')
}
</script>
<template>
  <h1>Mi perfil</h1>
  <p>{{ usuario.correo }} · {{ usuario.rol }}</p>
  <form @submit.prevent="guardar">
    <label>Nombre<input v-model.trim="form.nombre" required minlength="3" maxlength="80"></label>
    <label>Alias<input v-model.trim="form.alias" required minlength="3" maxlength="40"></label>
    <button :disabled="cargando">Guardar</button>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="guardar" />
</template>
