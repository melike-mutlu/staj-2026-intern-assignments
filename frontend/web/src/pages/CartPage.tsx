import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { CartItem } from '../components/domain/CartItem/CartItem';
import { CartSummary } from '../components/domain/CartSummary/CartSummary';
import { useCart } from '../hooks/useCart';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoCartOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { Button } from '../components/ui/Button/Button';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { getErrorMessage } from '../utils/getErrorMessage';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    isLoading,
    isError,
    error,
    refetch,
    isServer,
    isMutating,
    mergeGuestCart,
    isMerging,
    guestItemsCount,
    mergeResult,
    clearMergeResult,
  } = useCart();

  const handleCheckout = () => {
    if (isServer) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const onMergeClick = () => {
    clearMergeResult();
    mergeGuestCart();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <Skeleton style={{ height: 120, width: '100%', borderRadius: 'var(--radius-8)' }} />
            <Skeleton style={{ height: 120, width: '100%', borderRadius: 'var(--radius-8)' }} />
          </div>
          <Skeleton style={{ height: 250, width: '100%', borderRadius: 'var(--radius-8)' }} />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Sepetiniz yüklenemedi"
          description={getErrorMessage(error)}
          action={<Button onClick={() => refetch()}>Tekrar Dene</Button>}
        />
      </PageContainer>
    );
  }

  if (items.length === 0 && (!isServer || guestItemsCount === 0)) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoCartOutline size={32} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Shopping Cart</h1>

      {isServer && (guestItemsCount > 0 || mergeResult) && (
        <div style={{
          padding: 'var(--space-16)',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: 'var(--radius-8)',
          marginBottom: 'var(--space-24)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-16)'
        }}>
          <div>
            {!mergeResult ? (
              <>
                <h3 className="text-heading-18">Misafir Sepetinizde Ürünler Var</h3>
                <p className="text-body-14" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
                  Giriş yapmadan önce sepetinize eklediğiniz {guestItemsCount} ürün bulunuyor. Hesabınıza aktarmak ister misiniz?
                </p>
              </>
            ) : (
              <>
                <h3 className="text-heading-18" aria-live="polite">
                  {mergeResult.failedItems.length === 0
                    ? `${mergeResult.transferredCount} ürün hesabınıza aktarıldı.`
                    : `${mergeResult.transferredCount} ürün aktarıldı, ${mergeResult.failedItems.length} ürün aktarılamadı.`}
                </h3>
                {mergeResult.failedItems.length > 0 && (
                  <ul role="alert" className="text-body-14" style={{ color: 'red', marginTop: 'var(--space-8)', paddingLeft: 'var(--space-16)' }}>
                    {mergeResult.failedItems.map(f => (
                      <li key={f.id}>{f.name} - {f.reason}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          {(!mergeResult || mergeResult.failedItems.length > 0) && guestItemsCount > 0 && (
            <Button onClick={onMergeClick} disabled={isMerging}>
              {isMerging ? 'Aktarılıyor...' : mergeResult ? 'Tekrar Dene' : 'Hesabıma Aktar'}
            </Button>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                isMutating={isMutating}
              />
            ))}
          </div>
          <div>
            <CartSummary subtotal={subtotal} shipping={0} onCheckout={handleCheckout} />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<IoCartOutline size={32} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
        />
      )}
    </PageContainer>
  );
};
