import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function DuenoLayout() {
  const { perfil } = useAuthStore();

  useEffect(() => {
    if (perfil && perfil.rol !== 'dueno' && perfil.rol !== 'admin') {
      router.replace('/');
    }
  }, [perfil]);

  return <Stack screenOptions={{ headerShown: false }} />;
}