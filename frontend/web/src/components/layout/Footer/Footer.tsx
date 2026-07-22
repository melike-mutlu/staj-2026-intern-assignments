import React from 'react';
import { PageContainer } from '../PageContainer/PageContainer';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <PageContainer>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h2 className={styles.title}>SHOP</h2>
            <p className={styles.link}>The best place to buy things.</p>
          </div>
          <div className={styles.column}>
            <h2 className={styles.title}>Categories</h2>
            <a href="#" className={styles.link}>Electronics</a>
            <a href="#" className={styles.link}>Clothing</a>
            <a href="#" className={styles.link}>Home</a>
          </div>
          <div className={styles.column}>
            <h2 className={styles.title}>Support</h2>
            <a href="#" className={styles.link}>Contact Us</a>
            <a href="#" className={styles.link}>FAQ</a>
            <a href="#" className={styles.link}>Shipping</a>
          </div>
          <div className={styles.column}>
            <h2 className={styles.title}>Legal</h2>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Privacy Policy</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} SHOP. All rights reserved.</p>
        </div>
      </PageContainer>
    </footer>
  );
};
