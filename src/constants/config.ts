export const CONFIG = {
  // Supabase — rellena estos después de crear el proyecto en supabase.com
  SUPABASE_URL: 'https://jttbummyuunupbmedodh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dGJ1bW15dXVudXBibWVkb2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDE0NDgsImV4cCI6MjA5Njc3NzQ0OH0.RpGQhAcmH2F4aCm8eXumDT5fwo6qgqx7CzAQ5Wy93DE',

  // Mapa
  MAPA_CENTRO_CUBA: {
    latitude: 22.0,
    longitude: -79.5,
    zoom: 7,
  },
  MAPA_RADIO_BUSQUEDA_KM: 5,

  // Paginación
  NEGOCIOS_POR_PAGINA: 20,
  PRODUCTOS_POR_PAGINA: 50,

  // Cache TanStack Query (en milisegundos)
  CACHE_NEGOCIOS: 1000 * 60 * 5,    // 5 minutos
  CACHE_PRODUCTOS: 1000 * 60 * 2,   // 2 minutos

  // Membresías
  PRECIO_MEMBRESIA_MENSUAL: 500,    // en CUP
  PRECIO_MEMBRESIA_ANUAL: 5000,

  // App
  APP_VERSION: '1.0.0',
  APP_NOMBRE: 'MiPyME Map',
} as const;