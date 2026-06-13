import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';

function useEstadisticasAdmin() {
  return useQuery({
    queryKey: ['admin-estadisticas'],
    queryFn: async () => {
      const [negocios, productos, membresias] = await Promise.all([
        supabase.from('negocios').select('id, estado, membresia_activa'),
        supabase.from('productos').select('id, disponible'),
        supabase.from('membresias').select('id, estado'),
      ]);

      return {
        totalNegocios: negocios.data?.length ?? 0,
        negociosActivos: negocios.data?.filter((n) => n.estado === 'activo').length ?? 0,
        negociosPendientes: negocios.data?.filter((n) => n.estado === 'pendiente').length ?? 0,
        negociosPro: negocios.data?.filter((n) => n.membresia_activa).length ?? 0,
        totalProductos: productos.data?.length ?? 0,
        membresiasActivas: membresias.data?.filter((m) => m.estado === 'activa').length ?? 0,
      };
    },
  });
}

function NavBarAdmin({ activa }: { activa: 'inicio' | 'negocios' | 'membresias' }) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(admin)/dashboard')}
      >
        <Text style={activa === 'inicio' ? styles.navIconoActivo : styles.navIcono}>🏠</Text>
        <Text style={activa === 'inicio' ? styles.navLabelActivo : styles.navLabel}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(admin)/negocios')}
      >
        <Text style={activa === 'negocios' ? styles.navIconoActivo : styles.navIcono}>🏢</Text>
        <Text style={activa === 'negocios' ? styles.navLabelActivo : styles.navLabel}>Negocios</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(admin)/membresias')}
      >
        <Text style={activa === 'membresias' ? styles.navIconoActivo : styles.navIcono}>💳</Text>
        <Text style={activa === 'membresias' ? styles.navLabelActivo : styles.navLabel}>Membresías</Text>
      </TouchableOpacity>
    </View>
  );
}

export { NavBarAdmin };

export default function AdminDashboard() {
  const { perfil, logout } = useAuthStore();
  const { data: stats, isLoading } = useEstadisticasAdmin();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Panel Admin 👑</Text>
          <Text style={styles.headerSubtitulo}>
            {perfil?.nombre ?? 'Administrador'}
          </Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <Text style={styles.seccionTitulo}>Resumen general</Text>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: COLORS.primary }]}>
              <Text style={styles.statEmoji}>🏢</Text>
              <Text style={[styles.statValor, { color: COLORS.primary }]}>
                {stats?.totalNegocios}
              </Text>
              <Text style={styles.statLabel}>Total negocios</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={[styles.statValor, { color: COLORS.success }]}>
                {stats?.negociosActivos}
              </Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: COLORS.warning }]}>
              <Text style={styles.statEmoji}>⏳</Text>
              <Text style={[styles.statValor, { color: COLORS.warning }]}>
                {stats?.negociosPendientes}
              </Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: COLORS.accent }]}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={[styles.statValor, { color: COLORS.accent }]}>
                {stats?.negociosPro}
              </Text>
              <Text style={styles.statLabel}>PRO activos</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: COLORS.secondary }]}>
              <Text style={styles.statEmoji}>📦</Text>
              <Text style={[styles.statValor, { color: COLORS.secondary }]}>
                {stats?.totalProductos}
              </Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: COLORS.membresiaPro }]}>
              <Text style={styles.statEmoji}>💳</Text>
              <Text style={[styles.statValor, { color: COLORS.membresiaPro }]}>
                {stats?.membresiasActivas}
              </Text>
              <Text style={styles.statLabel}>Membresías</Text>
            </View>
          </View>
        )}

        {/* Acciones rápidas */}
        <Text style={styles.seccionTitulo}>Acciones rápidas</Text>
        <View style={styles.accionesGrid}>
          <TouchableOpacity
            style={styles.accionCard}
            onPress={() => router.push('/(admin)/negocios')}
          >
            <Text style={styles.accionEmoji}>🏢</Text>
            <Text style={styles.accionTitulo}>Gestionar negocios</Text>
            <Text style={styles.accionSubtitulo}>Aprobar, suspender</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accionCard}
            onPress={() => router.push('/(admin)/membresias')}
          >
            <Text style={styles.accionEmoji}>💳</Text>
            <Text style={styles.accionTitulo}>Membresías</Text>
            <Text style={styles.accionSubtitulo}>Gestionar planes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accionCard}>
            <Text style={styles.accionEmoji}>👥</Text>
            <Text style={styles.accionTitulo}>Usuarios</Text>
            <Text style={styles.accionSubtitulo}>Ver todos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accionCard}>
            <Text style={styles.accionEmoji}>📊</Text>
            <Text style={styles.accionTitulo}>Reportes</Text>
            <Text style={styles.accionSubtitulo}>Ver métricas</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <NavBarAdmin activa="inicio" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSubtitulo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  btnLogout: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnLogoutTexto: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  scroll: {
    padding: 16,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statEmoji: {
    fontSize: 22,
  },
  statValor: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  accionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  accionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  accionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  accionSubtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.navBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navIconoActivo: {
    fontSize: 22,
  },
  navIcono: {
    fontSize: 22,
    opacity: 0.4,
  },
  navLabelActivo: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.navActive,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.navInactive,
  },
});