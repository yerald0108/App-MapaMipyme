export const COLORS = {
  // Primarios — azul cubano oscuro
  primary: '#1a3a6b',
  primaryDark: '#0f2347',
  primaryLight: '#e8eef7',
  primaryMid: '#2a5298',

  // Acento — rojo cubano
  accent: '#cc2936',
  accentLight: '#fdf0f1',

  // Secundario — dorado/amarillo
  secondary: '#f0a500',
  secondaryLight: '#fdf6e3',

  // Neutrales
  white: '#ffffff',
  black: '#0d0d0d',
  gray100: '#f8f9fa',
  gray200: '#f1f3f5',
  gray300: '#e9ecef',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',

  // Estados
  success: '#2d9e6b',
  warning: '#f0a500',
  error: '#cc2936',
  info: '#2a5298',

  // Membresía
  membresiaPro: '#1a3a6b',
  membresiaBasic: '#6c757d',

  // Mapa
  markerActivo: '#cc2936',
  markerInactivo: '#adb5bd',

  // UI
  background: '#f8f9fa',
  surface: '#ffffff',
  border: '#e9ecef',
  borderDark: '#ced4da',
  textPrimary: '#0d0d0d',
  textSecondary: '#6c757d',
  textMuted: '#adb5bd',

  // Nav bar
  navActive: '#1a3a6b',
  navInactive: '#adb5bd',
  navBackground: '#ffffff',
} as const;

export type ColorKey = keyof typeof COLORS;