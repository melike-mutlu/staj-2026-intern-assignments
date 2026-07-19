import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import styles from './CheckoutForm.module.css';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(4, 'Valid zip code is required'),
  cardNumber: z.string().min(16, 'Valid card number is required'),
  expiry: z.string().min(5, 'Valid expiry date is required (MM/YY)'),
  cvv: z.string().min(3, 'Valid CVV is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting?: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.section}>
        <h3 className="text-heading-18">Shipping Address</h3>
        <div className={styles.grid2}>
          <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="Street Address" {...register('address')} error={errors.address?.message} />
        <div className={styles.grid2}>
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="Zip Code" {...register('zipCode')} error={errors.zipCode?.message} />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className="text-heading-18">Payment Details</h3>
        <Input label="Card Number" placeholder="0000 0000 0000 0000" {...register('cardNumber')} error={errors.cardNumber?.message} />
        <div className={styles.grid2}>
          <Input label="Expiry Date" placeholder="MM/YY" {...register('expiry')} error={errors.expiry?.message} />
          <Input label="CVV" placeholder="123" {...register('cvv')} error={errors.cvv?.message} />
        </div>
      </div>

      <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </Button>
    </form>
  );
};
