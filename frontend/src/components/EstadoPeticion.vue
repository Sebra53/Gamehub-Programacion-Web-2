<script setup>
defineProps({ cargando: Boolean, error: String, exito: String })
defineEmits(['reintentar'])
</script>
<template>
  <p v-if="cargando" role="status">Cargando…</p>
  <div v-else-if="error" role="alert">
    {{ error }}
    <button type="button" @click="$emit('reintentar')">Reintentar</button>
  </div>
  <p v-else-if="exito" role="status">{{ exito }}</p>
</template>
