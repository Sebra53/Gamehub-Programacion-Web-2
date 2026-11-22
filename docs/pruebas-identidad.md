
# Pruebas de identidad y autorización

Proyecto: GameHub IPVG  
Responsable: Andres Saldias  
Fecha: 22-11-2026

## Pruebas automáticas

Comando ejecutado:
npm test -- --runInBand

Resultados:
- Test Suites: 3 passed, 3 total
- Tests: 6 passed, 6 total
- Pruebas fallidas: 0

## Pruebas manuales


| Caso | Acción | Resultado esperado | Resultado real |
|---|---|---|---|
| A01 | Login válido | Token y acceso al perfil | Aprobado: login 201, token recibido y perfil consultado con 200 |
| A02 | Contraseña incorrecta | Error 401 | Aprobado: respuesta 401 |
| A03 | Petición protegida sin token | Error 401 | Aprobado: respuesta 401 |
| A04 | Estudiante crea torneo | Error 403 | Aprobado: respuesta 403 |
| A05 | Enviar rol ADMIN en registro | Error 400 | Aprobado: respuesta 400 |
| A06 | Otro capitán edita equipo ajeno | Error 403 | Aprobado: respuesta 403 |
| A07 | Editar perfil y recargar | Datos persistidos | Aprobado: cambios conservados después de recargar |
| A08 | Token inválido o vencido | Sesión invalidada | Aprobado: token inválido rechazado con 401 |
| A09 | Consultar relaciones de usuarios | Sin contraseña ni hash | Aprobado: no se exponen contraseñas ni hashes |
| A10 | Desactivar usuario y repetir petición | Error 401 | Aprobado: usuario inactivo rechazado con 401 |



## Observaciones

Las pruebas automáticas de autenticación y permisos
de equipos se ejecutaron correctamente.

Se ejecutaron las 10 pruebas manuales de identidad
y autorización mediante Swagger y la aplicación web.

Resultados:
- Pruebas automáticas: 6 aprobadas, 0 fallidas.
- Pruebas manuales: 10 aprobadas, 0 fallidas.

En A10 se utilizó una cuenta ESTUDIANTE de prueba
con ID 2, desactivada temporalmente en MySQL.
El backend rechazó su acceso con HTTP 401.