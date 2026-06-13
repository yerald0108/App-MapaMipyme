import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { useNegocios } from '../../src/hooks/useNegocios';

function TarjetaEstadistica({
  emoji,
  valor,
  label,
  color,
}: {
  emoji: string;
  valor: string | number;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValor, { color }]}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function NavBarDueno({ activa }: { activa: 'inicio' | 'productos' | 'perfil' }) {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(dueno)/dashboard')}
      >
        <Text style={activa === 'inicio' ? styles.navIconoActivo : styles.navIcono}>🏠</Text>
        <Text style={activa === 'inicio' ? styles.navLabelActivo : styles.navLabel}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(dueno)/productos')}
      >
        <Text style={activa === 'productos' ? styles.navIconoActivo : styles.navIcono}>📦</Text>
        <Text style={activa === 'productos' ? styles.navLabelActivo : styles.navLabel}>Productos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace('/(dueno)/perfil-negocio')}
      >
        <Text style={activa === 'perfil' ? styles.navIconoActivo : styles.navIcono}>⚙️</Text>
        <Text style={activa === 'perfil' ? styles.navLabelActivo : styles.navLabel}>Mi Negocio</Text>
      </TouchableOpacity>
    </View>
  );
}

export { NavBarDueno };

export default function DuenoDashboard() {
  const { perfil, logout } = useAuthStore();
  const { data: negocios, isLoading } = useNegocios();

  // Negocios del dueño actual
  const misNegocios = negocios?.filter((n) => n.dueno_id === perfil?.id) ?? [];
  const totalProductos = 0; // Se calculará cuando tengamos los productos

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSaludo}>
            Hola, {perfil?.nombre?.split(' ')[0] ?? 'Dueño'} 👋
          </Text>
          <Text style={styles.headerSubtitulo}>Panel de gestión</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Membresía */}
        <View style={styles.membresiaCard}>
          <View style={styles.membresiaInfo}>
            <Text style={styles.membresiaEmoji}>⭐</Text>
            <View>
              <Text style={styles.membresiaTitulo}>Plan Básico</Text>
              <Text style={styles.membresiaSubtitulo}>
                Actualiza a PRO para más visibilidad
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btnUpgrade}>
            <Text style={styles.btnUpgradeTexto}>Mejorar</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <Text style={styles.seccionTitulo}>Resumen</Text>
        <View style={styles.statsGrid}>
          <TarjetaEstadistica
            emoji="🏪"
            valor={isLoading ? '...' : misNegocios.length}
            label="Negocios"
            color={COLORS.primary}
          />
          <TarjetaEstadistica
            emoji="📦"
            valor="—"
            label="Productos"
            color={COLORS.secondary}
          />
          <TarjetaEstadistica
            emoji="👁️"
            valor="—"
            label="Visitas hoy"
            color={COLORS.success}
          />
          <TarjetaEstadistica
            emoji="⭐"
            valor={misNegocios.filter((n) => n.membresia_activa).length}
            label="PRO activos"
            color={COLORS.accent}
          />
        </View>

        {/* Acciones rápidas */}
        <Text style={styles.seccionTitulo}>Acciones rápidas</Text>
        <View style={styles.accionesGrid}>
          <TouchableOpacity
            style={styles.accionCard}
            onPress={() => router.push('/(dueno)/productos')}
          >
            <Text style={styles.accionEmoji}>📦</Text>
            <Text style={styles.accionTitulo}>Mis productos</Text>
            <Text style={styles.accionSubtitulo}>Gestionar inventario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accionCard}
            onPress={() => router.push('/(dueno)/perfil-negocio')}
          >
            <Text style={styles.accionEmoji}>🏪</Text>
            <Text style={styles.accionTitulo}>Mi negocio</Text>
            <Text style={styles.accionSubtitulo}>Editar información</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accionCard}>
            <Text style={styles.accionEmoji}>📊</Text>
            <Text style={styles.accionTitulo}>Estadísticas</Text>
            <Text style={styles.accionSubtitulo}>Ver visitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accionCard}>
            <Text style={styles.accionEmoji}>💳</Text>
            <Text style={styles.accionTitulo}>Membresía</Text>
            <Text style={styles.accionSubtitulo}>Ver mi plan</Text>
          </TouchableOpacity>
        </View>

        {/* Mis negocios */}
        <Text style={styles.seccionTitulo}>Mis negocios</Text>

        {isLoading && (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} />
        )}

        {!isLoading && misNegocios.length === 0 && (
          <View style={styles.sinNegocios}>
            <Text style={styles.sinNegociosEmoji}>🏪</Text>
            <Text style={styles.sinNegociosTitulo}>Sin negocios registrados</Text>
            <Text style={styles.sinNegociosSubtitulo}>
              Registra tu negocio para aparecer en el mapa
            </Text>
            <TouchableOpacity
              style={styles.btnRegistrarNegocio}
              onPress={() => router.push('/(dueno)/nuevo-negocio')}
            >
              <Text style={styles.btnRegistrarNegocioTexto}>+ Registrar mi negocio</Text>
            </TouchableOpacity>
          </View>
        )}

        {misNegocios.map((negocio) => (
          <View key={negocio.id} style={styles.negocioCard}>
            <View style={styles.negocioInfo}>
              <Text style={styles.negocioNombre}>{negocio.nombre}</Text>
              <Text style={styles.negocioDireccion}>
                📍 {negocio.municipio}, {negocio.provincia}
              </Text>
              <View style={styles.negocioEstado}>
                <View style={[
                  styles.estadoBadge,
                  { backgroundColor: negocio.estado === 'activo' ? COLORS.success : COLORS.warning }
                ]}>
                  <Text style={styles.estadoBadgeTexto}>
                    {negocio.estado.toUpperCase()}
                  </Text>
                </View>
                {negocio.membresia_activa && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeTexto}>⭐ PRO</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnVerProductos}
              onPress={() => router.push('/(dueno)/productos')}
            >
              <Text style={styles.btnVerProductosTexto}>Ver productos →</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <NavBarDueno activa="inicio" />
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerSaludo: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSubtitulo: {
    fontSize: 13,
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
    paddingBottom: 8,
  },

  // ── Membresía ──
  membresiaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    opacity: 0.9,
  },
  membresiaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  membresiaEmoji: {
    fontSize: 28,
  },
  membresiaTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  membresiaSubtitulo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  btnUpgrade: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnUpgradeTexto: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },

  // ── Sección ──
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },

  // ── Stats ──
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

  // ── Acciones ──
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

  // ── Negocios ──
  negocioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  negocioInfo: {
    gap: 4,
  },
  negocioNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  negocioDireccion: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  negocioEstado: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  estadoBadgeTexto: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  proBadgeTexto: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  btnVerProductos: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnVerProductosTexto: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Sin negocios ──
  sinNegocios: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginBottom: 16,
  },
  sinNegociosEmoji: {
    fontSize: 44,
  },
  sinNegociosTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sinNegociosSubtitulo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // ── Nav bar ──
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
  btnRegistrarNegocio: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
},
  btnRegistrarNegocioTexto: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 15,
},
});