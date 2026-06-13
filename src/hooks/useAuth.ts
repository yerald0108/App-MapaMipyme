import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { perfil, cargando, error, login, registro, logout, cargarPerfil, limpiarError } =
    useAuthStore();

  useEffect(() => {
    // Cargar sesión existente al arrancar
    cargarPerfil();

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await cargarPerfil();
        } else {
          useAuthStore.setState({ perfil: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { perfil, cargando, error, login, registro, logout, limpiarError };
}