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

export default function PantallaLogin() {
  const { login, cargando, error, limpiarError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password);
    // Si no hay error, navegar según rol
    const perfil = useAuthStore.getState().perfil;
    if (perfil) {
      if (perfil.rol === 'admin') {
        router.replace('/(admin)/dashboard');
      } else if (perfil.rol === 'dueno') {
        router.replace('/(dueno)/dashboard');
      } else {
        router.replace('/');
      }
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
            <Text style={styles.headerTitulo}>Acceso MiPyME</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Logo */}
          <View style={styles.logoContenedor}>
            <View style={styles.logoCirculo}>
              <Text style={styles.logoEmoji}>🏪</Text>
            </View>
            <Text style={styles.titulo}>Bienvenido</Text>
            <Text style={styles.subtitulo}>
              Gestiona tu negocio desde cualquier lugar
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formulario}>

            {/* Error */}
            {error ? (
              <TouchableOpacity
                style={styles.errorContenedor}
                onPress={limpiarError}
              >
                <Text style={styles.errorTexto}>⚠️ {error}</Text>
                <Text style={styles.errorCerrar}>✕</Text>
              </TouchableOpacity>
            ) : null}

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
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.gray400}
                  secureTextEntry={!verPassword}
                />
                <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
                  <Text style={styles.campoIcono}>
                    {verPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón login */}
            <TouchableOpacity
              style={[
                styles.btnLogin,
                (cargando || !email || !password) && styles.btnDeshabilitado,
              ]}
              onPress={handleLogin}
              disabled={cargando || !email || !password}
            >
              {cargando ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnLoginTexto}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divisor}>
              <View style={styles.divisorLinea} />
              <Text style={styles.divisorTexto}>o</Text>
              <View style={styles.divisorLinea} />
            </View>

            {/* Ir a registro */}
            <TouchableOpacity
              style={styles.btnRegistro}
              onPress={() => router.push('/(auth)/registro')}
            >
              <Text style={styles.btnRegistroTexto}>
                ¿No tienes cuenta?{' '}
                <Text style={styles.btnRegistroEnlace}>Regístrate aquí</Text>
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
    paddingVertical: 36,
    backgroundColor: COLORS.primary,
  },
  logoCirculo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoEmoji: {
    fontSize: 46,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  formulario: {
    flex: 1,
    padding: 24,
    gap: 16,
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
  campoIcono: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  btnLogin: {
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
  btnLoginTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divisorLinea: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  divisorTexto: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  btnRegistro: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  btnRegistroTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  btnRegistroEnlace: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});