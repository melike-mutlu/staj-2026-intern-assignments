import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { SearchBar } from '../components/domain/SearchBar/SearchBar';
import { ProductGrid } from '../components/domain/ProductGrid/ProductGrid';
import { ProductCard } from '../components/domain/ProductCard/ProductCard';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { Button } from '../components/ui/Button/Button';
import { IoSearchOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { getProducts, mapApiProductToProduct } from '../services/catalog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useFavorites } from '../hooks/useFavorites';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 400);

  const {
    isFavorite,
    toggleFavorite,
    isFavoritePending,
    isFavoritesUnavailable,
    mutationError,
    clearMutationError,
    isQueryError,
    queryError,
    refetch
  } = useFavorites();

  const productsQuery = useQuery({
    queryKey: ['products', { q: debouncedQuery || undefined }],
    queryFn: () =>
      getProducts({
        q: debouncedQuery || undefined,
        size: 50,
      }),
    placeholderData: keepPreviousData,
  });

  const products = productsQuery.data?.items.map(mapApiProductToProduct) ?? [];

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Search Products</h1>
      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ marginTop: 'var(--space-32)' }}>
        {productsQuery.isLoading && (
          <ProductGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-12)', marginBottom: 'var(--space-12)' }} />
                <Skeleton style={{ width: '70%', height: 20, marginBottom: 'var(--space-4)' }} />
                <Skeleton style={{ width: '40%', height: 20 }} />
              </div>
            ))}
          </ProductGrid>
        )}

        {productsQuery.isError && (
          <EmptyState
            icon={<IoAlertCircleOutline size={32} />}
            title="Arama yapılamadı"
            description={getErrorMessage(productsQuery.error)}
            action={<Button onClick={() => productsQuery.refetch()}>Tekrar Dene</Button>}
          />
        )}

        {productsQuery.isSuccess && products.length > 0 && (
          <>
            {isQueryError && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-16)', padding: 'var(--space-12)', backgroundColor: '#fff0f0', border: '1px solid red', borderRadius: 'var(--radius-8)', color: 'red' }}>
                <span>Favoriler yüklenemedi: {getErrorMessage(queryError)}</span>
                <Button size="sm" variant="secondary" onClick={() => refetch()}>Tekrar Dene</Button>
              </div>
            )}
            {mutationError && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-16)', padding: 'var(--space-12)', backgroundColor: '#fff0f0', border: '1px solid red', borderRadius: 'var(--radius-8)', color: 'red' }}>
                <span>Favori işlemi başarısız: {getErrorMessage(mutationError)}</span>
                <Button size="sm" variant="secondary" onClick={clearMutationError}>Kapat</Button>
              </div>
            )}
            <ProductGrid>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(Number(product.id))}
                  isFavoriteDisabled={isFavoritePending(Number(product.id)) || isFavoritesUnavailable}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </ProductGrid>
          </>
        )}

        {productsQuery.isSuccess && products.length === 0 && (
          <EmptyState
            icon={<IoSearchOutline size={32} />}
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}
      </div>
    </PageContainer>
  );
};
