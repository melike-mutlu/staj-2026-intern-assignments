import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageContainer } from '../components/layout/PageContainer/PageContainer';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useAuthStore } from '../stores/authStore';
import { registerUser } from '../services/auth';
import { getErrorMessage } from '../utils/getErrorMessage';

const registerSchema = z.object({
  full_name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().min(1, 'Email gerekli').email('Geçerli bir email girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError('');
    try {
      const response = await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      // Backend returns tokens on register — auto-login
      setSession(response);
      navigate('/', { replace: true });
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  return (
    <PageContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-32)' }}>
        <h1 className="text-heading-24" style={{ marginBottom: 'var(--space-24)', textAlign: 'center' }}>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Input
            label="Full Name"
            autoComplete="name"
            {...register('full_name')}
            error={errors.full_name?.message}
          />
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
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          {apiError && (
            <p role="alert" className="text-body-14" style={{ color: 'red', textAlign: 'center', margin: 0 }}>
              {apiError}
            </p>
          )}
          <Button type="submit" fullWidth style={{ marginTop: 'var(--space-8)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Kayıt yapılıyor...' : 'Register'}
          </Button>
        </form>
        <p className="text-body-14" style={{ marginTop: 'var(--space-24)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-brand-teal)' }}>Login</Link>
        </p>
      </Card>
    </PageContainer>
  );
};
