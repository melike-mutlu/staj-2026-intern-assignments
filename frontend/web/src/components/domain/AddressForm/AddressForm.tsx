import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import type { CreateAddressRequest } from '../../../types/api';
import styles from './AddressForm.module.css';

const addressSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır').max(60, 'Başlık çok uzun'),
  city: z.string().min(2, 'Şehir en az 2 karakter olmalıdır').max(80, 'Şehir çok uzun'),
  district: z.string().min(2, 'İlçe en az 2 karakter olmalıdır').max(80, 'İlçe çok uzun'),
  line1: z.string().min(5, 'Adres en az 5 karakter olmalıdır').max(255, 'Adres çok uzun'),
  postal_code: z.string().max(20, 'Posta kodu çok uzun').optional().or(z.literal('')),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialValues?: Partial<AddressFormData>;
  onSubmit: (data: CreateAddressRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Kaydet',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
  });

  const handleFormSubmit = (data: AddressFormData) => {
    onSubmit({
      ...data,
      postal_code: data.postal_code || null,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Adres Başlığı"
        placeholder="Ev, İş vb."
        {...register('title')}
        error={errors.title?.message}
      />
      <div className={styles.row}>
        <Input
          label="Şehir"
          {...register('city')}
          error={errors.city?.message}
        />
        <Input
          label="İlçe"
          {...register('district')}
          error={errors.district?.message}
        />
      </div>
      <Input
        label="Açık Adres"
        {...register('line1')}
        error={errors.line1?.message}
      />
      <Input
        label="Posta Kodu (Opsiyonel)"
        {...register('postal_code')}
        error={errors.postal_code?.message}
      />
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            İptal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
