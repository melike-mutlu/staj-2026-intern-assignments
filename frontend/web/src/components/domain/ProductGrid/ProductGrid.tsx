import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './ProductGrid.module.css';

export const ProductGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn(styles.grid, className)} {...props}>
      {children}
    </div>
  );
};
