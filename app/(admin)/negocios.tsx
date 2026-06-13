import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';
import { CONFIG } from '../../src/constants/config';
import { NavBarAdmin } from './dashboard';

interface MembresiaConNegocio {
  id: string;
  negocio_id: string;
  plan: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto: number;
  created_at: string;
  negocios: { nombre: string; municipio: string } | null;
}


function useMembresiastAdmin() {
  return useQuery({
    queryKey: ['admin-membresias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membresias')
        .select('*, negocios(nombre, municipio)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MembresiaConNegocio[];
    },
  });
}

export default function AdminMembresias() {
  const queryClient = useQueryClient();
  const { data: membresias, isLoading } = useMembresiastAdmin();

  const handleCrearMembresia = async (negocioId: string, plan: 'mensual' | 'anual') => {
    const meses = plan === 'mensual' ? 1 : 12;
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + meses);

    await supabase.from('membresias').insert({
      negocio_id: negocioId,
      plan,
      estado: 'activa',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0],
      monto: plan === 'mensual'
        ? CONFIG.PRECIO_MEMBRESIA_MENSUAL
        : CONFIG.PRECIO_MEMBRESIA_ANUAL,
    });

    await supabase
      .from('negocios')
      .update({ membresia_activa: true })
      .eq('id', negocioId);

    queryClient.invalidateQueries({ queryKey: ['admin-membresias'] });
    queryClient.invalidateQueries({ queryKey: ['admin-estadisticas'] });
    queryClient.invalidateQueries({ queryKey: ['negocios'] });
  };

  const handleCancelar = async (membresia: MembresiaConNegocio) => {
    Alert.alert(
      'Cancelar membresía',
      `¿Cancelar la membresía de "${membresia.negocios?.nombre}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            await supabase
              .from('membresias')
              .update({ estado: 'cancelada' })
              .eq('id', membresia.id);

            await supabase
              .from('negocios')
              .update({ membresia_activa: false })
              .eq('id', membresia.negocio_id);

            queryClient.invalidateQueries({ queryKey: ['admin-membresias'] });
            queryClient.invalidateQueries({ queryKey: ['admin-estadisticas'] });
            queryClient.invalidateQueries({ queryKey: ['negocios'] });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Membresías</Text>
        <Text style={styles.headerSubtitulo}>
          {membresias?.filter((m) => m.estado === 'activa').length ?? 0} activas
        </Text>
      </View>

      {/* Precios */}
      <View style={styles.preciosContenedor}>
        <View style={styles.precioCard}>
          <Text style={styles.precioEmoji}>📅</Text>
          <Text style={styles.precioLabel}>Mensual</Text>
          <Text style={styles.precioValor}>
            {CONFIG.PRECIO_MEMBRESIA_MENSUAL.toLocaleString()} CUP
          </Text>
        </View>
        <View style={[styles.precioCard, styles.precioCardDestacado]}>
          <Text style={styles.precioEmoji}>🗓️</Text>
          <Text style={styles.precioLabelDestacado}>Anual</Text>
          <Text style={styles.precioValorDestacado}>
            {CONFIG.PRECIO_MEMBRESIA_ANUAL.toLocaleString()} CUP
          </Text>
          <Text style={styles.precioAhorro}>Ahorra 17%</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={membresias}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <Text style={styles.listaTitulo}>
              Historial de membresías ({membresias?.length ?? 0})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Text style={styles.sinDatosEmoji}>💳</Text>
              <Text style={styles.sinDatosTexto}>No hay membresías registradas</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.tarjetaHeader}>
                <View style={styles.tarjetaInfo}>
                  <Text style={styles.tarjetaNombre} numberOfLines={1}>
                    {item.negocios?.nombre ?? 'Negocio desconocido'}
                  </Text>
                  <Text style={styles.tarjetaMunicipio}>
                    📍 {item.negocios?.municipio ?? '—'}
                  </Text>
                </View>
                <View style={[
                  styles.estadoBadge,
                  item.estado === 'activa' && styles.estadoActivo,
                  item.estado === 'vencida' && styles.estadoVencido,
                  item.estado === 'cancelada' && styles.estadoCancelado,
                ]}>
                  <Text style={styles.estadoTexto}>
                    {item.estado.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.tarjetaDetalles}>
                <Text style={styles.detalle}>
                  📋 Plan: <Text style={styles.detalleValor}>{item.plan}</Text>
                </Text>
                <Text style={styles.detalle}>
                  💰 Monto: <Text style={styles.detalleValor}>{item.monto.toLocaleString()} CUP</Text>
                </Text>
                <Text style={styles.detalle}>
                  📅 Vence: <Text style={styles.detalleValor}>{item.fecha_fin}</Text>
                </Text>
              </View>

              {item.estado === 'activa' && (
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={() => handleCancelar(item)}
                >
                  <Text style={styles.btnCancelarTexto}>Cancelar membresía</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <NavBarAdmin activa="membresias" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  header: {
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
  preciosContenedor: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  precioCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 2,
  },
  precioCardDestacado: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  precioEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  precioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  precioLabelDestacado: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  precioValor: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  precioValorDestacado: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  precioAhorro: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '700',
    marginTop: 2,
  },
  lista: {
    padding: 16,
    gap: 10,
  },
  listaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tarjeta: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tarjetaInfo: {
    flex: 1,
    marginRight: 10,
  },
  tarjetaNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tarjetaMunicipio: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.gray300,
  },
  estadoActivo: { backgroundColor: '#dcfce7' },
  estadoVencido: { backgroundColor: '#fef9c3' },
  estadoCancelado: { backgroundColor: '#fee2e2' },
  estadoTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tarjetaDetalles: {
    gap: 4,
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 10,
  },
  detalle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  detalleValor: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  btnCancelar: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  btnCancelarTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
  },
  sinDatosEmoji: { fontSize: 44 },
  sinDatosTexto: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});