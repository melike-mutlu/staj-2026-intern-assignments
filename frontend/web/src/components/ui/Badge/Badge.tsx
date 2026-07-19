import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'neutral', children, ...props }) => {
  return (
    <span className={cn(styles.badge, styles[`variant-${variant}`], className)} {...props}>
      {children}
    </span>
  );
};
