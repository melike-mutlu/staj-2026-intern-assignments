import React from 'react';
import { cn } from '../../../utils/cn';
import styles from './Pill.module.css';

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.pill, active && styles.active, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Pill.displayName = 'Pill';
