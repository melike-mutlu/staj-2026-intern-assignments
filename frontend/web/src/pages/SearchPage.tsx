import React from 'react';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { IoSearchOutline } from 'react-icons/io5';

export const SearchPage: React.FC = () => {
  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Search Results</h1>
      <EmptyState
        icon={<IoSearchOutline size={32} />}
        title="No results found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    </PageContainer>
  );
};
