import React from 'react';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { ProductGrid } from '../components/domain/ProductGrid/ProductGrid';
import { ProductCard } from '../components/domain/ProductCard/ProductCard';
import { CategoryChip } from '../components/domain/CategoryChip/CategoryChip';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../mocks/products';

export const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  
  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <PageContainer>
      <section style={{ marginBottom: 'var(--space-32)', textAlign: 'center', padding: 'var(--space-64) 0', backgroundColor: 'var(--color-brand-cream)', borderRadius: 'var(--radius-20)' }}>
        <h1 className="text-display-55">Welcome to SHOP</h1>
        <p className="text-body-18" style={{ marginTop: 'var(--space-16)' }}>Discover amazing products.</p>
      </section>

      <div style={{ display: 'flex', gap: 'var(--space-12)', marginBottom: 'var(--space-32)', overflowX: 'auto', paddingBottom: 'var(--space-8)' }}>
        {MOCK_CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </CategoryChip>
        ))}
      </div>

      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </PageContainer>
  );
};
