import React from 'react';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { OrderCard } from '../components/domain/OrderCard/OrderCard';
import type { Order } from '../components/domain/OrderCard/OrderCard';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1234',
    date: new Date().toISOString(),
    status: 'delivered',
    total: 249.98,
    items: [
      { id: '1', name: 'ProBook X15', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', quantity: 1, price: 1299.99 },
      { id: '3', name: 'NoiseCanceling Pro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', quantity: 1, price: 349.99 },
    ]
  }
];

export const OrdersPage: React.FC = () => {
  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Your Orders</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        {MOCK_ORDERS.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </PageContainer>
  );
};
