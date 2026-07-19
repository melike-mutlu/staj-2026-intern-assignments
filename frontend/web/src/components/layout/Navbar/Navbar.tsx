import React from 'react';
import { Link } from 'react-router-dom';
import { IoCartOutline, IoPersonOutline, IoSearchOutline } from 'react-icons/io5';
import { PageContainer } from '../PageContainer/PageContainer';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <PageContainer className={styles.container}>
        <Link to="/" className={styles.logo}>
          SHOP
        </Link>
        <div className={styles.actions}>
          <Link to="/search" className={styles.iconButton}>
            <IoSearchOutline size={24} />
          </Link>
          <Link to="/profile" className={styles.iconButton}>
            <IoPersonOutline size={24} />
          </Link>
          <Link to="/cart" className={styles.iconButton}>
            <IoCartOutline size={24} />
          </Link>
        </div>
      </PageContainer>
    </header>
  );
};
