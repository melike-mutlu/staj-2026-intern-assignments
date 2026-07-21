import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useAuthStore } from '../stores/authStore';
import { loginUser } from '../services/auth';
import { getErrorMessage } from '../utils/getErrorMessage';

const loginSchema = z.object({
  email: z.string().min(1, 'Email gerekli').email('Geçerli bir email girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore(state => state.setSession);
  const [apiError, setApiError] = useState('');

  const locationState = location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null;
  const fromLocation = locationState?.from;

  let from = '/';
  if (fromLocation && typeof fromLocation.pathname === 'string') {
    // Only allow internal paths starting with '/' to prevent open redirects
    if (fromLocation.pathname.startsWith('/')) {
      from = fromLocation.pathname;
      if (typeof fromLocation.search === 'string') from += fromLocation.search;
      if (typeof fromLocation.hash === 'string') from += fromLocation.hash;
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    try {
      const response = await loginUser(data);
      setSession(response);
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  return (
    <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-32)' }}>
        <h1 className="text-heading-24" style={{ marginBottom: 'var(--space-24)', textAlign: 'center' }}>Login to SHOP</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
          {apiError && (
            <p role="alert" className="text-body-14" style={{ color: 'red', textAlign: 'center', margin: 0 }}>
              {apiError}
            </p>
          )}
          <Button type="submit" fullWidth style={{ marginTop: 'var(--space-8)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Giriş yapılıyor...' : 'Login'}
          </Button>
        </form>
        <p className="text-body-14" style={{ marginTop: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Demo: demo@eticaret.com / DemoPass123
        </p>
        <p className="text-body-14" style={{ marginTop: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-brand-teal)' }}>Register</Link>
        </p>
      </Card>
    </PageContainer>
  );
};
