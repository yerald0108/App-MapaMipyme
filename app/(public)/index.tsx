import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useNegocios } from '../../src/hooks/useNegocios';
import { Negocio } from '../../src/types';

const CATEGORIA_EMOJI: Record<string, string> = {
  alimentacion:      '🛒',
  farmacia:          '💊',
  ferreteria:        '🔧',
  ropa:              '👕',
  electrodomesticos: '📺',
  servicios:         '🔨',
  otro:              '🏪',
};

function BarraBusqueda({
  valor,
  onChange,
}: {
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.barraBusquedaContenedor}>
      <View style={styles.barraBusqueda}>
        <Text style={styles.barraBusquedaIcono}>🔍</Text>
        <TextInput
          style={styles.barraBusquedaInput}
          placeholder="Buscar productos..."
          placeholderTextColor={COLORS.gray500}
          value={valor}
          onChangeText={onChange}
        />
        {valor.length > 0 && (
          <TouchableOpacity onPress={() => onChange('')}>
            <Text style={styles.barraBusquedaLimpiar}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function TarjetaNegocio({
  negocio,
  onPress,
}: {
  negocio: Negocio;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress} activeOpacity={0.85}>
      {/* Foto del negocio */}
      <View style={styles.tarjetaFoto}>
        {negocio.foto_url ? (
          <Image source={{ uri: negocio.foto_url }} style={styles.tarjetaImagen} />
        ) : (
          <View style={styles.tarjetaFotoPlaceholder}>
            <Text style={styles.tarjetaEmoji}>
              {CATEGORIA_EMOJI[negocio.categoria] ?? '🏪'}
            </Text>
          </View>
        )}
        {negocio.membresia_activa && (
          <View style={styles.badgePro}>
            <Text style={styles.badgeProTexto}>PRO</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.tarjetaInfo}>
        <Text style={styles.tarjetaNombre} numberOfLines={1}>
          {negocio.nombre}
        </Text>
        <Text style={styles.tarjetaDireccion} numberOfLines={1}>
          📍 {negocio.direccion}, {negocio.municipio}
        </Text>
        {negocio.horario_apertura && negocio.horario_cierre && (
          <Text style={styles.tarjetaHorario}>
            🕐 {negocio.horario_apertura} - {negocio.horario_cierre}
          </Text>
        )}
      </View>

      {/* Botón visita */}
      <TouchableOpacity style={styles.btnVisita} onPress={onPress}>
        <Text style={styles.btnVisitaTexto}>Visita</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function NavBar() {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIconoActivo}>🏠</Text>
        <Text style={styles.navLabelActivo}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcono}>❤️</Text>
        <Text style={styles.navLabel}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcono}>💬</Text>
        <Text style={styles.navLabel}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.navIcono}>👤</Text>
        <Text style={styles.navLabel}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PantallaInicio() {
  const { data: negocios, isLoading, isError, refetch } = useNegocios();
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const negociosFiltrados = negocios?.filter((n) =>
    busqueda.trim() === ''
      ? true
      : n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        n.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        n.municipio.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Mapa placeholder con barra de búsqueda flotante encima */}
      <View style={styles.mapaContenedor}>
        <View style={styles.mapaFondo}>
          <Text style={styles.mapaIcono}>🗺️</Text>
          <Text style={styles.mapaTexto}>Mapa interactivo</Text>
          <Text style={styles.mapaSubtexto}>MapLibre GL — próxima fase</Text>
        </View>
        {/* Barra flotante sobre el mapa */}
        <BarraBusqueda valor={busqueda} onChange={setBusqueda} />
      </View>

      {/* Lista de negocios */}
      {isLoading && (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.cargandoTexto}>Buscando negocios...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centrado}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTexto}>Error al cargar los negocios</Text>
          <TouchableOpacity style={styles.btnReintentar} onPress={() => refetch()}>
            <Text style={styles.btnReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={negociosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={
            <Text style={styles.listaTitulo}>
              {busqueda
                ? `${negociosFiltrados?.length ?? 0} resultados para "${busqueda}"`
                : `${negociosFiltrados?.length ?? 0} negocios disponibles`}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Text style={styles.errorEmoji}>🏪</Text>
              <Text style={styles.errorTexto}>
                {busqueda
                  ? 'No se encontraron negocios'
                  : 'No hay negocios disponibles'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TarjetaNegocio
              negocio={item}
              onPress={() => router.push(`/(public)/negocio/${item.id}`)}
            />
          )}
        />
      )}

      {/* Bottom Navigation */}
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Mapa ──
  mapaContenedor: {
    height: 260,
    position: 'relative',
  },
  mapaFondo: {
    flex: 1,
    backgroundColor: '#d0dcea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapaIcono: {
    fontSize: 44,
    marginBottom: 6,
  },
  mapaTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  mapaSubtexto: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },

  // ── Barra búsqueda flotante ──
  barraBusquedaContenedor: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
  },
  barraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  barraBusquedaIcono: {
    fontSize: 16,
    marginRight: 8,
  },
  barraBusquedaInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  barraBusquedaLimpiar: {
    fontSize: 14,
    color: COLORS.gray500,
    paddingHorizontal: 4,
  },

  // ── Lista ──
  lista: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listaTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Tarjeta negocio ──
  tarjeta: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tarjetaFoto: {
    height: 120,
    position: 'relative',
  },
  tarjetaImagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tarjetaFotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjetaEmoji: {
    fontSize: 44,
  },
  badgePro: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeProTexto: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tarjetaInfo: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 3,
  },
  tarjetaNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tarjetaDireccion: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tarjetaHorario: {
    fontSize: 12,
    color: COLORS.primary,
  },
  btnVisita: {
    margin: 14,
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnVisitaTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // ── Estados ──
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cargandoTexto: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorTexto: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  btnReintentar: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnReintentarTexto: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // ── Nav bar ──
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.navBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
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