import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Button } from '../components/ui/Button/Button';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

export const OrderConfirmPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <EmptyState
        variant="success"
        icon={<IoCheckmarkCircleOutline size={32} />}
        title="Order Placed Successfully!"
        description="Thank you for your purchase. We will send you an email confirmation shortly."
        action={<Button onClick={() => navigate('/')}>Continue Shopping</Button>}
      />
    </PageContainer>
  );
};
