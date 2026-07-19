import React from 'react';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import type { Product } from '../../../types/product';
import { cn } from '../../../utils/cn';
import { formatPrice } from '../../../utils/formatPrice';
import styles from './ProductCard.module.css';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavorite,
  isFavorite,
  className,
  ...props
}) => {
  return (
    <div className={cn(styles.card, className)} {...props}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {onFavorite && (
          <button
            className={styles.favoriteButton}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product.id);
            }}
          >
            {isFavorite ? <IoHeart color="red" size={20} /> : <IoHeartOutline size={20} />}
          </button>
        )}
      </div>
      <h4 className={styles.title}>{product.name}</h4>
      <span className={styles.price}>{formatPrice(product.price)}</span>
    </div>
  );
};
