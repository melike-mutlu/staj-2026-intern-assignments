import React from 'react';
import { formatPrice } from '../../../utils/formatPrice';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils/cn';
import styles from './CartSummary.module.css';

export interface CartSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: number;
  shipping?: number;
  onCheckout?: () => void;
  checkoutLabel?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping = 0,
  onCheckout,
  checkoutLabel = 'Proceed to Checkout',
  className,
  ...props
}) => {
  const total = subtotal + shipping;

  return (
    <div className={cn(styles.summary, className)} {...props}>
      <h3 className="text-heading-18">Order Summary</h3>
      <div className={styles.row}>
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.row}>
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
      </div>
      <div className={styles.totalRow}>
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {onCheckout && (
        <Button className={styles.checkoutButton} onClick={onCheckout} fullWidth size="lg">
          {checkoutLabel}
        </Button>
      )}
    </div>
  );
};
