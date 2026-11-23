
# Pruebas de torneos e inscripciones

Proyecto: GameHub IPVG
Responsable: Andres Saldias
Fecha: 22-11-2026

## Datos de demostración

Base de datos: gamehub_ipvg_demo

Se ejecutó el script datos-demo.ps1 para crear
usuarios, equipos, torneos, inscripciones y partidos.

La fase datos se ejecutó dos veces, generando
dos conjuntos de demostración.

Los rankings de Rocket League y EA FC
mostraron correctamente los resultados esperados.

## Verificaciones en MySQL

Se ejecutó database/verificar.sql.

- Inscripciones duplicadas: 0 filas.
- Torneos con cupos excedidos: 0 filas.

Resultado: verificaciones de integridad aprobadas.

## Pruebas manuales


| Caso | Acción | Esperado | Observado |
|---|---|---|---|
| B01 | Crear, consultar, editar y eliminar un torneo | CRUD completo | Aprobado: creación 201, consulta 200, edición 200, eliminación correcta y consulta posterior 404. Torneo ID 5 |
| B02 | Buscar por nombre, videojuego y estado | Filtros combinados | Aprobado: los tres filtros funcionaron simultáneamente en Vue |
| B03 | Reinscribir un equipo aceptado | Error 409 | Aprobado: respuesta 409 |
| B04 | Inscribir un tercer equipo con cupo 2 lleno | Error 409 | Aprobado: respuesta 409. Torneo ID 6 |
| B05 | Inscribir después del cierre | Error 409 | Aprobado: respuesta 409 por inscripción cerrada |
| B06 | Dos solicitudes simultáneas por el último cupo | Solo una aceptada | Aprobado: Halcones 201, Titanes 409. Torneo ID 8. Se comprobaron dos inscripciones aceptadas |
| B07 | Reducir cupos por debajo de los inscritos | Error 409 | Aprobado: respuesta 409. Torneo ID 1 |
| B08 | Enviar datos incompletos y fecha inválida | Error 400 | Aprobado: ambas solicitudes devolvieron 400 |
| B09 | Cancelar y volver a inscribir | Reutilizar la inscripción | Aprobado: inscripción ID 17 cancelada y reactivada conservando el mismo ID |
| B10 | Cancelar un equipo con partidos registrados | Error 409 | Aprobado: respuesta 409. Inscripción ID 1 |
| B11 | Eliminar un torneo con inscripciones | Error 409 | Aprobado: DELETE 409 y GET posterior 200. Torneo ID 6 |


## Observaciones

La carga automática de datos fue exitosa.

Las verificaciones de integridad de MySQL
se completaron correctamente.

Las 11 pruebas manuales B01-B11 fueron
ejecutadas y aprobadas utilizando Swagger,
Vue y PowerShell.

## Resultado final

Fecha de ejecución: 22-11-2026
Responsable: Andres Saldias

- Pruebas manuales ejecutadas: 11.
- Pruebas aprobadas: 11.
- Pruebas fallidas: 0.

Las pruebas se realizaron utilizando Swagger,
la aplicación Vue y PowerShell.

La prueba B06 utilizó solicitudes concurrentes
para comprobar el control del último cupo.

Las verificaciones de integridad realizadas con
MySQL Workbench también fueron satisfactorias.

