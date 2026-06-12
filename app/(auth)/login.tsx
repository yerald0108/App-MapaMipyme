import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

export default function PantallaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    setCargando(true);
    setError('');
    // TODO: conectar con Supabase auth
    setTimeout(() => {
      setCargando(false);
      // Simulación: redirigir según rol
      router.replace('/(dueno)/dashboard');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => router.back()}
        >
          <Text style={styles.btnVolverTexto}>← Volver</Text>
        </TouchableOpacity>

        {/* Logo / título */}
        <View style={styles.logoContenedor}>
          <Text style={styles.logoEmoji}>🏪</Text>
          <Text style={styles.titulo}>Acceso MiPyME</Text>
          <Text style={styles.subtitulo}>
            Gestiona tu negocio desde aquí
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formulario}>
          {error ? (
            <View style={styles.errorContenedor}>
              <Text style={styles.errorTexto}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Correo electrónico</Text>
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

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.gray400}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btnLogin, cargando && styles.btnLoginDeshabilitado]}
            onPress={handleLogin}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.btnLoginTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnRegistro}>
            <Text style={styles.btnRegistroTexto}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.btnRegistroEnlace}>
                Regístrate aquí
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
  btnVolver: {
    paddingVertical: 16,
  },
  btnVolverTexto: {
    color: COLORS.primary,
    fontSize: 16,
  },
  logoContenedor: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  formulario: {
    gap: 8,
  },
  errorContenedor: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorTexto: {
    color: COLORS.error,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  btnLogin: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  btnLoginDeshabilitado: {
    opacity: 0.7,
  },
  btnLoginTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  btnRegistro: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnRegistroTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  btnRegistroEnlace: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});