import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/authStore';

export default function PantallaRegistro() {
  const { registro, cargando, error, limpiarError } = useAuthStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const valido = nombre.trim() && email.trim() && password.length >= 6 && password === confirmar;

  const handleRegistro = async () => {
    if (!valido) return;
    await registro(email.trim(), password, nombre.trim());
    const perfil = useAuthStore.getState().perfil;
    if (perfil) {
      router.replace('/(dueno)/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
              <Text style={styles.btnBackTexto}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitulo}>Crear cuenta</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Logo */}
          <View style={styles.logoContenedor}>
            <View style={styles.logoCirculo}>
              <Text style={styles.logoEmoji}>🏪</Text>
            </View>
            <Text style={styles.titulo}>Registra tu MiPyME</Text>
            <Text style={styles.subtitulo}>
              Llega a más clientes en Cuba
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formulario}>

            {error ? (
              <TouchableOpacity style={styles.errorContenedor} onPress={limpiarError}>
                <Text style={styles.errorTexto}>⚠️ {error}</Text>
                <Text style={styles.errorCerrar}>✕</Text>
              </TouchableOpacity>
            ) : null}

            {/* Nombre */}
            <View style={styles.campoContenedor}>
              <Text style={styles.campoLabel}>Nombre del dueño</Text>
              <View style={styles.campoInput}>
                <Text style={styles.campoIcono}>👤</Text>
                <TextInput
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={COLORS.gray400}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.campoContenedor}>
              <Text style={styles.campoLabel}>Correo electrónico</Text>
              <View style={styles.campoInput}>
                <Text style={styles.campoIcono}>✉️</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@correo.com"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.campoContenedor}>
              <Text style={styles.campoLabel}>Contraseña</Text>
              <View style={styles.campoInput}>
                <Text style={styles.campoIcono}>🔒</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={COLORS.gray400}
                  secureTextEntry={!verPassword}
                />
                <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
                  <Text style={styles.campoIcono}>{verPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar password */}
            <View style={styles.campoContenedor}>
              <Text style={styles.campoLabel}>Confirmar contraseña</Text>
              <View style={[
                styles.campoInput,
                confirmar && password !== confirmar && styles.campoError,
              ]}>
                <Text style={styles.campoIcono}>🔒</Text>
                <TextInput
                  style={styles.input}
                  value={confirmar}
                  onChangeText={setConfirmar}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={COLORS.gray400}
                  secureTextEntry={!verPassword}
                />
                {confirmar && (
                  <Text style={styles.campoIcono}>
                    {password === confirmar ? '✅' : '❌'}
                  </Text>
                )}
              </View>
              {confirmar && password !== confirmar && (
                <Text style={styles.campoErrorTexto}>Las contraseñas no coinciden</Text>
              )}
            </View>

            {/* Botón registro */}
            <TouchableOpacity
              style={[styles.btnRegistro, (!valido || cargando) && styles.btnDeshabilitado]}
              onPress={handleRegistro}
              disabled={!valido || cargando}
            >
              {cargando ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnRegistroTexto}>Crear cuenta</Text>
              )}
            </TouchableOpacity>

            {/* Ir a login */}
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => router.back()}
            >
              <Text style={styles.btnLoginTexto}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.btnLoginEnlace}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
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
    letterSpacing: 0.5,
  },
  logoContenedor: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: COLORS.primary,
  },
  logoCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitulo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  formulario: {
    flex: 1,
    padding: 24,
    gap: 14,
  },
  errorContenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorTexto: {
    color: COLORS.error,
    fontSize: 13,
    flex: 1,
  },
  errorCerrar: {
    color: COLORS.error,
    fontSize: 14,
    paddingLeft: 8,
  },
  campoContenedor: {
    gap: 6,
  },
  campoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  campoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  campoError: {
    borderColor: COLORS.error,
  },
  campoErrorTexto: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 2,
  },
  campoIcono: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  btnRegistro: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
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
  btnRegistroTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnLogin: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  btnLoginTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  btnLoginEnlace: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});