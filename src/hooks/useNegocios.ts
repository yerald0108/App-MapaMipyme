import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Negocio, Producto } from '../types';
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