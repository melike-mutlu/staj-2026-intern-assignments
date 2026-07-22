import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../constants/tokens';
import { queryClient } from '../lib/query-client';
import { useAuthStore } from '../stores/auth-store';

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={colors.brand.teal} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerBackTitle: 'Geri' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Ürün Detayı' }} />
        <Stack.Screen name="login" options={{ title: 'Giriş Yap', presentation: 'modal' }} />
        <Stack.Screen name="register" options={{ title: 'Hesap Oluştur', presentation: 'modal' }} />
        <Stack.Screen name="checkout" options={{ title: 'Ödeme' }} />
        <Stack.Screen name="order-confirm/[id]" options={{ title: 'Sipariş Tamamlandı' }} />
      </Stack>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.white,
  },
});
