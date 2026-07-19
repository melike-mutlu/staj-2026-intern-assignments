import React from 'react';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatPrice';
import { cn } from '../../../utils/cn';
import styles from './CartItem.module.css';

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Product & { quantity: number };
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className,
  ...props
}) => {
  return (
    <div className={cn(styles.cartItem, className)} {...props}>
      <img src={item.image} alt={item.name} className={styles.image} />
      <div className={styles.details}>
        <div className={styles.header}>
          <h4 className={styles.title}>{item.name}</h4>
          <span className={styles.price}>{formatPrice(item.price * item.quantity)}</span>
        </div>
        <div className={styles.footer}>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityButton}
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              -
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button className={styles.removeButton} onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
