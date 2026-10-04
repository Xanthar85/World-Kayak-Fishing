import type { StringsSchema } from './strings.es.ts';

export const stringsEn: StringsSchema = {
  app: {
    name: 'WKF',
    tagline: 'World Kayak Fishing',
  },

  common: {
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    add: 'Add',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    copy: 'Copy',
    copied: 'Copied',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    search: 'Search',
    searching: 'Searching…',
    unnamed: 'Unnamed',
    optional: 'optional',
  },

  firstrun: {
    welcome: 'Welcome to WKF',
    intro:
      'Your kayak and shore fishing logbook. No accounts, no cloud, no hassle. Everything stays on your device.',
    addFirstSpot: 'Add your first spot',
  },

  home: {
    counter: '{{count}} / {{max}}',
    empty: {
      title: 'No spots yet',
      subtitle: 'When you add your first spot, it will appear here.',
    },
    noSpots: 'No spots yet',
    addSpot: 'Add spot',
    limitReached: 'Limit of 6 spots reached',
    card: {
      noData: 'No data',
      stale: 'Stale data',
      updatedAgo: 'Updated {{min}} min ago',
      updatedNow: 'Updated just now',
      refresh: 'Refresh',
      loading: 'Loading…',
      error: 'Load error',
    },
  },

  map: {
    newSpot: 'NEW SPOT',
    editSpot: 'EDIT SPOT',
    spotName: 'Spot name',
    spotNamePlaceholder: 'Give it a name',
    searching: 'Searching…',
    unnamed: 'Unnamed',
    tapToPlace: 'Tap the map to place the spot',
    coordinates: 'Coordinates',
  },

  verdict: {
    favorable: 'Favorable',
    acceptable: 'Acceptable',
    demanding: 'Demanding',
    advisedAgainst: 'Advised against',
    triggeringFactor: 'Triggering factor',
    seeAllFactors: 'See all factors',
    appliedThreshold: 'Applied threshold: category {{category}}, {{zone}}',
    launch: {
      title: 'Launch / landing',
      safe: 'Safe',
      watch: 'Watch',
      hard: 'Hard',
      noGo: 'No go',
    },
  },

  factors: {
    waveHeight: 'Wave height',
    wavePeriod: 'Period',
    waveDirection: 'Wave direction',
    windSpeed: 'Wind',
    windGusts: 'Gusts',
    windDirection: 'Wind direction',
    temperature: 'Temperature',
    precipitation: 'Precipitation',
    pressure: 'Pressure',
    seaLevel: 'Tide',
    current: 'Current',
  },

  tabs: {
    waves: 'Waves',
    wind: 'Wind',
    weather: 'Weather',
    air: 'Air',
    barometer: 'Barometer',
    activity: 'Activity',
    sun: 'Sun',
    moon: 'Moon',
    tides: 'Tides',
  },

  settings: {
    title: 'Settings',
    language: 'Language',
    languageEs: 'Español',
    languageEn: 'English',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    kayak: 'My kayak',
    kayakCategory: 'Kayak category',
    kayakCategoryA: 'A — Offshore, demanding conditions',
    kayakCategoryB: 'B — Advanced coastal',
    kayakCategoryC: 'C — Standard coastal',
    kayakCategoryD: 'D — Sheltered waters',
    kayakCategoryAssumed: 'No category configured. C is applied by default.',
    zones: 'Zone',
    zoneMed: 'Mediterranean',
    zoneAtlantic: 'Atlantic',
    zonePacific: 'Pacific',
    zoneOther: 'Other',
    tabsVisibility: 'Visible tabs',
    tabLocked: 'Fixed',
    tutorial: 'Tutorial',
    tutorialRestart: 'Watch the tutorial again',
    tutorialExtended: 'Full tutorial',
    data: 'Data',
    exportJson: 'Export data (JSON)',
    importJson: 'Import data (JSON)',
    clearAll: 'Delete all data',
    clearAllConfirm: 'Are you sure? This cannot be undone.',
    about: 'About',
    aboutText:
      'World Kayak Fishing (WKF). Free webapp for kayak and shore fishing. No accounts, no cloud. Everything stays on your device.',
    donate: 'Buy me a coffee',
    donateText: 'WKF is free and ad-free. If it helps you, you can support the project.',
    version: 'Version',
  },

  tutorial: {
    title: 'Tutorial',
    intro:
      'WKF helps you decide whether it is worth going out fishing and in which part of the day. Here is how it works, no fluff.',
    step1Title: '1. Add your spots',
    step1Body:
      'A spot is a fishing area. You can have up to 6. When you create one, you mark the exact place on the map and give it a name. You can also add its shore access point, which we use to warn you about launch and landing.',
    step2Title: '2. Read the verdict',
    step2Body:
      'For each spot, WKF sums up the conditions in a per-slot verdict: Favorable, Acceptable, Demanding or Advised against. If it is Demanding or Advised against, we tell you which factor triggered the warning. The worst factor always wins, not the average.',
    step3Title: '3. Go into the detail',
    step3Body:
      'Inside a spot you have tabs with the raw data: waves, wind, weather, air, barometer, activity, sun, moon and tides. Big numbers, hourly table and chart. Everything in sight.',
    step4Title: '4. Launch warning',
    step4Body:
      'If you have configured the access point, WKF adds a specific launch and landing warning: Safe, Watch, Hard or No go. It takes into account the access type, the wave corrected at the shore, the wind and the tide.',
    step5Title: '5. No accounts, no cloud',
    step5Body:
      'WKF does not ask you to register and does not send your spots to any server. Everything lives on your device. You can export your data to a JSON file and import it back when you change phone or computer.',
    step6Title: '6. Important warning',
    step6Body:
      'WKF is an aid, not a substitute for your judgement. Data comes from open weather models, with limited accuracy at the shore. It is not a navigation tool. Before going out to sea, always assess the real conditions and your own experience.',
  },

  winds: {
    // Mediterranean rose of 16 points. Applied only on the Spanish
    // and French/Italian Mediterranean coast (DP-034).
    med: {
      N: 'Tramontana (Northerly)',
      NNE: 'Greco-Tramontana (NNE)',
      NE: 'Gregal (Northeasterly)',
      ENE: 'Greco-Levante (ENE)',
      E: 'Levante (Easterly)',
      ESE: 'Siroco-Levante (ESE)',
      SE: 'Siroco (Southeasterly)',
      SSE: 'Siroco-Ostro (SSE)',
      S: 'Ostro (Southerly)',
      SSO: 'Ostro-Libeccio (SSW)',
      SO: 'Lebeche (Southwesterly)',
      OSO: 'Poniente-Libeccio (WSW)',
      O: 'Poniente (Westerly)',
      ONO: 'Poniente-Mistral (WNW)',
      NO: 'Mistral (Northwesterly)',
      NNO: 'Tramontana-Mistral (NNW)',
    },
    // Generic names everywhere else.
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
    format: 'Coordinate format',
    dd: 'Decimal (DD)',
    dms: 'Degrees, minutes, seconds (DMS)',
    ddm: 'Degrees, decimal minutes (DDM)',
  },

  errors: {
    networkError: 'No connection or server not responding.',
    apiError: 'The API returned an error.',
    apiQuota: 'API limit reached. Try again later.',
    unknown: 'Something went wrong.',
  },
};