import { useState, useEffect } from 'react';
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
import { COLORS } from '../../src/constants/colors';
import { useMisNegocios } from '../../src/hooks/useNegocios';
import { supabase } from '../../src/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { NavBarDueno } from './dashboard';
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

export default function DuenoPerfilNegocio() {
  const queryClient = useQueryClient();
  const { data: misNegocios, isLoading } = useMisNegocios();
  const negocio = misNegocios?.[0];

  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'alimentacion' as CategoriaНegocio,
    direccion: '',
    municipio: '',
    provincia: '',
    telefono: '',
    horario_apertura: '',
    horario_cierre: '',
    dias_abierto: [] as string[],
  });

  useEffect(() => {
    if (negocio) {
      setForm({
        nombre: negocio.nombre ?? '',
        descripcion: negocio.descripcion ?? '',
        categoria: negocio.categoria,
        direccion: negocio.direccion ?? '',
        municipio: negocio.municipio ?? '',
        provincia: negocio.provincia ?? '',
        telefono: negocio.telefono ?? '',
        horario_apertura: negocio.horario_apertura ?? '',
        horario_cierre: negocio.horario_cierre ?? '',
        dias_abierto: negocio.dias_abierto ?? [],
      });
    }
  }, [negocio]);

  const toggleDia = (dia: string) => {
    setForm((prev) => ({
      ...prev,
      dias_abierto: prev.dias_abierto.includes(dia)
        ? prev.dias_abierto.filter((d) => d !== dia)
        : [...prev.dias_abierto, dia],
    }));
  };

  const handleGuardar = async () => {
    if (!negocio) return;
    if (!form.nombre.trim() || !form.direccion.trim()) {
      Alert.alert('Error', 'El nombre y la dirección son obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const { error } = await supabase
        .from('negocios')
        .update({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || null,
          categoria: form.categoria,
          direccion: form.direccion.trim(),
          municipio: form.municipio.trim(),
          provincia: form.provincia.trim(),
          telefono: form.telefono.trim() || null,
          horario_apertura: form.horario_apertura.trim() || null,
          horario_cierre: form.horario_cierre.trim() || null,
          dias_abierto: form.dias_abierto,
        })
        .eq('id', negocio.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['mis-negocios'] });
      queryClient.invalidateQueries({ queryKey: ['negocios'] });
      Alert.alert('✅ Guardado', 'Los cambios se guardaron correctamente');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!negocio) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Mi Negocio</Text>
        </View>
        <View style={styles.centrado}>
          <Text style={styles.sinNegocioEmoji}>🏪</Text>
          <Text style={styles.sinNegocioTexto}>No tienes un negocio registrado</Text>
          <Text style={styles.sinNegocioSubtexto}>
            Contacta al administrador para registrar tu negocio
          </Text>
        </View>
        <NavBarDueno activa="perfil" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Mi Negocio</Text>
          <Text style={styles.headerSubtitulo}>Edita tu información</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnGuardar, guardando && styles.btnDeshabilitado]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.btnGuardarTexto}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Estado actual */}
        <View style={styles.estadoCard}>
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

        {/* Información básica */}
        <Text style={styles.seccionTitulo}>Información básica</Text>

        <View style={styles.campo}>
          <Text style={styles.label}>Nombre del negocio *</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(v) => setForm({ ...form, nombre: v })}
            placeholder="Nombre de tu MiPyME"
            placeholderTextColor={COLORS.gray400}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={form.descripcion}
            onChangeText={(v) => setForm({ ...form, descripcion: v })}
            placeholder="¿Qué ofrece tu negocio?"
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

        {/* Categoría */}
        <Text style={styles.seccionTitulo}>Categoría</Text>
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

        {/* Ubicación */}
        <Text style={styles.seccionTitulo}>Ubicación</Text>

        <View style={styles.campo}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={styles.input}
            value={form.direccion}
            onChangeText={(v) => setForm({ ...form, direccion: v })}
            placeholder="Calle, número"
            placeholderTextColor={COLORS.gray400}
          />
        </View>

        <View style={styles.fila}>
          <View style={[styles.campo, { flex: 1 }]}>
            <Text style={styles.label}>Municipio</Text>
            <TextInput
              style={styles.input}
              value={form.municipio}
              onChangeText={(v) => setForm({ ...form, municipio: v })}
              placeholder="Municipio"
              placeholderTextColor={COLORS.gray400}
            />
          </View>
          <View style={[styles.campo, { flex: 1 }]}>
            <Text style={styles.label}>Provincia</Text>
            <TextInput
              style={styles.input}
              value={form.provincia}
              onChangeText={(v) => setForm({ ...form, provincia: v })}
              placeholder="Provincia"
              placeholderTextColor={COLORS.gray400}
            />
          </View>
        </View>

        {/* Horario */}
        <Text style={styles.seccionTitulo}>Horario</Text>

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

        {/* Días */}
        <Text style={styles.seccionTitulo}>Días abierto</Text>
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

        <View style={{ height: 24 }} />
      </ScrollView>

      <NavBarDueno activa="perfil" />
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
  btnGuardar: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  btnDeshabilitado: {
    opacity: 0.6,
  },
  btnGuardarTexto: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  scroll: {
    padding: 16,
    gap: 10,
  },
  estadoCard: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  estadoBadgeTexto: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  proBadgeTexto: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
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
  },
});