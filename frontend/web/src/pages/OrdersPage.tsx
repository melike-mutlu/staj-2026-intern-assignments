import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { OrderCard } from '../components/domain/OrderCard/OrderCard';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Button } from '../components/ui/Button/Button';
import { IoAlertCircleOutline, IoReceiptOutline } from 'react-icons/io5';
import { useAuthStore } from '../stores/authStore';
import { getOrders } from '../services/orders';
import { getErrorMessage } from '../utils/getErrorMessage';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: getOrders,
    enabled: !!user,
  });

  if (ordersQuery.isLoading) {
    return (
      <PageContainer>
        <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Siparişlerim</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Skeleton style={{ height: 200, width: '100%', borderRadius: 'var(--radius-8)' }} />
          <Skeleton style={{ height: 200, width: '100%', borderRadius: 'var(--radius-8)' }} />
        </div>
      </PageContainer>
    );
  }

  if (ordersQuery.isError) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Siparişler yüklenemedi"
          description={getErrorMessage(ordersQuery.error)}
          action={<Button onClick={() => ordersQuery.refetch()}>Tekrar Dene</Button>}
        />
      </PageContainer>
    );
  }

  const orders = ordersQuery.data || [];

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Siparişlerim</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<IoReceiptOutline size={32} />}
          title="Henüz siparişiniz yok"
          description="Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz."
          action={<Button onClick={() => navigate('/')}>Alışverişe Başla</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              to={`/order-confirm/${order.id}`}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
