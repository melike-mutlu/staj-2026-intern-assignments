import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../ui/Badge/Badge';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import { cn } from '../../../utils/cn';
import type { ApiOrder } from '../../../types/api';
import styles from './OrderCard.module.css';

export interface OrderCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  order: ApiOrder;
  to: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, to, className, ...props }) => {
  const getStatusVariant = (status: ApiOrder['status']) => {
    switch (status) {
      case 'paid':
      case 'shipped': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'neutral';
      default: return 'neutral';
    }
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to={to}
      className={cn(styles.card, className)}
      {...props}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        ...props.style
      }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.orderId}>Sipariş #{order.id}</div>
          <div className={styles.date}>{formatDate(order.created_at)}</div>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className={styles.items} style={{ padding: 'var(--space-16) 0', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', margin: 'var(--space-16) 0' }}>
        <p className="text-body-14" style={{ color: 'var(--color-text-secondary)' }}>
          {order.items.map(i => i.product_name).join(', ')}
        </p>
        <p className="text-body-14" style={{ marginTop: 'var(--space-8)' }}>
          Toplam {totalQuantity} ürün
        </p>
      </div>

      <div className={styles.footer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="text-body-14" style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Genel Toplam</span>
          <span className={styles.total} style={{ display: 'block' }}>{formatPrice(order.total_amount)}</span>
        </div>
        <span className="text-body-14" style={{ color: 'var(--color-brand-teal)', fontWeight: 500 }}>
          Detayı Gör &rarr;
        </span>
      </div>
    </Link>
  );
};
