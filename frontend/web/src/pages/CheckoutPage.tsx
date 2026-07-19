import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { CheckoutForm } from '../components/domain/CheckoutForm/CheckoutForm';
import { CartSummary } from '../components/domain/CartSummary/CartSummary';
import { useCartStore } from '../stores/cartStore';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { subtotal, clearCart } = useCartStore();

  const handleCheckout = (data: any) => {
    console.log('Order submitted', data);
    clearCart();
    navigate('/order-confirm');
  };

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)' }}>
        <div style={{ flex: 2 }}>
          <CheckoutForm onSubmit={handleCheckout} />
        </div>
        <div style={{ flex: 1 }}>
          <CartSummary subtotal={subtotal()} shipping={10} />
        </div>
      </div>
    </PageContainer>
  );
};
