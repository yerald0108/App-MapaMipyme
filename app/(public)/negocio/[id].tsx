import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { useNegocio, useProductos } from '../../../src/hooks/useNegocios';
import { Producto } from '../../../src/types';

const CATEGORIA_EMOJI: Record<string, string> = {
  alimentacion:      '🛒',
  farmacia:          '💊',
  ferreteria:        '🔧',
  ropa:              '👕',
  electrodomesticos: '📺',
  servicios:         '🔨',
  otro:              '🏪',
};

function TarjetaProducto({ producto }: { producto: Producto }) {
  return (
    <View style={[styles.producto, !producto.disponible && styles.productoAgotado]}>
      {/* Foto producto */}
      <View style={styles.productoFoto}>
        {producto.foto_url ? (
          <Image source={{ uri: producto.foto_url }} style={styles.productoImagen} />
        ) : (
          <View style={styles.productoFotoPlaceholder}>
            <Text style={styles.productoEmoji}>📦</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre} numberOfLines={2}>
          {producto.nombre}
        </Text>
        <Text style={styles.productoPrecio}>
          {producto.precio.toLocaleString('es-CU')} CUP
        </Text>
        <Text style={styles.productoStock}>
          {producto.disponible
            ? `${producto.stock} ${producto.unidad}${producto.stock !== 1 ? 's' : ''}`
            : 'Agotado'}
        </Text>
      </View>

      {/* Indicador disponible */}
      <View style={[
        styles.productoIndicador,
        { backgroundColor: producto.disponible ? COLORS.success : COLORS.error }
      ]} />
    </View>
  );
}

function NavBar() {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/')}>
        <Text style={styles.navIcono}>🏠</Text>
        <Text style={styles.navLabel}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcono}>❤️</Text>
        <Text style={styles.navLabel}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcono}>💬</Text>
        <Text style={styles.navLabel}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcono}>👤</Text>
        <Text style={styles.navLabel}>Perfil</Text>
      </TouchableOpacity>
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
        <Text style={styles.cargandoTexto}>Cargando negocio...</Text>
      </SafeAreaView>
    );
  }

  if (!negocio) {
    return (
      <SafeAreaView style={styles.centrado}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTexto}>Negocio no encontrado</Text>
        <TouchableOpacity style={styles.btnVolver} onPress={() => router.back()}>
          <Text style={styles.btnVolverTexto}>← Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header con botón volver */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>
          MIPYME
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Foto grande del negocio */}
        <View style={styles.fotoContenedor}>
          {negocio.foto_url ? (
            <Image source={{ uri: negocio.foto_url }} style={styles.fotoNegocio} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.fotoEmoji}>
                {CATEGORIA_EMOJI[negocio.categoria] ?? '🏪'}
              </Text>
            </View>
          )}
        </View>

        {/* Info del negocio */}
        <View style={styles.infoContenedor}>
          <Text style={styles.negocioNombre}>{negocio.nombre}</Text>
          <Text style={styles.negocioDireccion}>
            📍 {negocio.direccion}, {negocio.municipio}, {negocio.provincia}
          </Text>

          <View style={styles.detallesRow}>
            {negocio.horario_apertura && negocio.horario_cierre && (
              <View style={styles.detalleChip}>
                <Text style={styles.detalleChipTexto}>
                  🕐 {negocio.horario_apertura} - {negocio.horario_cierre}
                </Text>
              </View>
            )}
            {negocio.telefono && (
              <View style={styles.detalleChip}>
                <Text style={styles.detalleChipTexto}>
                  📞 {negocio.telefono}
                </Text>
              </View>
            )}
            {negocio.membresia_activa && (
              <View style={styles.detalleChipPro}>
                <Text style={styles.detalleChipProTexto}>⭐ PRO</Text>
              </View>
            )}
          </View>

          {negocio.descripcion && (
            <Text style={styles.negocioDescripcion}>{negocio.descripcion}</Text>
          )}
        </View>

        {/* Separador */}
        <View style={styles.separador} />

        {/* Cabecera productos */}
        <View style={styles.productosHeader}>
          <Text style={styles.productosTitulo}>Products</Text>
          <Text style={styles.productosCantidadLabel}>Cantidad</Text>
        </View>

        {/* Lista productos */}
        {cargandoProductos && (
          <View style={styles.centradoInline}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        )}

        {!cargandoProductos && productos?.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}

        {!cargandoProductos && productos?.length === 0 && (
          <View style={styles.sinProductos}>
            <Text style={styles.sinProductosEmoji}>📦</Text>
            <Text style={styles.sinProductosTexto}>
              Sin productos registrados
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

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
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 12,
  },
  centradoInline: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  cargandoTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 44,
  },
  errorTexto: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  btnVolver: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnVolverTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  btnBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackTexto: {
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 32,
  },
  headerTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },

  // ── Foto negocio ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  fotoContenedor: {
    height: 200,
    width: '100%',
  },
  fotoNegocio: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoEmoji: {
    fontSize: 64,
  },

  // ── Info negocio ──
  infoContenedor: {
    padding: 16,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  negocioNombre: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  negocioDireccion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  detallesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  detalleChip: {
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detalleChipTexto: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detalleChipPro: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  detalleChipProTexto: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '700',
  },
  negocioDescripcion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },

  // ── Separador ──
  separador: {
    height: 8,
    backgroundColor: COLORS.gray200,
  },

  // ── Productos ──
  productosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productosTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  productosCantidadLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  producto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: 12,
    gap: 12,
  },
  productoAgotado: {
    opacity: 0.45,
  },
  productoFoto: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  productoImagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productoFotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  productoEmoji: {
    fontSize: 28,
  },
  productoInfo: {
    flex: 1,
    gap: 3,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  productoStock: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  productoIndicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },

  // ── Sin productos ──
  sinProductos: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  sinProductosEmoji: {
    fontSize: 40,
  },
  sinProductosTexto: {
    fontSize: 14,
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
  navIcono: {
    fontSize: 22,
    opacity: 0.5,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.navInactive,
  },
});