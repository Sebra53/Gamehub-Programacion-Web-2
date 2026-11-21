<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api, token, usuario } from '../services/api'
import { usePeticion } from '../composables/usePeticion'
import EstadoPeticion from '../components/EstadoPeticion.vue'
const props = defineProps({ registro: Boolean })
const router = useRouter()
const form = reactive({ nombre: '', alias: '', correo: '', password: '' })
const { cargando, error, exito, ejecutar } = usePeticion()
async function enviar() {
  await ejecutar(async () => {
    if (props.registro) await api('/auth/registro', 'POST', form)
    const sesion = await api('/auth/login', 'POST', {
      correo: form.correo, password: form.password,
    })
    token.value = sesion.access_token
    sessionStorage.setItem('token', token.value)
    usuario.value = await api('/auth/yo')
    await router.push('/torneos')
  })
}
</script>
<template>
  <h1>{{ registro ? 'Crear cuenta' : 'Ingresar' }}</h1>
  <form @submit.prevent="enviar">
    <template v-if="registro">
      <label>Nombre<input v-model.trim="form.nombre" required minlength="3" maxlength="80"></label>
      <label>Alias<input v-model.trim="form.alias" required minlength="3" maxlength="40"></label>
    </template>
    <label>Correo<input v-model.trim="form.correo" type="email" required maxlength="120"></label>
    <label>Contraseña<input v-model="form.password" type="password" required minlength="8" maxlength="72"></label>
    <button :disabled="cargando">Continuar</button>
  </form>
  <EstadoPeticion :cargando="cargando" :error="error" :exito="exito" @reintentar="enviar" />
</template>
