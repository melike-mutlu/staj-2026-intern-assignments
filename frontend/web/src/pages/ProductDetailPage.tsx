import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Button } from '../components/ui/Button/Button';
import { MOCK_PRODUCTS } from '../mocks/products';
import { formatPrice } from '../utils/formatPrice';
import { useCartStore } from '../stores/cartStore';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const addItem = useCartStore(state => state.addItem);

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
          <Button size="lg" onClick={() => addItem(product)}>Add to Cart</Button>
        </div>
      </div>
    </PageContainer>
  );
};
