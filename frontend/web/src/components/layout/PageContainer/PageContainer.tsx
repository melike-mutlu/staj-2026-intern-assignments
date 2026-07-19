import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './PageContainer.module.css';

export const PageContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn(styles.container, className)} {...props}>
      {children}
    </div>
  );
};
