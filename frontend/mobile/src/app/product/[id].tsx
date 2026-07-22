import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { ScreenState } from '../../components/ui/ScreenState';
import { colors, radius, spacing, typography } from '../../constants/tokens';
import { queryClient } from '../../lib/query-client';
import { getApiErrorMessage } from '../../services/api';
import { getProduct } from '../../services/catalog';
import { addCartItem } from '../../services/commerce';
import { useAuthStore } from '../../stores/auth-store';
import type { ApiCart } from '../../types/api';
import { formatPrice } from '../../utils/format';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const product = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
  const addMutation = useMutation({
    mutationFn: () => addCartItem(Number(id)),
    onSuccess: (cart) => {
      queryClient.setQueryData<ApiCart>(['cart'], cart);
      router.push('/cart');
    },
    onError: (error) => Alert.alert('Sepete eklenemedi', getApiErrorMessage(error)),
  });

  if (product.isLoading) return <ScreenState loading title="Ürün yükleniyor" />;
  if (product.isError || !product.data) {
    return <ScreenState title="Ürün bulunamadı" actionTitle="Geri dön" onAction={() => router.back()} />;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push({ pathname: '/login', params: { returnTo: `/product/${id}` } });
      return;
    }
    addMutation.mutate();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={product.data.image_url} style={styles.image} contentFit="cover" transition={150} />
      <Text style={styles.category}>{product.data.category?.name ?? 'Ürün'}</Text>
      <Text style={styles.title}>{product.data.name}</Text>
      <View style={styles.meta}>
        <Text style={styles.price}>{formatPrice(product.data.price)}</Text>
        <Text style={styles.rating}>★ {product.data.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.description}>{product.data.description}</Text>
      <Text style={styles.stock}>{product.data.stock > 0 ? `${product.data.stock} adet stokta` : 'Stokta yok'}</Text>
      <Button
        title={isAuthenticated ? 'Sepete ekle' : 'Sepete eklemek için giriş yap'}
        size="lg"
        fullWidth
        loading={addMutation.isPending}
        disabled={product.data.stock <= 0}
        onPress={handleAddToCart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[16], paddingBottom: spacing[48], backgroundColor: colors.brand.white },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius[8], backgroundColor: colors.brand.cream },
  category: { ...typography.body[13], color: colors.text.secondary, marginTop: spacing[24] },
  title: { ...typography.heading[28], color: colors.text.primary, marginTop: spacing[4] },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[12] },
  price: { ...typography.heading[24], color: colors.brand.teal },
  rating: { ...typography.body[14], color: colors.text.tertiary },
  description: { ...typography.body[16], color: colors.text.secondary, lineHeight: 24, marginVertical: spacing[24] },
  stock: { ...typography.body[13], color: colors.text.tertiary, marginBottom: spacing[16] },
});
