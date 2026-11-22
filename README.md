
# GameHub IPVG
Plataforma de torneos de videojuegos.
 
## Integrantes
- Sebastián Bonilla
- Anthony Rebolledo
- Andres Saldias

## Tecnologías
Vue 3 y Vite, Vue Router, NestJS, TypeORM, MySQL.

## Uso de IA

- apoyo 
- diseño
- dudas
- organizacion del proyecto
- revision conflictos
- nombre commit


## Arquitectura del sistema

GameHub utiliza una arquitectura cliente-servidor:

- Frontend: Vue 3 con Vite.
- Backend: NestJS con TypeScript.
- Base de datos: MySQL.
- ORM: TypeORM.
- Autenticación: JWT.
- Documentación de API: Swagger.

El frontend realiza peticiones HTTP al backend.
NestJS procesa las solicitudes y utiliza TypeORM
para consultar y modificar los datos de MySQL.

## Instalación y ejecución

1. Clonar el repositorio.
2. Instalar las dependencias del backend con `npm ci`.
3. Configurar `backend/.env` con la conexión a MySQL.
4. Iniciar el backend con `npm run start:dev`.
5. Instalar las dependencias del frontend con `npm ci`.
6. Iniciar el frontend con `npm run dev`.

Direcciones locales:

- Frontend: http://localhost:5173
- Swagger: http://localhost:3000/docs

## Variables de entorno

El backend utiliza:

- DB_HOST: dirección del servidor MySQL.
- DB_PORT: puerto de MySQL.
- DB_USER: usuario de la base de datos.
- DB_PASSWORD: contraseña de MySQL.
- DB_NAME: nombre de la base de datos.
- JWT_SECRET: clave para firmar los tokens.
- PORT: puerto del backend.
- FRONTEND_ORIGIN: dirección permitida del frontend.

El archivo `.env` contiene información privada
y no debe subirse a GitHub.

## Reglas de negocio

- Los usuarios públicos se registran como ESTUDIANTE.
- Los ADMIN pueden administrar los torneos.
- Los capitanes pueden administrar sus equipos.
- Los equipos se inscriben respetando los cupos.
- No se permite duplicar una inscripción aceptada.
- Los torneos utilizan modalidad liga.
- Victoria: 3 puntos.
- Empate: 1 punto.
- Derrota: 0 puntos.
- El ranking se calcula a partir de los resultados.

## Datos de demostración

Para las pruebas se utiliza una base separada:

`gamehub_ipvg_demo`

El archivo `database/datos-demo.ps1` permite
cargar datos mediante dos fases.

Primera fase:

`powershell -NoProfile -File database/datos-demo.ps1 -Fase usuarios`

Esta fase registra cuatro usuarios de prueba.

Luego se debe asignar el rol ADMIN a
`admin@example.test` desde MySQL Workbench.

Segunda fase:

`powershell -NoProfile -File database/datos-demo.ps1 -Fase datos`

Esta fase crea:

- Cuatro equipos.
- Dos torneos.
- Ocho inscripciones.
- Tres partidos con resultados.

El script está pensado para ejecutarse una sola vez
en una base de demostración nueva.

## Pruebas realizadas

### Commit 13: identidad y autorización

- Seis pruebas automáticas aprobadas con Jest.
- Diez pruebas manuales aprobadas.
- Sin errores detectados en las pruebas ejecutadas.

Evidencia: `docs/pruebas-identidad.md`

### Commit 14: datos y pruebas de negocio

- Carga automática de datos ejecutada correctamente.
- Ranking de Rocket League y EA FC verificado.
- Consulta de inscripciones duplicadas: cero filas.
- Consulta de cupos excedidos: cero filas.
- Once pruebas manuales B01-B11 aprobadas mediante Swagger, Vue y PowerShell.

La fase de datos se ejecutó dos veces en la base
de demostración, generando dos conjuntos de registros.

Evidencia: `docs/pruebas-negocio.md`

## Verificación de MySQL

El archivo `database/verificar.sql` contiene
consultas para revisar:

- Usuarios.
- Equipos e integrantes.
- Torneos.
- Inscripciones.
- Partidos.
- Resultados.
- Inscripciones duplicadas.
- Cupos excedidos.

## Colaboración

El proyecto se desarrolla mediante Git y GitHub,
utilizando ramas de trabajo y Pull Requests
para integrar los cambios a main.

Repositorio:
https://github.com/Sebra53/Gamehub-Programacion-Web-2
