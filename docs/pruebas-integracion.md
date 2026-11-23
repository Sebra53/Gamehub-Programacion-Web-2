
# Pruebas finales de integración

Proyecto: GameHub IPVG
Responsable: Andres Saldias
Fecha: 23-11-2026

## Objetivo

Verificar el funcionamiento integrado del sistema,
incluyendo frontend Vue, backend NestJS, base de datos
MySQL, autorización, partidos, resultados y ranking.

## Resultados de pruebas de integración

| Caso | Acción | Esperado | Observado |
|---|---|---|---|
| C01 | Programar un equipo contra sí mismo | HTTP 400 | Aprobado: HTTP 400. Se rechazó el partido |
| C02 | Programar un equipo no inscrito | HTTP 409 | Aprobado: HTTP 409 |
| C03 | Estudiante intenta registrar un resultado | HTTP 403 | Aprobado: HTTP 403. Acceso denegado |
| C04 | Consultar resultado de partido inexistente | HTTP 404 | Aprobado: HTTP 404 |
| C05 | Victoria, empate y corrección de resultado | Ranking consistente | Aprobado: ranking 3-0, luego 1-1 y nuevamente 3-0 |
| C06 | Partido sin resultado | No suma partidos jugados | Aprobado: partido PROGRAMADO creado con 201 y ranking sin cambios |
| C07 | Detener API y actualizar Vue | Error visible | Aprobado: Vue mostró un error de comunicación |
| C08 | Reiniciar API y consultar registros | Datos persistentes | Aprobado: torneos, partidos y ranking permanecieron |
| C09 | Recargar una ruta dinámica con sesión | Mismo registro | Aprobado: se mantuvo la página del torneo |
| C10 | Login y Authorize en Swagger | Operación protegida correcta | Aprobado: GET /auth/yo respondió 200 con rol ADMIN |
| C11 | Clonar, instalar y ejecutar siguiendo README | Ambos proyectos ejecutan | Aprobado: instalación limpia y ejecución de Vue y NestJS |
| C12 | Cancelar eliminación desde Vue | Registro permanece | Aprobado: eliminación cancelada y torneo conservado |
| C13 | npm test -- --runInBand | Todas las pruebas pasan | Aprobado: 4 suites y 10 pruebas |
| C14 | npm run build en ambos proyectos | Sin errores | Aprobado: NestJS y Vite compilaron correctamente |

## Pruebas automáticas

Comando ejecutado:

npm test -- --runInBand

Resultados:

- Suites aprobadas: 4 de 4.
- Pruebas aprobadas: 10 de 10.
- Pruebas fallidas: 0.

Se verificaron autenticación, equipos y cálculo
del ranking, incluyendo empates, victorias,
correcciones y desempates.

## Compilaciones

Backend:
npm run build

Resultado: compilación exitosa de NestJS.

Frontend:
npm run build

Resultado: compilación exitosa de Vite.

## Instalación desde cero

Se clonó el repositorio en una carpeta independiente
denominada gamehub-verificacion-final.

Se ejecutó npm ci en ambos proyectos.

Backend:
- 747 paquetes instalados.
- 20 vulnerabilidades moderadas informadas por npm audit.

Frontend:
- 37 paquetes instalados.
- 0 vulnerabilidades informadas.

Se comprobó la ejecución local de ambos proyectos
y la consulta de información almacenada en MySQL.

La copia utilizada correspondía a la versión de
main previa a la integración del commit 15.

## Resultado final

Pruebas de integración ejecutadas: 14.
Pruebas de integración aprobadas: 14.
Pruebas de integración fallidas: 0.

La ejecución confirmó el funcionamiento de las reglas
de negocio, el control de acceso, la persistencia de
datos, los resultados de partidos y el ranking.

Pendiente de cierre: integrar el commit 15 en main
y verificar la versión definitiva publicada.
