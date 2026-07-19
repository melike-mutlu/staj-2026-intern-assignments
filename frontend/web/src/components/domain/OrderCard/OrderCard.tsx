import React from 'react';
import { Badge } from '../../ui/Badge/Badge';
import { formatPrice } from '../../../utils/formatPrice';
import { cn } from '../../../utils/cn';
import styles from './OrderCard.module.css';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, className, ...props }) => {
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'pending':
      case 'shipped': return 'warning';
      case 'cancelled': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className={cn(styles.card, className)} {...props}>
      <div className={styles.header}>
        <div>
          <div className={styles.orderId}>Order #{order.id}</div>
          <div className={styles.date}>{new Date(order.date).toLocaleDateString()}</div>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>
      
      <div className={styles.items}>
        {order.items.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.image} alt={item.name} className={styles.image} />
            <div className={styles.itemDetails}>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemMeta}>Qty: {item.quantity} • {formatPrice(item.price)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className="text-body-14 text-secondary">Total Amount</span>
        <span className={styles.total}>{formatPrice(order.total)}</span>
      </div>
    </div>
  );
};
