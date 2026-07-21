import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Button } from '../components/ui/Button/Button';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoAlertCircleOutline, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { getProduct, mapApiProductToProduct } from '../services/catalog';
import { getErrorMessage } from '../utils/getErrorMessage';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, isMutating } = useCart();
  const {
    isFavorite,
    toggleFavorite,
    isFavoritePending,
    isFavoritesUnavailable,
    isQueryLoading,
    isQueryError,
    queryError,
    refetch,
    mutationError
  } = useFavorites();

  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState('');
  const cartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [favSuccess, setFavSuccess] = useState('');
  const favTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      if (favTimeoutRef.current) clearTimeout(favTimeoutRef.current);
    };
  }, []);

  const handleFavoriteToggle = async () => {
    if (!product) return;
    const result = await toggleFavorite(Number(product.id));
    if (result) {
      if (favTimeoutRef.current) clearTimeout(favTimeoutRef.current);
      setFavSuccess(result.action === 'added' ? 'Ürün favorilere eklendi.' : 'Ürün favorilerden çıkarıldı.');
      favTimeoutRef.current = setTimeout(() => {
        setFavSuccess('');
      }, 3000);
    }
  };

  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const product = productQuery.data ? mapApiProductToProduct(productQuery.data) : null;
  const isOutOfStock = productQuery.data?.stock === 0;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product);
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      setAdded(true);
      setAddError('');
      cartTimeoutRef.current = setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAddError(err.response?.data?.detail || 'Sepete eklerken bir hata oluştu.');
      } else {
        setAddError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      }
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = setTimeout(() => setAddError(''), 3000);
    }
  };

  // Loading state
  if (productQuery.isLoading) {
    return (
      <PageContainer>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-64)' }}>
          <Skeleton style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-12)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            <Skeleton style={{ width: '60%', height: 32 }} />
            <Skeleton style={{ width: '30%', height: 24 }} />
            <Skeleton style={{ width: '100%', height: 80 }} />
            <Skeleton style={{ width: '40%', height: 48, borderRadius: 'var(--radius-12)' }} />
          </div>
        </div>
      </PageContainer>
    );
  }

  // 404 - product not found
  if (productQuery.isError && axios.isAxiosError(productQuery.error) && productQuery.error.response?.status === 404) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: 'var(--space-64) 0' }}>
          <h1 className="text-heading-28">Ürün bulunamadı</h1>
          <p className="text-body-16" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-12)' }}>
            Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--space-24)' }}>
            <Button size="lg">Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Other API errors
  if (productQuery.isError) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Ürün yüklenemedi"
          description={getErrorMessage(productQuery.error)}
          action={<Button onClick={() => productQuery.refetch()}>Tekrar Dene</Button>}
        />
      </PageContainer>
    );
  }

  if (!product) return null;

  return (
    <PageContainer>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-64)' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius-12)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
          <div>
            <h1 className="text-heading-28">{product.name}</h1>
            <p className="text-heading-20" style={{ color: 'var(--color-brand-teal)', marginTop: 'var(--space-8)' }}>{formatPrice(product.price)}</p>
          </div>
          <p className="text-body-16" style={{ color: 'var(--color-text-secondary)' }}>{product.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <Button size="lg" onClick={handleAddToCart} disabled={added || isOutOfStock || isMutating}>
              {isMutating ? 'Ekleniyor...' : isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
            </Button>
            {addError && (
              <p role="alert" className="text-body-14" style={{ color: 'red', margin: 0 }}>
                {addError}
              </p>
            )}

            {isQueryError && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-8)', backgroundColor: '#fff0f0', border: '1px solid red', borderRadius: 'var(--radius-8)', color: 'red' }}>
                <span className="text-body-14">Favoriler yüklenemedi: {getErrorMessage(queryError)}</span>
                <Button size="sm" variant="secondary" onClick={() => refetch()}>Tekrar Dene</Button>
              </div>
            )}

            <Button
              size="lg"
              variant="secondary"
              onClick={handleFavoriteToggle}
              disabled={isFavoritePending(Number(product.id)) || isFavoritesUnavailable}
              aria-pressed={isFavorite(Number(product.id))}
              aria-label={isFavorite(Number(product.id)) ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)' }}>
                {isFavorite(Number(product.id)) ? <IoHeart color="red" size={24} /> : <IoHeartOutline size={24} />}
                <span>
                  {isQueryLoading ? 'Favoriler yükleniyor...' : isFavorite(Number(product.id)) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                </span>
              </div>
            </Button>

            {mutationError && (
              <p role="alert" className="text-body-14" style={{ color: 'red', margin: 0 }}>
                {getErrorMessage(mutationError)}
              </p>
            )}

            {favSuccess && (
              <p className="text-body-14" style={{ color: 'green', margin: 0, fontWeight: 500 }}>
                {favSuccess}
              </p>
            )}
          </div>
          <div aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            {added ? `${product.name} has been added to your cart.` : ''}
            {addError ? addError : ''}
            {favSuccess ? favSuccess : ''}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
