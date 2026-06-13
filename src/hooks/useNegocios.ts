import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Negocio, Producto, CategoriaНegocio } from '../types';
import { CONFIG } from '../constants/config';

// ─── Obtener todos los negocios activos ───────────────────
export function useNegocios() {
  return useQuery({
    queryKey: ['negocios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('estado', 'activo')
        .order('membresia_activa', { ascending: false });

      if (error) throw error;
      return data as Negocio[];
    },
    staleTime: CONFIG.CACHE_NEGOCIOS,
  });
}

// ─── Obtener un negocio por ID ────────────────────────────
export function useNegocio(id: string) {
  return useQuery({
    queryKey: ['negocio', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Negocio;
    },
    enabled: !!id,
  });
}

// ─── Obtener negocios del dueño autenticado ───────────────
export function useMisNegocios() {
  return useQuery({
    queryKey: ['mis-negocios'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .eq('dueno_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Negocio[];
    },
  });
}

// ─── Obtener productos de un negocio ─────────────────────
export function useProductos(negocioId: string) {
  return useQuery({
    queryKey: ['productos', negocioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('negocio_id', negocioId)
        .order('disponible', { ascending: false })
        .order('nombre');

      if (error) throw error;
      return data as Producto[];
    },
    enabled: !!negocioId,
    staleTime: CONFIG.CACHE_PRODUCTOS,
  });
}

// ─── Crear producto ───────────────────────────────────────
export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('productos')
        .insert(producto)
        .select()
        .single();

      if (error) throw error;
      return data as Producto;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productos', data.negocio_id] });
    },
  });
}

// ─── Actualizar producto ──────────────────────────────────
export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      negocio_id,
      ...cambios
    }: Partial<Producto> & { id: string; negocio_id: string }) => {
      const { data, error } = await supabase
        .from('productos')
        .update(cambios)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Producto;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productos', data.negocio_id] });
    },
  });
}

// ─── Eliminar producto ────────────────────────────────────
export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, negocio_id }: { id: string; negocio_id: string }) => {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, negocio_id };
    },
    onSuccess: ({ negocio_id }) => {
      queryClient.invalidateQueries({ queryKey: ['productos', negocio_id] });
    },
  });
}

// ─── Crear negocio ────────────────────────────────────────
export function useCrearNegocio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (negocio: {
      nombre: string;
      descripcion?: string;
      categoria: CategoriaНegocio;
      direccion: string;
      municipio: string;
      provincia: string;
      telefono?: string;
      horario_apertura?: string;
      horario_cierre?: string;
      dias_abierto?: string[];
      latitud?: number;
      longitud?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const payload: any = {
        dueno_id: user.id,
        nombre: negocio.nombre,
        descripcion: negocio.descripcion || null,
        categoria: negocio.categoria,
        direccion: negocio.direccion,
        municipio: negocio.municipio,
        provincia: negocio.provincia,
        telefono: negocio.telefono || null,
        horario_apertura: negocio.horario_apertura || null,
        horario_cierre: negocio.horario_cierre || null,
        dias_abierto: negocio.dias_abierto || [],
        estado: 'pendiente',
        membresia_activa: false,
      };

      if (negocio.latitud && negocio.longitud) {
        payload.ubicacion = `POINT(${negocio.longitud} ${negocio.latitud})`;
      }

      const { data, error } = await supabase
        .from('negocios')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as Negocio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-negocios'] });
      queryClient.invalidateQueries({ queryKey: ['admin-negocios'] });
      queryClient.invalidateQueries({ queryKey: ['admin-estadisticas'] });
    },
  });
}