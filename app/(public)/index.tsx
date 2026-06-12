import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useNegocios } from '../../src/hooks/useNegocios';
import { Negocio } from '../../src/types';

const CATEGORIA_EMOJI: Record<string, string> = {
  alimentacion:     '🛒',
  farmacia:         '💊',
  ferreteria:       '🔧',
  ropa:             '👕',
  electrodomesticos:'📺',
  servicios:        '🔨',
  otro:             '🏪',
};

function TarjetaNegocio({
  negocio,
  onPress,
}: {
  negocio: Negocio;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress}>
      <View style={styles.tarjetaIzquierda}>
        <Text style={styles.tarjetaEmoji}>
          {CATEGORIA_EMOJI[negocio.categoria] ?? '🏪'}
        </Text>
      </View>
      <View style={styles.tarjetaCentro}>
        <Text style={styles.tarjetaNombre}>{negocio.nombre}</Text>
        <Text style={styles.tarjetaDireccion}>
          {negocio.direccion} · {negocio.municipio}
        </Text>
        {negocio.horario_apertura && negocio.horario_cierre && (
          <Text style={styles.tarjetaHorario}>
            🕐 {negocio.horario_apertura} - {negocio.horario_cierre}
          </Text>
        )}
      </View>
      <View style={styles.tarjetaDerecha}>
        {negocio.membresia_activa ? (
          <View style={styles.badgePro}>
            <Text style={styles.badgeProTexto}>PRO</Text>
          </View>
        ) : (
          <View style={styles.badgeBasic}>
            <Text style={styles.badgeBasicTexto}>BASIC</Text>
          </View>
        )}
        <Text style={styles.tarjetaFlecha}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PantallaInicio() {
  const { data: negocios, isLoading, isError, refetch } = useNegocios();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNegocioPress = (id: string) => {
    router.push({
      pathname: "/(public)/negocio/[id]",
      params: { id }
    } as any);
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>MiPyME Map</Text>
          <Text style={styles.headerSubtitulo}>
            {negocios ? `${negocios.length} negocios activos` : 'Cargando...'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnBuscar}
          onPress={() => router.push('/(public)/buscar')}
        >
          <Text style={styles.btnBuscarTexto}>🔍 Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa placeholder */}
      <View style={styles.mapaPlaceholder}>
        <Text style={styles.mapaIcono}>🗺️</Text>
        <Text style={styles.mapaTexto}>Mapa MapLibre — próximamente</Text>
      </View>

      {/* Estado: cargando */}
      {isLoading && (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.cargandoTexto}>Cargando negocios...</Text>
        </View>
      )}

      {/* Estado: error */}
      {isError && (
        <View style={styles.centrado}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTexto}>Error al cargar los negocios</Text>
          <TouchableOpacity style={styles.btnReintentar} onPress={() => refetch()}>
            <Text style={styles.btnReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de negocios */}
      {!isLoading && !isError && (
        <FlatList
          data={negocios}
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
            <Text style={styles.listaTitulo}>Negocios cercanos</Text>
          }
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Text style={styles.mapaIcono}>🏪</Text>
              <Text style={styles.errorTexto}>No hay negocios disponibles</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TarjetaNegocio
              negocio={item}
              onPress={() => handleNegocioPress(item.id)}
            />
          )}
        />
      )}

      {/* Botón acceso dueños */}
      <TouchableOpacity
        style={styles.btnDueno}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.btnDuenoTexto}>¿Eres dueño de una MiPyME? →</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitulo: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  btnBuscar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnBuscarTexto: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  mapaPlaceholder: {
    height: 180,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapaIcono: {
    fontSize: 40,
    marginBottom: 6,
  },
  mapaTexto: {
    fontSize: 14,
    color: COLORS.gray500,
  },
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
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tarjetaIzquierda: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tarjetaEmoji: {
    fontSize: 22,
  },
  tarjetaCentro: {
    flex: 1,
  },
  tarjetaNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tarjetaDireccion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tarjetaHorario: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
  },
  tarjetaDerecha: {
    alignItems: 'center',
    gap: 4,
  },
  badgePro: {
    backgroundColor: COLORS.membresiaPro,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeProTexto: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeBasic: {
    backgroundColor: COLORS.gray200,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeBasicTexto: {
    color: COLORS.gray600,
    fontSize: 10,
    fontWeight: '600',
  },
  tarjetaFlecha: {
    fontSize: 20,
    color: COLORS.gray400,
  },
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
  btnDueno: {
    margin: 16,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  btnDuenoTexto: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});