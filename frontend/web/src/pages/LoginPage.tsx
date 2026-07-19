import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: '1', name: 'Test User', email: 'test@example.com' }, 'mock-jwt-token');
    navigate('/');
  };

  return (
    <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-32)' }}>
        <h1 className="text-heading-24" style={{ marginBottom: 'var(--space-24)', textAlign: 'center' }}>Login to SHOP</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Input label="Email" type="email" required />
          <Input label="Password" type="password" required />
          <Button type="submit" fullWidth style={{ marginTop: 'var(--space-8)' }}>Login</Button>
        </form>
        <p className="text-body-14" style={{ marginTop: 'var(--space-24)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-brand-teal)' }}>Register</Link>
        </p>
      </Card>
    </PageContainer>
  );
};
