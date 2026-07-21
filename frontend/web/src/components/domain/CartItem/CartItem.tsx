import React from 'react';
import { formatPrice } from '../../../utils/formatPrice';
import { cn } from '../../../utils/cn';
import styles from './CartItem.module.css';

export interface CartItemUI {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
}

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: CartItemUI;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  isMutating?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isMutating = false,
  className,
  ...props
}) => {
  const atMaxStock = item.stock !== undefined && item.quantity >= item.stock;

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
              disabled={isMutating || item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isMutating || atMaxStock}
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <button
            className={styles.removeButton}
            onClick={() => onRemove(item.id)}
            disabled={isMutating}
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
