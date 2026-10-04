export const stringsEs = {
  app: {
    name: 'WKF',
    tagline: 'World Kayak Fishing',
  },

  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Borrar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Volver',
    add: 'Añadir',
    loading: 'Cargando…',
    refresh: 'Refrescar',
    retry: 'Reintentar',
    copy: 'Copiar',
    copied: 'Copiado',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    search: 'Buscar',
    searching: 'Buscando…',
    unnamed: 'Sin nombre',
    optional: 'opcional',
  },

  firstrun: {
    welcome: 'Bienvenido a WKF',
    intro:
      'Tu cuaderno de pesca en kayak y desde costa. Sin cuentas, sin nubes, sin líos. Todo se queda en tu dispositivo.',
    addFirstSpot: 'Añade tu primer punto',
  },

  home: {
    counter: '{{count}} / {{max}}',
    empty: {
      title: 'Sin puntos todavía',
      subtitle: 'Cuando añadas tu primer punto, aparecerá aquí.',
    },
    noSpots: 'Sin puntos todavía',
    addSpot: 'Añadir punto',
    limitReached: 'Límite de 6 puntos alcanzado',
    card: {
      noData: 'Sin datos',
      stale: 'Datos caducados',
      updatedAgo: 'Actualizado hace {{min}} min',
      updatedNow: 'Actualizado ahora',
      refresh: 'Refrescar',
      loading: 'Cargando…',
      error: 'Error al cargar',
    },
  },

  map: {
    newSpot: 'NUEVO PUNTO',
    editSpot: 'EDITAR PUNTO',
    spotName: 'Nombre del punto',
    spotNamePlaceholder: 'Ponle un nombre',
    searching: 'Buscando…',
    unnamed: 'Sin nombre',
    tapToPlace: 'Toca el mapa para colocar el punto',
    coordinates: 'Coordenadas',
  },

  verdict: {
    favorable: 'Favorable',
    acceptable: 'Aceptable',
    demanding: 'Exigente',
    advisedAgainst: 'Desaconsejado',
    triggeringFactor: 'Factor disparador',
    seeAllFactors: 'Ver todos los factores',
    appliedThreshold: 'Umbral aplicado: categoría {{category}}, {{zone}}',
    launch: {
      title: 'Salida / entrada',
      safe: 'Segura',
      watch: 'Vigilar',
      hard: 'Difícil',
      noGo: 'No salir',
    },
  },

  factors: {
    waveHeight: 'Altura de ola',
    wavePeriod: 'Periodo',
    waveDirection: 'Dirección de ola',
    windSpeed: 'Viento',
    windGusts: 'Rachas',
    windDirection: 'Dirección del viento',
    temperature: 'Temperatura',
    precipitation: 'Precipitación',
    pressure: 'Presión',
    seaLevel: 'Marea',
    current: 'Corriente',
  },

  tabs: {
    waves: 'Oleaje',
    wind: 'Viento',
    weather: 'Tiempo',
    air: 'Aire',
    barometer: 'Barómetro',
    activity: 'Actividad',
    sun: 'Sol',
    moon: 'Luna',
    tides: 'Mareas',
  },

  settings: {
    title: 'Ajustes',
    language: 'Idioma',
    languageEs: 'Español',
    languageEn: 'English',
    theme: 'Tema',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    kayak: 'Mi kayak',
    kayakCategory: 'Categoría de kayak',
    kayakCategoryA: 'A — Alta mar, condiciones exigentes',
    kayakCategoryB: 'B — Costero avanzado',
    kayakCategoryC: 'C — Costero estándar',
    kayakCategoryD: 'D — Aguas protegidas',
    kayakCategoryAssumed: 'Sin categoría configurada. Se aplica C por defecto.',
    zones: 'Zona',
    zoneMed: 'Mediterráneo',
    zoneAtlantic: 'Atlántico',
    zonePacific: 'Pacífico',
    zoneOther: 'Otra',
    tabsVisibility: 'Subpestañas visibles',
    tabLocked: 'Fija',
    tutorial: 'Tutorial',
    tutorialRestart: 'Volver a ver el tutorial',
    tutorialExtended: 'Tutorial completo',
    data: 'Datos',
    exportJson: 'Exportar datos (JSON)',
    importJson: 'Importar datos (JSON)',
    clearAll: 'Borrar todos los datos',
    clearAllConfirm: '¿Seguro? Esta acción no se puede deshacer.',
    about: 'Acerca de',
    aboutText:
      'World Kayak Fishing (WKF). Webapp gratuita de pesca en kayak y desde costa. Sin cuentas, sin nubes. Todo se queda en tu dispositivo.',
    donate: 'Invitar a un café',
    donateText: 'WKF es gratis y sin anuncios. Si te sirve, puedes apoyar el proyecto.',
    version: 'Versión',
  },

  tutorial: {
    title: 'Tutorial',
    intro:
      'WKF te ayuda a decidir si merece la pena salir a pescar y en qué franja del día. Te contamos cómo funciona, sin rodeos.',
    step1Title: '1. Añade tus puntos',
    step1Body:
      'Un punto es una zona de pesca. Puedes tener hasta 6. Al crearlo, marcas en el mapa el sitio exacto y le pones nombre. También puedes añadir su punto de acceso a tierra, que usamos para avisarte sobre la salida y la entrada al mar.',
    step2Title: '2. Mira el veredicto',
    step2Body:
      'Para cada punto, WKF resume las condiciones en un veredicto por franja del día: Favorable, Aceptable, Exigente o Desaconsejado. Si es Exigente o Desaconsejado, te decimos qué factor ha disparado el aviso. Manda siempre el peor factor, no la media.',
    step3Title: '3. Entra al detalle',
    step3Body:
      'Dentro de un punto tienes subpestañas con los datos en crudo: oleaje, viento, tiempo, aire, barómetro, actividad, sol, luna y mareas. Números grandes, tabla por horas y gráfico. Todo a la vista.',
    step4Title: '4. Aviso de salida',
    step4Body:
      'Si has configurado el punto de acceso, WKF añade un aviso específico de salida y entrada al mar: Segura, Vigilar, Difícil o No salir. Tiene en cuenta el tipo de acceso, la ola corregida en costa, el viento y la marea.',
    step5Title: '5. Sin cuentas, sin nubes',
    step5Body:
      'WKF no te pide registrarte y no manda tus puntos a ningún servidor. Todo vive en tu dispositivo. Puedes exportar tus datos a un archivo JSON y volverlos a importar cuando cambies de móvil u ordenador.',
    step6Title: '6. Aviso importante',
    step6Body:
      'WKF es una ayuda, no un sustituto de tu criterio. Los datos vienen de modelos meteorológicos abiertos, con precisión limitada en costa. No es una herramienta de navegación. Antes de salir al mar, valora siempre las condiciones reales y tu propia experiencia.',
  },

  winds: {
    // Rosa mediterránea de 16 rumbos. Se aplica solo en fachada
    // mediterránea española e italiana/francesa (DP-034).
    med: {
      N: 'Tramontana',
      NNE: 'Greco-Tramontana',
      NE: 'Gregal',
      ENE: 'Greco-Levante',
      E: 'Levante',
      ESE: 'Siroco-Levante',
      SE: 'Siroco',
      SSE: 'Siroco-Ostro',
      S: 'Ostro',
      SSO: 'Ostro-Libeccio',
      SO: 'Lebeche',
      OSO: 'Poniente-Libeccio',
      O: 'Poniente',
      ONO: 'Poniente-Mistral',
      NO: 'Mistral',
      NNO: 'Tramontana-Mistral',
    },
    // Nombres genéricos en el resto del mundo.
    generic: {
      N: 'N',
      NNE: 'NNE',
      NE: 'NE',
      ENE: 'ENE',
      E: 'E',
      ESE: 'ESE',
      SE: 'SE',
      SSE: 'SSE',
      S: 'S',
      SSO: 'SSO',
      SO: 'SO',
      OSO: 'OSO',
      O: 'O',
      ONO: 'ONO',
      NO: 'NO',
      NNO: 'NNO',
    },
  },

  coords: {
    format: 'Formato de coordenadas',
    dd: 'Decimal (DD)',
    dms: 'Grados, minutos, segundos (DMS)',
    ddm: 'Grados, minutos decimales (DDM)',
  },

  errors: {
    networkError: 'Sin conexión o servidor no responde.',
    apiError: 'La API ha devuelto un error.',
    apiQuota: 'Límite de la API alcanzado. Prueba más tarde.',
    unknown: 'Algo ha ido mal.',
  },
};

export type StringsSchema = typeof stringsEs;