import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';
import { PageContainer } from './PageContainer/PageContainer';
import { Skeleton } from '../ui/Skeleton/Skeleton';

export const RootLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 'var(--space-32) 0' }}>
        <Suspense
          fallback={(
            <PageContainer>
              <div role="status" aria-label="Sayfa yükleniyor">
                <Skeleton style={{ width: '40%', height: 32, marginBottom: 24 }} />
                <Skeleton style={{ width: '100%', height: 240 }} />
              </div>
            </PageContainer>
          )}
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
