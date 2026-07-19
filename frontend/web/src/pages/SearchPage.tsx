import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { SearchBar } from '../components/domain/SearchBar/SearchBar';
import { ProductGrid } from '../components/domain/ProductGrid/ProductGrid';
import { ProductCard } from '../components/domain/ProductCard/ProductCard';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoSearchOutline } from 'react-icons/io5';
import { MOCK_PRODUCTS } from '../mocks/products';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredProducts = query.trim() !== '' ? MOCK_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  ) : MOCK_PRODUCTS;

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Search Products</h1>
      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ marginTop: 'var(--space-32)' }}>
        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState
            icon={<IoSearchOutline size={32} />}
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        )}
      </div>
    </PageContainer>
  );
};
