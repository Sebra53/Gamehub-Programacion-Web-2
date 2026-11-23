
import { calcularRanking } from './calcular-ranking';

describe('Ranking de liga', () => {
  const equipos = [
    { id: 1, nombre: 'Dragones' },
    { id: 2, nombre: 'Halcones' },
    { id: 3, nombre: 'Lobos' },
  ];

  it('calcula victoria derrota y equipos sin partidos', () => {
    const tabla = calcularRanking(equipos, [
      { localId: 1, visitanteId: 2, local: 3, visitante: 1 },
    ]);

    expect(tabla.find(f => f.equipoId === 1)).toMatchObject({
      puntos: 3,
      victorias: 1,
      diferencia: 2,
      jugados: 1,
    });

    expect(tabla.find(f => f.equipoId === 2)).toMatchObject({
      puntos: 0,
      derrotas: 1,
      diferencia: -2,
    });

    expect(tabla.find(f => f.equipoId === 3)).toMatchObject({
      puntos: 0,
      jugados: 0,
    });
  });

  it('asigna un punto a cada equipo en empate', () => {
    const tabla = calcularRanking(equipos, [
      { localId: 1, visitanteId: 2, local: 2, visitante: 2 },
    ]);

    for (const id of [1, 2]) {
      expect(tabla.find(f => f.equipoId === id)).toMatchObject({
        puntos: 1,
        empates: 1,
        diferencia: 0,
      });
    }
  });

  it('recalcula al corregir sin conservar puntos anteriores', () => {
    const original = calcularRanking(equipos, [
      { localId: 1, visitanteId: 2, local: 3, visitante: 1 },
    ]);

    const corregida = calcularRanking(equipos, [
      { localId: 1, visitanteId: 2, local: 0, visitante: 1 },
    ]);

    expect(original.find(f => f.equipoId === 1)?.puntos).toBe(3);
    expect(corregida.find(f => f.equipoId === 1)?.puntos).toBe(0);
    expect(corregida.find(f => f.equipoId === 2)?.puntos).toBe(3);
  });

  it('desempata por diferencia de puntaje', () => {
    const tabla = calcularRanking(equipos, [
      { localId: 1, visitanteId: 3, local: 2, visitante: 0 },
      { localId: 2, visitanteId: 3, local: 4, visitante: 0 },
    ]);

    expect(tabla[0].equipoId).toBe(2);
  });
});
