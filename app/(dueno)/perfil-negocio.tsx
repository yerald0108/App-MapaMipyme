import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';

export default function DuenoPerfilNegocio() {
  return (
    <SafeAreaView style={styles.contenedor}>
      <Text style={styles.texto}>⚙️ Perfil del negocio — próximamente</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  texto: { fontSize: 18, color: COLORS.textSecondary },
});