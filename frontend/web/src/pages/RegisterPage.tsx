import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-32)' }}>
        <h1 className="text-heading-24" style={{ marginBottom: 'var(--space-24)', textAlign: 'center' }}>Create Account</h1>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Input label="Full Name" required />
          <Input label="Email" type="email" required />
          <Input label="Password" type="password" required />
          <Button type="submit" fullWidth style={{ marginTop: 'var(--space-8)' }}>Register</Button>
        </form>
        <p className="text-body-14" style={{ marginTop: 'var(--space-24)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-brand-teal)' }}>Login</Link>
        </p>
      </Card>
    </PageContainer>
  );
};
