// ─── ROLES ────────────────────────────────────────────────
export type RolUsuario = 'ciudadano' | 'dueno' | 'admin';

// ─── USUARIO / AUTH ───────────────────────────────────────
export interface Perfil {
  id: string;
  rol: RolUsuario;
  nombre: string;
  telefono?: string;
  avatar_url?: string;
  created_at: string;
}

// ─── NEGOCIO ──────────────────────────────────────────────
export type EstadoNegocio = 'pendiente' | 'activo' | 'suspendido';
export type CategoriaНegocio =
  | 'alimentacion'
  | 'farmacia'
  | 'ferreteria'
  | 'ropa'
  | 'electrodomesticos'
  | 'servicios'
  | 'otro';

export interface Negocio {
  id: string;
  dueno_id: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaНegocio;
  estado: EstadoNegocio;
  direccion: string;
  municipio: string;
  provincia: string;
  telefono?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  dias_abierto?: string[];
  latitud: number;
  longitud: number;
  foto_url?: string;
  membresia_activa: boolean;
  created_at: string;
  updated_at: string;
}

// ─── PRODUCTO ─────────────────────────────────────────────
export type UnidadMedida =
  | 'unidad'
  | 'kg'
  | 'g'
  | 'litro'
  | 'ml'
  | 'caja'
  | 'paquete';

export interface Producto {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  unidad: UnidadMedida;
  disponible: boolean;
  foto_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── MEMBRESÍA ────────────────────────────────────────────
export type EstadoMembresia = 'activa' | 'vencida' | 'cancelada';
export type PlanMembresia = 'mensual' | 'anual';

export interface Membresia {
  id: string;
  negocio_id: string;
  plan: PlanMembresia;
  estado: EstadoMembresia;
  fecha_inicio: string;
  fecha_fin: string;
  monto: number;
  created_at: string;
}

// ─── HELPERS DE UI ────────────────────────────────────────
export interface NegocioConDistancia extends Negocio {
  distancia_km?: number;
}

export interface FiltrosNegocio {
  categoria?: CategoriaНegocio;
  soloConStock?: boolean;
  soloAbiertos?: boolean;
  radioKm?: number;
}