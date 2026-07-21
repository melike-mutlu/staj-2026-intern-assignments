import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../ui/Input/Input';
import styles from './TestPaymentForm.module.css';

const TEST_CARD_NUMBER = '4242424242424242';
const TEST_EXPIRY = '12/30';
const TEST_CVV = '123';

const testPaymentSchema = z.object({
  cardholderName: z.string().trim().min(2, 'Kart üzerindeki isim en az 2 karakter olmalıdır.'),
  cardNumber: z.string().refine(
    (value) => value.replace(/\s/g, '') === TEST_CARD_NUMBER,
    'Yalnızca 4242 4242 4242 4242 test kartını kullanın.',
  ),
  expiry: z.string().refine(
    (value) => value.trim() === TEST_EXPIRY,
    'Test son kullanma tarihi 12/30 olmalıdır.',
  ),
  cvv: z.string().refine(
    (value) => value.trim() === TEST_CVV,
    'Test CVV değeri 123 olmalıdır.',
  ),
});

type TestPaymentFormData = z.infer<typeof testPaymentSchema>;

interface TestPaymentFormProps {
  onValidSubmit: () => void;
}

export const TEST_PAYMENT_FORM_ID = 'test-payment-form';

export const TestPaymentForm: React.FC<TestPaymentFormProps> = ({ onValidSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestPaymentFormData>({
    resolver: zodResolver(testPaymentSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  return (
    <form
      id={TEST_PAYMENT_FORM_ID}
      className={styles.form}
      onSubmit={handleSubmit(() => onValidSubmit())}
      autoComplete="off"
    >
      <div id="test-payment-notice" className={styles.notice}>
        <strong>Yalnızca test bilgilerini kullanın.</strong>
        <span>Bu alanlar backend'e gönderilmez ve hiçbir yerde saklanmaz.</span>
      </div>

      <Input
        label="Test Kartı Üzerindeki İsim"
        placeholder="Demo Kullanıcı"
        autoComplete="off"
        aria-describedby="test-payment-notice"
        {...register('cardholderName')}
        error={errors.cardholderName?.message}
      />

      <Input
        label="Test Kartı Numarası"
        placeholder="4242 4242 4242 4242"
        inputMode="numeric"
        maxLength={19}
        autoComplete="off"
        aria-describedby="test-payment-notice"
        {...register('cardNumber')}
        error={errors.cardNumber?.message}
      />

      <div className={styles.row}>
        <Input
          label="Test Son Kullanma Tarihi"
          placeholder="12/30"
          inputMode="numeric"
          maxLength={5}
          autoComplete="off"
          aria-describedby="test-payment-notice"
          {...register('expiry')}
          error={errors.expiry?.message}
        />
        <Input
          label="Test CVV"
          placeholder="123"
          type="password"
          inputMode="numeric"
          maxLength={3}
          autoComplete="off"
          aria-describedby="test-payment-notice"
          {...register('cvv')}
          error={errors.cvv?.message}
        />
      </div>
    </form>
  );
};
