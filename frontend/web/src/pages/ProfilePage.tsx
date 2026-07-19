import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <PageContainer>
      <h1 className="text-heading-28" style={{ marginBottom: 'var(--space-24)' }}>Profile Settings</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)' }}>
        <Card>
          <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)' }}>Personal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <Input label="Name" defaultValue={user.name} />
            <Input label="Email" defaultValue={user.email} />
            <Button>Save Changes</Button>
          </div>
        </Card>
        <Card>
          <h3 className="text-heading-20" style={{ marginBottom: 'var(--space-16)' }}>Account Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <Button variant="secondary" onClick={() => navigate('/orders')}>View Order History</Button>
            <Button variant="ghost" onClick={logout} style={{ color: 'red' }}>Logout</Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
