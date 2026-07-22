import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '../../components/domain/ProductCard';
import { ScreenState } from '../../components/ui/ScreenState';
import { getCategories, getProducts } from '../../services/catalog';
import { colors, radius, spacing, typography } from '../../constants/tokens';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const products = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => getProducts({ size: 20, category: selectedCategory }),
  });
  const categories = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  if (products.isLoading) return <ScreenState loading title="Ürünler yükleniyor" />;
  if (products.isError) {
    return (
      <ScreenState
        title="Ürünlere ulaşılamadı"
        message="Backend'in çalıştığını ve API adresini kontrol edin."
        actionTitle="Tekrar dene"
        onAction={() => void products.refetch()}
      />
    );
  }

  return (
    <FlatList
      data={products.data?.items ?? []}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.brand}>SHOP</Text>
            <Text style={styles.headline}>Günün seçkisini keşfet</Text>
            <Text style={styles.subtitle}>Gerçek stok, gerçek fiyat ve güvenli demo ödeme akışı.</Text>
            <Pressable onPress={() => router.push('/search')} style={styles.searchButton}>
              <Text style={styles.searchText}>Ürünlerde ara</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <FlatList
            horizontal
            data={[{ id: 0, name: 'Tümü', slug: undefined }, ...(categories.data ?? [])]}
            keyExtractor={(item) => String(item.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
            renderItem={({ item }) => {
              const active = selectedCategory === item.slug;
              return (
                <Pressable
                  onPress={() => setSelectedCategory(item.slug)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                </Pressable>
              );
            }}
          />
          <View style={styles.productsTitleRow}>
            <Text style={styles.sectionTitle}>Ürünler</Text>
            <Text style={styles.count}>{products.data?.total ?? 0} ürün</Text>
          </View>
        </>
      }
      ListEmptyComponent={<ScreenState title="Bu kategoride ürün bulunamadı" />}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[16], paddingBottom: spacing[32], backgroundColor: colors.brand.white },
  row: { gap: spacing[12], marginBottom: spacing[12] },
  header: {
    padding: spacing[24],
    marginBottom: spacing[24],
    borderRadius: radius[8],
    backgroundColor: colors.brand.cream,
  },
  brand: { ...typography.body[13], fontWeight: '800', color: colors.brand.teal },
  headline: { ...typography.heading[28], color: colors.text.primary, marginTop: spacing[8] },
  subtitle: { ...typography.body[14], color: colors.text.secondary, marginTop: spacing[8], lineHeight: 21 },
  searchButton: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
    marginTop: spacing[16],
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius[8],
    backgroundColor: colors.brand.white,
  },
  searchText: { ...typography.body[14], color: colors.text.secondary },
  categories: { gap: spacing[8], paddingBottom: spacing[24] },
  chip: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing[16],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  chipActive: { backgroundColor: colors.brand.teal, borderColor: colors.brand.teal },
  chipText: { ...typography.body[14], color: colors.text.primary },
  chipTextActive: { color: colors.brand.white },
  productsTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.heading[20], color: colors.text.primary, marginBottom: spacing[12] },
  count: { ...typography.body[13], color: colors.text.secondary, marginBottom: spacing[12] },
});
