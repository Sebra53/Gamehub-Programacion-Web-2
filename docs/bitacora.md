# Bitácora de desarrollo — GameHub IPVG

**Proyecto:** GameHub IPVG  
**Responsable de los avances registrados:** Andres Saldias  
**Fecha:** 22-11-2026

## Commit 11 — Calendario y detalle de partidos

Se implementaron las vistas para consultar partidos programados y visualizar sus detalles.

**Actividades realizadas:**
- Desarrollo de la vista de partidos.
- Implementación de la vista de detalle.
- Integración de rutas de navegación en Vue.
- Comprobación de programación de partidos y registro de resultados.

**Resultado:** funcionalidades integradas en la rama principal mediante Pull Request.

## Commit 12 — Ranking de torneos

Se implementó el cálculo de posiciones de los equipos a partir de los resultados de los partidos.

**Actividades realizadas:**
- Incorporación del servicio y controlador de ranking en NestJS.
- Implementación del cálculo de puntos.
- Creación de la tabla de clasificación en Vue.
- Comprobación de resultados y posiciones.

**Resultado:** ranking funcional e integrado en la rama principal.

## Commit 13 — Identidad y autorización

Se incorporaron pruebas automáticas y manuales para comprobar la seguridad de GameHub.

**Actividades realizadas:**
- Creación de pruebas Jest para autenticación.
- Creación de pruebas Jest para permisos de equipos.
- Ejecución de seis pruebas automáticas.
- Ejecución de diez pruebas manuales mediante Swagger y la aplicación web.
- Registro de evidencias en `docs/pruebas-identidad.md`.

**Resultados:**
- 6 pruebas automáticas aprobadas.
- 10 pruebas manuales aprobadas.
- Se comprobó el rechazo de tokens inválidos.
- Se verificó que un estudiante no puede editar equipos ajenos.
- Se comprobó que un usuario desactivado no puede acceder con su token.

**Resultado:** commit integrado en `main` mediante Pull Request #5.

## Commit 14 — Datos reproducibles y pruebas de negocio

Se preparó un escenario de demostración independiente para verificar el comportamiento del sistema.

**Actividades realizadas:**
- Creación del script `database/datos-demo.ps1`.
- Creación de la base `gamehub_ipvg_demo`.
- Registro de cuatro usuarios ficticios.
- Asignación controlada del rol ADMIN a la cuenta de demostración.
- Ejecución del script para crear equipos, torneos, inscripciones y resultados.
- Creación de `database/verificar.sql`.
- Comprobación de los rankings de Rocket League y EA FC.
- Creación de `docs/pruebas-negocio.md`.
- Actualización del README.

**Resultados observados:**
- Los rankings mostraron los puntos esperados.
- La consulta de inscripciones duplicadas devolvió cero filas.
- La consulta de cupos excedidos devolvió cero filas.
- La fase de carga de datos se ejecutó accidentalmente dos veces, por lo que quedaron dos conjuntos de demostración en la base de pruebas.

**Pruebas pendientes:** ejecutar los casos manuales B01 a B11 y registrar sus resultados reales.

## Problemas y soluciones

### Protección de los datos existentes

**Situación:** el proyecto ya contenía usuarios, equipos y torneos utilizados durante el desarrollo.

**Solución:** se creó una base de datos independiente, `gamehub_ipvg_demo`, para ejecutar los scripts y realizar las pruebas sin modificar los registros originales.

### Ejecución repetida del script

**Situación:** la fase de carga de datos se ejecutó dos veces y generó nuevos equipos y torneos en ambas ocasiones.

**Resultado:** el script terminó correctamente en las dos ejecuciones. Las consultas SQL no detectaron inscripciones duplicadas por equipo y torneo ni cupos excedidos.

**Medida preventiva:** ejecutar la carga una sola vez sobre una base de demostración nueva.

## Uso de inteligencia artificial

Se utilizó inteligencia artificial como apoyo para comprender el código, organizar las actividades, redactar documentación, preparar pruebas y resolver dudas técnicas.

Los resultados de las pruebas se comprobaron mediante la ejecución del sistema, Swagger, Jest y MySQL Workbench.

## Estado del proyecto

- **Commit 13:** integrado y verificado.
- **Commit 14:** preparación de datos y documentación realizada; pruebas manuales pendientes.
- **Commit 15:** pendiente de desarrollo y verificación final.