import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { CartSummary } from '../components/domain/CartSummary/CartSummary';
import { AddressForm } from '../components/domain/AddressForm/AddressForm';
import { TestPaymentForm, TEST_PAYMENT_FORM_ID } from '../components/domain/TestPaymentForm/TestPaymentForm';
import { Button } from '../components/ui/Button/Button';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { getAddresses, createAddress } from '../services/addresses';
import { createOrder } from '../services/orders';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { CreateAddressRequest } from '../types/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, subtotal, isLoading: cartLoading, isError: cartError, error: cartErrorObj, refetch: refetchCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const addressQuery = useQuery({
    queryKey: ['addresses', user?.id || 0],
    queryFn: getAddresses,
    enabled: !!user,
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: CreateAddressRequest) => createAddress(data),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user!.id] });
      setSelectedAddressId(newAddress.id);
      setShowAddForm(false);
    },
  });

  const orderMutation = useMutation({
    mutationFn: () => {
      if (!selectedAddressId) throw new Error("Lütfen bir teslimat adresi seçin.");
      return createOrder({
        shipping_address_id: selectedAddressId,
        payment_method: 'simulation',
      });
    },
    onSuccess: async (order) => {
      // 1. Write the new order to the query cache
      queryClient.setQueryData(['order', user!.id, String(order.id)], order);

      // 2. Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders', user!.id] });

      // 3. Cancel any outgoing cart queries
      await queryClient.cancelQueries({ queryKey: ['cart', user!.id] });

      // 4. Clear the cart cache locally since backend already cleared it
      queryClient.setQueryData(['cart', user!.id], { items: [], subtotal: 0 });

      // 5. Redirect to confirmation page
      navigate(`/order-confirm/${order.id}`, { replace: true });
    },
    onError: (error) => {
      setCheckoutError(getErrorMessage(error));
    }
  });

  if (!user) return null;

  if (cartLoading) {
    return (
      <PageContainer>
        <Skeleton style={{ height: 400, width: '100%', borderRadius: 'var(--radius-8)' }} />
      </PageContainer>
    );
  }

  if (cartError) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Sepetiniz yüklenemedi"
          description={getErrorMessage(cartErrorObj)}
          action={<Button onClick={() => refetchCart()}>Tekrar Dene</Button>}
        />
      </PageContainer>
    );
  }

  if (items.length === 0 && !orderMutation.isSuccess) {
    return <Navigate to="/cart" replace />;
  }

  const handleCreateOrder = () => {
    setCheckoutError('');
    orderMutation.mutate();
  };

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>

          <section>
            <h2 className="text-heading-20" style={{ marginBottom: 'var(--space-16)' }}>Teslimat Adresi</h2>

            {addressQuery.isLoading ? (
              <Skeleton style={{ height: 100, borderRadius: 'var(--radius-8)' }} />
            ) : addressQuery.isError ? (
              <div style={{ padding: 'var(--space-16)', border: '1px solid red', borderRadius: 'var(--radius-8)', backgroundColor: '#fff0f0' }}>
                <p role="alert" style={{ color: 'red', marginBottom: 'var(--space-12)' }}>
                  Adresler yüklenemedi: {getErrorMessage(addressQuery.error)}
                </p>
                <Button variant="secondary" size="sm" onClick={() => addressQuery.refetch()}>Tekrar Dene</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {addressQuery.data?.length === 0 ? (
                  <p className="text-body-14" style={{ color: 'var(--color-text-secondary)' }}>Kayıtlı adresiniz bulunmuyor.</p>
                ) : (
                  addressQuery.data?.map(address => (
                    <label
                      key={address.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-12)',
                        padding: 'var(--space-16)',
                        border: `1px solid ${selectedAddressId === address.id ? 'var(--color-brand-teal)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-8)',
                        cursor: 'pointer',
                        backgroundColor: selectedAddressId === address.id ? 'rgba(0, 128, 128, 0.05)' : 'transparent'
                      }}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        style={{ marginTop: 'var(--space-4)' }}
                      />
                      <div>
                        <strong>{address.title}</strong>
                        <p className="text-body-14" style={{ marginTop: 'var(--space-4)' }}>
                          {address.line1}, {address.district}/{address.city} {address.postal_code}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}

            {!showAddForm ? (
              <Button
                variant="secondary"
                onClick={() => setShowAddForm(true)}
                style={{ marginTop: 'var(--space-16)' }}
                disabled={addressQuery.isError}
              >
                + Yeni Adres Ekle
              </Button>
            ) : (
              <div style={{ marginTop: 'var(--space-16)' }}>
                <AddressForm
                  onSubmit={(data) => addAddressMutation.mutate(data)}
                  onCancel={() => setShowAddForm(false)}
                  isLoading={addAddressMutation.isPending}
                />
                {addAddressMutation.isError && (
                  <p role="alert" className="text-body-14" style={{ color: 'red', marginTop: 'var(--space-8)' }}>
                    Adres eklenemedi: {getErrorMessage(addAddressMutation.error)}
                  </p>
                )}
              </div>
            )}
          </section>

          <section style={{
            padding: 'var(--space-24)',
            backgroundColor: 'var(--color-surface-hover)',
            borderRadius: 'var(--radius-8)'
          }}>
            <h2 className="text-heading-20" style={{ marginBottom: 'var(--space-8)' }}>Test Ödeme Bilgileri</h2>
            <p className="text-body-14" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-16)' }}>
              Bu bir demo ödeme işlemidir. Gerçek ödeme alınmayacaktır.
            </p>
            <TestPaymentForm onValidSubmit={handleCreateOrder} />
          </section>

        </div>

        <div>
          <CartSummary subtotal={subtotal} shipping={0} />

          <div style={{ marginTop: 'var(--space-24)', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            <Button
              type="submit"
              form={TEST_PAYMENT_FORM_ID}
              size="lg"
              fullWidth
              disabled={!selectedAddressId || orderMutation.isPending || addressQuery.isError || addressQuery.isLoading}
            >
              {orderMutation.isPending ? 'Sipariş oluşturuluyor...' : 'Simüle Ödeme ile Sipariş Ver'}
            </Button>
            {checkoutError && (
              <p role="alert" className="text-body-14" style={{ color: 'red', textAlign: 'center', margin: 0 }}>
                {checkoutError}
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
