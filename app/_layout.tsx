import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CONFIG } from '../src/constants/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CONFIG.CACHE_NEGOCIOS,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="(public)/index"
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}