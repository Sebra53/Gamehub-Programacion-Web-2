
export interface EquipoTabla {
  id: number;
  nombre: string;
}

export interface Marcador {
  localId: number;
  visitanteId: number;
  local: number;
  visitante: number;
}

export function calcularRanking(
  equipos: EquipoTabla[],
  resultados: Marcador[]
) {
  const filas = new Map(equipos.map(e => [e.id, {
    equipoId: e.id,
    nombre: e.nombre,
    jugados: 0,
    victorias: 0,
    empates: 0,
    derrotas: 0,
    favor: 0,
    contra: 0,
    puntos: 0,
  }]));

  for (const r of resultados) {
    const a = filas.get(r.localId);
    const b = filas.get(r.visitanteId);

    if (!a || !b) continue;

    a.jugados++;
    b.jugados++;

    a.favor += r.local;
    a.contra += r.visitante;

    b.favor += r.visitante;
    b.contra += r.local;

    if (r.local === r.visitante) {
      a.empates++;
      b.empates++;
      a.puntos++;
      b.puntos++;
    } else {
      const ganador = r.local > r.visitante ? a : b;
      const perdedor = ganador === a ? b : a;

      ganador.victorias++;
      ganador.puntos += 3;
      perdedor.derrotas++;
    }
  }

  return [...filas.values()]
    .map(f => ({
      ...f,
      diferencia: f.favor - f.contra
    }))
    .sort((a, b) =>
      b.puntos - a.puntos ||
      b.diferencia - a.diferencia ||
      b.favor - a.favor ||
      a.nombre.localeCompare(b.nombre)
    );
}
