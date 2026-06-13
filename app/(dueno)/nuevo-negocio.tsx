import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useCrearNegocio } from '../../src/hooks/useNegocios';
import { CategoriaНegocio } from '../../src/types';

const CATEGORIAS: { valor: CategoriaНegocio; emoji: string; label: string }[] = [
  { valor: 'alimentacion',      emoji: '🛒', label: 'Alimentación' },
  { valor: 'farmacia',          emoji: '💊', label: 'Farmacia' },
  { valor: 'ferreteria',        emoji: '🔧', label: 'Ferretería' },
  { valor: 'ropa',              emoji: '👕', label: 'Ropa' },
  { valor: 'electrodomesticos', emoji: '📺', label: 'Electrodomésticos' },
  { valor: 'servicios',         emoji: '🔨', label: 'Servicios' },
  { valor: 'otro',              emoji: '🏪', label: 'Otro' },
];

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const PROVINCIAS_CUBA = [
  'Pinar del Río', 'Artemisa', 'La Habana', 'Mayabeque',
  'Matanzas', 'Cienfuegos', 'Villa Clara', 'Sancti Spíritus',
  'Ciego de Ávila', 'Camagüey', 'Las Tunas', 'Holguín',
  'Granma', 'Santiago de Cuba', 'Guantánamo', 'Isla de la Juventud',
];

// Pasos del formulario
type Paso = 1 | 2 | 3;

export default function NuevoNegocio() {
  const crearNegocio = useCrearNegocio();
  const [paso, setPaso] = useState<Paso>(1);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'alimentacion' as CategoriaНegocio,
    direccion: '',
    municipio: '',
    provincia: 'La Habana',
    telefono: '',
    horario_apertura: '08:00',
    horario_cierre: '18:00',
    dias_abierto: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as string[],
  });

  const toggleDia = (dia: string) => {
    setForm((prev) => ({
      ...prev,
      dias_abierto: prev.dias_abierto.includes(dia)
        ? prev.dias_abierto.filter((d) => d !== dia)
        : [...prev.dias_abierto, dia],
    }));
  };

  const validarPaso1 = () => form.nombre.trim().length > 0;
  const validarPaso2 = () =>
    form.direccion.trim().length > 0 && form.municipio.trim().length > 0;

  const handleSiguiente = () => {
    if (paso === 1 && !validarPaso1()) {
      Alert.alert('Error', 'El nombre del negocio es obligatorio');
      return;
    }
    if (paso === 2 && !validarPaso2()) {
      Alert.alert('Error', 'La dirección y el municipio son obligatorios');
      return;
    }
    setPaso((prev) => (prev + 1) as Paso);
  };

  const handleGuardar = async () => {
    try {
      await crearNegocio.mutateAsync({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        categoria: form.categoria,
        direccion: form.direccion.trim(),
        municipio: form.municipio.trim(),
        provincia: form.provincia,
        telefono: form.telefono.trim() || undefined,
        horario_apertura: form.horario_apertura || undefined,
        horario_cierre: form.horario_cierre || undefined,
        dias_abierto: form.dias_abierto,
      });

      Alert.alert(
        '✅ Negocio registrado',
        'Tu negocio fue enviado para revisión. El administrador lo aprobará pronto y aparecerá en el mapa.',
        [{ text: 'Entendido', onPress: () => router.replace('/(dueno)/dashboard') }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo registrar el negocio');
    }
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => paso === 1 ? router.back() : setPaso((prev) => (prev - 1) as Paso)}
        >
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Registrar negocio</Text>
        <Text style={styles.headerPaso}>{paso}/3</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progresoBarra}>
        <View style={[styles.progresoRelleno, { width: `${(paso / 3) * 100}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── PASO 1: Info básica ── */}
        {paso === 1 && (
          <View style={styles.pasoContenedor}>
            <Text style={styles.pasoTitulo}>📋 Información básica</Text>
            <Text style={styles.pasoSubtitulo}>
              Cuéntanos sobre tu negocio
            </Text>

            <View style={styles.campo}>
              <Text style={styles.label}>Nombre del negocio *</Text>
              <TextInput
                style={styles.input}
                value={form.nombre}
                onChangeText={(v) => setForm({ ...form, nombre: v })}
                placeholder="Ej: Bodega El Rápido"
                placeholderTextColor={COLORS.gray400}
                autoFocus
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={form.descripcion}
                onChangeText={(v) => setForm({ ...form, descripcion: v })}
                placeholder="¿Qué productos o servicios ofreces?"
                placeholderTextColor={COLORS.gray400}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={form.telefono}
                onChangeText={(v) => setForm({ ...form, telefono: v })}
                placeholder="Ej: 52345678"
                placeholderTextColor={COLORS.gray400}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Categoría *</Text>
              <View style={styles.categoriasGrid}>
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat.valor}
                    style={[
                      styles.categoriaChip,
                      form.categoria === cat.valor && styles.categoriaChipActivo,
                    ]}
                    onPress={() => setForm({ ...form, categoria: cat.valor })}
                  >
                    <Text style={styles.categoriaEmoji}>{cat.emoji}</Text>
                    <Text style={[
                      styles.categoriaLabel,
                      form.categoria === cat.valor && styles.categoriaLabelActivo,
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ── PASO 2: Ubicación ── */}
        {paso === 2 && (
          <View style={styles.pasoContenedor}>
            <Text style={styles.pasoTitulo}>📍 Ubicación</Text>
            <Text style={styles.pasoSubtitulo}>
              ¿Dónde está tu negocio?
            </Text>

            <View style={styles.campo}>
              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                style={styles.input}
                value={form.direccion}
                onChangeText={(v) => setForm({ ...form, direccion: v })}
                placeholder="Calle, número, entre calles"
                placeholderTextColor={COLORS.gray400}
                autoFocus
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Municipio *</Text>
              <TextInput
                style={styles.input}
                value={form.municipio}
                onChangeText={(v) => setForm({ ...form, municipio: v })}
                placeholder="Ej: Plaza de la Revolución"
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Provincia *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.provinciasScroll}
              >
                {PROVINCIAS_CUBA.map((prov) => (
                  <TouchableOpacity
                    key={prov}
                    style={[
                      styles.provinciaChip,
                      form.provincia === prov && styles.provinciaChipActiva,
                    ]}
                    onPress={() => setForm({ ...form, provincia: prov })}
                  >
                    <Text style={[
                      styles.provinciaTexto,
                      form.provincia === prov && styles.provinciaTextoActivo,
                    ]}>
                      {prov}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.infoUbicacion}>
              <Text style={styles.infoUbicacionEmoji}>📌</Text>
              <Text style={styles.infoUbicacionTexto}>
                En la próxima versión podrás marcar tu ubicación exacta en el mapa
              </Text>
            </View>
          </View>
        )}

        {/* ── PASO 3: Horario ── */}
        {paso === 3 && (
          <View style={styles.pasoContenedor}>
            <Text style={styles.pasoTitulo}>🕐 Horario</Text>
            <Text style={styles.pasoSubtitulo}>
              ¿Cuándo está abierto tu negocio?
            </Text>

            <View style={styles.fila}>
              <View style={[styles.campo, { flex: 1 }]}>
                <Text style={styles.label}>Apertura</Text>
                <TextInput
                  style={styles.input}
                  value={form.horario_apertura}
                  onChangeText={(v) => setForm({ ...form, horario_apertura: v })}
                  placeholder="08:00"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
              <View style={[styles.campo, { flex: 1 }]}>
                <Text style={styles.label}>Cierre</Text>
                <TextInput
                  style={styles.input}
                  value={form.horario_cierre}
                  onChangeText={(v) => setForm({ ...form, horario_cierre: v })}
                  placeholder="18:00"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Días abierto</Text>
              <View style={styles.diasGrid}>
                {DIAS.map((dia) => (
                  <TouchableOpacity
                    key={dia}
                    style={[
                      styles.diaChip,
                      form.dias_abierto.includes(dia) && styles.diaChipActivo,
                    ]}
                    onPress={() => toggleDia(dia)}
                  >
                    <Text style={[
                      styles.diaTexto,
                      form.dias_abierto.includes(dia) && styles.diaTextoActivo,
                    ]}>
                      {dia.charAt(0).toUpperCase() + dia.slice(1, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Resumen final */}
            <View style={styles.resumenCard}>
              <Text style={styles.resumenTitulo}>📋 Resumen</Text>
              <Text style={styles.resumenItem}>
                🏪 <Text style={styles.resumenValor}>{form.nombre}</Text>
              </Text>
              <Text style={styles.resumenItem}>
                {CATEGORIAS.find((c) => c.valor === form.categoria)?.emoji}{' '}
                <Text style={styles.resumenValor}>
                  {CATEGORIAS.find((c) => c.valor === form.categoria)?.label}
                </Text>
              </Text>
              <Text style={styles.resumenItem}>
                📍 <Text style={styles.resumenValor}>
                  {form.direccion}, {form.municipio}, {form.provincia}
                </Text>
              </Text>
              {form.telefono && (
                <Text style={styles.resumenItem}>
                  📞 <Text style={styles.resumenValor}>{form.telefono}</Text>
                </Text>
              )}
              <View style={styles.resumenAviso}>
                <Text style={styles.resumenAvisoTexto}>
                  ⏳ Tu negocio quedará en estado PENDIENTE hasta que el administrador lo apruebe
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Botones de navegación */}
      <View style={styles.botonesContenedor}>
        {paso < 3 ? (
          <TouchableOpacity
            style={[styles.btnSiguiente, !validarPaso1() && paso === 1 && styles.btnDeshabilitado]}
            onPress={handleSiguiente}
          >
            <Text style={styles.btnSiguienteTexto}>Siguiente →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnGuardar, crearNegocio.isPending && styles.btnDeshabilitado]}
            onPress={handleGuardar}
            disabled={crearNegocio.isPending}
          >
            {crearNegocio.isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.btnGuardarTexto}>✅ Registrar negocio</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
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
  },
  headerPaso: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    width: 40,
    textAlign: 'right',
  },
  progresoBarra: {
    height: 4,
    backgroundColor: COLORS.gray300,
  },
  progresoRelleno: {
    height: 4,
    backgroundColor: COLORS.secondary,
  },
  scroll: {
    padding: 16,
  },
  pasoContenedor: {
    gap: 16,
  },
  pasoTitulo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  pasoSubtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: -8,
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
    height: 90,
    textAlignVertical: 'top',
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  categoriaChipActivo: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  categoriaEmoji: {
    fontSize: 16,
  },
  categoriaLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoriaLabelActivo: {
    color: COLORS.primary,
  },
  provinciasScroll: {
    marginTop: 4,
  },
  provinciaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  provinciaChipActiva: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  provinciaTexto: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  provinciaTextoActivo: {
    color: COLORS.primary,
  },
  infoUbicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  infoUbicacionEmoji: {
    fontSize: 20,
  },
  infoUbicacionTexto: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  diasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diaChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  diaChipActivo: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  diaTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  diaTextoActivo: {
    color: COLORS.white,
  },
  resumenCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 8,
  },
  resumenTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  resumenItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resumenValor: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resumenAviso: {
    backgroundColor: '#fef9c3',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  resumenAvisoTexto: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  botonesContenedor: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnSiguiente: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDeshabilitado: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnSiguienteTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  btnGuardar: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
  },
  btnGuardarTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
});