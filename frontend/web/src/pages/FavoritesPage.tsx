import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { ProductGrid } from '../components/domain/ProductGrid/ProductGrid';
import { ProductCard } from '../components/domain/ProductCard/ProductCard';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { Button } from '../components/ui/Button/Button';
import { IoAlertCircleOutline, IoHeartOutline } from 'react-icons/io5';
import { useFavorites } from '../hooks/useFavorites';
import { getErrorMessage } from '../utils/getErrorMessage';
import { mapApiProductToProduct } from '../services/catalog';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    favoriteProducts,
    isQueryLoading: isLoading,
    isQueryError: isError,
    queryError: error,
    mutationError,
    clearMutationError,
    refetch,
    isFavorite,
    toggleFavorite,
    isFavoritePending,
    isFavoritesUnavailable
  } = useFavorites();

  const products = favoriteProducts.map(mapApiProductToProduct);

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Favorilerim</h1>

      {isLoading && (
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

      {isError && (
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Favoriler yüklenemedi"
          description={getErrorMessage(error)}
          action={<Button onClick={() => refetch()}>Tekrar Dene</Button>}
        />
      )}

      {!isLoading && !isError && favoriteProducts.length === 0 && (
        <EmptyState
          icon={<IoHeartOutline size={32} />}
          title="Henüz favori ürününüz yok"
          description="Beğendiğiniz ürünleri kalp simgesine tıklayarak favorilerinize ekleyebilirsiniz."
          action={
            <Button onClick={() => navigate('/')}>Alışverişe Başla</Button>
          }
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
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
    </PageContainer>
  );
};
