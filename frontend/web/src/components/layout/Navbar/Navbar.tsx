import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoCartOutline, IoPersonOutline, IoPersonCircleOutline, IoSearchOutline, IoHeartOutline } from 'react-icons/io5';
import { PageContainer } from '../PageContainer/PageContainer';
import { useCart } from '../../../hooks/useCart';
import { useFavorites } from '../../../hooks/useFavorites';
import { useAuthStore } from '../../../stores/authStore';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { totalItems, isLoading, isError } = useCart();
  const { totalFavorites, isLoading: favLoading, isQueryError: favError } = useFavorites();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const profileLink = isAuthenticated ? '/profile' : '/login';
  const profileLabel = isAuthenticated ? 'Profile' : 'Login';

  const showBadge = !isLoading && !isError && totalItems > 0;
  const showFavBadge = isAuthenticated && !favLoading && !favError && totalFavorites > 0;

  return (
    <header className={styles.navbar}>
      <PageContainer className={styles.container}>
        <Link to="/" className={styles.logo}>
          SHOP
        </Link>
        <div className={styles.actions}>
          <Link to="/search" className={styles.iconButton} aria-label="Search">
            <IoSearchOutline size={24} />
          </Link>
          <Link
            to={isAuthenticated ? "/favorites" : "/login"}
            state={!isAuthenticated ? { from: location } : undefined}
            className={styles.iconButton}
            aria-label={`Favoriler${showFavBadge ? `, ${totalFavorites} ürün` : ''}`}
          >
            <IoHeartOutline size={24} />
            {showFavBadge && (
              <span className={styles.favBadge}>{totalFavorites > 99 ? '99+' : totalFavorites}</span>
            )}
          </Link>
          <Link to={profileLink} className={styles.iconButton} aria-label={profileLabel}>
            {isAuthenticated ? (
              <IoPersonCircleOutline size={24} style={{ color: 'var(--color-brand-teal)' }} />
            ) : (
              <IoPersonOutline size={24} />
            )}
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label={`Cart${showBadge ? `, ${totalItems} items` : ''}`}>
            <IoCartOutline size={24} />
            {showBadge && (
              <span className={styles.badge}>{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </Link>
        </div>
      </PageContainer>
    </header>
  );
};
