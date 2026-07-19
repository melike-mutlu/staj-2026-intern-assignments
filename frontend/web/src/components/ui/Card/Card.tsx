import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './Card.module.css';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn(styles.card, className)} {...props}>
      {children}
    </div>
  );
};
