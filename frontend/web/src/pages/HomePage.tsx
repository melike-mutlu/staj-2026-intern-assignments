import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { ProductGrid } from '../components/domain/ProductGrid/ProductGrid';
import { ProductCard } from '../components/domain/ProductCard/ProductCard';
import { CategoryChip } from '../components/domain/CategoryChip/CategoryChip';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Button } from '../components/ui/Button/Button';
import { IoAlertCircleOutline, IoStorefrontOutline } from 'react-icons/io5';
import { getProducts, getCategories, mapApiProductToProduct } from '../services/catalog';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useFavorites } from '../hooks/useFavorites';

export const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');

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

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: ['products', { category: activeCategory === 'All' ? undefined : activeCategory }],
    queryFn: () =>
      getProducts({
        category: activeCategory === 'All' ? undefined : activeCategory,
        size: 50,
      }),
  });

  const categories = categoriesQuery.data
    ? ['All', ...categoriesQuery.data.map(c => c.slug)]
    : ['All'];

  const categoryDisplayNames: Record<string, string> = { All: 'All' };
  if (categoriesQuery.data) {
    for (const cat of categoriesQuery.data) {
      categoryDisplayNames[cat.slug] = cat.name;
    }
  }

  const products = productsQuery.data?.items.map(mapApiProductToProduct) ?? [];

  return (
    <PageContainer>
      <section style={{ marginBottom: 'var(--space-32)', textAlign: 'center', padding: 'var(--space-64) 0', backgroundColor: 'var(--color-brand-cream)', borderRadius: 'var(--radius-20)' }}>
        <h1 className="text-display-55">Welcome to SHOP</h1>
        <p className="text-body-18" style={{ marginTop: 'var(--space-16)' }}>Discover amazing products.</p>
      </section>

      <div style={{ display: 'flex', gap: 'var(--space-12)', marginBottom: 'var(--space-32)', overflowX: 'auto', paddingBottom: 'var(--space-8)' }}>
        {categories.map((slug) => (
          <CategoryChip
            key={slug}
            active={activeCategory === slug}
            onClick={() => setActiveCategory(slug)}
          >
            {categoryDisplayNames[slug] ?? slug}
          </CategoryChip>
        ))}
      </div>

      {productsQuery.isLoading && (
        <ProductGrid>
          {Array.from({ length: 6 }).map((_, i) => (
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
          title="Ürünler yüklenemedi"
          description={getErrorMessage(productsQuery.error)}
          action={<Button onClick={() => productsQuery.refetch()}>Tekrar Dene</Button>}
        />
      )}

      {productsQuery.isSuccess && products.length === 0 && (
        <EmptyState
          icon={<IoStorefrontOutline size={32} />}
          title="Ürün bulunamadı"
          description="Bu kategoride henüz ürün yok."
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
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imagePriority={index < 2}
                isFavorite={isFavorite(Number(product.id))}
                isFavoriteDisabled={isFavoritePending(Number(product.id)) || isFavoritesUnavailable}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </ProductGrid>
        </>
      )}
    </PageContainer>
  );
};
