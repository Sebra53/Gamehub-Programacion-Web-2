<script setup>
import { useRouter } from 'vue-router'
import { usuario, cerrarSesion } from './services/api'
const router = useRouter()
function salir() { cerrarSesion(); router.push('/') }
</script>
<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <template v-if="usuario">
        <RouterLink to="/torneos">Torneos</RouterLink>
        <RouterLink to="/equipos">Equipos</RouterLink>
        <RouterLink to="/partidos">Partidos</RouterLink>
        <RouterLink to="/perfil">Mi perfil</RouterLink>
        <button @click="salir">Salir</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Ingresar</RouterLink>
        <RouterLink to="/registro">Registrarme</RouterLink>
      </template>
    </nav>
  </header>
  <main><RouterView :key="$route.fullPath" /></main>
</template>
