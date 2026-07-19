import React from 'react';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { CartItem } from '../components/domain/CartItem/CartItem';
import { CartSummary } from '../components/domain/CartSummary/CartSummary';
import { useCartStore } from '../stores/cartStore';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoCartOutline } from 'react-icons/io5';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-32)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
        <div>
          <CartSummary subtotal={subtotal()} shipping={0} />
        </div>
      </div>
    </PageContainer>
  );
};
