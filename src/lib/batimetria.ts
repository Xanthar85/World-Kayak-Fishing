// WKF — Batimetría.
// Consulta a ERDDAP GEBCO 2024 para obtener profundidad puntual.
// Verificado en Apps Script el 2026-10-05: ERDDAP responde HTTP 200
// en 200-570 ms por muestra. Devuelve CSV: header + units + fila.
// Elevación negativa = agua, positiva = tierra.
// DP-070: la propuesta automática de acceso se cancela. El usuario
// coloca el punto de acceso a mano si quiere.

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
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 3) return null;

    const parts = lines[2].split(',');
    if (parts.length < 3) return null;

    const elev = parseFloat(parts[2].trim());
    if (isNaN(elev) || elev >= 0) {
      // Elevación >= 0 es tierra firme o dato inválido
      return null;
    }

    // Elevación negativa = agua. Profundidad = -elevación.
    return -elev;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}