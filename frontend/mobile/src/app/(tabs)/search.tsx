import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '../../components/domain/ProductCard';
import { Input } from '../../components/ui/Input';
import { ScreenState } from '../../components/ui/ScreenState';
import { colors, spacing, typography } from '../../constants/tokens';
import { getProducts } from '../../services/catalog';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();
  const results = useQuery({
    queryKey: ['products', 'search', normalizedQuery],
    queryFn: () => getProducts({ q: normalizedQuery, size: 30 }),
    enabled: normalizedQuery.length >= 2,
  });

  return (
    <FlatList
      data={results.data?.items ?? []}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      keyboardShouldPersistTaps="handled"
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Ürün ara</Text>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="En az iki harf yazın"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      }
      ListEmptyComponent={
        results.isFetching ? (
          <ScreenState loading title="Aranıyor" />
        ) : results.isError ? (
          <ScreenState title="Arama yapılamadı" actionTitle="Tekrar dene" onAction={() => void results.refetch()} />
        ) : (
          <ScreenState
            title={normalizedQuery.length < 2 ? 'Aramaya başlayın' : 'Sonuç bulunamadı'}
            message={normalizedQuery.length < 2 ? 'Ürün adından en az iki harf yazın.' : 'Başka bir arama deneyin.'}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing[16], backgroundColor: colors.brand.white },
  row: { gap: spacing[12], marginBottom: spacing[12] },
  title: { ...typography.heading[28], color: colors.text.primary, marginTop: spacing[16], marginBottom: spacing[16] },
});
