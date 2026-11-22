
USE gamehub_ipvg_demo;

-- Usuarios de demostración
SELECT id, correo, rol, activo FROM usuarios;

-- Equipos creados
SELECT id, nombre, capitanId, estado FROM equipos;

-- Integrantes de equipos
SELECT * FROM equipo_integrantes;

-- Torneos
SELECT id, nombre, videojuego, cupoMaximo, estado
FROM torneos;

-- Inscripciones
SELECT torneoId, equipoId, estado FROM inscripciones;

-- Partidos
SELECT id, torneoId, equipoLocalId,
       equipoVisitanteId, estado
FROM partidos;

-- Resultados
SELECT partidoId, puntajeLocal, puntajeVisitante,
       ganadorId, registradoPor
FROM resultados;

-- Verificar inscripciones duplicadas
-- Debe devolver cero filas
SELECT torneoId, equipoId, COUNT(*) AS repeticiones
FROM inscripciones
GROUP BY torneoId, equipoId
HAVING COUNT(*) > 1;

-- Verificar que no se excedan los cupos
-- Debe devolver cero filas
SELECT t.id, t.cupoMaximo, COUNT(i.id) AS aceptados
FROM torneos t
LEFT JOIN inscripciones i
  ON i.torneoId = t.id
  AND i.estado = 'ACEPTADA'
GROUP BY t.id, t.cupoMaximo
HAVING COUNT(i.id) > t.cupoMaximo;
