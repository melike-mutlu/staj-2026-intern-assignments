import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Button } from '../components/ui/Button/Button';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { useAuthStore } from '../stores/authStore';
import { getOrder } from '../services/orders';
import { getErrorMessage } from '../utils/getErrorMessage';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';

export const OrderConfirmPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const parsedId = Number(orderId);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const orderQuery = useQuery({
    queryKey: ['order', user?.id, String(parsedId)],
    queryFn: () => getOrder(parsedId),
    enabled: !!user && isValidId,
  });

  const isNotFound = axios.isAxiosError(orderQuery.error) && orderQuery.error.response?.status === 404;

  if (!user) return null;

  if (!isValidId || isNotFound) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: 'var(--space-64) 0' }}>
          <h1 className="text-heading-28">Sipariş bulunamadı</h1>
          <p className="text-body-16" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-12)' }}>
            Aradığınız sipariş mevcut değil veya yetkiniz yok.
          </p>
          <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--space-24)' }}>
            <Button size="lg">Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <PageContainer>
        <Skeleton style={{ height: 400, width: '100%', borderRadius: 'var(--radius-12)' }} />
      </PageContainer>
    );
  }

  if (orderQuery.isError) {
    return (
      <PageContainer>
        <EmptyState
          icon={<IoAlertCircleOutline size={32} />}
          title="Sipariş yüklenemedi"
          description={getErrorMessage(orderQuery.error)}
          action={<Button onClick={() => orderQuery.refetch()}>Tekrar Dene</Button>}
        />
      </PageContainer>
    );
  }

  const order = orderQuery.data;
  if (!order) return null;

  return (
    <PageContainer>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 'var(--space-32)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-12)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <IoCheckmarkCircleOutline size={64} style={{ color: 'var(--color-brand-teal)', marginBottom: 'var(--space-16)' }} />
          <h1 className="text-heading-28">Siparişiniz Alındı!</h1>
          <p className="text-body-16" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-8)' }}>
            Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)', marginBottom: 'var(--space-32)' }}>
          <div>
            <h3 className="text-heading-16" style={{ color: 'var(--color-text-secondary)' }}>Sipariş Numarası</h3>
            <p className="text-body-16" style={{ marginTop: 'var(--space-4)', fontWeight: 500 }}>#{order.id}</p>
          </div>
          <div>
            <h3 className="text-heading-16" style={{ color: 'var(--color-text-secondary)' }}>Tarih</h3>
            <p className="text-body-16" style={{ marginTop: 'var(--space-4)', fontWeight: 500 }}>{formatDate(order.created_at)}</p>
          </div>
          <div>
            <h3 className="text-heading-16" style={{ color: 'var(--color-text-secondary)' }}>Sipariş Durumu</h3>
            <p className="text-body-16" style={{ marginTop: 'var(--space-4)', fontWeight: 500, textTransform: 'capitalize' }}>{order.status}</p>
          </div>
          <div>
            <h3 className="text-heading-16" style={{ color: 'var(--color-text-secondary)' }}>Ödeme Durumu</h3>
            <p className="text-body-16" style={{ marginTop: 'var(--space-4)', fontWeight: 500, textTransform: 'capitalize' }}>{order.payment_status}</p>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-32)' }}>
          <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-border)' }}>
            Teslimat Adresi
          </h3>
          <p className="text-body-16">{order.shipping_address}</p>
        </div>

        <div>
          <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-border)' }}>
            Sipariş Özeti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-body-16">{item.product_name} x {item.quantity}</span>
                <span className="text-body-16" style={{ fontWeight: 500 }}>{formatPrice(item.line_total)}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 'var(--space-16)',
              marginTop: 'var(--space-8)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <span className="text-heading-18">Genel Toplam</span>
              <span className="text-heading-20" style={{ color: 'var(--color-brand-teal)' }}>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-32)', textAlign: 'center' }}>
          <Link to="/">
            <Button size="lg">Alışverişe Dön</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
