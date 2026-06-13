import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';
import { useMisNegocios, useProductos, useCrearProducto, useActualizarProducto, useEliminarProducto } from '../../src/hooks/useNegocios';
import { Producto, UnidadMedida } from '../../src/types';
import { NavBarDueno } from './dashboard';

const UNIDADES: UnidadMedida[] = ['unidad', 'kg', 'g', 'litro', 'ml', 'caja', 'paquete'];

interface FormProducto {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  unidad: UnidadMedida;
  disponible: boolean;
}

const FORM_VACIO: FormProducto = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  unidad: 'unidad',
  disponible: true,
};

function ModalProducto({
  visible,
  onCerrar,
  onGuardar,
  productoEditar,
  cargando,
}: {
  visible: boolean;
  onCerrar: () => void;
  onGuardar: (form: FormProducto) => void;
  productoEditar: Producto | null;
  cargando: boolean;
}) {
  const [form, setForm] = useState<FormProducto>(
    productoEditar
      ? {
          nombre: productoEditar.nombre,
          descripcion: productoEditar.descripcion ?? '',
          precio: productoEditar.precio.toString(),
          stock: productoEditar.stock.toString(),
          unidad: productoEditar.unidad,
          disponible: productoEditar.disponible,
        }
      : FORM_VACIO
  );

  const valido = form.nombre.trim() && form.precio && form.stock;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modal.contenedor}>
        {/* Header modal */}
        <View style={modal.header}>
          <TouchableOpacity onPress={onCerrar}>
            <Text style={modal.btnCancelar}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={modal.titulo}>
            {productoEditar ? 'Editar producto' : 'Nuevo producto'}
          </Text>
          <TouchableOpacity
            onPress={() => onGuardar(form)}
            disabled={!valido || cargando}
          >
            {cargando ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <Text style={[modal.btnGuardar, !valido && modal.btnDeshabilitado]}>
                Guardar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={modal.scroll} keyboardShouldPersistTaps="handled">

          {/* Nombre */}
          <View style={modal.campo}>
            <Text style={modal.label}>Nombre del producto *</Text>
            <TextInput
              style={modal.input}
              value={form.nombre}
              onChangeText={(v) => setForm({ ...form, nombre: v })}
              placeholder="Ej: Aceite vegetal 1L"
              placeholderTextColor={COLORS.gray400}
            />
          </View>

          {/* Descripción */}
          <View style={modal.campo}>
            <Text style={modal.label}>Descripción</Text>
            <TextInput
              style={[modal.input, modal.inputMultiline]}
              value={form.descripcion}
              onChangeText={(v) => setForm({ ...form, descripcion: v })}
              placeholder="Descripción opcional"
              placeholderTextColor={COLORS.gray400}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Precio y Stock en fila */}
          <View style={modal.fila}>
            <View style={[modal.campo, { flex: 1 }]}>
              <Text style={modal.label}>Precio (CUP) *</Text>
              <TextInput
                style={modal.input}
                value={form.precio}
                onChangeText={(v) => setForm({ ...form, precio: v })}
                placeholder="0.00"
                placeholderTextColor={COLORS.gray400}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[modal.campo, { flex: 1 }]}>
              <Text style={modal.label}>Stock *</Text>
              <TextInput
                style={modal.input}
                value={form.stock}
                onChangeText={(v) => setForm({ ...form, stock: v })}
                placeholder="0"
                placeholderTextColor={COLORS.gray400}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Unidad */}
          <View style={modal.campo}>
            <Text style={modal.label}>Unidad de medida</Text>
            <View style={modal.unidadesGrid}>
              {UNIDADES.map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    modal.unidadChip,
                    form.unidad === u && modal.unidadChipActivo,
                  ]}
                  onPress={() => setForm({ ...form, unidad: u })}
                >
                  <Text style={[
                    modal.unidadChipTexto,
                    form.unidad === u && modal.unidadChipTextoActivo,
                  ]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Disponible */}
          <View style={modal.campo}>
            <Text style={modal.label}>Disponibilidad</Text>
            <View style={modal.switchFila}>
              <TouchableOpacity
                style={[
                  modal.switchBtn,
                  form.disponible && modal.switchBtnActivo,
                ]}
                onPress={() => setForm({ ...form, disponible: true })}
              >
                <Text style={[
                  modal.switchTexto,
                  form.disponible && modal.switchTextoActivo,
                ]}>
                  ✅ Disponible
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modal.switchBtn,
                  !form.disponible && modal.switchBtnAgotado,
                ]}
                onPress={() => setForm({ ...form, disponible: false })}
              >
                <Text style={[
                  modal.switchTexto,
                  !form.disponible && modal.switchTextoAgotado,
                ]}>
                  ❌ Agotado
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function TarjetaProductoDueno({
  producto,
  onEditar,
  onEliminar,
  onToggleDisponible,
}: {
  producto: Producto;
  onEditar: () => void;
  onEliminar: () => void;
  onToggleDisponible: () => void;
}) {
  return (
    <View style={[styles.tarjeta, !producto.disponible && styles.tarjetaAgotada]}>
      <View style={styles.tarjetaInfo}>
        <View style={styles.tarjetaFila}>
          <Text style={styles.tarjetaNombre} numberOfLines={1}>
            {producto.nombre}
          </Text>
          <Text style={styles.tarjetaPrecio}>
            {producto.precio.toLocaleString('es-CU')} CUP
          </Text>
        </View>
        <View style={styles.tarjetaFila}>
          <Text style={styles.tarjetaStock}>
            📦 {producto.stock} {producto.unidad}s
          </Text>
          <TouchableOpacity
            style={[
              styles.disponibleBtn,
              producto.disponible ? styles.disponibleActivo : styles.disponibleAgotado,
            ]}
            onPress={onToggleDisponible}
          >
            <Text style={styles.disponibleTexto}>
              {producto.disponible ? '✅ Disponible' : '❌ Agotado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.tarjetaAcciones}>
        <TouchableOpacity style={styles.btnEditar} onPress={onEditar}>
          <Text style={styles.btnEditarTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEliminar} onPress={onEliminar}>
          <Text style={styles.btnEliminarTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DuenoProductos() {
  const { data: misNegocios, isLoading: cargandoNegocios } = useMisNegocios();
  const negocioActual = misNegocios?.[0];

  const { data: productos, isLoading: cargandoProductos } = useProductos(
    negocioActual?.id ?? ''
  );

  const crearProducto = useCrearProducto();
  const actualizarProducto = useActualizarProducto();
  const eliminarProducto = useEliminarProducto();

  const [modalVisible, setModalVisible] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const abrirCrear = () => {
    setProductoEditar(null);
    setModalVisible(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProductoEditar(null);
  };

  const handleGuardar = async (form: FormProducto) => {
    if (!negocioActual) return;

    const datos = {
      negocio_id: negocioActual.id,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      unidad: form.unidad,
      disponible: form.disponible,
      foto_url: undefined,
    };

    if (productoEditar) {
      await actualizarProducto.mutateAsync({
        id: productoEditar.id,
        ...datos,
      });
    } else {
      await crearProducto.mutateAsync(datos);
    }
    cerrarModal();
  };

  const handleEliminar = (producto: Producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${producto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            eliminarProducto.mutate({
              id: producto.id,
              negocio_id: producto.negocio_id,
            }),
        },
      ]
    );
  };

  const handleToggleDisponible = (producto: Producto) => {
    actualizarProducto.mutate({
      id: producto.id,
      negocio_id: producto.negocio_id,
      disponible: !producto.disponible,
    });
  };

  const cargandoMutacion =
    crearProducto.isPending || actualizarProducto.isPending;

  if (cargandoNegocios) {
    return (
      <SafeAreaView style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!negocioActual) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Mis Productos</Text>
        </View>
        <View style={styles.centrado}>
          <Text style={styles.sinNegocioEmoji}>🏪</Text>
          <Text style={styles.sinNegocioTexto}>
            No tienes ningún negocio registrado
          </Text>
          <Text style={styles.sinNegocioSubtexto}>
            Contacta al administrador para registrar tu negocio
          </Text>
        </View>
        <NavBarDueno activa="productos" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Mis Productos</Text>
          <Text style={styles.headerSubtitulo}>{negocioActual.nombre}</Text>
        </View>
        <TouchableOpacity style={styles.btnAgregar} onPress={abrirCrear}>
          <Text style={styles.btnAgregarTexto}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.resumen}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenValor}>{productos?.length ?? 0}</Text>
          <Text style={styles.resumenLabel}>Total</Text>
        </View>
        <View style={styles.resumenDivisor} />
        <View style={styles.resumenItem}>
          <Text style={[styles.resumenValor, { color: COLORS.success }]}>
            {productos?.filter((p) => p.disponible).length ?? 0}
          </Text>
          <Text style={styles.resumenLabel}>Disponibles</Text>
        </View>
        <View style={styles.resumenDivisor} />
        <View style={styles.resumenItem}>
          <Text style={[styles.resumenValor, { color: COLORS.error }]}>
            {productos?.filter((p) => !p.disponible).length ?? 0}
          </Text>
          <Text style={styles.resumenLabel}>Agotados</Text>
        </View>
      </View>

      {/* Lista */}
      {cargandoProductos ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.cargandoTexto}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.sinProductos}>
              <Text style={styles.sinProductosEmoji}>📦</Text>
              <Text style={styles.sinProductosTitulo}>Sin productos</Text>
              <Text style={styles.sinProductosSubtitulo}>
                Toca "+ Agregar" para añadir tu primer producto
              </Text>
              <TouchableOpacity style={styles.btnAgregarGrande} onPress={abrirCrear}>
                <Text style={styles.btnAgregarGrandeTexto}>+ Agregar producto</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TarjetaProductoDueno
              producto={item}
              onEditar={() => abrirEditar(item)}
              onEliminar={() => handleEliminar(item)}
              onToggleDisponible={() => handleToggleDisponible(item)}
            />
          )}
        />
      )}

      {/* Modal */}
      <ModalProducto
        visible={modalVisible}
        onCerrar={cerrarModal}
        onGuardar={handleGuardar}
        productoEditar={productoEditar}
        cargando={cargandoMutacion}
      />

      <NavBarDueno activa="productos" />
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
  },
  cargandoTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
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
  btnAgregar: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnAgregarTexto: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  resumen: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  resumenItem: {
    flex: 1,
    alignItems: 'center',
  },
  resumenValor: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  resumenLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resumenDivisor: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  lista: {
    padding: 16,
    paddingBottom: 8,
    gap: 10,
  },
  tarjeta: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tarjetaAgotada: {
    opacity: 0.6,
    borderColor: COLORS.error,
    borderStyle: 'dashed',
  },
  tarjetaInfo: {
    flex: 1,
    gap: 6,
  },
  tarjetaFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tarjetaNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  tarjetaPrecio: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tarjetaStock: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  disponibleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  disponibleActivo: {
    backgroundColor: '#dcfce7',
  },
  disponibleAgotado: {
    backgroundColor: '#fee2e2',
  },
  disponibleTexto: {
    fontSize: 11,
    fontWeight: '600',
  },
  tarjetaAcciones: {
    flexDirection: 'column',
    gap: 6,
  },
  btnEditar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEditarTexto: {
    fontSize: 16,
  },
  btnEliminar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEliminarTexto: {
    fontSize: 16,
  },
  sinNegocioEmoji: {
    fontSize: 48,
  },
  sinNegocioTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sinNegocioSubtexto: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  sinProductos: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  sinProductosEmoji: {
    fontSize: 52,
  },
  sinProductosTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sinProductosSubtitulo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  btnAgregarGrande: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnAgregarGrandeTexto: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 15,
  },
});

const modal = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  btnCancelar: {
    fontSize: 15,
    color: COLORS.error,
    fontWeight: '600',
  },
  btnGuardar: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '800',
  },
  btnDeshabilitado: {
    opacity: 0.4,
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  campo: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
  },
  unidadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unidadChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  unidadChipActivo: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  unidadChipTexto: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  unidadChipTextoActivo: {
    color: COLORS.primary,
  },
  switchFila: {
    flexDirection: 'row',
    gap: 10,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  switchBtnActivo: {
    borderColor: COLORS.success,
    backgroundColor: '#dcfce7',
  },
  switchBtnAgotado: {
    borderColor: COLORS.error,
    backgroundColor: '#fee2e2',
  },
  switchTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  switchTextoActivo: {
    color: COLORS.success,
  },
  switchTextoAgotado: {
    color: COLORS.error,
  },
});