import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../constants/tokens';
import type { ApiProduct } from '../../types/api';
import { formatPrice } from '../../utils/format';

export function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name} ürününü aç`}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: String(product.id) } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={product.image_url} contentFit="cover" style={styles.image} transition={150} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category?.name ?? 'Ürün'}</Text>
        <Text numberOfLines={2} style={styles.name}>{product.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '49%',
    minHeight: 260,
    backgroundColor: colors.brand.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius[8],
    overflow: 'hidden',
  },
  pressed: { opacity: 0.76 },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.brand.cream },
  content: { flex: 1, padding: spacing[12], gap: spacing[4] },
  category: { ...typography.body[12], color: colors.text.secondary },
  name: { ...typography.body[16], fontWeight: '600', color: colors.text.primary, minHeight: 42 },
  meta: { marginTop: 'auto', gap: spacing[4] },
  price: { ...typography.body[16], fontWeight: '700', color: colors.brand.teal },
  rating: { ...typography.body[12], color: colors.text.tertiary },
});
