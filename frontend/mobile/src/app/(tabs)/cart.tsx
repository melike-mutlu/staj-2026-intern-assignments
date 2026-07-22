import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { ScreenState } from '../../components/ui/ScreenState';
import { colors, radius, spacing, typography } from '../../constants/tokens';
import { queryClient } from '../../lib/query-client';
import { getApiErrorMessage } from '../../services/api';
import { getCart, removeCartItem, updateCartItem } from '../../services/commerce';
import { useAuthStore } from '../../stores/auth-store';
import type { ApiCart } from '../../types/api';
import { formatPrice } from '../../utils/format';

export default function CartScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cart = useQuery({ queryKey: ['cart'], queryFn: getCart, enabled: isAuthenticated });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess: (data) => queryClient.setQueryData<ApiCart>(['cart'], data),
    onError: (error) => Alert.alert('Sepet güncellenemedi', getApiErrorMessage(error)),
  });
  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (error) => Alert.alert('Ürün silinemedi', getApiErrorMessage(error)),
  });

  if (!isAuthenticated) {
    return (
      <ScreenState
        title="Sepet için giriş yapın"
        message="Sepetiniz hesabınızla eşitlenir ve webde de aynı şekilde görünür."
        actionTitle="Giriş yap"
        onAction={() => router.push({ pathname: '/login', params: { returnTo: '/cart' } })}
      />
    );
  }
  if (cart.isLoading) return <ScreenState loading title="Sepet yükleniyor" />;
  if (cart.isError) {
    return <ScreenState title="Sepet yüklenemedi" actionTitle="Tekrar dene" onAction={() => void cart.refetch()} />;
  }
  if (!cart.data?.items.length) {
    return <ScreenState title="Sepetiniz boş" message="Beğendiğiniz ürünleri sepete ekleyin." actionTitle="Alışverişe başla" onAction={() => router.push('/')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sepetim</Text>
      {cart.data.items.map((item) => (
        <View key={item.product_id} style={styles.item}>
          <Image source={item.image_url} style={styles.image} contentFit="cover" />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.product_name}</Text>
            <Text style={styles.price}>{formatPrice(item.line_total)}</Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityLabel="Adedi azalt"
                disabled={item.quantity <= 1 || updateMutation.isPending}
                onPress={() => updateMutation.mutate({ productId: item.product_id, quantity: item.quantity - 1 })}
                style={styles.iconButton}
              ><Text style={styles.iconText}>−</Text></Pressable>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Pressable
                accessibilityLabel="Adedi artır"
                disabled={item.quantity >= item.stock || updateMutation.isPending}
                onPress={() => updateMutation.mutate({ productId: item.product_id, quantity: item.quantity + 1 })}
                style={styles.iconButton}
              ><Text style={styles.iconText}>+</Text></Pressable>
              <Pressable onPress={() => removeMutation.mutate(item.product_id)} style={styles.removeButton}>
                <Text style={styles.removeText}>Sil</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Ara toplam</Text>
        <Text style={styles.summaryTotal}>{formatPrice(cart.data.subtotal)}</Text>
      </View>
      <Button title="Ödemeye geç" fullWidth size="lg" onPress={() => router.push('/checkout')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[16], paddingBottom: spacing[48], backgroundColor: colors.brand.white },
  title: { ...typography.heading[28], marginVertical: spacing[16], color: colors.text.primary },
  item: { flexDirection: 'row', gap: spacing[12], paddingVertical: spacing[16], borderBottomWidth: 1, borderBottomColor: colors.border.light },
  image: { width: 88, height: 88, borderRadius: radius[8], backgroundColor: colors.brand.cream },
  itemInfo: { flex: 1, gap: spacing[8] },
  itemName: { ...typography.body[16], fontWeight: '600', color: colors.text.primary },
  price: { ...typography.body[14], fontWeight: '700', color: colors.brand.teal },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing[8] },
  iconButton: { width: 32, height: 32, borderRadius: radius[4], borderWidth: 1, borderColor: colors.border.light, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, color: colors.text.primary },
  quantity: { ...typography.body[14], width: 22, textAlign: 'center' },
  removeButton: { marginLeft: 'auto', padding: spacing[8] },
  removeText: { ...typography.body[13], color: '#b42318' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing[24], marginBottom: spacing[16] },
  summaryLabel: { ...typography.heading[18], color: colors.text.primary },
  summaryTotal: { ...typography.heading[20], color: colors.brand.teal },
});
