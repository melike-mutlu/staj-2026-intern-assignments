import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoImageOutline } from 'react-icons/io5';
import type { Product } from '../../../types/product';
import { cn } from '../../../utils/cn';
import { formatPrice } from '../../../utils/formatPrice';
import styles from './ProductCard.module.css';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
  isFavoriteDisabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavoriteToggle,
  isFavorite = false,
  isFavoriteDisabled = false,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn(styles.cardWrapper, className)} {...props}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--color-text-secondary)' }}>
                <IoImageOutline size={48} />
              </div>
            )}
          </div>
          <h4 className={styles.title}>{product.name}</h4>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
      </Link>

      {onFavoriteToggle && (
        <button
          type="button"
          className={styles.favoriteButton}
          aria-label={isFavorite ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
          aria-pressed={isFavorite}
          disabled={isFavoriteDisabled}
          onClick={() => onFavoriteToggle(Number(product.id))}
        >
          {isFavorite ? <IoHeart color="red" size={20} /> : <IoHeartOutline size={20} />}
        </button>
      )}
    </div>
  );
};
