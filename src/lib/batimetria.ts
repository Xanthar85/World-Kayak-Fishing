// WKF — Batimetría y propuesta de acceso automático.
// Consulta a ERDDAP GEBCO 2024 para obtener profundidad y localizar acceso a costa.

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

export async function profundidadEnMuestras(
  latCentro: number,
  lonCentro: number,
  rumboGrados: number,
  distanciaMn: number,
  numMuestras: number
): Promise<{ lat: number; lon: number; profundidad: number | null }[]> {
  const rumboRad = (rumboGrados * Math.PI) / 180;
  const latRad = (latCentro * Math.PI) / 180;

  const puntos: { lat: number; lon: number }[] = [];
  for (let i = 1; i <= numMuestras; i++) {
    const d = distanciaMn * (i / numMuestras);
    const dLat = (d / 60) * Math.cos(rumboRad);
    const dLon = ((d / 60) * Math.sin(rumboRad)) / Math.cos(latRad);
    puntos.push({
      lat: latCentro + dLat,
      lon: lonCentro + dLon,
    });
  }

  const promesas = puntos.map(async (p) => {
    const profundidad = await obtenerProfundidad(p.lat, p.lon);
    return {
      lat: p.lat,
      lon: p.lon,
      profundidad,
    };
  });

  return Promise.all(promesas);
}

export async function proponerAcceso(
  latPesca: number,
  lonPesca: number
): Promise<{
  lat: number;
  lon: number;
  profundidad: number;
  pocoClaro: boolean;
} | null> {
  const rumbos = Array.from({ length: 16 }, (_, i) => i * 22.5);

  const resultadosPorRumbo = await Promise.all(
    rumbos.map((rumbo) => profundidadEnMuestras(latPesca, lonPesca, rumbo, 2, 12))
  );

  const todasLasMuestras = resultadosPorRumbo.flat();

  // Filtrar muestras con profundidad != null y profundidad > 0.5 m
  const validas = todasLasMuestras.filter(
    (m): m is { lat: number; lon: number; profundidad: number } =>
      m.profundidad !== null && m.profundidad > 0.5
  );

  if (validas.length === 0) return null;

  // Entre todas las muestras válidas, buscar las menores de 5 m
  const menoresDe5 = validas.filter((m) => m.profundidad < 5);

  if (menoresDe5.length > 0) {
    // La más somera (menor profundidad)
    menoresDe5.sort((a, b) => a.profundidad - b.profundidad);
    return {
      lat: menoresDe5[0].lat,
      lon: menoresDe5[0].lon,
      profundidad: menoresDe5[0].profundidad,
      pocoClaro: false,
    };
  }

  // Si no hay ninguna < 5 m, elegir la más somera de todas y marcar pocoClaro: true
  validas.sort((a, b) => a.profundidad - b.profundidad);
  return {
    lat: validas[0].lat,
    lon: validas[0].lon,
    profundidad: validas[0].profundidad,
    pocoClaro: true,
  };
}
