
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


## Commit 15: pruebas de ranking e integración final

Se completaron las verificaciones finales del sistema.

- 4 pruebas automáticas adicionales de ranking.
- 10 pruebas Jest aprobadas en total.
- 14 pruebas de integración C01-C14 aprobadas.
- Compilación exitosa del backend NestJS.
- Compilación exitosa del frontend Vue/Vite.
- Instalación limpia comprobada desde un clon de main.
- Persistencia de MySQL verificada tras reiniciar la API.
- Validación de permisos, partidos, resultados y ranking.

Evidencia: `docs/pruebas-integracion.md`

Durante la instalación limpia, npm informó
20 vulnerabilidades moderadas en las dependencias
del backend. Estas advertencias no impidieron
las pruebas, pero requieren revisión posterior.
```

Guarda también este archivo.

## Paso 4. Revisar los archivos antes del último commit

En PowerShell ejecuta:

```powershell
git status
```

Deberían aparecer, como mínimo:

- `README.md` modificado.
- `docs/pruebas-negocio.md` modificado.
- `docs/pruebas-integracion.md` nuevo.
- `backend/src/ranking/calcular-ranking.spec.ts` nuevo.

Después ejecuta:

```powershell
git add README.md docs/pruebas-negocio.md docs/pruebas-integracion.md backend/src/ranking/calcular-ranking.spec.ts
git diff --cached --stat
```

Si actualizaste también `docs/bitacora.md`, puedes incluirlo mediante `git add docs/bitacora.md`.

**Pégame el resultado de `git diff --cached --stat`.** Revisaremos que estén los archivos correctos y ejecutaremos el commit final:

```powershell
git commit -m "test: ranking integracion y documentacion de entrega"
```

Después haremos el push, fusionaremos el Pull Request y comprobaremos que `main` contiene la versión definitiva de GameHub.

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
