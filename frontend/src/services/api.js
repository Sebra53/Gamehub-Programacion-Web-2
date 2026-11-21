import { ref } from 'vue'
export const token = ref(sessionStorage.getItem('token') || '')
export const usuario = ref(null)
 
export function cerrarSesion() {
  token.value = ''
  usuario.value = null
  sessionStorage.removeItem('token')
}
 
export async function api(ruta, metodo = 'GET', datos) {
  let respuesta
  try {
    respuesta = await fetch(`http://localhost:3000${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
      ...(datos === undefined ? {} : { body: JSON.stringify(datos) }),
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Reintenta.')
  }
  const cuerpo = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    if (respuesta.status === 401) cerrarSesion()
    const mensaje = cuerpo?.message || `Error HTTP ${respuesta.status}`
    throw new Error(Array.isArray(mensaje) ? mensaje.join('. ') : mensaje)
  }
  return cuerpo
}

