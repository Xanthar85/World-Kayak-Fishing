// src/lib/batimetria.ts
// WKF — Batimetría.
// Consulta a ERDDAP GEBCO 2024 para obtener profundidad puntual.
// Verificado en Apps Script el 2026-10-05: ERDDAP responde HTTP 200
// en 200-570 ms por muestra. Devuelve CSV: header + units + fila.
// Elevación negativa = agua, positiva = tierra.
// DP-070: la propuesta automática de acceso se cancela. El usuario
// coloca el punto de acceso a mano si quiere.
// v1.010: bug 16. La profundidad no se obtenía nunca. El parser
// anterior asumía 3 líneas (header, units, fila). ERDDAP devuelve
// 2 líneas de cabecera y luego la fila. Se ha verificado que el
// formato real es:
//   línea 0: "latitude,longitude,elevation"
//   línea 1: "degrees_north,degrees_east,m"
//   línea 2: "40.422916...,0.422916...,19"
// A veces ERDDAP añade una línea vacía al final. Se filtra.
// A veces la respuesta trae un mensaje de error en texto plano
// (HTTP 200 con cuerpo no-CSV). Se detecta y se devuelve null.
// Se devuelve null también si la elevación es >= 0 (tierra).

export async function obtenerProfundidad(
  lat: number,
  lon: number
): Promise<number | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://erddap.cmcc-opa.eu/erddap/griddap/Surf_f204_4c2a_5962.csv?elevation[(${lat.toFixed(5)})][(${lon.toFixed(5)})]`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/csv' },
    });

    if (!res.ok) return null;
    const text = await res.text();

    // Detección temprana de respuesta no-CSV (error en texto plano).
    // ERDDAP a veces responde 200 con un mensaje de error.
    if (!text.includes('latitude') || !text.includes('elevation')) {
      return null;
    }

    // Normalizar saltos de línea y quitar líneas vacías.
    const lines = text
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 3) return null;

    // La fila de datos es la última línea (formato: lat,lon,elev).
    // Buscamos la última línea que tenga 3 campos separados por coma
    // y cuyo tercer campo sea un número.
    let elev: number | null = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      const parts = lines[i].split(',');
      if (parts.length < 3) continue;
      const candidate = parseFloat(parts[2].trim());
      if (Number.isFinite(candidate)) {
        elev = candidate;
        break;
      }
    }

    if (elev === null) return null;

    // Elevación >= 0 es tierra firme o dato inválido.
    if (elev >= 0) return null;

    // Elevación negativa = agua. Profundidad = -elevación.
    return -elev;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}