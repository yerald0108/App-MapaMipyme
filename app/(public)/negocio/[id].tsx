import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { useNegocio, useProductos } from '../../../src/hooks/useNegocios';
import { Producto } from '../../../src/types';

function TarjetaProducto({ producto }: { producto: Producto }) {
  return (
    <View style={[styles.producto, !producto.disponible && styles.productoAgotado]}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{producto.nombre}</Text>
        <Text style={styles.productoStock}>
          {producto.disponible
            ? `${producto.stock} ${producto.unidad}${producto.stock !== 1 ? 's' : ''} disponibles`
            : 'Agotado'}
        </Text>
      </View>
      <Text style={styles.productoPrecio}>
        ${producto.precio.toLocaleString('es-CU')} CUP
      </Text>
    </View>
  );
}

export default function PantallaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: negocio, isLoading: cargandoNegocio } = useNegocio(id);
  const { data: productos, isLoading: cargandoProductos } = useProductos(id);

  if (cargandoNegocio) {
    return (
      <SafeAreaView style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!negocio) {
    return (
      <SafeAreaView style={styles.centrado}>
        <Text style={styles.errorTexto}>Negocio no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnVolver}>← Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.btnVolverTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          {negocio.nombre}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info principal */}
        <View style={styles.infoCard}>
          <Text style={styles.negocioNombre}>{negocio.nombre}</Text>
          {negocio.descripcion && (
            <Text style={styles.negocioDescripcion}>{negocio.descripcion}</Text>
          )}

          <View style={styles.fila}>
            <Text style={styles.filaIcono}>📍</Text>
            <Text style={styles.filaTexto}>
              {negocio.direccion}, {negocio.municipio}, {negocio.provincia}
            </Text>
          </View>

          {negocio.telefono && (
            <View style={styles.fila}>
              <Text style={styles.filaIcono}>📞</Text>
              <Text style={styles.filaTexto}>{negocio.telefono}</Text>
            </View>
          )}

          {negocio.horario_apertura && negocio.horario_cierre && (
            <View style={styles.fila}>
              <Text style={styles.filaIcono}>🕐</Text>
              <Text style={styles.filaTexto}>
                {negocio.horario_apertura} - {negocio.horario_cierre}
              </Text>
            </View>
          )}

          {negocio.dias_abierto && negocio.dias_abierto.length > 0 && (
            <View style={styles.fila}>
              <Text style={styles.filaIcono}>📅</Text>
              <Text style={styles.filaTexto}>
                {negocio.dias_abierto.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Productos */}
        <Text style={styles.seccionTitulo}>
          Productos disponibles
          {productos ? ` (${productos.length})` : ''}
        </Text>

        {cargandoProductos && (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 16 }} />
        )}

        {productos?.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}

        {!cargandoProductos && productos?.length === 0 && (
          <View style={styles.sinProductos}>
            <Text style={styles.sinProductosTexto}>
              Este negocio no tiene productos registrados
            </Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  btnVolverTexto: {
    fontSize: 24,
    color: COLORS.white,
    width: 32,
  },
  headerTitulo: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  negocioNombre: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  negocioDescripcion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  filaIcono: {
    fontSize: 15,
    marginTop: 1,
  },
  filaTexto: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  producto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productoAgotado: {
    opacity: 0.5,
  },
  productoInfo: {
    flex: 1,
    marginRight: 12,
  },
  productoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  productoStock: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  productoPrecio: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sinProductos: {
    padding: 24,
    alignItems: 'center',
  },
  sinProductosTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  errorTexto: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  btnVolver: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});