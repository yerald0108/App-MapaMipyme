import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Perfil, RolUsuario } from '../types';

interface AuthState {
  perfil: Perfil | null;
  cargando: boolean;
  error: string | null;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  registro: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => Promise<void>;
  cargarPerfil: () => Promise<void>;
  limpiarError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  perfil: null,
  cargando: false,
  error: null,

  login: async (email, password) => {
    set({ cargando: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await get().cargarPerfil();
    } catch (e: any) {
      set({ error: e.message ?? 'Error al iniciar sesión' });
    } finally {
      set({ cargando: false });
    }
  },

  registro: async (email, password, nombre) => {
    set({ cargando: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, rol: 'dueno' },
        },
      });
      if (error) throw error;
      await get().cargarPerfil();
    } catch (e: any) {
      set({ error: e.message ?? 'Error al registrarse' });
    } finally {
      set({ cargando: false });
    }
  },

  logout: async () => {
    set({ cargando: true });
    await supabase.auth.signOut();
    set({ perfil: null, cargando: false });
  },

  cargarPerfil: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      set({ perfil: data as Perfil });
    }
  },

  limpiarError: () => set({ error: null }),
}));