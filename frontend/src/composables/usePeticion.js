import { ref } from 'vue'
export function usePeticion() {
  const cargando = ref(false), error = ref(''), exito = ref('')
  async function ejecutar(tarea, mensaje = '') {
    cargando.value = true
    error.value = ''; exito.value = ''
    try {
      const valor = await tarea()
      exito.value = mensaje
      return valor
    } catch (e) {
      error.value = e.message
      return undefined
    } finally {
      cargando.value = false
    }
  }
  return { cargando, error, exito, ejecutar }
}
