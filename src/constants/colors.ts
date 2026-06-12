export const COLORS = {
  // Primarios
  primary: '#1a56db',
  primaryDark: '#1044b8',
  primaryLight: '#e8effd',

  // Secundarios
  secondary: '#0e9f6e',
  secondaryDark: '#057a55',
  secondaryLight: '#e8f8f3',

  // Neutrales
  white: '#ffffff',
  black: '#111827',
  gray100: '#f9fafb',
  gray200: '#f3f4f6',
  gray300: '#e5e7eb',
  gray400: '#d1d5db',
  gray500: '#9ca3af',
  gray600: '#6b7280',
  gray700: '#374151',
  gray800: '#1f2937',

  // Estados
  success: '#0e9f6e',
  warning: '#ff8000',
  error: '#f05252',
  info: '#3f83f8',

  // Membresía
  membresiaPro: '#7c3aed',
  membresiaBasic: '#1a56db',

  // Mapa
  markerActivo: '#1a56db',
  markerInactivo: '#9ca3af',
  markerSinStock: '#f05252',

  // UI
  background: '#f9fafb',
  surface: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
} as const;

export type ColorKey = keyof typeof COLORS;